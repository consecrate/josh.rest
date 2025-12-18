import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  basis: 'Consent' | 'Contract' | 'Legal Obligation' | 'Vital Interests' | 'Public Task' | 'Legitimate Interests';
  explanation: string;
}

const scenarios: Scenario[] = [
  // Contract
  {
    text: "An e-commerce site processes your address to ship a product you just bought.",
    basis: 'Contract',
    explanation: "Necessary to fulfill the **Contract** of sale."
  },
  {
    text: "A freelancer processes a client's bank details to send an invoice for completed work.",
    basis: 'Contract',
    explanation: "Necessary for the performance of the **Contract** (getting paid)."
  },
  {
    text: "An app asks for your email during sign-up to send you a password reset link if you forget it.",
    basis: 'Contract',
    explanation: "This is part of the core service **Contract** (account management)."
  },

  // Legal Obligation
  {
    text: "A company sends employee salary data to the IRS/Tax Authority.",
    basis: 'Legal Obligation',
    explanation: "Required by **Legal Obligation** (Tax Law)."
  },
  {
    text: "A bank performs Anti-Money Laundering (AML) checks on a new customer.",
    basis: 'Legal Obligation',
    explanation: "Banking laws explicitly require AML checks, so it is a **Legal Obligation**."
  },
  {
    text: "A court orders a company to hand over user data for a criminal investigation.",
    basis: 'Legal Obligation',
    explanation: "Compliance with a court order is a **Legal Obligation**."
  },

  // Vital Interests
  {
    text: "Paramedics access an unconscious accident victim's phone to find their medical ID.",
    basis: 'Vital Interests',
    explanation: "The person cannot consent, and it is a matter of life and death (**Vital Interests**)."
  },
  {
    text: "A hospital shares data with the CDC during a rapidly spreading deadly plague to track infection vectors.",
    basis: 'Vital Interests',
    explanation: "In emergencies where lives are at risk, **Vital Interests** applies (though Public Task often covers the government side)."
  },

  // Public Task
  {
    text: "The police process mugshots of arrested suspects.",
    basis: 'Public Task',
    explanation: "Law enforcement acts under official authority (**Public Task** / Article 10)."
  },
  {
    text: "A public school records student attendance.",
    basis: 'Public Task',
    explanation: "Schools perform a function in the public interest laid down by law."
  },
  {
    text: "The tax office collects income data from citizens.",
    basis: 'Public Task',
    explanation: "Tax collection is an official authority function."
  },

  // Legitimate Interests (The Tricky One)
  {
    text: "A bank runs fraud detection algorithms on credit card transactions.",
    basis: 'Legitimate Interests',
    explanation: "Preventing fraud is a **Legitimate Interest** that benefits everyone and doesn't override user rights."
  },
  {
    text: "A company implements network firewalls that log IP addresses to stop hackers.",
    basis: 'Legitimate Interests',
    explanation: "Network security is a recognized **Legitimate Interest** (Recital 49)."
  },
  {
    text: "A clothing store sends 'Recommended for you' emails to existing customers based on past purchases (Soft Opt-in).",
    basis: 'Legitimate Interests',
    explanation: "Direct marketing to existing customers can be a **Legitimate Interest**, provided they can opt-out."
  },
  {
    text: "A manager tracks the location of company delivery trucks to optimize routes.",
    basis: 'Legitimate Interests',
    explanation: "Business efficiency is a **Legitimate Interest**, as long as drivers are informed and it's not excessive."
  },

  // Consent
  {
    text: "A blog asks: 'Subscribe to our newsletter?' with an unchecked box.",
    basis: 'Consent',
    explanation: "Marketing to non-customers usually requires **Consent**."
  },
  {
    text: "A mobile flashlight app asks for your GPS location.",
    basis: 'Consent',
    explanation: "The app works without GPS. The data is not necessary for the contract, so they need **Consent**."
  },
  {
    text: "A website wants to share your email with 'Selected Partners' (3rd parties).",
    basis: 'Consent',
    explanation: "Sharing data with third parties for their marketing always requires specific **Consent**."
  },
  {
    text: "You allow a website to place tracking cookies to show you retargeted ads.",
    basis: 'Consent',
    explanation: "Tracking/Advertising cookies require **Consent** (ePrivacy Directive)."
  }
];

export const lawLawfulBasisMatcher: ProblemGenerator = {
  type: 'law-lawful-basis-matcher',
  displayName: 'Legal Basis Matcher',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const scenario = scenarios[Math.floor(rng() * scenarios.length)];
    
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
