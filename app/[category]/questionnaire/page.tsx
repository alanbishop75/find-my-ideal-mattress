"use client";
import { useParams } from 'next/navigation';
import { categoryRegistry } from '../../../config/registry';
import QuestionnairePage from '../../questionnaire/page-client';

export default function CategoryQuestionnairePage() {
  const params = useParams();
  const categoryId = params?.category as string;
  const config = categoryRegistry[categoryId];

  if (!config) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p>Category &quot;{categoryId}&quot; not found.</p>
      </div>
    );
  }

  return (
    <QuestionnairePage
      questionnaire={config.questionnaire}
      resultsPath={`/${categoryId}/results`}
    />
  );
}
