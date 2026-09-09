const steps = [
  {
    title: "Multiple provider dashboards",
    finding: "Fragmented visibility",
    position: "top",
  },
  {
    title: "Exporting CSV / reports",
    finding: "Manual reconciliation",
    position: "bottom",
  },
  {
    title: "Spreadsheet stitching",
    finding: "Investigation was complex and slow",
    position: "top",
  },
  {
    title: "Delayed insights",
    finding: "No clear cost ownership",
    position: "bottom",
  },
];

export function ResearchFlowCanvas() {
  return (
    <div className="finoutResearchCanvas" aria-label="Fragmented cloud cost investigation workflow">
      <div className="finoutResearchFlow">
        {steps.map((step, index) => (
          <div className={`finoutResearchStep finding-${step.position}`} key={step.title}>
            <p className="finoutResearchFinding">{step.finding}</p>
            <article>
              <strong>{step.title}</strong>
            </article>
            {index < steps.length - 1 && <span className="finoutResearchArrow" aria-hidden="true">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const themes = [
  { name: "Visibility", tone: "violet", notes: ["No way to see the big picture", "Each vendor has different formats", "We use 5+ dashboards just to track spend"] },
  { name: "Efficiency", tone: "yellow", notes: ["Answering simple questions is slow", "Reporting cycles delay planning", "Reconciliation takes hours every week"] },
  { name: "Alignment", tone: "rose", notes: ["Finance and engineering never look at the same numbers", "Data definitions aren’t consistent", "Lots of back-and-forth in Slack"] },
  { name: "Accuracy", tone: "blue", notes: ["High risk of errors when stitching CSVs", "Hard to trust the final reports", "Manual formulas break easily"] },
];

export function InterviewInsightsCanvas() {
  return (
    <div className="finoutInsightsCanvas" aria-label="Four themes from design partner interviews">
      {themes.map((theme) => (
        <article className={`finoutInsightTheme tone-${theme.tone}`} key={theme.name}>
          <header><h3>{theme.name}</h3></header>
          <ul>{theme.notes.map((note) => <li key={note}>“{note}”</li>)}</ul>
        </article>
      ))}
    </div>
  );
}

export function ResearchSequenceCanvas() {
  const [stage, setStage] = useState<"workflow" | "insights">("workflow");

  return (
    <div className="finoutResearchSequence">
      <header className="finoutResearchStageNav">
        <div><small>Research sequence</small><strong>{stage === "workflow" ? "What teams were doing" : "What we heard from teams"}</strong></div>
        <div role="tablist" aria-label="Research stages">
          <button type="button" role="tab" aria-selected={stage === "workflow"} onClick={() => setStage("workflow")}>Observed workflow</button>
          <button type="button" role="tab" aria-selected={stage === "insights"} onClick={() => setStage("insights")}>Interview synthesis</button>
        </div>
      </header>
      <div className="finoutResearchStagePanel" key={stage} role="tabpanel">
        {stage === "workflow" ? <ResearchFlowCanvas /> : (
          <>
            <div className="finoutResearchBridge"><p>Design-partner interviews showed that fragmented tooling affected more than speed. It weakened visibility, alignment and confidence in the final numbers.</p></div>
            <InterviewInsightsCanvas />
          </>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
