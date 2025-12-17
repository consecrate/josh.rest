import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  request: string;
  action: "DELETE" | "KEEP";
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    request: "I withdraw my consent for the newsletter. Delete my email from the marketing list.",
    action: "DELETE",
    explanation: "<strong>DELETE.</strong> When processing is based on **Consent**, withdrawing consent removes the legal basis. The data must be erased (or at least suppressed)."
  },
  {
    request: "I hate your service. Delete the unpaid invoice for the service I used last month.",
    action: "KEEP",
    explanation: "<strong>KEEP.</strong> Bob has a **Legal Obligation** (tax laws) and a **Contractual necessity** to keep invoice records. The Right to Erasure is NOT absolute."
  },
  {
    request: "The data you have on me is no longer necessary for the purpose you collected it.",
    action: "DELETE",
    explanation: "<strong>DELETE.</strong> If the data is **no longer necessary** for the original purpose, Article 17(1)(a) says it must be erased."
  },
  {
    request: "I want you to delete my data because I am suing you, and I don't want you to have evidence.",
    action: "KEEP",
    explanation: "<strong>KEEP.</strong> Erasure does not apply if the processing is necessary for the **establishment, exercise, or defense of legal claims**."
  },
  {
    request: "I unlawfully posted someone else's private photos. Delete them immediately.",
    action: "DELETE",
    explanation: "<strong>DELETE.</strong> If the personal data have been **unlawfully processed**, they must be erased."
  },
  {
    request: "I want you to delete my medical records held by the public hospital.",
    action: "KEEP",
    explanation: "<strong>KEEP.</strong> Erasure often does not apply when processing is necessary for **reasons of public interest in the area of public health**."
  }
];

export const lawErasureJudge: ProblemGenerator = {
  type: 'law-erasure-judge',
  displayName: 'The Erasure Judge',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];

    return {
      question: `<strong>Request:</strong> "${scenario.request}"<br/><br/><strong>Verdict:</strong> Should Bob DELETE the data or KEEP it?`,
      options: [
        "DELETE (Right to Erasure applies)",
        "KEEP (Exception applies)"
      ],
      correctIndex: scenario.action === "DELETE" ? 0 : 1,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawErasureJudge] as const;
