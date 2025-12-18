import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  status: 'Valid' | 'Invalid';
  reason: string;
}

const scenarios: Scenario[] = [
  // Invalid Scenarios
  {
    text: "A signup form has a pre-checked box that says 'Sign me up for the newsletter'.",
    status: 'Invalid',
    reason: "Consent must be **Unambiguous** and require an affirmative action. Pre-ticked boxes are banned (Planet49)."
  },
  {
    text: "To download a free PDF guide, you must agree to receive sales calls forever. (Forced Consent)",
    status: 'Invalid',
    reason: "Consent must be **Freely Given**. You cannot 'bundle' unnecessary consent with a service (Article 7(4))."
  },
  {
    text: "The privacy policy says 'By using this site, you consent to all data processing.'",
    status: 'Invalid',
    reason: "Consent must be **Unambiguous**. Silence, inactivity, or 'browse-wrap' agreements are not valid."
  },
  {
    text: "A user consents to 'Marketing', but later finds out their data was sold to a 3rd party broker.",
    status: 'Invalid',
    reason: "Consent must be **Informed**. If they didn't know you were selling it, the consent is void."
  },
  {
    text: "An employer asks a low-level employee to consent to video surveillance in the break room.",
    status: 'Invalid',
    reason: "Consent is likely invalid due to the **Power Imbalance**. Employees may feel they can't say no."
  },
  {
    text: "You can unsubscribe, but you have to send a physical letter to an office in Panama.",
    status: 'Invalid',
    reason: "Consent must be **Easy to Withdraw**. It must be as easy to withdraw as it was to give."
  },
  {
    text: "A single 'I Agree' button covers Terms of Service, Privacy Policy, and Marketing emails.",
    status: 'Invalid',
    reason: "Consent must be **Specific** (Granular). You cannot lump different purposes together."
  },
  {
    text: "A child of 12 years old consents to data processing for an online game.",
    status: 'Invalid',
    reason: "Children under 13-16 (depending on country) cannot give valid consent online without parental authorization."
  },

  // Valid Scenarios
  {
    text: "A user clicks an empty checkbox that says 'I agree to receive marketing emails'.",
    status: 'Valid',
    reason: "This is **Valid**. It is Affirmative (clicked), Specific, and Freely Given."
  },
  {
    text: "A cookie banner has two equal buttons: 'Accept All' and 'Reject All'.",
    status: 'Valid',
    reason: "This is **Valid**. The choice is genuine and not nudged (no Dark Patterns)."
  },
  {
    text: "A user fills out a form specifically to enter a contest, and the form clearly says data is used for the contest.",
    status: 'Valid',
    reason: "This is **Valid** (or possibly Contract), as the purpose is clear and the user took action."
  },
  {
    text: "A user withdraws consent via a simple 'Unsubscribe' link in an email.",
    status: 'Valid',
    reason: "This demonstrates the **Right to Withdraw**, which validates the original consent mechanism's compliance."
  }
];

export const lawValidConsent: ProblemGenerator = {
  type: 'law-valid-consent',
  displayName: 'Valid Consent Checker',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const scenario = scenarios[Math.floor(rng() * scenarios.length)];
    
    const correctOption = scenario.status === 'Valid' 
      ? "Yes, Valid Consent"
      : "No, Invalid Consent";

    const wrongOption = scenario.status === 'Valid'
      ? "No, Invalid Consent"
      : "Yes, Valid Consent";

    // We add some specific reasons as distractors/clarifiers if we want, 
    // but for "Valid/Invalid" binary, keeping it simple is often harder because you have to be sure.
    // Let's add flavor to the options.
    
    let options = [];
    if (scenario.status === 'Valid') {
        options = [
            "Yes, Valid Consent",
            "No, Invalid (Pre-ticked)",
            "No, Invalid (Not Specific)",
            "No, Invalid (Power Imbalance)"
        ];
    } else {
        // Find the specific reason category
        let reasonShort = "General Error";
        if (scenario.reason.includes("Pre-ticked")) reasonShort = "Invalid (Pre-ticked box)";
        else if (scenario.reason.includes("Freely")) reasonShort = "Invalid (Not Freely Given)";
        else if (scenario.reason.includes("Unambiguous")) reasonShort = "Invalid (Not Unambiguous)";
        else if (scenario.reason.includes("Specific")) reasonShort = "Invalid (Not Granular)";
        else if (scenario.reason.includes("Power")) reasonShort = "Invalid (Power Imbalance)";
        else if (scenario.reason.includes("Withdraw")) reasonShort = "Invalid (Hard to Withdraw)";
        else if (scenario.reason.includes("Children")) reasonShort = "Invalid (Child cannot consent)";
        else if (scenario.reason.includes("Informed")) reasonShort = "Invalid (Not Informed)";

        options = [
            `No, ${reasonShort}`,
            "Yes, Valid Consent",
            "No, Invalid (But acceptable for business)",
            "Yes, Implied Consent is enough"
        ];
    }

    const shuffledOptions = shuffleWithSeed(options, rng);
    const correctIndex = shuffledOptions.indexOf(scenario.status === 'Valid' ? "Yes, Valid Consent" : options[0]);

    return {
      question: `<strong>Scenario:</strong> ${scenario.text}<br/><br/>Is this consent valid under GDPR?`,
      options: shuffledOptions,
      correctIndex,
      explanation: scenario.reason
    };
  }
};

export const generators = [lawValidConsent] as const;
