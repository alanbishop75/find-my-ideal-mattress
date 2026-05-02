import { redirect } from 'next/navigation';

// Legacy route retained for backward compatibility.
export default function LegacyQuestionnaireV2Page() {
	redirect('/mattress/questionnaire');
}
