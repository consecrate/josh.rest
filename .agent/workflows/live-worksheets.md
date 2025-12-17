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
  question: string;        // The question text (supports LaTeX)
  answer: string;          // The short answer
  derivation?: string;     // Optional detailed derivation/explanation
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
<WorksheetProblem
  number={1}
  question="Solve for $x$: $2x + 5 = 13$"
  answer="$x = 4$"
  derivation={`Subtract 5 from both sides:
$$2x = 8$$

Divide both sides by 2:
$$x = 4$$`}
/>
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

<WorksheetProblem number={1} ... />
<WorksheetProblem number={2} ... />
...

</LiveWorksheet>
```

## Creating a Live Worksheet Lesson

### Step 1: Prepare the Source Material

Gather your problems with:
- Clear question statements
- Concise answers
- Detailed step-by-step derivations/explanations

### Step 2: Create the MDX File

Create a file in `src/content/courses/{course-name}/{order}-{slug}.mdx`:

```mdx
---
title: "Relations & Functions Worksheet"
description: "Interactive practice problems on relations, functions, and equivalence"
order: 2
section: "Fundamentals"
sectionOrder: 1
---

import WorksheetProblem from "../../../components/WorksheetProblem.astro";
import LiveWorksheet from "../../../components/LiveWorksheet.astro";

Brief introduction to the worksheet...

<LiveWorksheet title="Relations & Functions" description="28 problems with detailed derivations">

<WorksheetProblem
  number={1}
  question="Describe $\\mathbb{Z} \\times \\mathbb{Z}$"
  answer="The set of all ordered pairs of integers."
  derivation={`The Cartesian product $A \\times B$ is defined as...`}
/>

<WorksheetProblem
  number={2}
  ...
/>

</LiveWorksheet>

## Summary

Optional summary of topics covered...
```

### Step 3: LaTeX Formatting

**Important LaTeX Notes:**
- Use **double backslashes** in MDX strings: `\\mathbb{Z}` not `\mathbb{Z}`
- Inline math: `$x^2$`
- Display math: `$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$`
- Multi-line derivations use template literals with backticks
- KaTeX is automatically rendered on page load and when answers are revealed

**Example with complex math:**
```mdx
<WorksheetProblem
  number={5}
  question="Prove that $R_5$ on $\\mathbb{Z}$ is transitive."
  answer="Transitive (see derivation)"
  derivation={`Assume $x-y = 5k$ and $y-z = 5j$.

Add equations:
$$(x-y) + (y-z) = 5k + 5j$$

Simplify:
$$x - z = 5(k+j)$$

Thus $5 \\mid (x-z)$. ∎`}
/>
```

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
- Semantic HTML structure
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

## Example: Complete Worksheet

See `src/content/courses/algebra/02-relations-worksheet.mdx` for a full example with 25+ problems covering:
- Cartesian products
- Function invertibility
- Equivalence relations
- Relation matrices
- Closures
- Partial orders and Hasse diagrams

## Best Practices

1. **Problem Numbering**: Use sequential numbers (1, 2, 3...) for clarity
2. **Answer Brevity**: Keep answers concise; save details for derivations
3. **Derivation Structure**: Use clear headings, step labels, and formatting
4. **LaTeX Escaping**: Always double-escape backslashes in MDX strings
5. **Grouping**: Use `LiveWorksheet` container for 3+ problems
6. **Standalone Problems**: You can use `WorksheetProblem` alone for 1-2 problems
7. **Testing**: Always preview to ensure LaTeX renders correctly

## Comparison with Other Interactive Elements

| Feature | Live Worksheet | AdaptiveQuiz | MultipleChoice |
|---------|----------------|--------------|----------------|
| Problem Count | Fixed set | Dynamic (generates on demand) | Single question |
| Answer Format | Free-form text with LaTeX | Multiple choice | Multiple choice |
| Feedback | Show/hide toggle | Immediate right/wrong | Immediate right/wrong |
| Adaptivity | None | Adds questions on errors | None |
| Use Case | Curated problem sets | Practice drills | Comprehension checks |
| Derivations | Detailed step-by-step | Brief explanations | Brief explanations |

## Future Enhancements

Potential improvements:
- Progress tracking (how many problems attempted)
- Export answers to PDF
- Hint system (show partial derivation)
- Student notes/annotations
- Difficulty ratings per problem
