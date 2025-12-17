import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const anonVsPseudo: ProblemGenerator = {
  type: 'law-anon-vs-pseudo',
  displayName: 'Anonymisation vs. Pseudonymisation',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const scenarios = [
      {
        text: "Replacing names with 'User_123' but keeping a secret key in a safe that links 'User_123' back to 'John Doe'.",
        type: "Pseudonymisation",
        reason: "Because a key exists to re-identify the person, the data is only pseudonymised, not anonymous. GDPR still applies."
      },
      {
        text: "Hashing email addresses without a salt (or with a known salt), allowing a hacker to potentially brute-force the original emails.",
        type: "Pseudonymisation",
        reason: "If re-identification is reasonably possible (e.g. rainbow tables), it is at best pseudonymisation."
      },
      {
        text: "Deleting all identifiers and aggregating data so that no individual can be singled out or inferred (e.g., 'Total website visitors: 5000').",
        type: "Anonymisation",
        reason: "If the process is irreversible and individuals can no longer be identified, it is anonymous. GDPR does not apply."
      },
      {
        text: "Encrypting a database where the decryption key is held by the CTO.",
        type: "Pseudonymisation",
        reason: "Encryption is a form of pseudonymisation. The data can be restored to its original state using the key."
      },
      {
        text: "Blurring faces in a video so effectively that even with advanced software, the original faces cannot be recovered.",
        type: "Anonymisation",
        reason: "If the blurring is irreversible and effective, the data may be considered anonymous."
      }
    ];

    const scenario = scenarios[Math.floor(rng() * scenarios.length)];
    const options = shuffleWithSeed(["Pseudonymisation", "Anonymisation"], rng);
    const correctIndex = options.indexOf(scenario.type);

    return {
      question: `**Scenario**: ${scenario.text}\n\nIs this Anonymisation or Pseudonymisation?`,
      options,
      correctIndex,
      explanation: scenario.reason
    };
  }
};

export const generators = [anonVsPseudo] as const;
