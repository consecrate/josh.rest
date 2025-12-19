import type { Problem, ProblemGenerator } from './types';
import { mulberry32 } from './prng';

interface FineScenario {
    breach: string;
    category: 'Tier 1' | 'Tier 2';
    explanation: string;
}

const scenarios: FineScenario[] = [
    {
        breach: "Failing to implement 'Privacy by Design' in a new app feature.",
        category: 'Tier 1',
        explanation: "<strong>Tier 1:</strong> Obligations of the controller and processor (Articles 25-43) fall under the lower tier limits (€10M / 2%)."
    },
    {
        breach: "Processing sensitive health data without a valid legal basis.",
        category: 'Tier 2',
        explanation: "<strong>Tier 2:</strong> Breaches of basic principles for processing (Articles 5, 6, 7, 9) fall under the higher tier limits (€20M / 4%)."
    },
    {
        breach: "Blocking a user from exercising their Right of Access (SAR).",
        category: 'Tier 2',
        explanation: "<strong>Tier 2:</strong> Violating data subject rights (Articles 12-22) falls under the higher tier limits (€20M / 4%)."
    },
    {
        breach: "Failing to notify the Supervisory Authority of a data breach within 72 hours.",
        category: 'Tier 1',
        explanation: "<strong>Tier 1:</strong> Data breach notification requirements (Articles 33-34) are administrative obligations in the lower tier."
    },
    {
        breach: "Transferring personal data to a country without an Adequacy Decision or safeguards.",
        category: 'Tier 2',
        explanation: "<strong>Tier 2:</strong> Transfers of personal data to recipients in third countries (Articles 44-49) fall under the higher tier limits."
    }
];

export const lawFineTuner: ProblemGenerator = {
    type: 'law-fine-tuner',
    displayName: 'The Fine Tuner',
    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const scenario = scenarios[Math.floor(rng() * scenarios.length)];

        return {
            question: `<strong>Breach:</strong> ${scenario.breach}<br/><br/>According to Article 83, which maximum fine limit applies to this infringement?`,
            options: [
                "Tier 1: up to €10,000,000 or 2% of annual turnover",
                "Tier 2: up to €20,000,000 or 4% of annual turnover",
                "Tier 3: up to €50,000,000 or 10% of annual turnover",
                "Fixed fine of €1,000,000"
            ],
            correctIndex: scenario.category === 'Tier 1' ? 0 : 1,
            explanation: scenario.explanation
        };
    }
};

export const generators = [lawFineTuner] as const;
