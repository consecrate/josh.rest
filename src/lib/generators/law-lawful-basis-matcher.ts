import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  basis: 'Consent' | 'Contract' | 'Legal Obligation' | 'Vital Interests' | 'Public Task' | 'Legitimate Interests';
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    text: "An online store processes your address to deliver a package you bought.",
    basis: 'Contract',
    explanation: "This is **Contract**. The processing is necessary to fulfill the contract (buying the item)."
  },
  {
    text: "An employer reports employee salaries to the tax authority.",
    basis: 'Legal Obligation',
    explanation: "This is **Legal Obligation**. The employer is required by law (tax laws) to process this data."
  },
  {
    text: "A hospital accesses a patient's medical history while they are unconscious in the ER to save their life.",
    basis: 'Vital Interests',
    explanation: "This is **Vital Interests**. It is a matter of life and death, and the data subject cannot give consent."
  },
  {
    text: "A website asks: 'Can we use your email to send you our weekly newsletter?' and you click 'Yes'.",
    basis: 'Consent',
    explanation: "This is **Consent**. The user has given clear, affirmative permission for a specific purpose."
  },
  {
    text: "A bank runs a fraud detection algorithm on all credit card transactions to protect its customers.",
    basis: 'Legitimate Interests',
    explanation: "This is **Legitimate Interests**. The bank has a valid interest (preventing fraud) that benefits both them and the customer, and it's necessary."
  },
  {
    text: "A local council collects garbage collection data to manage waste services.",
    basis: 'Public Task',
    explanation: "This is **Public Task**. The processing is done by a public authority in the exercise of official authority."
  },
  {
    text: "A streaming service processes your credit card to charge your monthly subscription.",
    basis: 'Contract',
    explanation: "This is **Contract**. Payment processing is necessary to perform the service agreement."
  },
  {
    text: "A company retains invoices for 7 years because the tax law says so.",
    basis: 'Legal Obligation',
    explanation: "This is **Legal Obligation**. They are complying with a statutory retention period."
  },
  {
    text: "A mobile game asks for access to your camera to overlay AR monsters.",
    basis: 'Consent',
    explanation: "This is **Consent**. The access isn't strictly necessary for the game to *run* (it could work without AR), so they ask for permission."
  },
  {
    text: "A network security system logs IP addresses to detect DDoS attacks.",
    basis: 'Legitimate Interests',
    explanation: "This is **Legitimate Interests**. Network security is a widely recognized legitimate interest (Recital 49)."
  }
];

export const lawLawfulBasisMatcher: ProblemGenerator = {
  type: 'law-lawful-basis-matcher',
  displayName: 'Legal Basis Matcher',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];
    
    const allOptions = [
      "Consent",
      "Contract",
      "Legal Obligation",
      "Vital Interests",
      "Public Task",
      "Legitimate Interests"
    ];

    const shuffledOptions = shuffleWithSeed(allOptions, rng);
    const correctIndex = shuffledOptions.indexOf(scenario.basis);

    return {
      question: `<strong>Scenario:</strong> ${scenario.text}<br/><br/>Which Lawful Basis applies best here?`,
      options: shuffledOptions,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawLawfulBasisMatcher] as const;
