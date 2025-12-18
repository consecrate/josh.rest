import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  violation: 'Confidentiality' | 'Integrity' | 'Availability';
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    text: "A DDoS attack floods the company's servers with traffic, crashing the website for 6 hours.",
    violation: 'Availability',
    explanation: "Users cannot access the service. This is an **Availability** breach—the data exists but is unreachable."
  },
  {
    text: "A misconfigured S3 bucket exposes 10,000 customer records to the public internet.",
    violation: 'Confidentiality',
    explanation: "Unauthorized parties could access the data. This is a **Confidentiality** breach caused by misconfiguration."
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
  },
  {
    text: "A phishing email tricks an employee into revealing their login credentials to an attacker.",
    violation: 'Confidentiality',
    explanation: "The attacker gained unauthorized access to credentials. This is a **Confidentiality** breach through social engineering."
  },
  {
    text: "A cloud provider's data center loses power for 4 hours, and the backup generators fail.",
    violation: 'Availability',
    explanation: "Services become unreachable due to infrastructure failure. This is an **Availability** breach."
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
