import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  violation: 'Confidentiality' | 'Integrity' | 'Availability';
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    text: "A hacker uses ransomware to encrypt your database, making it inaccessible to you.",
    violation: 'Availability',
    explanation: "The data is still there, but you can't get to it. This is an **Availability** breach."
  },
  {
    text: "An employee leaves a printout of a patient list on a train.",
    violation: 'Confidentiality',
    explanation: "Unauthorized people (passengers) could see the data. This is a **Confidentiality** breach."
  },
  {
    text: "A software bug accidentally overwrites customer addresses with random characters.",
    violation: 'Integrity',
    explanation: "The data has been altered/corrupted. It is no longer accurate or reliable. This is an **Integrity** breach."
  },
  {
    text: "A disgruntled ex-employee uses their old password to log in and download the client list.",
    violation: 'Confidentiality',
    explanation: "Unauthorized access (even by a former employee) is a **Confidentiality** breach."
  },
  {
    text: "A server room fire destroys the main hard drives and the backups fail to restore.",
    violation: 'Availability',
    explanation: "The data is gone forever (or for a long time). This is the ultimate **Availability** failure."
  },
  {
    text: "An attacker performs a SQL Injection to change the price of all products to $0.00.",
    violation: 'Integrity',
    explanation: "The attacker didn't steal the data, they changed it. This violates **Integrity**."
  }
];

export const lawSecurityTriad: ProblemGenerator = {
  type: 'law-security-triad',
  displayName: 'CIA Triad Detector',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];
    
    const options = shuffleWithSeed(['Confidentiality', 'Integrity', 'Availability'], rng);
    const correctIndex = options.indexOf(scenario.violation);

    return {
      question: `<strong>Scenario:</strong> ${scenario.text}<br/><br/>Which part of the CIA security triad was primarily violated?`,
      options: options,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawSecurityTriad] as const;
