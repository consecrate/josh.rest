import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const directiveVsRegulation: ProblemGenerator = {
  type: 'law-directive-vs-regulation',
  displayName: 'Directive vs. Regulation',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const scenarios = [
      {
        text: "The EU passes a law saying 'Goals must be met, but countries can decide how.' France passes a strict version, Germany passes a loose version.",
        correct: "Directive",
        wrong: ["Regulation", "Recommendation", "Opinion"],
        explanation: "This is a **Directive**. It sets a goal but leaves the method of implementation to the Member States, often resulting in different rules in different countries."
      },
      {
        text: "The EU passes a law that applies immediately and identically in every country. Spain cannot change it.",
        correct: "Regulation",
        wrong: ["Directive", "Guideline", "Treaty"],
        explanation: "This is a **Regulation**. It is 'directly applicable' and binding in its entirety. It creates a single uniform law across the EU."
      },
      {
        text: "Why did the EU replace the 1995 Directive with the GDPR (Regulation)?",
        correct: "To harmonize laws so businesses only face one set of rules.",
        wrong: ["To make laws weaker.", "To let countries have more freedom.", "To ban the internet."],
        explanation: "The shift to a **Regulation** was driven by the need for **Harmonization**. Under the Directive, companies had to deal with 28 different variations of the law."
      }
    ];

    const scenario = scenarios[Math.floor(rng() * scenarios.length)];
    const options = shuffleWithSeed([scenario.correct, ...scenario.wrong], rng);
    const correctIndex = options.indexOf(scenario.correct);

    return {
      question: scenario.text,
      options,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [directiveVsRegulation] as const;
