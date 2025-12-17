import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  original: string;
  newPurpose: string;
  verdict: 'Compatible' | 'Incompatible';
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    original: "Collected shipping address to deliver a package.",
    newPurpose: "Using the address to analyze shipping times and logistics efficiency.",
    verdict: 'Compatible',
    explanation: "Statistical analysis for internal efficiency is generally considered **Compatible** (and often Legitimate Interest)."
  },
  {
    original: "Collected email for a monthly newsletter.",
    newPurpose: "Selling the email list to a third-party ad network.",
    verdict: 'Incompatible',
    explanation: "Selling data to third parties is **Incompatible** with the original purpose of a newsletter. It requires new, specific consent."
  },
  {
    original: "Collected employee health data for sick leave administration.",
    newPurpose: "Using the data to evaluate employees for promotion.",
    verdict: 'Incompatible',
    explanation: "Health data is sensitive. Using it for performance reviews is **Incompatible**, unfair, and likely illegal."
  },
  {
    original: "Collected customer purchase history for warranty records.",
    newPurpose: "Using the history to recommend similar products on the user's homepage.",
    verdict: 'Compatible',
    explanation: "Product recommendations (within the same platform) based on history are often **Compatible** (reasonable expectation/soft opt-in)."
  },
  {
    original: "Collected CCTV footage for building security.",
    newPurpose: "Using the footage to monitor how often employees take coffee breaks.",
    verdict: 'Incompatible',
    explanation: "Using security footage for performance monitoring is **Incompatible** (Function Creep) and a violation of transparency/fairness."
  },
  {
    original: "Collected patient data for medical treatment.",
    newPurpose: "Anonymizing the data for medical research.",
    verdict: 'Compatible',
    explanation: "Processing for scientific research purposes is explicitly deemed **Compatible** by Article 5(1)(b), provided safeguards (like anonymization) are in place."
  },
  {
    original: "Collected phone number for Two-Factor Authentication (security).",
    newPurpose: "Using the phone number for marketing calls.",
    verdict: 'Incompatible',
    explanation: "This was a real case (Twitter/Facebook). Using security data for marketing is **Incompatible** and deceptive."
  }
];

export const lawPurposeCompatibility: ProblemGenerator = {
  type: 'law-purpose-compatibility',
  displayName: 'Purpose Pivot Check',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];
    
    const correctOption = scenario.verdict === 'Compatible' 
      ? "Yes, Compatible (Go ahead)" 
      : "No, Incompatible (Stop or get new consent)";
      
    const distractor = scenario.verdict === 'Compatible'
      ? "No, Incompatible (Stop or get new consent)"
      : "Yes, Compatible (Go ahead)";
      
    const options = shuffleWithSeed([correctOption, distractor], rng);
    const correctIndex = options.indexOf(correctOption);

    return {
      question: `<strong>Original Purpose:</strong> ${scenario.original}<br/><strong>New Purpose:</strong> ${scenario.newPurpose}<br/><br/>Is the new purpose compatible with the original one?`,
      options: options,
      correctIndex,
      explanation: scenario.explanation
    };
  }
};

export const generators = [lawPurposeCompatibility] as const;
