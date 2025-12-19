import type { Problem, ProblemGenerator } from './types';
import { mulberry32 } from './prng';

interface PowerScenario {
    situation: string;
    power: string;
    explanation: string;
}

const scenarios: PowerScenario[] = [
    {
        situation: "Bob plans to launch a 'Mass Surveillance' feature for cats. The SA thinks this will likely violate the GDPR.",
        power: "Warning",
        explanation: "<strong>Warning:</strong> Issued under Article 58(2)(a) where intended processing operations are likely to infringe the GDPR."
    },
    {
        situation: "Bob forgot to include his company's address in the privacy policy once, but fixed it immediately.",
        power: "Reprimand",
        explanation: "<strong>Reprimand:</strong> Issued under Article 58(2)(b) where processing operations have infringed the GDPR (usually for minor/past violations)."
    },
    {
        situation: "Bob refuses to give a user a copy of their data. The SA tells him he HAS to do it within 48 hours.",
        power: "Order to comply",
        explanation: "<strong>Order to comply:</strong> Under Article 58(2)(c), the SA can order the controller or processor to comply with the data subject's requests."
    },
    {
        situation: "Bob's security is so bad that hackers are stealing data every hour. The SA tells Bob he must stop all processing until it is fixed.",
        power: "Temporary ban",
        explanation: "<strong>Ban:</strong> Under Article 58(2)(f), the SA can impose a temporary or definitive limitation including a ban on processing."
    },
    {
        situation: "Bob is sending data to a pirate server in International Waters that has no data laws. The SA tells him to stop the transfer.",
        power: "Suspension of data flows",
        explanation: "<strong>Suspension:</strong> Under Article 58(2)(j), the SA can order the suspension of data flows to a recipient in a third country or to an international organization."
    }
];

export const lawPowerPlay: ProblemGenerator = {
    type: 'law-power-play',
    displayName: 'The Power Play',
    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const scenario = scenarios[Math.floor(rng() * scenarios.length)];

        return {
            question: `<strong>Situation:</strong> ${scenario.situation}<br/><br/>Which corrective power is the Supervisory Authority most likely to exercise?`,
            options: [
                "Warning",
                "Reprimand",
                "Order to comply",
                "Temporary ban",
                "Suspension of data flows"
            ],
            correctIndex: ["Warning", "Reprimand", "Order to comply", "Temporary ban", "Suspension of data flows"].indexOf(scenario.power),
            explanation: scenario.explanation
        };
    }
};

export const generators = [lawPowerPlay] as const;
