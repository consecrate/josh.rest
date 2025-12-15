# josh.rest — Product Requirements Document

## Overview

**josh.rest** is a personal blog and interactive educational resource inspired by platforms like MathAcademy. It combines traditional content blocks with interactive learning components, enabling readers to actively engage with material rather than passively consuming it.

---

## Goals

1. **Educational Engagement** — Provide interactive elements that reinforce learning
2. **Simplicity** — Minimal complexity in both codebase and user experience
3. **Performance** — Blazingly fast load times with zero JavaScript by default (Astro islands)
4. **Aesthetic** — Minimalist, sophisticated, yet approachable and cute

---

## Technical Stack

| Layer         | Technology                     | Rationale                                                          |
| ------------- | ------------------------------ | ------------------------------------------------------------------ |
| Framework     | **Astro**                      | Zero-JS by default, partial hydration, excellent for content sites |
| Content       | **MDX**                        | Markdown with embedded interactive components                      |
| Styling       | **CSS (vanilla)**              | No framework overhead, full control, fast                          |
| Interactivity | **Vanilla JS / Astro Islands** | Only hydrate what needs interactivity                              |
| Deployment    | **Vercel / Cloudflare Pages**  | Edge-first, fast globally                                          |

---

## Content Architecture

### 1. Text Blocks (Default)

Standard markdown content — paragraphs, headings, code blocks, images, lists, blockquotes.

```md
# Understanding Derivatives

The derivative of a function represents its rate of change...
```

### 2. Interactive Blocks

#### Multiple Choice Block (MVP)

A self-contained interactive component with:

- **Question** — The prompt/problem
- **5 Options** — Labeled A through E
- **Submit Button** — Triggers answer evaluation
- **Solution Reveal** — Shows correct answer + explanation after submission

**Behavior:**

1. User reads question
2. User selects one option (radio-style, single selection)
3. User clicks "Submit"
4. Component reveals:
   - ✓ Correct / ✗ Incorrect indicator
   - The correct answer highlighted
   - Optional explanation text
5. Component locks (no re-submission)

**Component API:**

```astro
<MultipleChoice
  question="What is the derivative of x²?"
  options={[
    "x",
    "2x",
    "x²",
    "2",
    "2x²"
  ]}
  correct={1}  // 0-indexed, so "2x"
  explanation="Using the power rule: d/dx[xⁿ] = nxⁿ⁻¹, we get 2x¹ = 2x"
/>
```

---

## Design Principles

### Visual Language

| Principle         | Implementation                                                      |
| ----------------- | ------------------------------------------------------------------- |
| **Minimalist**    | Dark background, limited palette, generous whitespace               |
| **Sophisticated** | Classic serif typography, refined spacing, understated elegance     |
| **Readable**      | High contrast cream-on-black, comfortable line-height, left-aligned |
| **Fast**          | No layout shifts, instant feedback, smooth transitions              |

### Color Palette (Dark Mode)

```
Background:     #181818 (rich black)
Text:           #E8E6E3 (warm cream)
Heading:        #FFFFFF (pure white)
Accent:         #E8E6E3 (cream, underlined links)
Correct:        #4ADE80 (soft green)
Incorrect:      #F87171 (soft red)
Muted:          #888888 (medium gray)
Surface:        #222222 (dark gray)
```

### Typography

- **Headings:** Georgia, serif — elegant, bold
- **Body:** Georgia, serif — 18px base, generous line-height (1.7)
- **Code:** JetBrains Mono or monospace
- **Links:** Underlined, same color as body text

### Spacing Scale

```
4px, 8px, 16px, 24px, 32px, 48px, 64px
```

---

## Page Structure

```
/
├── index.astro          # Home / blog listing
├── posts/
│   └── [slug].astro     # Individual post (MDX)
└── about.astro          # About page (optional)
```

### Home Page

- Site title + tagline
- List of posts (title, date, brief description)
- Clean, scannable layout

### Post Page

- Title + metadata (date, reading time)
- Content area (text blocks + interactive blocks)
- No sidebar clutter

---

## Component Specifications

### `<MultipleChoice />`

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `question` | `string` | ✓ | The question text |
| `options` | `string[]` | ✓ | Exactly 5 answer options |
| `correct` | `number` | ✓ | Index of correct answer (0-4) |
| `explanation` | `string` | ✗ | Explanation shown after submit |

**States:**

1. `idle` — Waiting for user selection
2. `selected` — User has chosen an option (Submit enabled)
3. `submitted` — Answer revealed, component locked

**Accessibility:**

- Proper `<fieldset>` and `<legend>` structure
- Keyboard navigable (arrow keys between options)
- Focus visible states
- ARIA labels for result announcement

---

## Performance Budget

| Metric                   | Target         |
| ------------------------ | -------------- |
| First Contentful Paint   | < 1s           |
| Largest Contentful Paint | < 1.5s         |
| Total Blocking Time      | < 50ms         |
| Cumulative Layout Shift  | < 0.1          |
| JavaScript (per page)    | < 10KB gzipped |
| CSS (total)              | < 15KB gzipped |

---

## File Structure

```
josh.rest/
├── src/
│   ├── components/
│   │   └── MultipleChoice.astro    # Interactive component
│   ├── layouts/
│   │   ├── Base.astro              # HTML shell
│   │   └── Post.astro              # Post layout
│   ├── pages/
│   │   ├── index.astro             # Home
│   │   └── posts/
│   │       └── [...slug].astro     # Dynamic post routes
│   ├── content/
│   │   └── posts/                  # MDX content files
│   └── styles/
│       └── global.css              # Global styles
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## MVP Scope

### In Scope ✓

- [x] Astro project setup
- [x] Global styling (typography, colors, spacing)
- [x] Base layout
- [x] Home page with post listing
- [x] Post page with MDX support
- [x] `<MultipleChoice />` component
- [x] One sample post demonstrating the component

### Out of Scope (Future)

- [ ] Dark mode toggle
- [ ] Additional interactive blocks (Fill-in-blank, Matching, etc.)
- [ ] Progress tracking / local storage
- [ ] Search functionality
- [ ] Comments
- [ ] Analytics

---

## Success Criteria

1. **Lighthouse Score** — 100/100 on Performance
2. **Bundle Size** — Total JS < 10KB
3. **Functionality** — Multiple choice works correctly on mobile + desktop
4. **Design** — Visually matches described aesthetic
5. **Content** — At least 1 demo post with interactive elements

---

## Next Steps

1. Initialize Astro project with TypeScript
2. Configure MDX integration
3. Create global styles
4. Build layouts (Base, Post)
5. Build `<MultipleChoice />` component
6. Create sample content
7. Test and refine

---

_PRD Version 1.0 — December 2024_
