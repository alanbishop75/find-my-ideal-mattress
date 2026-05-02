import { redirect } from 'next/navigation';

// Redirect legacy /questionnaire to the mattress questionnaire route
export default function QuestionnairePage() {
  redirect('/mattress/questionnaire');
}
