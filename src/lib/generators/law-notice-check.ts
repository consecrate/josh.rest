import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  missing: string;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    text: "Bob writes: 'We collect your name and email. We use it to send you the newsletter. You have the right to unsubscribe.'",
    missing: "Identity of the Controller",
    explanation: "Bob forgot to say **who he is**! He must state his identity and contact details."
  },
  {
    text: "Bob writes: 'I am Bob, CEO of DataVault. I collect your IP address.'",
    missing: "Purpose of Processing",
    explanation: "Bob identified himself and the data, but not **why** he is collecting it (the Purpose)."
  },
  {
    text: "Bob writes: 'I am Bob. I collect your email for the newsletter. I will keep it forever.'",
    missing: "Retention Period",
    explanation: "Saying 'forever' is usually not compliant, but specifically, he must define the **criteria for retention** (e.g., 'until you unsubscribe')."
  },
  {
    text: "Bob writes: 'I am Bob. I collect your data for marketing. If you have questions, email me.'",
    missing: "Rights of the Data Subject",
    explanation: "Bob must explicitly list the **Rights** (Access, Rectification, Erasure, etc.) available to the user."
  },
  {
    text: "Bob writes: 'I am Bob. I collect your data. I am relying on Legitimate Interest.'",
    missing: "Legitimate Interest Details",
    explanation: "If relying on Legitimate Interest, he must specify **what that interest is**."
  },
  {
    text: "Bob writes: 'I am Bob. I collect your data to share with my partners.'",
    missing: "Recipients of Data",
    explanation: "Bob must specify the **Recipients** or categories of recipients of the personal data."
  },
  {
    text: "Bob writes: 'I am Bob of DataVault Ltd. I collect your email for marketing. I rely on consent. You can complain to me.'",
    missing: "Right to lodge complaint with supervisory authority",
    explanation: "Bob forgot to mention the user's **right to lodge a complaint with a supervisory authority** (e.g., the ICO in the UK)."
  },
  {
    text: "Bob writes: 'I am Bob. I process your location data to show nearby restaurants. I keep it for 30 days.'",
    missing: "Legal Basis",
    explanation: "Bob has identity, purpose, and retention, but he must state the **Legal Basis** (e.g., consent, legitimate interest) for processing."
  }
];

export const lawNoticeCheck: ProblemGenerator = {
  type: 'law-notice-check',
  displayName: 'The Transparency Inspector',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];

    const allOptions = [
      "Identity of the Controller",
      "Purpose of Processing",
      "Retention Period",
      "Rights of the Data Subject",
      "Recipients of Data",
      "Legal Basis",
      "Right to lodge complaint with supervisory authority",
      "Legitimate Interest Details"
    ];

    // Ensure the correct answer is in the options
    if (!allOptions.includes(scenario.missing)) {
        allOptions.push(scenario.missing);
    }

    const shuffledOptions = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffledOptions.indexOf(scenario.missing);

    return {
      question: `<strong>Privacy Notice Draft:</strong><br/>"${scenario.text}"<br/><br/>What mandatory Article 13 information is MISSING from this notice?`,
      options: shuffledOptions,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawNoticeCheck] as const;
