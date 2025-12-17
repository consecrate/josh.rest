import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const specialCategoryDetector: ProblemGenerator = {
  type: 'law-special-category-detector',
  displayName: 'Special Category Detector',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const items = [
      {
        text: "User's political party affiliation",
        isSpecial: true,
        reason: "Political opinions are explicitly listed in Article 9 as special category data."
      },
      {
        text: "Medical history or blood type",
        isSpecial: true,
        reason: "Health data is a special category under Article 9."
      },
      {
        text: "Fingerprint data used for ID verification",
        isSpecial: true,
        reason: "Biometric data used for identification is a special category."
      },
      {
        text: "User's salary or credit score",
        isSpecial: false,
        reason: "Financial data is sensitive and personal, but strictly speaking, it is *not* an Article 9 'Special Category'."
      },
      {
        text: "Trade union membership status",
        isSpecial: true,
        reason: "Trade union membership is a special category under Article 9."
      },
      {
        text: "User's home address",
        isSpecial: false,
        reason: "Address is personal data, but not a special category."
      },
      {
        text: "Religious beliefs",
        isSpecial: true,
        reason: "Religious or philosophical beliefs are special category data."
      },
      {
        text: "Social Security Number / ID Number",
        isSpecial: false,
        reason: "National IDs are highly sensitive personal data, but they are generally not Article 9 data (though they have their own specific rules)."
      }
    ];

    const item = items[Math.floor(rng() * items.length)];
    const correct = item.isSpecial ? "Yes (Article 9 Special Category)" : "No (General Personal Data)";
    const wrong = item.isSpecial ? "No (General Personal Data)" : "Yes (Article 9 Special Category)";
    
    const options = shuffleWithSeed([correct, wrong], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `Is **"${item.text}"** considered a **Special Category** (Article 9) of data?`,
      options,
      correctIndex,
      explanation: item.reason
    };
  }
};

export const generators = [specialCategoryDetector] as const;
