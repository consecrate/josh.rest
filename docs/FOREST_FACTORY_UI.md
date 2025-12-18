# 🌲 Forest Factory — UI/UX Design

> Design specification for the Forest Factory quiz generation interface.

---

## Overview

Forest Factory is a two-panel interface where users configure a quiz on the left and take it on the right. The primary use case is **timed multiple-choice quizzes** generated from packs or custom generator selections.

---

## Layout

```
┌─────────────────────────────┬──────────────────────────────────────┐
│  LEFT SIDEBAR (Config)      │  RIGHT PANEL (Quiz)                  │
│  - Packs                    │  - Questions                         │
│  - Generators               │  - Timer                             │
│  - Settings                 │  - Results                           │
│  - Factorize! button        │                                      │
└─────────────────────────────┴──────────────────────────────────────┘
```

---

## Left Sidebar Sections

### 1. Packs

Pre-made collections of generators. Selecting a pack auto-populates the Generators section.

```
┌─────────────────────────────┐
│ PACKS                       │
├─────────────────────────────┤
│ ○ Computer Architecture     │
│ ○ GDPR Essentials           │
│ ○ Relations & Functions     │
└─────────────────────────────┘
```

**Behavior:**
- Radio selection (one pack at a time)
- Clicking a pack loads its generators into the Generators section
- User can then customize by toggling individual generators

---

### 2. Generators

Shows which generators are active. Users can toggle individual generators on/off.

```
┌─────────────────────────────┐
│ GENERATORS                  │
├─────────────────────────────┤
│ ☑ binary-multiplication     │
│ ☑ binary-division           │
│ ☑ floating-point            │
│ ☐ binary-division-table     │  ← user disabled this one
│                             │
│ [+ Add Generator]           │
└─────────────────────────────┘
```

**Behavior:**
- Checkboxes to enable/disable generators
- "[+ Add Generator]" opens a modal/dropdown to pick from all available generators
- At least one generator must be enabled to Factorize

**Add Generator Modal:**
```
┌─────────────────────────────────┐
│ Add Generator                   │
├─────────────────────────────────┤
│ 🔍 Search...                    │
├─────────────────────────────────┤
│ BINARY                          │
│   ○ binary-multiplication       │
│   ○ binary-multiplication-table │
│   ○ binary-division             │
│   ○ binary-division-table       │
│   ○ floating-point              │
│                                 │
│ LAW & GDPR                      │
│   ○ law-personal-data-classifier│
│   ○ law-valid-consent           │
│   ○ law-lawful-basis-matcher    │
│   ...                           │
└─────────────────────────────────┘
```

---

### 3. Settings

Quiz configuration options.

```
┌─────────────────────────────┐
│ SETTINGS                    │
├─────────────────────────────┤
│ Questions   [10 ▼]          │
│                             │
│ Time Limit  [None ▼]        │
│             • None          │
│             • 5 min         │
│             • 10 min        │
│             • 15 min        │
│             • 30 min        │
│             • 60 min        │
│             • Custom...     │
└─────────────────────────────┘
```

**Question Count Options:** 5, 10, 15, 20, 25, 30, 50

**Time Limit Options:** None, 5, 10, 15, 30, 60 min, Custom

---

### 4. Factorize! Button

Primary CTA at the bottom of the sidebar.

```
┌─────────────────────────────┐
│                             │
│  ┌───────────────────────┐  │
│  │   🌲 Factorize!       │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

**States:**
- **Disabled:** No generators selected
- **Enabled:** At least one generator selected
- **Loading:** Generating questions (show spinner)

---

## Right Panel States

### State 1: Empty (Initial)

```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│              🌲                      │
│         (large, faded)               │
│                                      │
│     Select a pack and Factorize!     │
│                                      │
│                                      │
└──────────────────────────────────────┘
```

---

### State 2: Quiz Active

```
┌──────────────────────────────────────┐
│ Computer Architecture    ⏱️ 14:32    │
│ 20 questions • seed: 42  [Share]    │
├──────────────────────────────────────┤
│                                      │
│ Q1 of 20                             │
│                                      │
│ Multiply 1011₂ × 110₂               │
│                                      │
│ ○ 100001₂                           │
│ ○ 110010₂                           │
│ ● 1000010₂  ← selected              │
│ ○ 1010110₂                          │
│                                      │
│         [← Prev]  [Next →]           │
│                                      │
├──────────────────────────────────────┤
│ Progress: ████████░░░░░░░░ 8/20     │
└──────────────────────────────────────┘
```

**Components:**
- **Header:** Pack name, timer (if enabled), share button
- **Question:** Current question with multiple choice options
- **Navigation:** Prev/Next buttons, or question number grid
- **Progress:** Visual indicator of answered questions

---

### State 3: Timer Warning

When time is running low (< 1 min remaining):

```
┌──────────────────────────────────────┐
│ Computer Architecture    ⏱️ 0:45    │
│                          ↑ RED       │
├──────────────────────────────────────┤
│ ...                                  │
```

Timer turns red and pulses gently.

---

### State 4: Time's Up

When timer reaches zero:

```
┌──────────────────────────────────────┐
│                                      │
│         ⏰ Time's Up!                │
│                                      │
│   You answered 15 of 20 questions   │
│                                      │
│        [View Results]                │
│                                      │
└──────────────────────────────────────┘
```

**Behavior:**
- Modal overlay or replace quiz content
- Auto-submit answered questions
- Optionally allow continuing without timer

---

### State 5: Results

```
┌──────────────────────────────────────┐
│ Results                              │
│ Computer Architecture • seed: 42     │
├──────────────────────────────────────┤
│                                      │
│   Score: 16/20 (80%)                 │
│   ████████████████░░░░               │
│                                      │
│   Time: 12:34 / 15:00                │
│                                      │
├──────────────────────────────────────┤
│ Review Questions                     │
├──────────────────────────────────────┤
│ ✓ Q1. Multiply 1011₂ × 110₂        │
│ ✗ Q2. Convert 0.375 to IEEE 754     │
│   Your answer: A                     │
│   Correct: C                         │
│   [Show Explanation]                 │
│ ✓ Q3. ...                           │
├──────────────────────────────────────┤
│                                      │
│ [Try Again]  [New Quiz]  [Share]     │
│                                      │
└──────────────────────────────────────┘
```

**Features:**
- Score summary with visual bar
- Time taken (if timed)
- Expandable explanations for each question
- Actions: retry same seed, new random quiz, share results

---

## Sharing / Seed UX

### Share Button Behavior

Clicking [Share] copies a URL to clipboard:

```
https://josh.rest/forest?pack=comp-arch&seed=42&q=20&t=15
```

**URL Parameters:**
| Param | Description |
|-------|-------------|
| `pack` | Pack ID |
| `seed` | Random seed for reproducibility |
| `q` | Question count |
| `t` | Time limit in minutes (optional) |

**Toast notification:** "Link copied! Share with classmates 🌲"

---

### Loading from URL

When someone visits a shared link:
1. Auto-populate pack and settings from URL params
2. Show a "Start Quiz" button instead of auto-starting
3. Display: "Quiz shared by a friend • 20 questions • 15 min"

---

## Timer Implementation

### Display Format

| Time Remaining | Display |
|----------------|---------|
| ≥ 1 hour | `1:00:00` |
| ≥ 1 minute | `14:32` |
| < 1 minute | `0:45` (red) |
| < 10 seconds | `0:09` (red, pulsing) |

### Notifications

| Trigger | Action |
|---------|--------|
| 5 min remaining | Subtle pulse on timer |
| 1 min remaining | Timer turns red |
| 10 sec remaining | Timer pulses |
| 0 sec | Modal: "Time's Up!" + auto-submit |

### Timer Persistence

- Timer state saved to localStorage
- Refreshing page resumes quiz with remaining time
- Prevents cheating by reloading

---

## Mobile Considerations

On screens < 900px:

1. **Collapse sidebar** into a bottom sheet or hamburger menu
2. **Full-width quiz** on right panel
3. **Sticky timer** at top of screen
4. **Swipe navigation** between questions

```
┌──────────────────────────────┐
│ ≡  Computer Arch    ⏱️ 14:32 │
├──────────────────────────────┤
│                              │
│ Q1 of 20                     │
│                              │
│ Multiply 1011₂ × 110₂       │
│                              │
│ ○ 100001₂                   │
│ ○ 110010₂                   │
│ ● 1000010₂                  │
│ ○ 1010110₂                  │
│                              │
│    ← swipe to navigate →     │
│                              │
├──────────────────────────────┤
│ ●○○○○○○○○○○○○○○○○○○○ 1/20   │
└──────────────────────────────┘
```

---

## Component Hierarchy

```
ForestFactory/
├── Sidebar/
│   ├── PackSelector
│   ├── GeneratorList
│   │   └── GeneratorCheckbox
│   ├── AddGeneratorModal
│   ├── SettingsPanel
│   │   ├── QuestionCountSelect
│   │   └── TimeLimitSelect
│   └── FactorizeButton
│
├── QuizPanel/
│   ├── EmptyState
│   ├── QuizHeader
│   │   ├── Timer
│   │   └── ShareButton
│   ├── QuestionCard
│   │   └── MultipleChoiceOptions
│   ├── QuizNavigation
│   ├── ProgressBar
│   └── TimesUpModal
│
└── ResultsPanel/
    ├── ScoreSummary
    ├── QuestionReview
    │   └── ExplanationExpander
    └── ActionButtons
```

---

## State Management

```typescript
interface ForestFactoryState {
  // Configuration
  selectedPackId: string | null;
  activeGenerators: string[];
  questionCount: number;
  timeLimitMinutes: number | null;
  
  // Quiz state
  quiz: {
    seed: number;
    questions: Problem[];
    answers: (number | null)[];  // index of selected option per question
    currentIndex: number;
    startedAt: number | null;    // timestamp
    submittedAt: number | null;  // timestamp
  } | null;
  
  // UI state
  phase: 'config' | 'quiz' | 'results';
  showAddGeneratorModal: boolean;
}
```

---

## Backend Architecture

### Directory Structure

```
src/lib/
├── generators/                 # EXISTING - Auto-discovered
│   ├── index.ts               # Auto-discovery + registry
│   ├── types.ts               # Problem, ProblemGenerator interfaces
│   ├── prng.ts                # Seeded RNG utilities
│   ├── binary-*.ts            # Binary arithmetic generators (5)
│   └── law-*.ts               # GDPR/law generators (20+)
│
└── forest-factory/            # NEW
    ├── index.ts               # Public API exports
    ├── types.ts               # Pack interface
    ├── packs.ts               # All pack definitions
    └── generate.ts            # Quiz generation logic
```

### Core Interfaces

```typescript
// src/lib/generators/types.ts (EXISTING)
export interface Problem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ProblemGenerator {
  readonly type: string;           // e.g., "binary-multiplication-no-carry"
  readonly displayName: string;    // e.g., "Binary Multiplication (No Carries)"
  generate(seed: number): Problem;
}

// src/lib/forest-factory/types.ts (NEW)
export interface Pack {
  readonly id: string;             // URL-safe identifier
  readonly name: string;           // Display name
  readonly description: string;    // Short description
  readonly generators: readonly string[];  // Generator type IDs
}
```

### Generator Registry (Existing)

Generators are **auto-discovered** via `import.meta.glob`:

```typescript
// src/lib/generators/index.ts
const modules = import.meta.glob<{ generators: readonly ProblemGenerator[] }>(
  ['./*.ts', '!./index.ts', '!./types.ts', '!./prng.ts'],
  { eager: true },
);

const registry = new Map<string, ProblemGenerator>();

for (const mod of Object.values(modules)) {
  for (const gen of mod.generators) {
    registry.set(gen.type, gen);
  }
}

export function getGenerator(type: string): ProblemGenerator {
  const gen = registry.get(type);
  if (!gen) throw new Error(`Unknown generator: ${type}`);
  return gen;
}

export function listGenerators(): string[] {
  return [...registry.keys()];
}
```

**Implication:** Adding a new generator file automatically registers it. Zero configuration needed.

### Pack Definitions

Packs are **static data** in a single file:

```typescript
// src/lib/forest-factory/packs.ts
export const packs: readonly Pack[] = [
  {
    id: 'comp-arch',
    name: 'Computer Architecture',
    description: 'Binary arithmetic, division, floating point',
    generators: [
      'binary-multiplication-no-carry',
      'binary-multiplication-carry',
      'binary-multiplication-table',
      'binary-division',
      'binary-division-table',
      'floating-point',
    ],
  },
  {
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
      'law-accountability-check',
    ],
  },
  {
    id: 'relations-functions',
    name: 'Relations & Functions',
    description: 'Equivalence relations, partial orders, closures',
    generators: ['algebra-relations-bank'],
  },
] as const;
```

**Why a single file?**
- Packs are just configuration (strings)
- Easy to see all packs at a glance
- No auto-discovery overhead for 5-10 packs
- Simple to maintain

### Category Inference

Categories are **inferred from naming conventions**:

```typescript
// src/lib/forest-factory/index.ts
export function getCategory(generatorType: string): string {
  if (generatorType.startsWith('binary-') || generatorType === 'floating-point') 
    return 'Binary Arithmetic';
  if (generatorType.startsWith('law-')) return 'Law & GDPR';
  if (generatorType.startsWith('algebra-')) return 'Algebra';
  return 'Other';
}

export function listGeneratorsByCategory(): Map<string, string[]> {
  const all = listGenerators();
  const byCategory = new Map<string, string[]>();
  
  for (const type of all) {
    const cat = getCategory(type);
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(type);
  }
  
  return byCategory;
}
```

**Why not add `category` to generator metadata?**
- Naming is already consistent (`binary-*`, `law-*`)
- Zero changes to 28+ existing generator files
- Can enhance later if needed

### Quiz Generation

```typescript
// src/lib/forest-factory/generate.ts
import { getGenerator } from '../generators';
import { mulberry32 } from '../generators/prng';
import type { Problem } from '../generators/types';

export interface GeneratedQuiz {
  seed: number;
  generators: string[];
  questions: Problem[];
}

export function generateMockTest(
  generatorTypes: string[],
  seed: number,
  count: number
): GeneratedQuiz {
  const rng = mulberry32(seed);
  const questions: Problem[] = [];

  for (let i = 0; i < count; i++) {
    // Pick random generator from the list
    const genType = generatorTypes[Math.floor(rng() * generatorTypes.length)];
    const generator = getGenerator(genType);
    
    // Generate question with derived seed
    const questionSeed = Math.floor(rng() * 2147483647);
    questions.push(generator.generate(questionSeed));
  }

  return { seed, generators: generatorTypes, questions };
}
```

**Usage:**

```typescript
// From a pack
const pack = getPack('comp-arch');
const quiz = generateMockTest(pack.generators, 42, 20);

// Custom generator selection
const quiz = generateMockTest(
  ['binary-multiplication-no-carry', 'floating-point'],
  123,
  10
);
```

### Public API

```typescript
// src/lib/forest-factory/index.ts
export { getPack, listPacks } from './packs';
export { getCategory, listGeneratorsByCategory } from './categories';
export { generateMockTest } from './generate';
export type { Pack } from './types';
export type { GeneratedQuiz } from './generate';
```

### Efficiency Considerations

| Aspect | Solution |
|--------|----------|
| **Generator lookup** | O(1) via `Map<string, ProblemGenerator>` |
| **Pack lookup** | O(1) via `Map<string, Pack>` |
| **Category grouping** | Computed once, cached if needed |
| **Bundle size** | Generators already tree-shaken by Astro |
| **Runtime cost** | Packs are just string arrays (< 1KB total) |

### Data Flow

```
User selects pack
       ↓
Pack → List of generator IDs
       ↓
Factorize! clicked
       ↓
generateMockTest(generatorIDs, seed, count)
       ↓
For each question:
  - Pick random generator from list (seeded)
  - Call generator.generate(derivedSeed)
       ↓
Return Problem[] → Display in QuizPanel
```

---

## Implementation Phases

### Phase 1: Core Quiz Flow
- [ ] Pack selection → loads generators
- [ ] Generator toggles
- [ ] Question count selector
- [ ] Factorize! generates quiz
- [ ] Question display with navigation
- [ ] Submit and show results

### Phase 2: Timer
- [ ] Time limit selector
- [ ] Countdown display
- [ ] Warning states (red, pulse)
- [ ] Time's up modal
- [ ] localStorage persistence

### Phase 3: Sharing
- [ ] Generate shareable URL
- [ ] Copy to clipboard with toast
- [ ] Load quiz from URL params
- [ ] "Shared quiz" landing state

### Phase 4: Polish
- [ ] Mobile responsive layout
- [ ] Keyboard navigation
- [ ] Animations/transitions
- [ ] Explanation expandos in results

---

## Open Questions

1. **Question navigation style:** Linear (Prev/Next) vs. Grid (click any question number)?
2. **Partial submit:** Allow submitting before answering all questions?
3. **Retry behavior:** Same seed = same questions, or shuffle order?
4. **Audio notification:** Play sound when time's up?
