# 🌲 Forest Factory — Mock Test Generator

> Generate infinite practice tests from collections of problem generators.

---

## Concept

A **Pack** is simply a collection of generators. Load a pack, get a practice test.

```typescript
interface Pack {
  id: string;
  name: string;
  description: string;
  generators: string[];  // Generator type IDs
}
```

That's it.

---

## Example Packs

```typescript
const compArchPack: Pack = {
  id: 'comp-arch-midterm',
  name: 'Computer Architecture Midterm',
  description: 'Binary arithmetic, division, floating point',
  generators: [
    'binary-multiplication-no-carry',
    'binary-multiplication-carry',
    'binary-multiplication-table',
    'binary-division',
    'binary-division-table',
    'floating-point'
  ]
};

const gdprPack: Pack = {
  id: 'gdpr-essentials',
  name: 'GDPR Essentials',
  description: 'Personal data, consent, principles, rights',
  generators: [
    'law-personal-data-classifier',
    'law-special-category-detector',
    'law-anon-vs-pseudo',
    'law-valid-consent',
    'law-lawful-basis-matcher',
    'law-data-minimization',
    'law-purpose-compatibility',
    'law-retention-policy',
    'law-security-triad',
    'law-accountability-check'
  ]
};

const numberTheoryPack: Pack = {
  id: 'number-theory-all',
  name: 'Number Theory & Cryptography',
  description: 'Primes, modular arithmetic, CRT, RSA, and historical ciphers',
  generators: [
    'number-theory-prime-check',
    'number-theory-sophie-germain',
    'number-theory-pairwise-coprime',
    'number-theory-special-primes',
    'number-theory-phi',
    'number-theory-crt',
    'crypto-caesar',
    'crypto-rsa-small',
    'crypto-theory-pool',
    'apps-isbn-check',
    'apps-applied-mod-pool'
  ]
};
```

---

## How Generators Work

All generators implement the same interface:

```typescript
interface ProblemGenerator {
  readonly type: string;
  readonly displayName: string;
  generate(seed: number): Problem;
}
```

**The Pack doesn't care how a generator produces questions.** It just calls `generate(seed)`.

### Generator Patterns

| Pattern | Example | Internal Behavior |
|---------|---------|-------------------|
| **Algorithmic** | `binary-multiplication` | Computes answer from random inputs |
| **Pool-based** | `law-valid-consent` | Picks from curated scenario array |
| **Question bank** | `algebra-relations-bank` | Picks from hand-crafted questions |

All three patterns expose the same `generate(seed): Problem` interface.

---

## Solving "Ungeneratable" Questions

Some questions can't be algorithmically generated (proofs, conceptual reasoning). 

**Solution:** Make a generator that picks from a curated pool.

### Example: Algebra Relations Worksheet

The worksheet at `src/content/courses/algebra/02-relations-worksheet.mdx` has 28 hand-crafted questions. Convert them to a generator:

```typescript
// src/lib/generators/algebra-relations-bank.ts
import type { Problem, ProblemGenerator } from './types';
import { mulberry32 } from './prng';

const questions: Problem[] = [
  {
    question: 'Is $f(x) = \\frac{x}{x+1}$ invertible?',
    options: ['Yes', 'No', 'Only for $x > 0$', 'Only for integers'],
    correctIndex: 0,
    explanation: 'To check if a function is invertible, we check if it is **one-to-one**...'
  },
  {
    question: 'Is $=$ an equivalence relation?',
    options: ['Yes', 'No'],
    correctIndex: 0,
    explanation: 'Equality is the prototypical equivalence relation...'
  },
  {
    question: 'Is $>$ an equivalence relation?',
    options: ['Yes', 'No'],
    correctIndex: 1,
    explanation: 'It fails reflexivity: $a > a$ is never true...'
  },
  // ... more questions
];

const algebraRelationsBank: ProblemGenerator = {
  type: 'algebra-relations-bank',
  displayName: 'Relations & Functions',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    return questions[Math.floor(rng() * questions.length)];
  }
};

export const generators = [algebraRelationsBank] as const;
```

Now it's just another generator. Add it to a pack:

```typescript
const algebraPack: Pack = {
  id: 'algebra-relations',
  name: 'Relations & Functions',
  description: 'Equivalence relations, partial orders, closures',
  generators: ['algebra-relations-bank']
};
```

---

## Test Generation

```typescript
// src/lib/forest-factory/index.ts
import { getGenerator } from '../generators';
import { mulberry32, shuffleWithSeed } from '../generators/prng';
import type { Pack } from './types';
import type { Problem } from '../generators/types';

interface MockTest {
  packId: string;
  seed: number;
  questions: Problem[];
}

export function generateMockTest(
  pack: Pack, 
  seed: number, 
  count: number
): MockTest {
  const rng = mulberry32(seed);
  const questions: Problem[] = [];

  for (let i = 0; i < count; i++) {
    // Pick a random generator from the pack
    const genType = pack.generators[Math.floor(rng() * pack.generators.length)];
    const generator = getGenerator(genType);
    
    // Generate a question with a derived seed
    const questionSeed = Math.floor(rng() * 2147483647);
    questions.push(generator.generate(questionSeed));
  }

  return { packId: pack.id, seed, questions };
}
```

### Usage

```typescript
const test = generateMockTest(compArchPack, 42, 20);
// → 20 questions randomly drawn from the pack's generators

const test2 = generateMockTest(compArchPack, 42, 20);
// → Identical to test (same seed = same test)

const test3 = generateMockTest(compArchPack, 123, 20);
// → Different test (different seed)
```

---

## Directory Structure

```
src/lib/
├── generators/              # All generators (existing)
│   ├── index.ts
│   ├── types.ts
│   ├── prng.ts
│   ├── binary-multiplication.ts
│   ├── law-valid-consent.ts
│   └── algebra-relations-bank.ts   # NEW: question bank as generator
│
└── forest-factory/          # Pack system (new)
    ├── index.ts             # generateMockTest()
    ├── types.ts             # Pack interface
    └── packs/
        ├── comp-arch-midterm.ts
        ├── gdpr-essentials.ts
        └── algebra-relations.ts
```

---

## Implementation Checklist

### Phase 1: Core
- [ ] Create `src/lib/forest-factory/types.ts` with Pack interface
- [ ] Create `src/lib/forest-factory/index.ts` with `generateMockTest()`
- [ ] Create first pack definition

### Phase 2: Question Banks
- [ ] Convert algebra worksheet to `algebra-relations-bank.ts` generator
- [ ] Test with pack system

### Phase 3: UI
- [ ] Pack selection page (`/practice`)
- [ ] Test-taking component
- [ ] Results page with explanations

---

## Seed Strategies

```typescript
// Fixed seed (same test for everyone)
generateMockTest(pack, 42, 20);

// Daily seed (new test each day)
generateMockTest(pack, Math.floor(Date.now() / 86400000), 20);

// Shareable URL
// /practice/comp-arch-midterm?seed=12345
```

---

## Summary

| Concept | Definition |
|---------|------------|
| **Generator** | Anything with `generate(seed): Problem` |
| **Pack** | A list of generator IDs |
| **Mock Test** | N questions drawn from a pack's generators |

The beauty: **all generators look the same to the pack system**, whether they compute answers algorithmically, pick from scenarios, or draw from hand-crafted question banks.
