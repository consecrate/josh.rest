import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const authFactors: ProblemGenerator = {
  type: 'law-auth-factors',
  displayName: 'Authentication Factors',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const items = [
      {
        text: "Password or PIN",
        factor: "Knowledge",
        reason: "It is something you **know**."
      },
      {
        text: "Secret Answer (e.g., mother's maiden name)",
        factor: "Knowledge",
        reason: "It is something you **know**."
      },
      {
        text: "USB Security Key (YubiKey)",
        factor: "Possession",
        reason: "It is something you **have**."
      },
      {
        text: "Smartphone (receiving an SMS code)",
        factor: "Possession",
        reason: "It is something you **have** (the phone/SIM card)."
      },
      {
        text: "Fingerprint Scan",
        factor: "Inherence",
        reason: "It is something you **are** (biometric)."
      },
      {
        text: "Face ID / Iris Scan",
        factor: "Inherence",
        reason: "It is something you **are** (biometric)."
      },
      {
        text: "Smart Card / ID Card",
        factor: "Possession",
        reason: "It is something you **have**."
      },
      {
        text: "Voice Recognition Pattern",
        factor: "Inherence",
        reason: "It is something you **are**."
      }
    ];

    const item = items[Math.floor(rng() * items.length)];
    const correct = item.factor;
    // Create wrong answers from the other factors
    const allFactors = ["Knowledge", "Possession", "Inherence"];
    const wrong = allFactors.filter(f => f !== correct);
    
    // We need 3 options total
    const options = shuffleWithSeed([correct, ...wrong], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `Which authentication factor is **"${item.text}"**?`,
      options,
      correctIndex,
      explanation: `"${item.text}" is a **${item.factor}** factor because ${item.reason}`
    };
  }
};

export const generators = [authFactors] as const;
