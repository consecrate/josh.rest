Looking at your request, I need to understand:

1. **The desired structure**: A sidebar like Cursor's learn page with course sections, numbered lessons, and "Coming Soon" indicators
2. **Programmatic generation**: Based on content/post structure
3. **Current codebase**: How you're already organizing content

Let me explore your current project structure to give you the best architecture advice:

[5 tools called]

Now I have a clear picture. Let me outline the architecture for your `/courses` feature with a programmatically-generated sidebar.

---

## Architecture Recommendation

### Core Components

Based on the Cursor sidebar you showed, you need:

1. **Course sections** (e.g., "AI Foundations", "Coming Soon")
2. **Numbered lessons** within each section
3. **Status indicators** (active, available, coming soon)
4. **Current lesson highlighting**

---

### Approach 1: Folder-Based Structure (Recommended)

This leverages the filesystem to define course hierarchy:

```
src/content/
├── posts/                    # Your existing blog posts
└── courses/
    └── ai-foundations/       # Course folder
        ├── _meta.json        # Course metadata
        ├── 01-how-ai-models-work.mdx
        ├── 02-hallucinations.mdx
        ├── 03-tokens-and-pricing.mdx
        └── ...
```

**`_meta.json`** defines course-level info:

```json
{
  "title": "AI Foundations",
  "order": 1,
  "comingSoon": false
}
```

**Lesson frontmatter**:

```yaml
---
title: "How AI Models Work"
description: "..."
order: 1
comingSoon: false
---
```

---

### Content Collection Schema

Update `src/content.config.ts`:

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/courses" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    comingSoon: z.boolean().default(false),
  }),
});

export const collections = { posts, courses };
```

---

### Page Structure

```
src/pages/
├── index.astro
├── posts/[...slug].astro
└── courses/
    ├── index.astro              # Course listing or redirect
    └── [...slug].astro          # Individual lesson with sidebar
```

---

### Sidebar Generation Logic

The key insight: Astro's `getCollection()` returns entries with an `id` that includes the folder path. For `courses/ai-foundations/01-intro.mdx`, the `id` is `ai-foundations/01-intro`.

**Utility function** (`src/lib/courses.ts`):

```typescript
import { getCollection, type CollectionEntry } from "astro:content";

export interface CourseSection {
  slug: string;
  title: string;
  order: number;
  comingSoon: boolean;
  lessons: CollectionEntry<"courses">[];
}

export async function getCourseStructure(): Promise<CourseSection[]> {
  const lessons = await getCollection("courses");

  // Group by course folder (first segment of id)
  const grouped = lessons.reduce((acc, lesson) => {
    const courseSlug = lesson.id.split("/")[0];
    if (!acc[courseSlug]) acc[courseSlug] = [];
    acc[courseSlug].push(lesson);
    return acc;
  }, {} as Record<string, CollectionEntry<"courses">[]>);

  // Build sections (you'd load _meta.json or derive from first lesson)
  const sections: CourseSection[] = Object.entries(grouped).map(
    ([slug, lessons]) => ({
      slug,
      title: formatTitle(slug), // "ai-foundations" → "AI Foundations"
      order: 1, // Load from _meta.json or first lesson
      comingSoon: false,
      lessons: lessons.sort((a, b) => a.data.order - b.data.order),
    })
  );

  return sections.sort((a, b) => a.order - b.order);
}

function formatTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
```

---

### Sidebar Component

**`src/components/CourseSidebar.astro`**:

```astro
---
import type { CourseSection } from '../lib/courses';

interface Props {
  sections: CourseSection[];
  currentSlug?: string;
}

const { sections, currentSlug } = Astro.props;
---

<nav class="course-sidebar">
  {sections.map((section, sectionIndex) => (
    <div class="section">
      <h3 class:list={['section-title', { 'coming-soon': section.comingSoon }]}>
        {section.comingSoon ? 'Coming Soon' : section.title}
      </h3>
      <ol class="lesson-list">
        {section.lessons.map((lesson) => {
          const isActive = lesson.id === currentSlug;
          const href = `/courses/${lesson.id}`;
          return (
            <li class:list={['lesson', { active: isActive, disabled: lesson.data.comingSoon }]}>
              {lesson.data.comingSoon ? (
                <span class="lesson-link disabled">{lesson.data.title}</span>
              ) : (
                <a href={href} class:list={['lesson-link', { active: isActive }]}>
                  {lesson.data.title}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  ))}
</nav>
```

---

### Course Lesson Page

**`src/pages/courses/[...slug].astro`**:

```astro
---
import { getCollection } from 'astro:content';
import { getCourseStructure } from '../../lib/courses';
import Base from '../../layouts/Base.astro';
import CourseSidebar from '../../components/CourseSidebar.astro';

export async function getStaticPaths() {
  const lessons = await getCollection('courses');
  return lessons
    .filter(l => !l.data.comingSoon)
    .map(lesson => ({
      params: { slug: lesson.id },
      props: { lesson },
    }));
}

const { lesson } = Astro.props;
const sections = await getCourseStructure();
const { Content } = await lesson.render();
---

<Base title={lesson.data.title}>
  <div class="course-layout">
    <CourseSidebar sections={sections} currentSlug={lesson.id} />
    <main class="course-content">
      <h1>{lesson.data.title}</h1>
      <Content />
    </main>
  </div>
</Base>
```

---

### Alternative: Frontmatter-Only Approach

If you want everything in frontmatter (no folders):

```yaml
---
title: "How AI Models Work"
course: "ai-foundations"
courseTitle: "AI Foundations"
courseOrder: 1
lessonOrder: 1
comingSoon: false
---
```

This is simpler but less organized on the filesystem.

---

## Summary

| Aspect           | Recommendation                                         |
| ---------------- | ------------------------------------------------------ |
| **Structure**    | Folder-based: `courses/{course-slug}/{lesson}.mdx`     |
| **Collection**   | Separate `courses` collection in `content.config.ts`   |
| **Sidebar data** | Build from `getCollection('courses')`, group by folder |
| **Routing**      | `pages/courses/[...slug].astro` with catch-all         |
| **Component**    | `<CourseSidebar>` that takes sections + currentSlug    |
| **Styling**      | CSS following your existing design system              |

### Pros of This Architecture:

1. **Zero config**: Filesystem = course structure
2. **Type-safe**: Astro validates frontmatter via Zod
3. **Fast**: All static, no runtime JS for sidebar
4. **Scalable**: Add courses by adding folders
5. **Matches your stack**: Pure Astro, no extra dependencies
