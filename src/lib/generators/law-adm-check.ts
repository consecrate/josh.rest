import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  situation: string;
  violation: boolean;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    situation: "Bob's AI automatically denies a loan application. No human ever sees it.",
    violation: true,
    explanation: "<strong>Violation (likely).</strong> This is a decision based **solely on automated processing** that produces **legal/significant effects**. Article 22 generally prohibits this unless an exception applies."
  },
  {
    situation: "Bob's AI recommends a movie to watch on Friday night.",
    violation: false,
    explanation: "<strong>No Violation.</strong> Recommending a movie does not produce **legal effects** or **similarly significant effects**. Article 22 does not apply to trivial decisions."
  },
  {
    situation: "Bob's AI flags a transaction as 'suspicious'. A human analyst reviews it and decides to block the account.",
    violation: false,
    explanation: "<strong>No Violation.</strong> This is not *solely* automated. There is **human intervention**. The human made the final decision."
  },
  {
    situation: "Bob's AI automatically calculates the price of an Uber ride based on demand.",
    violation: false,
    explanation: "<strong>Likely No Violation.</strong> While automated, dynamic pricing is usually considered a contractual necessity or does not have the same 'significant effect' on rights as a credit denial (though this is debated, generally it's allowed)."
  },
  {
    situation: "Bob's AI automatically filters out job applicants based on keywords. 90% are rejected without human review.",
    violation: true,
    explanation: "<strong>Violation.</strong> E-recruiting without human intervention can have a significant effect (denying employment). It falls under Article 22 protection."
  }
];

export const lawAdmCheck: ProblemGenerator = {
  type: 'law-adm-check',
  displayName: 'The AI Judge',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];

    return {
      question: `<strong>Scenario:</strong> ${scenario.situation}<br/><br/>Does this violate the general prohibition on Automated Decision Making (Article 22)?`,
      options: [
        "Yes (Prohibited / Requires Safeguards)",
        "No (Allowed / Not Significant)"
      ],
      correctIndex: scenario.violation ? 0 : 1,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawAdmCheck] as const;
