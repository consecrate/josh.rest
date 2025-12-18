---
description: Generate interactive lessons with quizzes and problem generators
---

# Create Interactive Lesson Workflow

## What are Bolts?
**Bolts** are high-impact, focused lessons designed to solidify a specific concept through "infinite" practice. Unlike standard lessons that mix theory and examples, a Bolt consists of:
1.  **Intuitive Visual Explanations**: Mental models (like "The Diagonal" for Reflexive) over formal definitions.
2.  **Immediate Interactive Checks**: Tiny quizzes right after each concept.
3.  **The Infinite Drill**: A final `<AdaptiveQuiz>` that generates endless variations of problems to master the skill.

When creating a Bolt, focus on *recognition* and *fluency*.

When asked to create a lesson on a topic, follow this exact process:

## 1. Analyze the Reference Lessons

First, read these files to understand the tech stack and patterns:
- `src/content/courses/computer-architecture/01-binary-multiplication.mdx` - Example lesson structure
- `src/lib/generators/binary-multiplication.ts` - Example generator implementation
- `docs/PRACTICE_PROBLEM_GENERATORS.md` - Generator architecture guide

## 2. Create an Outline and STOP

Before implementing, create a detailed outline and present it to the user. The outline must include:

### A. Lesson Structure
- **Course Section**: Which section this lesson belongs to (e.g., "Arithmetic Operations", "Memory Systems")
- **Section Order**: The display order of this section relative to other sections
- **Lesson Order**: The order of this lesson within its section
- List of content blocks with brief descriptions
- LaTeX examples/diagrams planned for each block
- Conceptual progression (how concepts build on each other)

### B. Interactive Components
For each interactive element you plan to create:

**For Practice Problems (using Generators):**
- **Generator name** (e.g., `topic-subtopic-difficulty`)
- **Problem type** (calculation, identification, tracing, etc.)
- **Input constraints** (e.g., 4-bit numbers only, no carries)
- **Wrong answer generation strategy**
- **Explanation format**

**For Comprehension Checks (Information-heavy subjects like Law):**
- Use "old-school" static MCQs (`<MultipleChoice />`)
- Define the question, options, correct index, and explanation directly in the component props
- Generators are not required for these checks

### C. Files to Create/Modify
- Lesson MDX file location and name
- Generator TypeScript files to create
- Any new components needed (rare)

**IMPORTANT**: After presenting the outline, explicitly ask:
> "Does this lesson plan look good? I'll proceed with implementation once you approve."

**DO NOT proceed until the user approves.**

## 3. Implementation (After Approval)

### Step 3a: Create Generators (If Applicable)

Generators are primarily for practice problems. For comprehension checks in information-heavy subjects, skip to Step 3b and use static MCQs.

For each generator:
1. Create file in `src/lib/generators/{generator-name}.ts`
2. Follow the ProblemGenerator interface:
```typescript
import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';

export const myGenerator: ProblemGenerator = {
  type: 'generator-name',
  displayName: 'Human Readable Name',
  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    // Generate problem using seeded RNG
    return { question, options, correctIndex, explanation };
  },
};
```
3. Register in `src/lib/generators/index.ts`

### Step 3b: Create the MDX Lesson

1. Create file in `src/content/courses/{course-name}/{order}-{slug}.mdx`
2. Structure with frontmatter:
```mdx
---
title: "Title"
description: "Description"
order: N
comingSoon: false
section: "Section Name"     # Optional: Group lessons into sections
sectionOrder: M             # Optional: Order of this section (lower = first)
---

import AdaptiveQuiz from "../../../components/AdaptiveQuiz.astro";
import MultipleChoice from "../../../components/MultipleChoice.astro";
```
3. Write content with:
   - Clear explanations building conceptually
   - LaTeX for math: inline `$...$` and display `$$...$$`
   - Worked examples before practice
   - `<AdaptiveQuiz generator="..." baseSeed={N} />` for practice problems
   - `<MultipleChoice ... />` for static comprehension checks (especially for info-heavy subjects)

**About Sections:**
- `section`: Optional field to group related lessons under a heading in the sidebar
- `sectionOrder`: Controls the order of sections (lower numbers appear first)
- `order`: Controls the order of lessons *within* a section
- Lessons without a section appear in an unnamed section at the top
- All lessons in the same section should have the same `sectionOrder`

### Step 3c: Verify

1. Run the dev server and check the lesson loads
2. Test all quizzes work correctly
3. Verify LaTeX renders properly

## Tech Stack Reference

### Components
- `AdaptiveQuiz.astro` - Adaptive quiz that adds more questions on wrong answers
- `MultipleChoice.astro` - Single multiple choice question
- `ContentBlock.astro` - Styled content section with title

### Generator Interface
```typescript
interface Problem {
  question: string;      // Can include $LaTeX$
  options: string[];     // Can include $LaTeX$
  correctIndex: number;
  explanation: string;   // Can include $$LaTeX$$
}

interface ProblemGenerator<P extends Problem = Problem> {
  readonly type: string;
  readonly displayName: string;
  generate(seed: number): P;
}
```

### PRNG Utilities
```typescript
import { mulberry32, shuffleWithSeed } from './prng';
const rng = mulberry32(seed); // Returns () => number [0,1)
const shuffled = shuffleWithSeed(array, rng);
```

### LaTeX in MDX
- Inline: `$x^2 + y^2$`
- Display: `$$\begin{array}{r}...\end{array}$$`
- Tables use HTML with inline `<style>` for complex layouts

### AdaptiveQuiz Props
```astro
<AdaptiveQuiz
  generator="generator-type"  // Must match generator's type field
  baseSeed={42}               // Starting seed for reproducibility
  initialCount={2}            // Questions shown initially
  appendCount={2}             // Added on wrong answer
  maxQuestions={10}           // Total cap
/>
```

### MultipleChoice Props
```astro
<MultipleChoice
  question="What is the answer?"
  options={["Option A", "Option B", "Option C"]}
  correct={0} // Index of correct option (0-based)
  explanation="Explanation for why Option A is correct."
/>
```

### Course Frontmatter Schema
```typescript
{
  title: string;              // Lesson title
  description: string;        // Brief description
  order: number;              // Order within the section
  comingSoon: boolean;        // Default: false. Disables link in sidebar
  section?: string;           // Optional: Section name (e.g., "Arithmetic Operations")
  sectionOrder?: number;      // Optional: Section display order (lower = first)
}
```

**Section Behavior:**
- Lessons are grouped by `section` name in the sidebar
- Sections are sorted by `sectionOrder`, then alphabetically
- Lessons within a section are sorted by `order`
- Lessons without a `section` appear in an unnamed group at the top
