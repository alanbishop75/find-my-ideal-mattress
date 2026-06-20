"use client";
import React, { Suspense } from 'react';
import { mattressQuestionnaire } from '../../config/mattress/questionnaire';
import { useAppState } from '../client-providers';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Questionnaire } from '../../core/types';
import { useRegion } from '../../core/geo/RegionContext';
import { useContext } from 'react';
import { getOptionLabelForRegion, getQuestionTextForRegion } from '../../core/geo/content';
import { defaultCategoryId } from '../../config/domain-map';
import {
	trackQuizStart,
	trackQuizComplete,
	trackQuizAbandoned,
	trackQuestionAnswered,
} from '../../lib/analytics';
import { useQuizEventLogger } from '../../components/useQuizEventLogger';
import { QuizAbandonContext } from '../../components/QuizAbandonContext';

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

function QuestionnairePageInner({ questionnaire: questionnaireProp, resultsPath = `/${defaultCategoryId}/results` }: Props) {
	const resolvedQuestionnaire = questionnaireProp ?? mattressQuestionnaire;
	const questions = resolvedQuestionnaire.questions;
	const { answers, setAnswer, reset } = useAppState();
	const { setAbandonQuiz } = useContext(QuizAbandonContext);
	const [isHydrated, setIsHydrated] = useState(false);
	const [current, setCurrent] = useState(0);
	const router = useRouter();
	const { region } = useRegion();
	const searchParams = useSearchParams();
	const seoSource = searchParams?.get('ref') ?? 'direct';
	const q = questions[current];
	const questionText = getQuestionTextForRegion(q.id, q.text, region);
	const { log } = useQuizEventLogger();

	const startedRef = useRef(false);
	const abandonedRef = useRef(false);
	useEffect(() => {
		reset();
		setAbandonQuiz(() => () => {
			if (!completedRef.current && !abandonedRef.current) {
				abandonedRef.current = true;
				trackEvent('quiz_abandoned', { quiz_id: resolvedQuestionnaire.id, question_index: current, seo_source: seoSource });
				trackQuizAbandoned(seoSource, questions[current]?.id ?? 'unknown');
				log({ event: 'quiz_abandoned', quizId: resolvedQuestionnaire.id, questionId: questions[current]?.id ?? 'unknown', source: seoSource });
			}
		});
		if (!startedRef.current) {
			startedRef.current = true;
			trackEvent('quiz_start', { quiz_id: resolvedQuestionnaire.id, seo_source: seoSource });
			trackQuizStart(seoSource);
			log({ event: 'quiz_start', quizId: resolvedQuestionnaire.id, source: seoSource });
		}
		return () => {
			setAbandonQuiz(null);
			if (!completedRef.current && !abandonedRef.current) {
				abandonedRef.current = true;
				trackEvent('quiz_abandoned', { quiz_id: resolvedQuestionnaire.id, question_index: current, seo_source: seoSource });
				trackQuizAbandoned(seoSource, questions[current]?.id ?? 'unknown');
				log({ event: 'quiz_abandoned', quizId: resolvedQuestionnaire.id, questionId: questions[current]?.id ?? 'unknown', source: seoSource });
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
		log({ event: 'question_answered', quizId: resolvedQuestionnaire.id, questionId: q.id, answerId: optionId, source: seoSource });
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
			abandonedRef.current = true;
			trackEvent('quiz_complete', { quiz_id: resolvedQuestionnaire.id, seo_source: seoSource });
			trackQuizComplete(seoSource);
			log({ event: 'quiz_complete', quizId: resolvedQuestionnaire.id, source: seoSource });
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
		<div style={{
			minHeight: "100vh",
			backgroundImage: "url('/images/a-soft-inviting-mattress.jpeg')",
			backgroundSize: "cover",
			backgroundPosition: "center 40%",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "flex-start",
			padding: "16px 16px 40px",
			position: "relative",
		}}>
			{/* Forest overlay for readability */}
			<div style={{
				position: "absolute",
				inset: 0,
				background: "rgba(26, 61, 47, 0.55)",
				zIndex: 0,
			}} />

			<main style={{
				width: "100%",
				maxWidth: 440,
				display: "flex",
				flexDirection: "column",
				gap: 20,
				position: "relative",
				zIndex: 1,
				background: "rgba(255,255,255,0.08)",
				border: "1px solid rgba(255,255,255,0.15)",
				borderRadius: 20,
				padding: 28,
				backdropFilter: "blur(12px)",
				WebkitBackdropFilter: "blur(12px)",
			}}>
				{isHydrated && <span data-testid="questionnaire-ready" style={{ display: "none" }}>ready</span>}

				<div>
					<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
						<span style={{ fontSize: 13, color: "#ffffff", fontWeight: 700 }}>{progress}% complete</span>
					</div>
					<div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, height: 6, width: "100%" }}>
						<div style={{ background: "#3bb273", height: 6, borderRadius: 8, width: `${progress}%`, transition: "width 0.3s", boxShadow: "0 0 8px rgba(59,178,115,0.6)" }} />
					</div>
				</div>

				<h2 style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", textAlign: "left", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.4)", lineHeight: 1.35 }}>{questionText}</h2>

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
									border: selected ? "2px solid #3bb273" : "1px solid rgba(255,255,255,0.28)",
									background: selected ? "rgba(59,178,115,0.22)" : "rgba(255,255,255,0.1)",
									backdropFilter: "blur(10px)",
									WebkitBackdropFilter: "blur(10px)",
									color: "#ffffff",
									borderRadius: 12,
									fontSize: 16,
									fontWeight: selected ? 600 : 400,
									textAlign: "center",
									cursor: "pointer",
									outline: "none",
									transition: "all 0.15s",
									boxShadow: selected ? "0 2px 12px rgba(59,178,115,0.4)" : "0 1px 4px rgba(0,0,0,0.2)",
								}}
							>
								{label}
							</button>
						);
					})}
				</div>

				{current > 0 && (
					<button
						type="button"
						data-testid="question-back"
						disabled={!isHydrated}
						onClick={handleBack}
						style={{
							alignSelf: "flex-start",
							background: "rgba(255,255,255,0.1)",
							border: "1px solid rgba(255,255,255,0.3)",
							borderRadius: 8,
							padding: "10px 18px",
							color: "rgba(255,255,255,0.85)",
							fontSize: 15,
							fontWeight: 500,
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: 6,
							minHeight: 44,
						}}
					>
						Back
					</button>
				)}
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
