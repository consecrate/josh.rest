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
      },
      {
        text: "The ePrivacy Directive (2002) governs cookies and electronic communications. Why is it still a 'Directive' and not a Regulation?",
        correct: "It predates GDPR and political negotiations for an ePrivacy Regulation have stalled for years.",
        wrong: ["Directives are stronger than Regulations.", "The EU forgot to update it.", "Cookies are not important enough."],
        explanation: "The ePrivacy **Regulation** has been proposed but repeatedly delayed. Until it passes, the older **Directive** (implemented differently in each country) still applies."
      },
      {
        text: "A Member State wants to set the age of digital consent at 13 instead of the GDPR's default 16. Can they?",
        correct: "Yes, GDPR allows Member States to lower it to 13 (this is a Directive-like flexibility built into the Regulation).",
        wrong: ["No, Regulations cannot be changed by Member States.", "Only if they leave the EU.", "Only with unanimous EU approval."],
        explanation: "Some GDPR provisions deliberately include **Member State flexibility** (like Article 8 on children's consent), which is a Directive-like feature within a Regulation."
      },
      {
        text: "The NIS2 Directive (Network and Information Security) requires critical infrastructure operators to report cyber incidents. How does it become law in France?",
        correct: "France must pass its own national law implementing the Directive's requirements.",
        wrong: ["It applies automatically like GDPR.", "France can ignore it.", "It only applies to German companies."],
        explanation: "As a **Directive**, NIS2 sets minimum standards but each Member State must **transpose** it into national law, potentially adding stricter requirements."
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
