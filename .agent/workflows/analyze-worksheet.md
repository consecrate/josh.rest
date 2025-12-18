# Workflow: Analyze Worksheet & Design Generators

This workflow guides an agent through the process of analyzing a practice worksheet (PDF, MDX, or text) and designing algorithmic generators to replicate its educational value indefinitely.

## Phase 1: Deconstruction & Abstraction

**Goal:** Turn specific static questions into generalizable problem types.

1.  **Read the Source Material:**
    -   Scan every problem in the worksheet.
    -   Identify the "core task" for each problem.
    -   *Example:* "Find the inverse of $f(x)=2x$" $\rightarrow$ Task: "Invert a linear function".

2.  **Categorize by Topic:**
    -   Group problems into clusters (e.g., "Matrix Operations", "Combinatorics", "Definitions").
    -   Map these clusters to standard curriculum sections if available (e.g., "7.2.1 Reflexivity").

3.  **Identify the "Scope of Knowledge":**
    -   **Look beyond the question:** What background knowledge is assumed?
    -   *Example:* If a problem asks "Is $R$ a partial order?", the student must know:
        1.  Definition of Reflexive, Antisymmetric, Transitive.
        2.  How to check these on a matrix/set.
        3.  What "Partial Order" means (the intersection of these properties).
    -   **Spot "Hidden Skills":**
        -   Does the problem require arithmetic? (e.g., Modulo operations).
        -   Does it require visualization? (e.g., Drawing Hasse diagrams).
        -   Does it require specific algorithms? (e.g., Warshall's Algorithm).

## Phase 2: Generator Design

**Goal:** Create specifications for code that generates these problems.

For each identified "Scope of Knowledge" or "Problem Cluster", design a generator using the following template:

### Generator Template

1.  **ID:** `topic-subtopic-variant` (e.g., `relation-matrix-properties`).
2.  **Scope:** explicitly link back to the worksheet problems (e.g., "Covers Problems 12, 15").
3.  **Description:** One sentence summary of what the user sees.
4.  **Algorithm:**
    -   **Inputs:** What is randomized? (e.g., "Matrix size $N$, density $D$").
    -   **Logic:** How is the answer derived? (e.g., "Compute $M \times M$ using boolean logic").
    -   **Constraints:** How do we ensure quality? (e.g., "Ensure matrix is not empty", "Ensure answer is not 'None of the above'").
5.  **Example:**
    -   **Question:** (Sample output text).
    -   **Answer:** (Sample correct answer).

## Phase 3: Gap Analysis & "Brainstorming"

**Goal:** Ensure the generators cover the *entire* testable surface area, not just what was on the specific worksheet.

1.  **Invert the Problem:**
    -   If the worksheet asks "Is $R$ symmetric?", add a generator for "Make $R$ symmetric" (Closure).
2.  **Change the Representation:**
    -   If the worksheet uses Sets ($\{(1,2)\}$), add a generator for Matrices ($M_{ij}$) or Digraphs.
3.  **Generalize the Domain:**
    -   If the worksheet uses Integers ($\mathbb{Z}$), can we use Bit Strings? Polynomials? Matrices?
4.  **Add "Meta" Questions:**
    -   Counting questions ("How many...?").
    -   Definition checking ("Which property is defined as...?").

## Phase 4: Output Format

Produce a design document (Markdown) containing:

1.  **Summary:** High-level list of generators.
2.  **Detailed Designs:** The filled-out templates from Phase 2.
3.  **Implementation Plan:** Suggested order of building (Primitives $\rightarrow$ Complex Generators).

## Example Prompt to Trigger This Workflow

> "@worksheet.pdf Analyze this worksheet and design a suite of generators to prepare a student for a test on this material. Be sure to identify hidden skills and scope."
