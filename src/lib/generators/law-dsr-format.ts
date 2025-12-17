import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  format: string;
  isCompliant: boolean;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    format: "A CSV (Comma Separated Values) file",
    isCompliant: true,
    explanation: "Yes! CSV is **structured**, **commonly used**, and **machine-readable**. It allows the user to easily move data to another service."
  },
  {
    format: "A PDF file containing screenshots of the user's dashboard",
    isCompliant: false,
    explanation: "No. While PDF is common, screenshots are **not machine-readable** structured data. Another system cannot easily import them."
  },
  {
    format: "A handwritten letter mailed to the user",
    isCompliant: false,
    explanation: "No. Paper is definitely **not machine-readable**."
  },
  {
    format: "A proprietary .BOB file that can only be opened with DataVault App",
    isCompliant: false,
    explanation: "No. This is not **commonly used** or interoperable. The user cannot take this to a competitor."
  },
  {
    format: "A standard JSON file",
    isCompliant: true,
    explanation: "Yes! JSON is the gold standard for **structured, machine-readable** data transfer on the web."
  },
  {
    format: "An XML file using a standard schema",
    isCompliant: true,
    explanation: "Yes! XML is **structured** and **machine-readable**."
  }
];

export const lawDsrFormat: ProblemGenerator = {
  type: 'law-dsr-format',
  displayName: 'Portability Format Checker',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];

    return {
      question: `<strong>Scenario:</strong> A user requests their data under the Right to Data Portability (Art 20).<br/><br/>Bob provides: <strong>${scenario.format}</strong>.<br/><br/>Is this compliant?`,
      options: [
        "Yes, this is compliant.",
        "No, this violates Article 20 requirements."
      ],
      correctIndex: scenario.isCompliant ? 0 : 1,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawDsrFormat] as const;
