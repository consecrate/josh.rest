import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

interface Scenario {
  purpose: string;
  fields: string[];
  unnecessary: string;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    purpose: "Subscribing to an email newsletter",
    fields: ["Email Address", "First Name", "Passport Number"],
    unnecessary: "Passport Number",
    explanation: "You do not need a government ID to send an email."
  },
  {
    purpose: "Ordering a pizza for delivery",
    fields: ["Delivery Address", "Phone Number", "Marital Status"],
    unnecessary: "Marital Status",
    explanation: "The pizza arrives the same way regardless of whether you are married or single."
  },
  {
    purpose: "Job Application for a Software Engineer",
    fields: ["Resume", "GitHub Profile", "Political Affiliation"],
    unnecessary: "Political Affiliation",
    explanation: "Political opinions are Special Category Data and irrelevant to coding ability."
  },
  {
    purpose: "Signing up for a free Wi-Fi hotspot",
    fields: ["Email (for login)", "Device MAC Address", "Home Address"],
    unnecessary: "Home Address",
    explanation: "Free Wi-Fi in a cafe does not require knowing where you live."
  },
  {
    purpose: "Calculating BMI (Body Mass Index) App",
    fields: ["Height", "Weight", "Full Name"],
    unnecessary: "Full Name",
    explanation: "A calculator app doesn't need to know *who* you are, just your measurements."
  },
  {
    purpose: "E-commerce Guest Checkout",
    fields: ["Credit Card Number", "Shipping Address", "Date of Birth"],
    unnecessary: "Date of Birth",
    explanation: "Unless you are buying age-restricted goods (alcohol), age is irrelevant for shopping."
  }
];

export const lawDataMinimization: ProblemGenerator = {
  type: 'law-data-minimization',
  displayName: 'Data Dietician',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    
    const scenarioIndex = Math.floor(rng() * scenarios.length);
    const scenario = scenarios[scenarioIndex];
    
    // Options are the fields
    const options = shuffleWithSeed([...scenario.fields], rng);
    const correctIndex = options.indexOf(scenario.unnecessary);

    return {
      question: `<strong>Purpose:</strong> ${scenario.purpose}<br/><br/>Which of these data fields is excessive (unnecessary) for this purpose?`,
      options: options,
      correctIndex,
      explanation: `<strong>${scenario.unnecessary}</strong> is not necessary. ${scenario.explanation}`
    };
  }
};

export const generators = [lawDataMinimization] as const;
