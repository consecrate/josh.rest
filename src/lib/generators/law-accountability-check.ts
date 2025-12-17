import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  tool: string;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    text: "Bob is about to launch a new high-risk AI system that processes health data on a large scale.",
    tool: "DPIA (Data Protection Impact Assessment)",
    explanation: "High-risk processing (like AI + Sensitive Data) requires a **DPIA** *before* you start."
  },
  {
    text: "The Data Protection Authority asks Bob: 'Show me a list of everything you do with personal data.'",
    tool: "ROPA (Record of Processing Activities)",
    explanation: "Article 30 requires a **Record of Processing Activities (ROPA)**, a master document of all data flows."
  },
  {
    text: "A hacker steals the user database. Bob needs to tell the regulator within 72 hours.",
    tool: "Data Breach Notification",
    explanation: "Article 33 requires notifying the DPA of a **Data Breach** within 72 hours if there is a risk to users."
  },
  {
    text: "Bob hires a cloud provider (AWS/Azure) to host his database.",
    tool: "Data Processing Agreement (DPA Contract)",
    explanation: "When a Controller hires a Processor, they must sign a **Data Processing Agreement (DPA)** to legally bind them."
  },
  {
    text: "Bob's company is a public authority (e.g., a hospital or city council).",
    tool: "DPO (Data Protection Officer)",
    explanation: "Public authorities (and companies with large-scale monitoring/sensitive data) *must* appoint a **Data Protection Officer (DPO)**."
  },
  {
    text: "Bob wants to design a new app. He sits down with the team to discuss privacy *before* writing code.",
    tool: "Privacy by Design",
    explanation: "Thinking about privacy at the design stage is called **Privacy by Design & Default**."
  }
];

export const lawAccountabilityCheck: ProblemGenerator = {
  type: 'law-accountability-check',
  displayName: 'The Auditor',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];
    
    const allOptions = [
      "DPIA (Data Protection Impact Assessment)",
      "ROPA (Record of Processing Activities)",
      "Data Breach Notification",
      "Data Processing Agreement (DPA Contract)",
      "DPO (Data Protection Officer)",
      "Privacy by Design"
    ];

    const shuffledOptions = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffledOptions.indexOf(scenario.tool);

    return {
      question: `<strong>Situation:</strong> ${scenario.text}<br/><br/>Which Accountability tool is required or best applies here?`,
      options: shuffledOptions,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawAccountabilityCheck] as const;
