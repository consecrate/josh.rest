import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const privacyVsSecurity: ProblemGenerator = {
  type: 'law-privacy-vs-security',
  displayName: 'Privacy vs. Security',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const scenarios = [
      {
        question: "A hacker uses SQL Injection to steal all user passwords from the database. What kind of failure is this primarily?",
        correct: "Security Failure",
        wrong: ["Privacy Violation", "Regulatory Oversight", "Contract Breach"],
        explanation: "This is a **Security Failure**. The mechanism for protecting the data (the vault) failed. While it leads to a privacy breach, the root cause is a failure of security controls."
      },
      {
        question: "Bob's app collects user location data every 5 minutes and sells it to advertisers without asking the user. The data is stored on a highly encrypted server.",
        correct: "Privacy Violation",
        wrong: ["Security Failure", "Data Corruption", "Service Denial"],
        explanation: "This is a **Privacy Violation**. The data is secure (encrypted), but the *use* of the data intrudes on the user's rights and expectations. The vault is safe, but the owner is misusing what's inside."
      },
      {
        question: "Alice wants to delete her account, but the 'Delete' button is fake and does nothing.",
        correct: "Privacy Violation",
        wrong: ["Security Failure", "Network Error", "Hardware Failure"],
        explanation: "This violates the user's control over their data (Informational Self-Determination), which is a core **Privacy** right."
      },
      {
        question: "An employee leaves a laptop containing user data on a train without a password.",
        correct: "Security Failure",
        wrong: ["Privacy Violation (Intentional)", "Software Bug", "Feature Request"],
        explanation: "This is a **Security Failure** (specifically, physical security and access control). It puts data at risk of unauthorized access."
      }
    ];

    const scenario = scenarios[Math.floor(rng() * scenarios.length)];
    const options = shuffleWithSeed([scenario.correct, ...scenario.wrong], rng);
    const correctIndex = options.indexOf(scenario.correct);

    return {
      question: scenario.question,
      options,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [privacyVsSecurity] as const;
