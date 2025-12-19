import type { Problem, ProblemGenerator } from './types';
import { mulberry32 } from './prng';

interface Scenario {
    residence: string;
    work: string;
    infringement: string;
    correctOptions: string[];
}

const scenarios: Scenario[] = [
    {
        residence: "Italy",
        work: "Italy",
        infringement: "Italy",
        correctOptions: ["Italy"]
    },
    {
        residence: "France",
        work: "Germany",
        infringement: "Spain",
        correctOptions: ["France", "Germany", "Spain"]
    },
    {
        residence: "Vietnam", // Non-EU resident
        work: "Poland",
        infringement: "Poland",
        correctOptions: ["Poland"]
    },
    {
        residence: "Belgium",
        work: "Netherlands",
        infringement: "Belgium",
        correctOptions: ["Belgium", "Netherlands"]
    },
    {
        residence: "Portugal",
        work: "Portugal",
        infringement: "Brazil", // Outside EU
        correctOptions: ["Portugal"]
    }
];

export const lawComplaintRouter: ProblemGenerator = {
    type: 'law-complaint-router',
    displayName: 'The Complaint Router',
    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const scenarioIndex = Math.floor(rng() * scenarios.length);
        const scenario = scenarios[scenarioIndex];

        const countries = ["France", "Germany", "Spain", "Italy", "Poland", "Belgium", "Netherlands", "Portugal", "Sweden", "Austria"];

        // Pick a wrong option
        let wrongOption = countries[Math.floor(rng() * countries.length)];
        while (scenario.correctOptions.includes(wrongOption)) {
            wrongOption = countries[Math.floor(rng() * countries.length)];
        }

        const correctOptionString = scenario.correctOptions.join(", ");

        return {
            question: `<strong>User Context:</strong><br/>
      - Lives in: ${scenario.residence}<br/>
      - Works in: ${scenario.work}<br/>
      - Violation happened in: ${scenario.infringement}<br/><br/>
      In which of these countries can the user file a GDPR complaint?`,
            options: [
                scenario.correctOptions[0],
                wrongOption,
                "Any EU country they want",
                "Only the country where the company is registered"
            ],
            correctIndex: 0,
            explanation: `According to Article 77, a complaint can be filed in the Member State of their <strong>habitual residence</strong>, <strong>place of work</strong>, or the <strong>place of the alleged infringement</strong>. In this case, that includes: ${correctOptionString}.`
        };
    }
};

export const generators = [lawComplaintRouter] as const;
