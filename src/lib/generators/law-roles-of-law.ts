import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  role: "Regulatory" | "Protective" | "Facilitative" | "Dispute Resolution";
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    text: "Bob incorporates 'DataVault Inc.' to issue shares to investors.",
    role: "Facilitative",
    explanation: "The law provides the framework (Corporate Law) to **Facilitate** business creation and investment."
  },
  {
    text: "A law prohibits companies from dumping toxic waste in the river.",
    role: "Regulatory",
    explanation: "This **Regulates** behavior for the public good (Environmental Law)."
  },
  {
    text: "Bob sues Alice for breach of contract. They go to court.",
    role: "Dispute Resolution",
    explanation: "The courts provide a mechanism for **Dispute Resolution** so they don't have to duel in the street."
  },
  {
    text: "A law prevents employers from forcing employees to work more than 48 hours a week.",
    role: "Protective",
    explanation: "This **Protects** the weaker party (employee) from the stronger party (employer)."
  },
  {
    text: "Bob and Alice sign a contract to define who owns the copyright to the logo.",
    role: "Facilitative",
    explanation: "Contract law **Facilitates** their private transaction by making their promises enforceable."
  },
  {
    text: "GDPR fines a company for losing user data.",
    role: "Regulatory",
    explanation: "This is **Regulatory** enforcement to ensure standards are met."
  },
  {
    text: "Consumer protection laws allow a user to return a defective product.",
    role: "Protective",
    explanation: "This **Protects** consumers from bad business practices."
  }
];

export const lawRolesOfLaw: ProblemGenerator = {
  type: 'law-roles-of-law',
  displayName: 'Roles of Law',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];

    const options = shuffleWithSeed(["Regulatory", "Protective", "Facilitative", "Dispute Resolution"], rng);
    const correctIndex = options.indexOf(scenario.role);

    return {
      question: `<strong>Scenario:</strong> ${scenario.text}<br/><br/>Which Role of Law is this?`,
      options,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawRolesOfLaw] as const;
