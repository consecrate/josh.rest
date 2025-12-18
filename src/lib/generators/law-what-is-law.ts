import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  type: "Law" | "Social Rule" | "Moral Rule" | "Contract";
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    text: "The speed limit is 60mph. You drive 80mph and get a ticket.",
    type: "Law",
    explanation: "This is a **Law**. It is enforced by the state (police) with a formal penalty (ticket)."
  },
  {
    text: "You promised your friend you'd help them move, but you slept in. Your friend is mad.",
    type: "Social Rule",
    explanation: "This is a **Social Rule**. The penalty is social (anger, loss of trust), not legal."
  },
  {
    text: "You sign a lease agreement to rent an apartment. The landlord sues you for not paying rent.",
    type: "Contract",
    explanation: "This is a **Contract**. While enforced by law, the obligation comes from a private agreement you voluntarily signed."
  },
  {
    text: "You feel guilty for not calling your grandmother on her birthday.",
    type: "Moral Rule",
    explanation: "This is a **Moral Rule**. The enforcement is internal (guilt)."
  },
  {
    text: "A company fires an employee for stealing trade secrets (violating the NDA).",
    type: "Contract",
    explanation: "The NDA is a **Contract**. The company enforces the terms of that agreement."
  },
  {
    text: "The GDPR requires companies to report data breaches within 72 hours.",
    type: "Law",
    explanation: "This is a **Law** (Regulation). It applies to everyone in that jurisdiction regardless of individual agreement."
  },
  {
    text: "A developer adheres to the team's style guide to avoid code review comments.",
    type: "Social Rule",
    explanation: "Team conventions are **Social Rules** (or internal policies). The penalty is professional friction, not jail."
  }
];

export const lawWhatIsLaw: ProblemGenerator = {
  type: 'law-what-is-law',
  displayName: 'Law vs. Rules',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];

    const options = shuffleWithSeed(["Law", "Social Rule", "Moral Rule", "Contract"], rng);
    const correctIndex = options.indexOf(scenario.type);

    return {
      question: `<strong>Scenario:</strong> ${scenario.text}<br/><br/>What kind of rule is this?`,
      options,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawWhatIsLaw] as const;
