import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const historyTimeline: ProblemGenerator = {
  type: 'law-history-timeline',
  displayName: 'Legal Timeline',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    const questions = [
      {
        q: "Which document was the first legally binding international treaty for data protection (1981)?",
        correct: "Convention 108 (Council of Europe)",
        wrong: ["GDPR", "Universal Declaration of Human Rights", "The Magna Carta"],
        explanation: "**Convention 108** (1981) was the first binding international instrument. The UDHR (1948) was a declaration, not a treaty."
      },
      {
        q: "The 'Right to Privacy' is explicitly protected in Article 8 of which major human rights convention?",
        correct: "European Convention on Human Rights (ECHR)",
        wrong: ["US Constitution", "Geneva Convention", "Treaty of Rome"],
        explanation: "The **ECHR Article 8** protects the 'Right to respect for private and family life'. This is the bedrock of European privacy law."
      },
      {
        q: "In 1995, the EU passed a framework that required member states to create their own privacy laws. What was it called?",
        correct: "Data Protection Directive (95/46/EC)",
        wrong: ["The GDPR", "The Privacy Act", "The Digital Services Act"],
        explanation: "It was the **Data Protection Directive**. Being a directive, it had to be implemented into national law by each country, leading to fragmentation."
      },
      {
        q: "Which event represents the 'Modern Era' of unified data protection across Europe (enforced 2018)?",
        correct: "The GDPR (General Data Protection Regulation)",
        wrong: ["The Internet Bill of Rights", "The Cyber Resilience Act", "The AI Act"],
        explanation: "The **GDPR** replaced the 1995 Directive to unify data protection laws across all EU member states."
      },
      {
        q: "Which country enacted the world's first national data protection law in 1970?",
        correct: "Germany (State of Hesse)",
        wrong: ["United States", "United Kingdom", "Sweden"],
        explanation: "The German state of **Hesse** passed the first data protection law in 1970, pioneering the concept before any nation had done so."
      },
      {
        q: "The 'Schrems I' ruling (2015) invalidated which EU-US data transfer mechanism?",
        correct: "Safe Harbor",
        wrong: ["Privacy Shield", "Standard Contractual Clauses", "Binding Corporate Rules"],
        explanation: "Max Schrems' case at the CJEU struck down **Safe Harbor** due to US mass surveillance concerns. It was replaced by Privacy Shield, which was later also invalidated (Schrems II, 2020)."
      },
      {
        q: "Article 12 of the Universal Declaration of Human Rights (1948) protects against what?",
        correct: "Arbitrary interference with privacy, family, home, or correspondence.",
        wrong: ["The right to free healthcare.", "The right to internet access.", "The right to form corporations."],
        explanation: "Article 12 UDHR established the **Right to Privacy** as a fundamental human right long before digital data existed."
      },
      {
        q: "What key limitation did the 1995 Data Protection Directive have that GDPR addressed?",
        correct: "It required national implementation, leading to 28 different versions across EU countries.",
        wrong: ["It only applied to paper records.", "It had no fines.", "It didn't cover the internet."],
        explanation: "As a **Directive**, it was implemented differently by each Member State, creating a fragmented patchwork that made cross-border business difficult."
      }
    ];

    const item = questions[Math.floor(rng() * questions.length)];
    const options = shuffleWithSeed([item.correct, ...item.wrong], rng);
    const correctIndex = options.indexOf(item.correct);

    return {
      question: item.q,
      options,
      correctIndex,
      explanation: item.explanation
    };
  }
};

export const generators = [historyTimeline] as const;
