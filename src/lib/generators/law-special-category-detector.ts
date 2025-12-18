import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const specialCategoryDetector: ProblemGenerator = {
  type: 'law-special-category-detector',
  displayName: 'Special Category Detector',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const items = [
      // True Special Categories (Article 9)
      {
        text: "User's political party affiliation",
        type: "Special Category (Article 9)",
        reason: "Political opinions are explicitly listed in Article 9. Processing is prohibited unless an exception applies."
      },
      {
        text: "Medical history (e.g., 'Patient has diabetes')",
        type: "Special Category (Article 9)",
        reason: "Data concerning health is a Special Category."
      },
      {
        text: "Fingerprint data used for ID verification (TouchID)",
        type: "Special Category (Article 9)",
        reason: "Biometric data *for the purpose of uniquely identifying a natural person* is Special Category."
      },
      {
        text: "Trade union membership status",
        type: "Special Category (Article 9)",
        reason: "Trade union membership is explicitly listed in Article 9."
      },
      {
        text: "Religious or philosophical beliefs",
        type: "Special Category (Article 9)",
        reason: "Religious beliefs are Special Category data."
      },
      {
        text: "Genetic data (DNA sequence)",
        type: "Special Category (Article 9)",
        reason: "Genetic data is Special Category data."
      },
      {
        text: "Sexual orientation or sex life",
        type: "Special Category (Article 9)",
        reason: "Data concerning a person's sex life or sexual orientation is Special Category."
      },

      // High Risk / Sensitive BUT NOT Article 9
      {
        text: "User's credit card number and salary",
        type: "General Personal Data (High Risk)",
        reason: "Financial data is highly sensitive and risky, but it is **NOT** an Article 9 Special Category. It doesn't require Article 9 exceptions (like explicit consent) but does require high security."
      },
      {
        text: "Social Security Number / National ID",
        type: "General Personal Data (National Law)",
        reason: "National IDs are not Article 9 data in the GDPR itself, though Member States often have specific rules for them (Article 87)."
      },
      {
        text: "A photograph of a user's face (stored on a profile page)",
        type: "General Personal Data",
        reason: "Photos are only Biometric (Special Category) if processed through specific technical means to **identify** someone (e.g., facial recognition). A standard profile pic is just Personal Data."
      },
      {
        text: "Location data (GPS history)",
        type: "General Personal Data (High Risk)",
        reason: "Location data is very intrusive, but it is not listed in Article 9. It is General Personal Data (though ePrivacy Directive may apply)."
      },
      
      // Article 10 (Criminal)
      {
        text: "Criminal conviction record",
        type: "Criminal Conviction Data (Article 10)",
        reason: "Criminal data is handled under **Article 10**, not Article 9. It can only be processed under official authority or specific EU/Member State law."
      }
    ];

    const item = items[Math.floor(rng() * items.length)];
    
    // We want the user to distinguish between "Special" and "General" primarily.
    // But adding "Criminal" as a distractor is good.
    
    let correct = "";
    if (item.type.includes("Special")) correct = "Yes, Special Category (Art. 9)";
    else if (item.type.includes("Criminal")) correct = "Criminal Data (Art. 10)";
    else correct = "No, General Personal Data";

    const allOptions = [
      "Yes, Special Category (Art. 9)",
      "No, General Personal Data",
      "Criminal Data (Art. 10)",
      "No, it is not Personal Data"
    ];

    const options = shuffleWithSeed(allOptions, rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `Is **"${item.text}"** considered a **Special Category** of data under GDPR Article 9?`,
      options,
      correctIndex,
      explanation: item.reason
    };
  }
};

export const generators = [specialCategoryDetector] as const;
