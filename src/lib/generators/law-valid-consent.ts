import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  status: 'Valid' | 'Invalid';
  reason: string;
}

const scenarios: Scenario[] = [
  {
    text: "A signup form has a pre-checked box that says 'Sign me up for the newsletter'.",
    status: 'Invalid',
    reason: "Consent must be **Unambiguous** and require an affirmative action. Pre-ticked boxes are explicitly banned (Planet49 ruling)."
  },
  {
    text: "To download a whitepaper, you must agree to receive sales calls forever. No agreement = No download.",
    status: 'Invalid',
    reason: "Consent must be **Freely Given**. This is a 'Cookie Wall' or 'Bundling' issue. You cannot condition a service on consent for unnecessary data."
  },
  {
    text: "A user clicks an empty checkbox that says 'I agree to receive marketing emails' while signing up.",
    status: 'Valid',
    reason: "This is **Valid**. It is an affirmative action (clicking), specific, and (presumably) informed."
  },
  {
    text: "The privacy policy says 'By using this site, you consent to all data processing described herein.'",
    status: 'Invalid',
    reason: "Consent must be **Unambiguous**. Mere use of a site (silence/inactivity) is not valid consent."
  },
  {
    text: "A popup asks: 'Do you want cookies? [Yes] [No]', with equal weight to both buttons.",
    status: 'Valid',
    reason: "This is **Valid**. It offers a genuine choice without nudging (Dark Patterns)."
  },
  {
    text: "A consent form groups 'Marketing', 'Analytics', and 'Third-Party Sharing' into one single 'I Agree' button.",
    status: 'Invalid',
    reason: "Consent must be **Specific** (Granular). Users should be able to consent to Analytics without consenting to Marketing."
  },
  {
    text: "You can unsubscribe from the newsletter, but you have to call a phone number between 9am-5pm to do it.",
    status: 'Invalid',
    reason: "Consent must be **Easy to Withdraw**. It must be as easy to withdraw as it was to give (e.g., one click)."
  },
  {
    text: "An employer asks an employee to consent to background monitoring.",
    status: 'Invalid',
    reason: "Consent is likely **Invalid** due to the power imbalance. It is not 'Freely Given' if the employee fears saying no."
  }
];

export const lawValidConsent: ProblemGenerator = {
  type: 'law-valid-consent',
  displayName: 'Valid Consent Checker',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];
    
    // We want the user to identify IF it's valid, and maybe WHY if it's invalid
    // For simplicity, let's just ask "Valid or Invalid?" but maybe with specific invalid reasons as options
    
    let options = [];
    if (scenario.status === 'Valid') {
      options = ["Valid Consent", "Invalid: Pre-ticked box", "Invalid: Not specific", "Invalid: Hard to withdraw"];
    } else {
      options = ["Valid Consent", `Invalid: ${scenario.reason.split('**')[1] || 'Reason'}`];
      // Add fillers
      if (!options[1].includes("Pre-ticked")) options.push("Invalid: Pre-ticked box");
      if (!options[1].includes("Freely Given")) options.push("Invalid: Not Freely Given");
      if (!options[1].includes("Specific")) options.push("Invalid: Not Specific");
    }
    
    // Ensure we have 4 unique options
    options = [...new Set(options)].slice(0, 4);
    if (options.length < 4) options.push("Invalid: Ambiguous");
    
    const shuffledOptions = shuffleWithSeed(options, rng);
    
    // Determine correct answer
    // If valid, look for "Valid Consent"
    // If invalid, look for the option that matches the reason key
    let correctIndex = -1;
    if (scenario.status === 'Valid') {
        correctIndex = shuffledOptions.indexOf("Valid Consent");
    } else {
        // Find the option that contains the key phrase from the reason
        // This is a bit tricky dynamically. Let's simplify.
        // Let's just make the options "Valid" vs "Invalid" for this generator?
        // No, let's try to be specific.
    }
    
    // SIMPLIFIED APPROACH:
    // Question: Is this consent valid?
    // Options: "Yes, it's valid", "No, it violates [Condition]", ...
    
    const correctOption = scenario.status === 'Valid' 
      ? "Yes, this is Valid Consent."
      : `No, it is Invalid (${scenario.reason.split('**')[1] || 'General'}).`;

    const distractors = scenario.status === 'Valid'
      ? [
          "No, it is Invalid (Pre-ticked box).",
          "No, it is Invalid (Not specific).",
          "No, it is Invalid (Bundled)."
        ]
      : [
          "Yes, this is Valid Consent.",
          "No, but it's acceptable for marketing.",
          "Yes, implied consent is enough."
        ];
        
    const finalOptions = shuffleWithSeed([correctOption, ...distractors], rng);
    correctIndex = finalOptions.indexOf(correctOption);

    return {
      question: `<strong>Scenario:</strong> ${scenario.text}<br/><br/>Is this consent valid under GDPR?`,
      options: finalOptions,
      correctIndex,
      explanation: scenario.reason
    };
  }
};

export const generators = [lawValidConsent] as const;
