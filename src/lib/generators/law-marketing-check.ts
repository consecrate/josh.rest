import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  objection: string;
  outcome: "STOP" | "BALANCE";
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    objection: "Stop sending me marketing emails!",
    outcome: "STOP",
    explanation: "<strong>STOP IMMEDIATELY.</strong> The Right to Object to **Direct Marketing** is an **absolute right**. No balancing test is required."
  },
  {
    objection: "Stop processing my data for fraud detection! I don't like it.",
    outcome: "BALANCE",
    explanation: "<strong>BALANCING TEST REQUIRED.</strong> For fraud detection (Legitimate Interest), Bob can refuse the objection if he demonstrates **compelling legitimate grounds** that override the user's interests."
  },
  {
    objection: "I dispute the accuracy of this debt. Stop processing it until we figure it out.",
    outcome: "STOP",
    explanation: "<strong>RESTRICT (PAUSE).</strong> This is actually the **Right to Restriction**. Bob must pause processing (store it, but don't use it) while verification takes place."
  },
  {
    objection: "Stop profiling me for personalized ads.",
    outcome: "STOP",
    explanation: "<strong>STOP IMMEDIATELY.</strong> Profiling related to direct marketing falls under the **absolute right** to object."
  },
  {
    objection: "I object to you keeping my server logs for security purposes.",
    outcome: "BALANCE",
    explanation: "<strong>BALANCING TEST REQUIRED.</strong> Security is usually a compelling legitimate ground. Bob likely wins this balance, but he must still perform the test."
  },
  {
    objection: "Stop using my data for credit scoring. I don't want you profiling my finances.",
    outcome: "BALANCE",
    explanation: "<strong>BALANCING TEST REQUIRED.</strong> Credit scoring for legitimate lending purposes is typically a compelling legitimate interest, but Bob must document the balancing test."
  },
  {
    objection: "I don't want my photo used in your company's promotional brochure anymore.",
    outcome: "STOP",
    explanation: "<strong>STOP IMMEDIATELY.</strong> Using someone's image for marketing materials typically relies on Consent. Once withdrawn, you must stop—and remove it from future prints."
  },
  {
    objection: "Stop sharing my order history with your analytics partner for 'product improvement'.",
    outcome: "BALANCE",
    explanation: "<strong>BALANCING TEST REQUIRED.</strong> Sharing with third parties for analytics may be Legitimate Interest, but Bob must weigh whether the data sharing is truly necessary and proportionate."
  }
];

export const lawMarketingCheck: ProblemGenerator = {
  type: 'law-marketing-check',
  displayName: 'The Objection Handler',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];

    return {
      question: `<strong>User Objection:</strong> "${scenario.objection}"<br/><br/>What must Bob do?`,
      options: [
        "Stop processing immediately (Absolute Right/Restriction)",
        "Perform a Balancing Test (Can potentially refuse)"
      ],
      correctIndex: scenario.outcome === "STOP" ? 0 : 1,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawMarketingCheck] as const;
