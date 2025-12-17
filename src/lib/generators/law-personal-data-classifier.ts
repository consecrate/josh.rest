import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const personalDataClassifier: ProblemGenerator = {
  type: 'law-personal-data-classifier',
  displayName: 'Personal Data Classifier',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const items = [
      {
        text: "John Doe's personal email address (john.doe@gmail.com)",
        isPersonal: true,
        reason: "It directly identifies a specific natural person."
      },
      {
        text: "Dynamic IP Address used by a home user",
        isPersonal: true,
        reason: "It can be linked to a specific person via the ISP, making them 'identifiable'."
      },
      {
        text: "Cookie ID tracking user behavior across sites",
        isPersonal: true,
        reason: "It singles out a specific user's device and behavior, making them identifiable."
      },
      {
        text: "Company Registration Number (for a corporation)",
        isPersonal: false,
        reason: "GDPR applies to *natural persons*, not legal entities like corporations."
      },
      {
        text: "Anonymized aggregate statistics (e.g., '50% of users are male')",
        isPersonal: false,
        reason: "If the data is truly anonymous and individuals cannot be singled out, it is not personal data."
      },
      {
        text: "Death Certificate of a person who died in 1990",
        isPersonal: false,
        reason: "GDPR does not apply to deceased persons (though national laws might)."
      },
      {
        text: "GPS coordinates of a delivery driver's phone",
        isPersonal: true,
        reason: "It tracks the location of a specific employee, which is personal data."
      },
      {
        text: "A generic info@company.com email address",
        isPersonal: false,
        reason: "It identifies a department, not a specific natural person (unless used by only one known person)."
      }
    ];

    const item = items[Math.floor(rng() * items.length)];
    const correct = item.isPersonal ? "Personal Data" : "Not Personal Data";
    const wrong = item.isPersonal ? "Not Personal Data" : "Personal Data";
    
    const options = shuffleWithSeed([correct, wrong], rng);
    const correctIndex = options.indexOf(correct);

    return {
      question: `Is **"${item.text}"** considered Personal Data under GDPR?`,
      options,
      correctIndex,
      explanation: item.reason
    };
  }
};

export const generators = [personalDataClassifier] as const;
