import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const businessCase: ProblemGenerator = {
  type: 'law-ds-business-case',
  displayName: 'The Board Meeting',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const objections = [
      {
        text: "Investor: 'Why spend $50k on data security? We're a small startup, nobody cares about us.'",
        correct: "Automated bots attack everyone. A breach now would destroy our reputation before we even launch.",
        wrong: [
          "You're right, let's save the money for marketing.",
          "We can just hide the breach if it happens.",
          "It's required by the Geneva Convention."
        ],
        explanation: "Security through obscurity fails. **Reputation** is a startup's most valuable asset; losing trust early is fatal."
      },
      {
        text: "CFO: 'Compliance with GDPR is too expensive. Let's just block European users.'",
        correct: "Europe is a huge market. Compliance also builds trust with US customers who value privacy.",
        wrong: [
          "Good idea, Europeans don't pay for apps anyway.",
          "We can just ignore the law, they can't catch us.",
          "We should only follow laws that are cheap."
        ],
        explanation: "Compliance isn't just a cost; it's a **Trust Signal**. High privacy standards attract premium customers globally."
      },
      {
        text: "Dev Team: 'Encryption slows down the app. Users want speed, not safety.'",
        correct: "Users will leave instantly if their data leaks. We can optimize performance, but we can't 'optimize' a data breach.",
        wrong: [
          "True, turn off all encryption.",
          "Safety is only for banking apps.",
          "Let's vote on it."
        ],
        explanation: "**Risk Mitigation** is critical. A slightly slower secure app is viable; a fast, leaky app is a liability."
      }
    ];

    const objection = objections[Math.floor(rng() * objections.length)];
    const options = shuffleWithSeed([objection.correct, ...objection.wrong], rng);
    const correctIndex = options.indexOf(objection.correct);

    return {
      question: `<strong>Scenario:</strong> ${objection.text}<br/><br/>Choose the best counter-argument:`,
      options,
      correctIndex,
      explanation: objection.explanation
    };
  }
};

export const generators = [businessCase] as const;
