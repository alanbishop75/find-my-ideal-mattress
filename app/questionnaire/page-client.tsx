"use client";
import React, { Suspense } from 'react';
import { mattressQuestionnaire } from '../../config/mattress/questionnaire';
import { useAppState } from '../client-providers';
import { useTheme } from '../../core/theme';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Questionnaire } from '../../core/types';
import { useRegion } from '../../core/geo/RegionContext';
import { getOptionLabelForRegion, getQuestionTextForRegion } from '../../core/geo/content';
import {
	trackQuizStart,
	trackQuizComplete,
	trackQuizAbandoned,
	trackQuestionAnswered,
} from '../../lib/analytics';

interface Props {
	questionnaire?: Questionnaire;
	resultsPath?: string;
}

type GtagFn = (command: string, event: string, params?: Record<string, string | number>) => void;

/** Fire a GA4 event safely (noop if gtag not loaded). */
function trackEvent(name: string, params?: Record<string, string | number>) {
	if (typeof window !== 'undefined' && typeof (window as typeof window & { gtag?: GtagFn }).gtag === 'function') {
		(window as typeof window & { gtag: GtagFn }).gtag('event', name, params ?? {});
	}
}

function QuestionnairePageInner({ questionnaire: questionnaireProp, resultsPath = '/mattress/results' }: Props) {
	const resolvedQuestionnaire = questionnaireProp ?? mattressQuestionnaire;
	const questions = resolvedQuestionnaire.questions;
	const { answers, setAnswer } = useAppState();
	const { tokens } = useTheme();
	const [isHydrated, setIsHydrated] = useState(false);
	const [current, setCurrent] = useState(0);
	const router = useRouter();
	const { region } = useRegion();
	const searchParams = useSearchParams();
	const seoSource = searchParams?.get('ref') ?? 'direct';
	const q = questions[current];
	const questionText = getQuestionTextForRegion(q.id, q.text, region);

	const startedRef = useRef(false);
	useEffect(() => {
		if (!startedRef.current) {
			startedRef.current = true;
			trackEvent('quiz_start', { quiz_id: resolvedQuestionnaire.id, seo_source: seoSource });
			trackQuizStart(seoSource);
		}
		return () => {
			if (!completedRef.current) {
				trackEvent('quiz_abandoned', { quiz_id: resolvedQuestionnaire.id, question_index: current, seo_source: seoSource });
				trackQuizAbandoned(seoSource, questions[current]?.id ?? 'unknown');
			}
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const completedRef = useRef(false);

	useEffect(() => {
		Promise.resolve().then(() => {
			setIsHydrated(true);
		});
	}, []);

	const handleSelect = (optionId: string) => {
		setAnswer(q.id, optionId);
		trackEvent('question_answered', { quiz_id: resolvedQuestionnaire.id, question_id: q.id, answer: optionId, question_index: current, seo_source: seoSource });
		trackQuestionAnswered(q.id, optionId);
		questions.forEach(bq => {
			if (bq.branch?.dependsOn === q.id && !bq.branch.values.includes(optionId)) {
				setAnswer(bq.id, '');
			}
		});
		let next = current + 1;
		while (next < questions.length) {
			const nextQ = questions[next];
			if (nextQ.branch) {
				const dep = answers[nextQ.branch.dependsOn] || (q.id === nextQ.branch.dependsOn ? optionId : "");
				if (!nextQ.branch.values.includes(dep)) {
					next++;
					continue;
				}
			}
			break;
		}
		if (next < questions.length) {
			setCurrent(next);
		} else {
			// eslint-disable-next-line react-hooks/immutability
			completedRef.current = true;
			trackEvent('quiz_complete', { quiz_id: resolvedQuestionnaire.id, seo_source: seoSource });
			trackQuizComplete(seoSource);
			router.push(resultsPath);
		}
	};

	const handleBack = () => {
		let prev = current - 1;
		while (prev >= 0) {
			const prevQ = questions[prev];
			if (prevQ.branch) {
				const dep = answers[prevQ.branch.dependsOn] ?? '';
				if (!prevQ.branch.values.includes(dep)) {
					prev--;
					continue;
				}
			}
			break;
		}
		if (prev >= 0) setCurrent(prev);
	};

	const stepCount = questions.length;
	const progress = Math.round(((current + 1) / stepCount) * 100);

	return (
		<div style={{ background: tokens.background, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" }}>
			<main style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 20 }}>
				{isHydrated && <span data-testid="questionnaire-ready" style={{ display: "none" }}>ready</span>}

				{current > 0 && (
					<button
						type="button"
						data-testid="question-back"
						disabled={!isHydrated}
						onClick={handleBack}
						style={{
							alignSelf: "flex-start",
							background: "none",
							border: `1px solid ${tokens.border}`,
							borderRadius: 8,
							padding: "10px 18px",
							color: tokens.textSecondary,
							fontSize: 15,
							fontWeight: 500,
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: 6,
							minHeight: 44,
						}}
					>
						← Back
					</button>
				)}

				<div>
					<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
						<span style={{ fontSize: 13, color: tokens.accent, fontWeight: 600 }}>{progress}% complete</span>
					</div>
					<div style={{ background: tokens.surfaceAlt, borderRadius: 8, height: 6, width: "100%" }}>
						<div style={{ background: tokens.accent, height: 6, borderRadius: 8, width: `${progress}%`, transition: "width 0.3s" }} />
					</div>
				</div>

				<h2 style={{ fontSize: 21, fontWeight: 700, color: tokens.textPrimary, textAlign: "left", margin: 0 }}>{questionText}</h2>

				<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
					{q.options.map((option: { id: string; label: string }) => {
						const selected = answers[q.id] === option.id;
						const label = getOptionLabelForRegion(q.id, option.id, option.label, region);
						return (
							<button
								type="button"
								key={option.id}
								data-testid="question-option"
								disabled={!isHydrated}
								onClick={() => handleSelect(option.id)}
								style={{
									width: "100%",
									padding: "14px 20px",
									border: `2px solid ${selected ? tokens.accent : tokens.border}`,
									background: selected ? tokens.accentSoft : tokens.surface,
									color: selected ? tokens.accent : tokens.textPrimary,
									borderRadius: 10,
									fontSize: 16,
									fontWeight: selected ? 600 : 400,
									textAlign: "center",
									cursor: "pointer",
									outline: "none",
									transition: "all 0.15s",
									boxShadow: selected ? `0 2px 8px ${tokens.accentSoft}` : "none",
								}}
							>
								{label}
							</button>
						);
					})}
				</div>
			</main>
		</div>
	);
}

export default function QuestionnairePage(props: Props) {
	return (
		<Suspense>
			<QuestionnairePageInner {...props} />
		</Suspense>
	);
}
