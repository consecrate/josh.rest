import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const anonVsPseudo: ProblemGenerator = {
  type: 'law-anon-vs-pseudo',
  displayName: 'Anonymisation vs. Pseudonymisation',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const scenarios = [
      {
        text: "Replacing names with 'User_123' but keeping a lookup table in a secure vault.",
        type: "Pseudonymisation",
        reason: "If a key (lookup table) exists to re-identify the person, it is **Pseudonymisation**. The data is still Personal Data."
      },
      {
        text: "Encrypting the database with AES-256. The key is stored on a separate server.",
        type: "Pseudonymisation",
        reason: "Encryption is the gold standard of **Pseudonymisation**. Because the original data can be recovered with the key, it is not anonymous."
      },
      {
        text: "Hashing email addresses using a secret 'salt' key.",
        type: "Pseudonymisation",
        reason: "Keyed hashing (HMAC) allows the holder of the key to verify or re-link data. It is **Pseudonymisation**."
      },
      {
        text: "Deleting the original dataset and retaining only 'Average Age: 34' and 'Total Users: 5000'.",
        type: "Anonymisation",
        reason: "Aggregation that prevents singling out is **Anonymisation**. This data is no longer Personal Data."
      },
      {
        text: "Blurring faces in a video so effectively that they cannot be reversed, and deleting the original raw video.",
        type: "Anonymisation",
        reason: "If the process is irreversible and identification is impossible by reasonable means, it is **Anonymisation**."
      },
      {
        text: "Removing names but keeping 'Date of Birth', 'Zip Code', and 'Gender' for a small town.",
        type: "Pseudonymisation (Ineffective)",
        reason: "This fails 'k-anonymity'. A specific person can likely be singled out by combining these traits. It is effectively still **Personal Data** (Pseudonymised at best)."
      },
      {
        text: "Tokenization: Replacing credit card numbers with a random token, where the mapping is held by the payment processor.",
        type: "Pseudonymisation",
        reason: "Tokenization is a form of **Pseudonymisation** because the mapping allows re-identification."
      }
    ];

    const scenario = scenarios[Math.floor(rng() * scenarios.length)];
    const options = shuffleWithSeed(["Pseudonymisation", "Anonymisation", "Encryption", "Deletion"], rng);
    
    // We map the type to the simplified options
    let correctOption = "";
    if (scenario.type.includes("Pseudonymisation")) correctOption = "Pseudonymisation";
    else correctOption = "Anonymisation";
    
    const correctIndex = options.indexOf(correctOption);

    return {
      question: `<strong>Scenario</strong>: ${scenario.text}<br/><br/>Is this Anonymisation or Pseudonymisation?`,
      options,
      correctIndex,
      explanation: scenario.reason
    };
  }
};

export const generators = [anonVsPseudo] as const;
