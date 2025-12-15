# Practice Problem Generators

## Overview

This document describes the architecture for **seeded practice problem generators** - a system that produces deterministic, infinitely many practice problems for course content. The key innovation is combining seeded randomness with an adaptive learning flow.

## Core Concepts

### 1. Seeded Randomness

Instead of truly random problems, we use a **seeded pseudo-random number generator (PRNG)**. This provides:

- **Reproducibility**: Same seed → same problem (useful for sharing, debugging, grading)
- **Infinite variety**: Different seeds → different problems
- **Deterministic flow**: The sequence of questions is predictable given the starting seed

```typescript
// Mulberry32 - A fast, high-quality 32-bit PRNG
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

### 2. Adaptive Learning Flow

The quiz component implements mastery-based learning:

1. User sees **2 initial questions**
2. If they answer correctly → progress to next concept
3. If they answer incorrectly → **2 more questions are appended** (different problems)
4. This continues until they demonstrate mastery

This creates a "learn until you get it" experience without being punitive.

---

## Architecture

### Directory Structure

```
src/
├── lib/
│   └── generators/
│       ├── index.ts           # Exports all generators
│       ├── types.ts           # Common interfaces
│       ├── prng.ts            # Seeded RNG utilities
│       └── binary-multiplication.ts  # First generator
├── components/
│   ├── MultipleChoice.astro   # Existing static component
│   └── AdaptiveQuiz.astro     # New adaptive component
```

### Core Interfaces

```typescript
// src/lib/generators/types.ts

export interface Problem {
  question: string;          // Question text (can include LaTeX)
  options: string[];         // Answer choices (can include LaTeX)
  correctIndex: number;      // Index of correct answer
  explanation: string;       // Explanation (can include LaTeX)
  latex?: string;            // Optional full LaTeX display (for visual problems)
}

export interface ProblemGenerator<P extends Problem = Problem> {
  readonly type: string;     // Unique identifier (e.g., "binary-multiplication")
  readonly displayName: string;
  
  generate(seed: number): P;
  
  // Optional: validate if a seed produces a valid problem
  validate?(seed: number): boolean;
}
```

### Generator Pattern

Each generator is a pure function that takes a seed and returns a complete problem:

```typescript
// Conceptual structure
const generator: ProblemGenerator = {
  type: 'binary-multiplication-no-carry',
  displayName: 'Binary Multiplication (No Carries)',
  
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    // Use rng() to generate deterministic random values
    // Build problem, compute solution, generate wrong answers
    return { question, options, correctIndex, explanation, latex };
  }
};
```

---

## Generator #1: Binary Long Multiplication (4-bit, No Carries)

### Constraints

- Two 4-bit numbers (0-15 each, displayed as `xxxx`)
- **No carries during partial product addition**: When summing partial products column-wise, no column should have more than one `1`
- Must show the full long multiplication layout in LaTeX

### Algorithm

```typescript
// src/lib/generators/binary-multiplication.ts

interface BinaryMultProblem extends Problem {
  a: number;
  b: number;
  product: number;
}

function hasNoCarries(a: number, b: number): boolean {
  // For 4-bit × 4-bit, we have up to 4 partial products
  // Check each column (0-7) to ensure at most one 1
  
  const partialProducts: number[] = [];
  for (let i = 0; i < 4; i++) {
    if ((b >> i) & 1) {
      partialProducts.push(a << i);
    }
  }
  
  // Check each column for at most one 1
  for (let col = 0; col < 8; col++) {
    let count = 0;
    for (const pp of partialProducts) {
      if ((pp >> col) & 1) count++;
    }
    if (count > 1) return false;
  }
  return true;
}

function generate(seed: number): BinaryMultProblem {
  const rng = mulberry32(seed);
  let a: number, b: number;
  
  // Find valid pair (rejection sampling with seed-deterministic sequence)
  let attempts = 0;
  do {
    a = Math.floor(rng() * 16);
    b = Math.floor(rng() * 16);
    attempts++;
  } while (!hasNoCarries(a, b) && attempts < 1000);
  
  if (attempts >= 1000) {
    // Fallback to known-good pairs
    a = 2; b = 3;
  }
  
  const product = a * b;
  
  return {
    question: `What is ${toBinary4(a)} × ${toBinary4(b)} in binary?`,
    options: generateOptions(product, rng),
    correctIndex: 0, // We'll shuffle
    explanation: `Step-by-step multiplication shows the result is ${toBinary8(product)}`,
    latex: generateLatex(a, b),
    a,
    b,
    product,
  };
}
```

### LaTeX Generation

The generator produces beautiful long multiplication layouts:

```typescript
function generateLatex(a: number, b: number): string {
  const aBin = toBinary4(a);
  const bBin = toBinary4(b);
  const product = a * b;
  
  // Build partial products
  const partials: string[] = [];
  for (let i = 0; i < 4; i++) {
    const bitSet = (b >> i) & 1;
    const partial = bitSet ? (a << i) : 0;
    const partialBin = partial.toString(2).padStart(8, '0');
    // Add phantom zeros for alignment
    const phantoms = '\\phantom{0}'.repeat(i);
    partials.push(`${partialBin.slice(0, 8 - i)}${phantoms}`);
  }
  
  return `
\\begin{array}{r}
${aBin} \\\\
\\times \\quad ${bBin} \\\\
\\hline
${partials.join(' \\\\\n')} \\\\
\\hline
${toBinary8(product)}
\\end{array}
`;
}
```

### Wrong Answer Generation

Generate plausible wrong answers:

```typescript
function generateOptions(correct: number, rng: () => number): string[] {
  const options = new Set<number>([correct]);
  
  const generators = [
    // Off by one bit
    () => correct ^ (1 << Math.floor(rng() * 8)),
    // Off by small amount
    () => correct + Math.floor(rng() * 4) - 2,
    // Shifted version
    () => correct << 1,
    () => correct >> 1,
  ];
  
  while (options.size < 4) {
    const gen = generators[Math.floor(rng() * generators.length)];
    const wrong = gen();
    if (wrong > 0 && wrong < 256 && wrong !== correct) {
      options.add(wrong);
    }
  }
  
  // Convert to binary strings and shuffle
  return shuffleWithSeed([...options].map(toBinary8), rng);
}
```

---

## Adaptive Quiz Component

### Props Interface

```typescript
interface AdaptiveQuizProps {
  generator: string;           // Generator type identifier
  baseSeed: number;            // Starting seed
  initialCount?: number;       // Questions to start (default: 2)
  appendCount?: number;        // Questions added on wrong answer (default: 2)
  maxQuestions?: number;       // Cap to prevent infinite loops (default: 10)
}
```

### Component Structure

```astro
<!-- src/components/AdaptiveQuiz.astro -->
---
interface Props {
  generator: string;
  baseSeed: number;
  initialCount?: number;
  appendCount?: number;
  maxQuestions?: number;
}

const {
  generator,
  baseSeed,
  initialCount = 2,
  appendCount = 2,
  maxQuestions = 10
} = Astro.props;
---

<div
  class="adaptive-quiz"
  data-generator={generator}
  data-base-seed={baseSeed}
  data-initial-count={initialCount}
  data-append-count={appendCount}
  data-max-questions={maxQuestions}
>
  <div class="quiz-questions"></div>
  <div class="quiz-progress">
    <span class="correct-count">0</span> / <span class="total-count">0</span> correct
  </div>
</div>

<script>
  import { getGenerator } from '../lib/generators';
  
  function initAdaptiveQuiz(container: HTMLElement) {
    const generator = getGenerator(container.dataset.generator!);
    let currentSeed = parseInt(container.dataset.baseSeed!, 10);
    let questionsAnswered = 0;
    let correctCount = 0;
    const maxQuestions = parseInt(container.dataset.maxQuestions!, 10);
    
    function addQuestions(count: number) {
      const questionsContainer = container.querySelector('.quiz-questions')!;
      
      for (let i = 0; i < count && questionsAnswered + i < maxQuestions; i++) {
        const problem = generator.generate(currentSeed++);
        const questionEl = createQuestionElement(problem, (isCorrect) => {
          questionsAnswered++;
          if (isCorrect) {
            correctCount++;
          } else {
            // Append more questions on wrong answer
            addQuestions(parseInt(container.dataset.appendCount!, 10));
          }
          updateProgress();
        });
        questionsContainer.appendChild(questionEl);
      }
      
      // Re-render KaTeX for new questions
      if (window.renderMathInElement) {
        window.renderMathInElement(questionsContainer);
      }
    }
    
    function updateProgress() {
      container.querySelector('.correct-count')!.textContent = String(correctCount);
      container.querySelector('.total-count')!.textContent = String(questionsAnswered);
    }
    
    // Initialize with first batch
    addQuestions(parseInt(container.dataset.initialCount!, 10));
  }
</script>
```

---

## Usage in MDX

### Import and Use

```mdx
---
title: "Binary Multiplication"
---

import AdaptiveQuiz from '../../components/AdaptiveQuiz.astro';

## Practice: Binary Multiplication

Now let's practice what we learned!

<AdaptiveQuiz
  generator="binary-multiplication-no-carry"
  baseSeed={42}
  initialCount={2}
  appendCount={2}
/>
```

### Seed Strategies

Different seeding approaches for different use cases:

```typescript
// 1. Fixed seed (same problems for everyone)
baseSeed={42}

// 2. Date-based seed (problems change daily)
baseSeed={Math.floor(Date.now() / 86400000)}

// 3. Lesson-based seed (unique per lesson, consistent)
baseSeed={hashCode(lesson.id)}

// 4. User-based seed (personalized, requires auth)
baseSeed={hashCode(userId + lessonId)}
```

---

## Extensibility Guide

### Adding a New Generator

1. **Create the generator file**:

```typescript
// src/lib/generators/polynomial-addition.ts
import type { Problem, ProblemGenerator } from './types';
import { mulberry32 } from './prng';

export const polynomialAdditionGenerator: ProblemGenerator = {
  type: 'polynomial-addition',
  displayName: 'Polynomial Addition',
  
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    // ... implementation
    return { question, options, correctIndex, explanation };
  }
};
```

2. **Register in index**:

```typescript
// src/lib/generators/index.ts
import { binaryMultiplicationGenerator } from './binary-multiplication';
import { polynomialAdditionGenerator } from './polynomial-addition';

const generators = new Map<string, ProblemGenerator>([
  [binaryMultiplicationGenerator.type, binaryMultiplicationGenerator],
  [polynomialAdditionGenerator.type, polynomialAdditionGenerator],
]);

export function getGenerator(type: string): ProblemGenerator {
  const gen = generators.get(type);
  if (!gen) throw new Error(`Unknown generator: ${type}`);
  return gen;
}
```

3. **Use in MDX**:

```mdx
<AdaptiveQuiz generator="polynomial-addition" baseSeed={123} />
```

### Generator Patterns

Common patterns for different problem types:

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Rejection Sampling** | When valid inputs are sparse | Binary mult with no carries |
| **Constructive** | When you can build valid inputs directly | Simple arithmetic |
| **Template** | Text-based problems with blanks | Fill-in-the-blank |
| **Transformation** | Transform a base problem | Word problems with names/numbers |

---

## Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Create `src/lib/generators/prng.ts` with mulberry32
- [ ] Create `src/lib/generators/types.ts` with interfaces
- [ ] Create `src/lib/generators/index.ts` with registry

### Phase 2: First Generator
- [ ] Implement `binary-multiplication.ts`
- [ ] Implement `hasNoCarries()` validation
- [ ] Implement LaTeX generation
- [ ] Implement wrong answer generation
- [ ] Write tests (sample function calls with expected outputs)

### Phase 3: Adaptive Component
- [ ] Create `AdaptiveQuiz.astro` component
- [ ] Implement question rendering with KaTeX
- [ ] Implement answer checking logic
- [ ] Implement "add more on wrong" behavior
- [ ] Style to match existing `MultipleChoice.astro`

### Phase 4: Integration
- [ ] Add to `01-introduction.mdx`
- [ ] Test with different seeds
- [ ] Verify KaTeX rendering

---

## Technical Considerations

### KaTeX Integration

Since the project already uses `katex`, `rehype-katex`, and `remark-math`, dynamically added content needs manual rendering:

```typescript
// After adding new question elements
if (typeof window !== 'undefined' && window.katex) {
  const elements = container.querySelectorAll('.math');
  elements.forEach(el => {
    window.katex.render(el.textContent!, el, { throwOnError: false });
  });
}
```

### Performance

- Generators should be **synchronous** and **fast** (< 1ms)
- No network requests in generators
- Precompute expensive values where possible
- Use rejection sampling sparingly (< 100 attempts typical)

### Testing Generators

```typescript
// Test: Determinism
const p1 = generator.generate(42);
const p2 = generator.generate(42);
assert(p1.question === p2.question);  // Same seed = same problem

// Test: Variety
const p3 = generator.generate(43);
assert(p1.question !== p3.question);  // Different seed = different problem

// Test: Validity
for (let i = 0; i < 100; i++) {
  const p = generator.generate(i);
  assert(p.options.includes(p.options[p.correctIndex]));  // Correct answer exists
  assert(p.options.length === 4);  // Always 4 options
}
```

---

## Example: Complete Binary Multiplication Problem

**Seed**: 42  
**Numbers**: 0011 × 0101 (3 × 5 = 15)

**Generated LaTeX**:
```latex
\begin{array}{r}
0011 \\
\times \quad 0101 \\
\hline
0011 \\
0000\phantom{0} \\
0011\phantom{00} \\
0000\phantom{000} \\
\hline
00001111
\end{array}
```

**Generated Question**:
> What is `0011 × 0101` in binary?
> 
> - A) `00001111` ✓
> - B) `00001110`
> - C) `00011110`
> - D) `00000111`

**Generated Explanation**:
> Multiply bit by bit:
> - 1 × 0011 = 0011 (position 0)
> - 0 × 0011 = 0000 (position 1)
> - 1 × 0011 = 0011 (position 2)
> - 0 × 0011 = 0000 (position 3)
> 
> Sum: 0011 + 0000 + 1100 + 0000 = 00001111 (15 in decimal)
