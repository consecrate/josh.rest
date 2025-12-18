# Relations & Functions Generator Design

Based on `src/content/courses/algebra/02-relations-worksheet.mdx` and the standard curriculum topics (Reflexive, Symmetric, Transitive, Equivalence, etc.), here are the designs for a suite of generators.

## 1. Generator: Finite Relation Properties (`relation-finite-properties`)

**Topic:** 7.1.1, 7.2.1, 7.2.2, 7.2.3
**Description:** Generates a random relation on a small set (e.g., $A=\{1,2,3\}$) presented as either a list of pairs, a matrix, or a digraph. User identifies properties.

### Algorithm
1.  **Setup:** Set size $n=3$ or $4$. Elements $\{1, ..., n\}$.
2.  **Generation:**
    -   Randomly decide desired properties (e.g., "Make it Reflexive but not Symmetric").
    -   Construct the boolean matrix $M$.
    -   *Or* randomly fill matrix and calculate properties.
3.  **Question Formats:**
    -   "Which properties does this relation satisfy?" (Multi-select style, but mapped to single correct combination option).
    -   "Is this relation Reflexive?" (Yes/No).
    -   "Which pair is missing to make it Transitive?"
4.  **Distractors:**
    -   Combinations of wrong properties.
    -   For "missing pair": pairs that don't fix the property or are already there.

### Example
**Question:** Consider $R$ on $\{1,2,3\}$ given by $M = \begin{pmatrix} 1 & 1 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$. Which property fails?
**Options:**
A) Reflexive
B) Symmetric
C) Antisymmetric
D) Transitive
**Correct:** B (Since $m_{12}=1$ but $m_{21}=0$).

---

## 2. Generator: Infinite Relation Properties (`relation-infinite-properties`)

**Topic:** 7.1.2, 7.2.1-7.2.3
**Description:** Selects from a pool of standard mathematical relations on sets like $\mathbb{Z}, \mathbb{R}, \mathbb{Z}^+, \mathcal{P}(S)$.

### Pool of Relations
-   $=$ (Equality)
-   $\le, <, \ge, >$ (Orderings)
-   $|$ (Divisibility on $\mathbb{Z}$ or $\mathbb{Z}^+$)
-   $\subseteq$ (Subset on Power set)
-   $\equiv (\mod n)$ (Congruence)
-   $\perp$ (Perpendicular lines)
-   $||$ (Parallel lines)
-   $x^2 + y^2 = 1$ (Unit circle)
-   Matrix Similarity ($A = PBP^{-1}$)

### Algorithm
1.  Pick a relation $R$ and a set $S$ from the pool.
2.  Compute its properties (pre-defined or logic-based).
3.  **Question:** "Is the relation $x R y$ on set $S$ symmetric?" or "Which property does it fail?"

### Example
**Question:** Let $R$ be the relation on $\mathbb{Z}$ defined by $x R y \iff x \le y$. Is $R$ symmetric?
**Answer:** No. (Counter-example: $2 \le 3$ is true, but $3 \le 2$ is false).

---

## 3. Generator: Closure Calculator (`relation-closures`)

**Topic:** 7.1.5 (Closures)
**Description:** Given a small finite relation, find the Reflexive, Symmetric, or Transitive closure.

### Algorithm
1.  Generate a small relation $R$ on $\{1,2,3,4\}$.
2.  Select target closure type (Reflexive, Symmetric, Transitive).
3.  Compute the closure $R^*$.
4.  **Question:** "Which pair(s) must be added to $R = \{...\}$ to make it [Symmetric]?"
5.  **Options:**
    -   Correct set of missing pairs.
    -   Sets with missing pairs or extra pairs.
    -   Sets that make it Reflexive instead of Symmetric.

### Example
**Question:** $R = \{(1,2), (2,3)\}$ on $\{1,2,3\}$. What is the **Transitive closure**?
**Answer:** Add $(1,3)$. Result: $\{(1,2), (2,3), (1,3)\}$.

---

## 4. Generator: Relation Operations (`relation-operations`)

**Topic:** 7.1.5, 7.1.3 (Domain/Range)
**Description:** Given two relations $R$ and $S$, perform Union, Intersection, Inverse, Composition.

### Algorithm
1.  Generate two small relations $R, S$.
2.  Select operation: $R \cup S$, $R \cap S$, $R^{-1}$, $S \circ R$.
3.  Compute result.
4.  **Question:** "Find $S \circ R$." or "Find the domain of $R^{-1}$."

### Example
**Question:** $R = \{(1,2)\}, S = \{(2,3)\}$. Find $S \circ R$.
**Answer:** $\{(1,3)\}$. (Since $1 \to 2$ in $R$, and $2 \to 3$ in $S$).

---

## 5. Generator: Equivalence Class Finder (`equivalence-classes`)

**Topic:** 7.2.6, 7.2.7, 7.2.8
**Description:** Focus on "Integers Modulo n" and "Bit string length" type relations.

### Algorithm
1.  **Scenario A (Modulo):** Fix $n$ (e.g., 5). Ask for the equivalence class of $x$ (e.g., $[12]_5$).
    -   Answer: $[2]_5$ or $\{..., -3, 2, 7, ...\}$.
2.  **Scenario B (Bit Strings):** Relation "Same number of 1s". Ask for size of class $[110]$ in strings of length 4.
    -   Answer: "How many strings of length 4 have exactly two 1s?" $\binom{4}{2} = 6$.
3.  **Scenario C (Functions):** Relation $f(x) = f(y)$. Class of $x$ is $f^{-1}(\{f(x)\})$.

### Example
**Question:** In $\mathbb{Z}_{12}$, what is the equivalence class of 27?
**Answer:** $[3]$. (Since $27 \equiv 3 \pmod{12}$).

---

## 6. Generator: Hasse Diagram Interpreter (`hasse-diagram-check`)

**Topic:** Partial Orders
**Description:** Text-based questions about a Hasse diagram structure (or generating SVG if possible, but text is safer for now).

### Algorithm
1.  Define a partial order (e.g., Divisibility on $\{1, 2, 3, 6\}$).
2.  **Question:** "In the Hasse diagram for divisibility on this set, does an edge exist directly from 1 to 6?"
3.  **Answer:** No (because $1 \to 2 \to 6$ and $1 \to 3 \to 6$ exist, so the direct line is redundant).

---

## 7. Generator: Function Properties (`function-properties`)

**Topic:** 7.1.7
**Description:** Functions as relations. Invertibility, Injective, Surjective.

### Algorithm
1.  Select a function $f: A \to B$. (Finite map or standard calculus function).
2.  **Question:** "Is $f$ injective (one-to-one)?" or "Find $f^{-1}(y)$."

### Example
**Question:** $f: \mathbb{Z} \to \mathbb{Z}, f(n) = 2n$. Is $f$ onto (surjective)?
**Answer:** No. (Odd integers are never mapped to).

---

## 8. Generator: Relation Counting (`relation-counting`)

**Topic:** 7.1.1
**Description:** Combinatorics questions about relations.

### Algorithm
1.  **Question Types:**
    -   "How many relations are there on a set of size $n$?" ($2^{n^2}$)
    -   "How many reflexive relations on a set of size $n$?" ($2^{n^2 - n}$)
    -   "How many symmetric relations?" ($2^{n(n+1)/2}$)
    -   "How many relations from $A$ ($m$ elements) to $B$ ($n$ elements)?" ($2^{mn}$)

### Example
**Question:** Set $A$ has 4 elements. How many relations on $A$ are **Reflexive**?
**Derivation:** Total pairs = 16. Diagonal pairs = 4. Reflexive means diagonal is fixed (all present). We have choice for the remaining $16-4=12$ pairs.
**Answer:** $2^{12} = 4096$.

---

## 9. Generator: Cartesian Product (`cartesian-product`)

**Topic:** 7.1.1
**Description:** Basic definition of Cartesian products.

### Algorithm
1.  Define sets $A$ and $B$.
2.  **Question:** "What is the size of $A \times B$?" or "Which element is in $A \times B$?"

---

## 10. Generator: Boolean Matrix Arithmetic (`matrix-boolean-algebra`)

**Scope:** Problem 13 ($R^2$, $\overline{R}$).
**Description:** Focus on the mechanics of Boolean Matrix Multiplication (row $\times$ column with OR/AND logic).

### Algorithm
1.  **Input:** Two $3 \times 3$ boolean matrices $A$ and $B$.
2.  **Task:** Calculate $A \odot B$ (Composition), $A^T$ (Inverse), or $A \lor B$ (Union).
3.  **Trick:** Ask for a specific entry like "What is the value at row 2, column 3 of $M_{R^2}$?" to prevent guessing.

### Example
**Question:** Given $M_R = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$, find $(M_R)^2$.
**Answer:** Identity matrix $\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$.

---

## 11. Generator: Poset Anatomy (`poset-elements`)

**Scope:** Problems 12, 25, 28 (Partial Orders).
**Description:** Identify special elements in a Partial Order.

### Algorithm
1.  **Input:** A Hasse diagram (image or described edges) or a set with divisibility rules.
2.  **Task:** Identify:
    -   **Maximal/Minimal elements** (nothing above/below).
    -   **Greatest/Least elements** (unique max/min).
    -   **Upper/Lower Bounds** of a subset.
    -   **Least Upper Bound (LUB)** / **Greatest Lower Bound (GLB)**.

### Example
**Question:** In the divisibility poset for $\{2, 3, 4, 6, 12\}$, what is the Least Upper Bound (LUB) of $\{2, 3\}$?
**Answer:** 6. (Common upper bounds are 6, 12. Least is 6).

---

## 12. Generator: Set Builder & Filters (`set-theory-filters`)

**Scope:** Problem 9 (Reading complex set notation).
**Description:** Filters elements from a universe based on predicates.

### Algorithm
1.  **Generation:** Define a universe $U = \{1, ..., 50\}$. Define predicates $P(x)$ (e.g., "divisible by 4") and $Q(x)$ (e.g., "perfect square").
2.  **Task:** List elements of $A = \{x \mid P(x)\}$ or calculate $|A \cap B|$.

### Example
**Question:** Let $A = \{x \in \{1..20\} \mid x \text{ is prime}\}$. Let $B = \{x \mid x \equiv 1 \pmod 4\}$. Find $A \cap B$.
**Answer:** $\{5, 13, 17\}$.

---

## 13. Generator: Discrete Combinatorics (`discrete-counting`)

**Scope:** Problem 22b, Problem 2.
**Description:** Counting problems related to relations and strings.

### Algorithm
1.  **Task:**
    -   "How many symmetric relations on a set of size 5?"
    -   "How many bit strings of length 8 have weight 3?"
    -   "How many functions from $A$ to $B$ are injective?"

### Example
**Question:** How many bit strings of length 5 have exactly two 1s?
**Answer:** $\binom{5}{2} = 10$.

---

## 14. Generator: Warshall's Algorithm Tracer (`warshall-step`)

**Scope:** Problem 19 (Warshall's algorithm).
**Description:** Trace specific steps of the Transitive Closure algorithm.

### Algorithm
1.  **Input:** Initial matrix $M_0$.
2.  **Task:** "After processing column 2 (k=2), which 0 changes to a 1?" or "Show the matrix $W_2$."

### Example
**Question:** Matrix $M = \begin{pmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{pmatrix}$. After allowing paths through node 2 ($W_2$), does $1 \to 3$ become possible?
**Answer:** Yes. (Path $1 \to 2 \to 3$ is formed).

---

## Implementation Plan

1.  **Shared Helpers:**
    -   `Matrix` class or utilities for boolean matrix operations (multiply, transpose, closure).
    -   `Relation` type (Set of pairs).
2.  **Generators:**
    -   Implement `relation-finite-properties` first (covers most basic needs).
    -   Implement `equivalence-classes` (high value for modulo arithmetic).
    -   Implement `relation-operations` (good for procedural practice).
