---
description: Create interactive worksheets where students can toggle answers and derivations
---

# Live Worksheets

A **Live Worksheet** is an interactive lesson format that converts traditional static worksheets into dynamic learning experiences. Each problem can be toggled to show/hide answers and detailed derivations on demand.

## What is a Live Worksheet?

Live Worksheets are ideal for:
- **Practice problem sets** where students want to attempt problems before seeing solutions
- **Homework assignments** that provide instant feedback
- **Review materials** where students can check their work step-by-step
- **Self-paced learning** where students control when they see explanations

Unlike traditional worksheets (PDF/paper) or adaptive quizzes (which generate problems dynamically), Live Worksheets:
- Present a **fixed set** of curated problems
- Allow students to **toggle visibility** of answers
- Provide **detailed derivations** for each problem
- Support complex **LaTeX math** in questions, answers, and explanations

## When to Use Live Worksheets vs Other Formats

| Format | Use Case |
|--------|----------|
| **Live Worksheet** | Fixed problem sets with detailed solutions (e.g., textbook exercises, exam prep) |
| **AdaptiveQuiz** | Practice problems that adapt based on performance (e.g., arithmetic drills) |
| **MultipleChoice** | Single comprehension checks embedded in lessons |
| **Regular Lesson** | Conceptual explanations without extensive problem-solving |

## Components

### 1. `WorksheetProblem.astro`

The core component for individual problems.

**Props:**
```typescript
interface Props {
  number: number;          // Problem number (1, 2, 3...)
  // Slots:
  // - question: The question text (supports LaTeX and <br />)
  // - answer: The short answer (supports LaTeX and <br />)
  // - derivation: Detailed step-by-step explanation
}
```

**Features:**
- Problem number and question always visible
- "Show Answer" / "Hide Answer" toggle button
- Answer section with green label (distinct styling)
- Optional derivation section with muted styling
- Smooth fade-in animation on reveal
- KaTeX re-rendering when answers are shown
- Accessible with ARIA attributes

**Example Usage:**
```mdx
<WorksheetProblem number={1}>
  <Fragment slot="question">Solve for $x$: $2x + 5 = 13$</Fragment>
  <Fragment slot="answer">$x = 4$</Fragment>
  <Fragment slot="derivation">
    Subtract 5 from both sides:
    $$2x = 8$$

    Divide both sides by 2:
    $$x = 4$$
  </Fragment>
</WorksheetProblem>
```

### 2. `LiveWorksheet.astro`

A container component that wraps multiple problems.

**Props:**
```typescript
interface Props {
  title: string;           // Worksheet title
  description?: string;    // Optional description
}
```

**Features:**
- Header with title and description
- "Show All Answers" button (reveals all problems at once)
- "Hide All Answers" button (collapses all problems)
- Consistent spacing and styling

**Example Usage:**
```mdx
<LiveWorksheet title="Algebra Practice" description="10 problems on linear equations">

<WorksheetProblem number={1}>...</WorksheetProblem>
<WorksheetProblem number={2}>...</WorksheetProblem>
...

</LiveWorksheet>
```

## Creating a Live Worksheet Lesson

### Step 1: Read the Source Material

If the source material is a PDF (e.g., a textbook chapter or worksheet):
1.  **Use the PDF MCP tool** (`pdf-reader`) to read the file.
2.  Extract the questions and any provided solutions.
3.  **Check for attached solutions:** If the user has provided or pointed to a separate solution key, ensure you read and incorporate those solutions as well to verify accuracy.

### Step 2: Create the MDX File

Create a file in `src/content/courses/{course-name}/{order}-{slug}.mdx`.

Follow this structure exactly (reference `@src/content/courses/algebra/02-relations-worksheet.mdx`):

```mdx
---
title: "Relations & Functions Worksheet"
description: "Interactive practice problems on relations, functions, and equivalence"
order: 2
section: "Fundamentals"
sectionOrder: 1
isWorksheet: true
---

import WorksheetProblem from "../../../components/WorksheetProblem.astro";
import LiveWorksheet from "../../../components/LiveWorksheet.astro";

<LiveWorksheet title="Relations & Functions" description="28 problems with detailed derivations">

<WorksheetProblem number={1}>
  <Fragment slot="question">
    Describe $\mathbb{Z} \times \mathbb{Z}$
  </Fragment>
  <Fragment slot="answer">
    The set of all ordered pairs of integers.
  </Fragment>
  <Fragment slot="derivation">
    The **Cartesian product** $A \times B$ is defined as...
    
    Detailed educational content goes here...
  </Fragment>
</WorksheetProblem>

...

</LiveWorksheet>
```

### Step 3: Content Guidelines

#### Formatting Lists and Multi-part Questions
When a question or answer has multiple parts (e.g., a., b., c.), **you MUST use `<br />` tags** to force new lines. Markdown newlines alone often collapse in these slots.

**Correct:**
```mdx
<Fragment slot="question">
  Find the following:<br />
  (a) The domain<br />
  (b) The range
</Fragment>
<Fragment slot="answer">
  (a) $[0, \infty)$<br />
  (b) $(-\infty, \infty)$
</Fragment>
```

**Incorrect:**
```mdx
<Fragment slot="question">
  Find the following:
  (a) The domain
  (b) The range
</Fragment>
```

#### High-Quality Educational Answers
Do not just provide the final answer. The goal is to teach.
1.  **Explanation over brevity:** In the `derivation` slot, write detailed, step-by-step explanations.
2.  **Educational Tone:** Explain *why* a step is taken, not just *what* the step is. Use bolding for key terms.
3.  **Visual Intuition:** If applicable, describe the visual or geometric intuition behind the problem.
4.  **Step-by-Step:** Break down complex problems into numbered steps or logical chunks.
5.  **Definitions:** Briefly recap relevant definitions if they are crucial to solving the problem.

### Step 4: LaTeX Formatting

**Important LaTeX Notes:**
- Use **double backslashes** in MDX strings: `\\mathbb{Z}` not `\mathbb{Z}`
- Inline math: `$x^2$`
- Display math: `$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$`
- Multi-line derivations use template literals with backticks
- KaTeX is automatically rendered on page load and when answers are revealed

## Styling and Design

The components follow the existing design system:
- **CSS Variables**: Uses `--surface`, `--text`, `--heading`, `--muted`, `--correct`
- **Spacing**: Uses `--space-*` variables for consistent spacing
- **Typography**: Inherits from global styles
- **Colors**: Answer labels use `--correct` (green), derivations use `--muted`
- **Animations**: Smooth fade-in on reveal (0.2s ease)

## Accessibility

The components include proper accessibility features:
- `aria-expanded` attribute on toggle buttons
- `aria-controls` linking buttons to answer sections
- `Semantic HTML` structure
- Keyboard navigation support

## Technical Implementation

### Client-Side Interactivity

Both components use vanilla JavaScript (no framework) for:
- Toggle button click handlers
- Show/hide state management
- Batch toggle operations (Show All / Hide All)
- KaTeX re-rendering on reveal

### KaTeX Re-rendering

When an answer is revealed, the component dynamically imports KaTeX auto-render:

```typescript
import("katex/contrib/auto-render").then(({ default: renderMathInElement }) => {
  renderMathInElement(answerSection, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
});
```

This ensures math in hidden content renders correctly when shown.

## Best Practices

1.  **Problem Numbering**: Use sequential numbers (1, 2, 3...) for clarity
2.  **Answer Brevity**: Keep answers concise; save details for derivations
3.  **Derivation Structure**: Use clear headings, step labels, and formatting
4.  **LaTeX Escaping**: Always double-escape backslashes in MDX strings
5.  **Grouping**: Use `LiveWorksheet` container for 3+ problems
6.  **Standalone Problems**: You can use `WorksheetProblem` alone for 1-2 problems
7.  **Testing**: Always preview to ensure LaTeX renders correctly
