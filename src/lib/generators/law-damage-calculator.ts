import type { Problem, ProblemGenerator } from './types';
import { mulberry32 } from './prng';

interface DamageScenario {
    title: string;
    description: string;
    material: boolean;
    nonMaterial: boolean;
    explanation: string;
}

const scenarios: DamageScenario[] = [
    {
        title: "The Identity Theft",
        description: "Credit card numbers were leaked. A user lost $5,000 from their bank account.",
        material: true,
        nonMaterial: true,
        explanation: "This includes <strong>Material Damage</strong> ($5,000 loss) and <strong>Non-Material Damage</strong> (the stress and anxiety of the theft)."
    },
    {
        title: "The Private Photo Leak",
        description: "Private photos of a teacher were leaked on a public forum. They didn't lose money, but they were mocked by students and felt humiliated.",
        material: false,
        nonMaterial: true,
        explanation: "This is purely <strong>Non-Material Damage</strong>. Loss of reputation, humiliation, and distress are all compensable under Article 82."
    },
    {
        title: "The Incorrect Debt Entry",
        description: "Bob accidentally listed a user as having 'Unpaid Debts'. The user's mortgage application was rejected by a bank.",
        material: true,
        nonMaterial: true,
        explanation: "The rejection of the mortgage (and potential extra costs) is <strong>Material Damage</strong>. The frustration and impact on life plans is <strong>Non-Material Damage</strong>."
    },
    {
        title: "The Political Profiling",
        description: "A user's political leanings were inferred and shared with advertisers without consent. The user feels their privacy has been 'violated'.",
        material: false,
        nonMaterial: true,
        explanation: "This is <strong>Non-Material Damage</strong>. The GDPR considers 'loss of control over personal data' as a significant harm in itself."
    }
];

export const lawDamageCalculator: ProblemGenerator = {
    type: 'law-damage-calculator',
    displayName: 'The Damage Calculator',
    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const scenario = scenarios[Math.floor(rng() * scenarios.length)];

        return {
            question: `<strong>Scenario: ${scenario.title}</strong><br/>${scenario.description}<br/><br/>Which types of damage can the user claim compensation for under Article 82?`,
            options: [
                "Material Damage only",
                "Non-Material Damage only",
                "Both Material and Non-Material Damage",
                "Neither (only fines are allowed)"
            ],
            correctIndex: 2,
            explanation: scenario.explanation
        };
    }
};

export const generators = [lawDamageCalculator] as const;
