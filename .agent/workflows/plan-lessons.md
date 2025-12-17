---
description: Plan a course curriculum from source materials
---

# Plan Course Lessons Workflow

When asked to plan lessons from source material (PDFs, text, links), follow this process to create a coherent and engaging curriculum structure.

## 1. Analyze the Source Material

Thoroughly review the provided source material to understand:
- **Scope & Depth**: How complex is the topic?
- **Key Concepts**: What are the atomic units of knowledge?
- **Dependencies**: Which concepts must be learned before others?
- **Tone**: Is it academic, practical, theoretical?

## 2. Design the Narrative Arc (Coherence)

Before splitting into lessons, determine a strategy to make the course feel coherent.
- **Storytelling**: Can you weave a continuous story or scenario through the lessons? (e.g., "Building a 4-bit CPU from scratch" or "A detective solving data crimes").
- **Project-Based**: Does the learner build something that evolves with each lesson?
- **Thematic Consistency**: Use consistent metaphors or visual themes.

## 3. Create a Detailed Curriculum Plan

Draft a plan that divides the material into digestible lessons. Aim for lessons that take 15-30 minutes to complete.

For the entire course, provide:
- **Course Title**: Catchy and descriptive.
- **Target Audience**: Who is this for?
- **Prerequisites**: What should they know beforehand?
- **Narrative Strategy**: Brief explanation of the unifying theme or story.

For each lesson, provide:
1.  **Order & Title**
2.  **Learning Objectives**: What specific skills/knowledge will the user gain?
3.  **Source Mapping**: Which specific sections/pages of the source material does this cover?
4.  **Narrative Beat**: How does this lesson advance the story or project?
5.  **Key Concepts**: List of technical terms or ideas introduced.
6.  **Proposed Interactivity**: Briefly suggest 1-2 interactive elements (quizzes, simulations) suitable for this content.

## 4. Review and Refine

Present the plan to the user in a structured format (Markdown).
- Ask if the pacing feels right (too fast/slow?).
- Ask if the narrative strategy aligns with their vision.
- **Do not proceed to creating actual lesson content (MDX) until the plan is approved.**

## Example Output Structure

```markdown
# Course Plan: [Topic Name]

## Strategy
We will use a [Story/Project] approach where the learner...

## Curriculum

### Lesson 1: [Title]
- **Goal**: ...
- **Story**: ...
- **Concepts**: ...
- **Source**: Pages 1-5

### Lesson 2: [Title]
...
```
