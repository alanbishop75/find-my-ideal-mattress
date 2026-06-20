import { redirect } from 'next/navigation';
import { defaultCategoryId } from '../../../config/domain-map';

// Legacy route retained for backward compatibility.
export default function LegacyQuestionnaireV2Page() {
	redirect(`/${defaultCategoryId}/questionnaire`);
}
