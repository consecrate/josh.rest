import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  recordType: string;
  age: string;
  policy: string;
  context?: string;
  action: 'Delete' | 'Keep';
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    recordType: "Tax Invoice",
    age: "10 years old",
    policy: "Keep for 7 years",
    action: 'Delete',
    explanation: "The retention period (7 years) has expired."
  },
  {
    recordType: "CCTV Footage",
    age: "45 days old",
    policy: "Keep for 30 days",
    action: 'Delete',
    explanation: "CCTV footage should usually be overwritten quickly (e.g., 30 days) unless an incident occurred."
  },
  {
    recordType: "Employee Contract",
    age: "Employee left 2 years ago",
    policy: "Keep for 5 years post-employment",
    action: 'Keep',
    explanation: "The retention period (5 years post-employment) has not yet expired."
  },
  {
    recordType: "Unsuccessful Job Application",
    age: "8 months old",
    policy: "Keep for 6 months",
    action: 'Delete',
    explanation: "Holding CVs of rejected candidates indefinitely is a violation. 6 months is a common limit for potential discrimination claims."
  },
  {
    recordType: "Customer Support Ticket",
    age: "3 years old",
    policy: "Keep for 2 years",
    context: "Ticket is related to an ongoing lawsuit.",
    action: 'Keep',
    explanation: "Legal holds (ongoing litigation) override standard retention policies. You must keep evidence."
  },
  {
    recordType: "Session Cookie",
    age: "User closed browser",
    policy: "Session duration",
    action: 'Delete',
    explanation: "Session cookies should disappear when the session ends."
  },
  {
    recordType: "Chat Support Transcript",
    age: "2 years old",
    policy: "Keep for 1 year",
    context: "Customer has filed a formal complaint that is still being reviewed.",
    action: 'Keep',
    explanation: "Active complaints or disputes override standard retention. You must keep relevant records until the matter is resolved."
  },
  {
    recordType: "Marketing Consent Record",
    age: "User withdrew consent 3 months ago",
    policy: "Delete consent data when withdrawn",
    action: 'Keep',
    explanation: "You must **keep proof that consent was withdrawn** for accountability. Delete the marketing data, but retain evidence of the withdrawal."
  }
];

export const lawRetentionPolicy: ProblemGenerator = {
  type: 'law-retention-policy',
  displayName: 'The Shredder',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];
    
    // Simple binary choice
    const correctOption = scenario.action;
    const wrongOption = scenario.action === 'Delete' ? 'Keep' : 'Delete';
    
    const options = shuffleWithSeed([correctOption, wrongOption], rng);
    const correctIndex = options.indexOf(correctOption);
    
    let question = `<strong>Record:</strong> ${scenario.recordType}<br/>
    <strong>Age:</strong> ${scenario.age}<br/>
    <strong>Policy:</strong> ${scenario.policy}`;
    
    if (scenario.context) {
      question += `<br/><strong>Context:</strong> ${scenario.context}`;
    }
    
    question += `<br/><br/>Action: Keep or Delete?`;

    return {
      question,
      options,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawRetentionPolicy] as const;
