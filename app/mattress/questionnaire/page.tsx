"use client";
import { categoryRegistry } from "../../../config/registry";
import QuestionnairePage from "../../questionnaire/page-client";

export default function MattressQuestionnairePage() {
  const config = categoryRegistry["mattress"];
  return (
    <QuestionnairePage
      questionnaire={config.questionnaire}
      resultsPath="/mattress/results"
    />
  );
}
