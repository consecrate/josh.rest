import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  text: string;
  verdict: 'Compliant' | 'Fairness Violation' | 'Transparency Violation' | 'Lawfulness Violation';
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    text: "A flashlight app requests access to your contacts list to 'optimize lighting', but actually uploads it to an ad network.",
    verdict: 'Transparency Violation',
    explanation: "This is a classic **Transparency** (and Fairness) violation. The stated purpose ('optimize lighting') is a lie. The user is being deceived about how their data is used."
  },
  {
    text: "A bank uses your transaction history to determine your credit score for a loan you applied for.",
    verdict: 'Compliant',
    explanation: "This is **Compliant**. It is Lawful (Contract/Legitimate Interest), Fair (expected for a loan), and Transparent (stated in the privacy policy)."
  },
  {
    text: "A grocery store tracks your purchases to offer you personalized coupons, as explained in their loyalty card terms.",
    verdict: 'Compliant',
    explanation: "This is **Compliant**. The data processing is compatible with the loyalty program, and the user was informed."
  },
  {
    text: "An employer installs hidden cameras in the break room to 'monitor productivity' without telling employees.",
    verdict: 'Transparency Violation',
    explanation: "Hidden surveillance is a severe **Transparency** violation. Employees have a right to know they are being monitored."
  },
  {
    text: "A dating app publishes all user profiles to a public search engine index without asking users, to 'increase visibility'.",
    verdict: 'Fairness Violation',
    explanation: "This is a **Fairness** violation. While they might argue 'Legitimate Interest', it is not within the *reasonable expectations* of users of a private dating app to be indexed publicly. It exposes them to harm."
  },
  {
    text: "A company scrapes email addresses from public websites to send cold-call marketing emails.",
    verdict: 'Lawfulness Violation',
    explanation: "This is likely a **Lawfulness** violation (lacking Consent or Legitimate Interest balancing test) and certainly a Fairness violation. Just because data is 'public' doesn't mean you can use it for anything."
  },
  {
    text: "A smart TV records your conversations to improve its voice recognition, but this is buried in paragraph 450 of the Terms of Service.",
    verdict: 'Transparency Violation',
    explanation: "Buried details fail the **Transparency** requirement. Information must be 'concise, transparent, intelligible and easily accessible'."
  },
  {
    text: "An online retailer charges Mac users 10% more than PC users for the same hotel booking based on device data.",
    verdict: 'Fairness Violation',
    explanation: "Price discrimination based on device type is often cited as a **Fairness** violation. It uses data to the detriment of the data subject in an unexpected way."
  },
  {
    text: "A fitness app shares your workout data with health insurers who then raise your premiums based on 'inactivity patterns'.",
    verdict: 'Fairness Violation',
    explanation: "This is a **Fairness** violation. Users do not reasonably expect fitness app data to be used against them for insurance purposes."
  },
  {
    text: "A newspaper website requires users to accept tracking cookies OR pay a subscription fee to access articles.",
    verdict: 'Compliant',
    explanation: "This 'cookie wall with alternative' model is **generally considered Compliant** by some DPAs (though contested). Users have a genuine choice, even if one option costs money."
  }
];

export const lawFairnessMeter: ProblemGenerator = {
  type: 'law-fairness-meter',
  displayName: 'The Fairness Meter',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    // Pick a random scenario
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];
    
    // Options
    const allOptions = [
      "Compliant",
      "Fairness Violation",
      "Transparency Violation",
      "Lawfulness Violation"
    ];

    // Shuffle options
    const shuffledOptions = shuffleWithSeed(allOptions, rng);
    
    // Find correct index
    const correctIndex = shuffledOptions.indexOf(scenario.verdict);

    return {
      question: `<strong>Scenario:</strong> ${scenario.text}<br/><br/>How would you evaluate this processing activity?`,
      options: shuffledOptions,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawFairnessMeter] as const;
