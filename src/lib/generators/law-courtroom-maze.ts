import type { Problem, ProblemGenerator } from './types';
import { mulberry32 } from './prng';

interface Scenario {
    context: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const scenarios: Scenario[] = [
    {
        context: "Bob's company is based in France. A user in Germany wants to sue Bob for a data breach.",
        question: "Where can the user file the lawsuit against Bob?",
        options: [
            "Only in France",
            "Only in Germany",
            "France or Germany",
            "The European Court of Human Rights"
        ],
        correctIndex: 2,
        explanation: "Under Article 79, a user can sue in the Member State where the controller has an establishment OR where the user has their habitual residence."
    },
    {
        context: "A user complained to the Spanish DPA, but the DPA hasn't replied for 4 months.",
        question: "What is the user's judicial remedy?",
        options: [
            "None, they must wait",
            "Sue the Spanish DPA in Spanish courts",
            "Sue the Spanish DPA in the CJEU",
            "Call the police"
        ],
        correctIndex: 1,
        explanation: "Article 78 gives data subjects the right to a judicial remedy against a supervisory authority if it fails to handle a complaint or inform them within three months."
    },
    {
        context: "A judge in a Belgian court is unsure if Bob's 'Cat Genetic Data' counts as Health Data under the GDPR.",
        question: "What should the judge do to ensure a consistent EU-wide interpretation?",
        options: [
            "Flip a coin",
            "Ask the Belgian Prime Minister",
            "Request a Preliminary Ruling from the CJEU",
            "Dismiss the case"
        ],
        correctIndex: 2,
        explanation: "National courts can (and sometimes must) refer questions about the interpretation of EU law to the Court of Justice of the European Union (CJEU) for a preliminary ruling."
    },
    {
        context: "Bob's company is a public government agency in Estonia.",
        question: "A user in Latvia wants to sue this Estonian agency for a data breach. Where must they go?",
        options: [
            "Estonian courts",
            "Latvian courts",
            "Either Estonia or Latvia",
            "The United Nations"
        ],
        correctIndex: 0,
        explanation: "Article 79(2) states that for controllers which are public authorities of a Member State acting in the exercise of their public powers, the courts of that Member State are exclusively competent."
    }
];

export const lawCourtroomMaze: ProblemGenerator = {
    type: 'law-courtroom-maze',
    displayName: 'The Courtroom Maze',
    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const scenarioIndex = Math.floor(rng() * scenarios.length);
        const scenario = scenarios[scenarioIndex];

        return {
            question: `<strong>Context:</strong> ${scenario.context}<br/><br/>${scenario.question}`,
            options: scenario.options,
            correctIndex: scenario.correctIndex,
            explanation: scenario.explanation
        };
    }
};

export const generators = [lawCourtroomMaze] as const;
