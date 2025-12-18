# Relations & Functions Pack - Implementation Documentation

This document describes the implementation of generators for the Relations & Functions pack in Forest Factory.

## Overview

- **Pack ID:** `discrete-math-relations`
- **Total Generators:** 14 files containing 42 individual generator types
- **Focus:** Relations, functions, equivalence, partial orders, counting

---

## Shared Utilities

**File:** `src/lib/generators/relation-utils.ts`

Common functions used across generators:

### Type Definitions
- `Relation` - Array of `[number, number]` pairs

### Matrix Conversion
- `createMatrix(n, relation)` - Convert relation to boolean matrix
- `matrixToRelation(matrix)` - Convert matrix to relation
- `matrixToLatex(matrix)` - Format matrix for LaTeX display
- `relationToLatex(relation)` - Format relation as set of pairs (1-indexed)

### Property Checkers
- `isReflexive(matrix)` - ∀a: (a,a) ∈ R
- `isSymmetric(matrix)` - (a,b) ∈ R ⟹ (b,a) ∈ R
- `isAntisymmetric(matrix)` - (a,b) ∈ R ∧ (b,a) ∈ R ⟹ a = b
- `isTransitive(matrix)` - (a,b) ∈ R ∧ (b,c) ∈ R ⟹ (a,c) ∈ R

### Closure Calculators
- `reflexiveClosure(matrix)` - R ∪ {(a,a)}
- `symmetricClosure(matrix)` - R ∪ R⁻¹
- `transitiveClosure(matrix)` - Warshall's algorithm

### Boolean Matrix Operations
- `matrixTranspose(matrix)`
- `matrixCompose(A, B)` - Boolean multiplication
- `matrixUnion(A, B)` - OR
- `matrixIntersection(A, B)` - AND
- `matrixComplement(matrix)` - NOT

### Combinatorics
- `binomial(n, k)` - C(n,k)
- `factorial(n)` - n!
- `permutation(n, r)` - P(n,r)

---

## Generator Files

### 1. relation-finite-properties.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `relation-properties-which` - Which properties does this relation satisfy?
- `relation-properties-is` - Is this relation [Property]?
- `relation-properties-fails` - Which property fails?

**Example:**
> Given matrix M_R = [[1,0,1],[0,1,0],[1,0,1]], which properties does R satisfy?
> A: Reflexive, Symmetric

---

### 2. relation-infinite-properties.ts

**Type:** POOL-BASED  
**Generators:**
- `relation-infinite-properties` - Properties of named relations (equality, ≤, |, etc.)
- `relation-is-equivalence` - Is it an equivalence relation?
- `relation-is-partial-order` - Is it a partial order?

**Example:**
> Is the relation "x ≤ y" on ℤ reflexive?
> A: Yes

---

### 3. relation-closures.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `relation-closure-pairs` - Which pairs must be added for closure?
- `relation-closure-result` - What is the closure of R?

**Example:**
> Given R = {(1,2), (2,3)}, which pairs must be added for transitive closure?
> A: {(1,3)}

---

### 4. relation-operations.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `relation-operations` - Compute R ∪ S, R ∩ S, R⁻¹, S ∘ R

**Example:**
> Find R⁻¹ where R = {(1,2), (2,3)}
> A: {(2,1), (3,2)}

---

### 5. equivalence-classes.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `equivalence-class-modulo` - What is [x] in ℤₙ?
- `equivalence-class-bitstring` - How many strings with k ones?
- `equivalence-class-count` - How many equivalence classes?

**Example:**
> What is [17] in ℤ₅?
> A: [2]

---

### 6. hasse-diagram-check.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `hasse-edge-exists` - Is there a direct edge from a to b?
- `hasse-immediate-elements` - Elements immediately above/below x?
- `hasse-minmax-elements` - Minimal/maximal elements?

**Example:**
> In divisibility on {1,2,3,6}, is there a direct edge from 2 to 6?
> A: Yes

---

### 7. function-properties.ts

**Type:** POOL-BASED  
**Generators:**
- `function-properties` - Is f injective/surjective/bijective?
- `function-classify` - Classify the function type

**Example:**
> Is f(x) = x² from ℝ to ℝ injective?
> A: No (f(-2) = f(2) = 4)

---

### 8. relation-counting.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `relation-counting` - Count relations (2^n², etc.)
- `relation-counting-formula` - What's the formula for...?

**Example:**
> How many reflexive relations on a set with 3 elements?
> A: 2^(9-3) = 64

---

### 9. cartesian-product.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `cartesian-product-size` - What is |A × B|?
- `cartesian-product-membership` - Is (x,y) ∈ A × B?
- `cartesian-product-element` - Which is an element of A × B?
- `cartesian-product-properties` - True/false properties

**Example:**
> Let A = {1,2,3}, B = {a,b}. What is |A × B|?
> A: 6

---

### 10. matrix-boolean-algebra.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `matrix-boolean-entry` - Entry at (i,j) of A ⊙ B?
- `matrix-boolean-result` - Compute A^T, A ∨ B
- `matrix-boolean-property` - True/false properties

**Example:**
> What is entry (1,2) of A²?
> A: 1

---

### 11. poset-elements.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `poset-minmax` - Minimal/maximal elements
- `poset-greatest-least` - Greatest/least element
- `poset-bounds` - LUB/GLB of a subset

**Example:**
> In divisibility on {1,2,3,4,6,12}, what is the LUB of {2,3}?
> A: 6

---

### 12. set-theory-filters.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `set-list-elements` - List elements of {x | P(x)}
- `set-intersection-size` - Find |A ∩ B|
- `set-complement` - Find complement of A

**Example:**
> List primes in {1,...,20}
> A: {2, 3, 5, 7, 11, 13, 17, 19}

---

### 13. discrete-counting.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `counting-bitstring-weight` - Bit strings with k ones
- `counting-injective-functions` - Injective function count
- `counting-total-functions` - Total function count
- `counting-symmetric-relations` - Symmetric relation count
- `counting-binomial` - Compute C(n,k)
- `counting-permutation` - Compute P(n,r)

**Example:**
> How many injective functions from {1,2} to {a,b,c}?
> A: P(3,2) = 6

---

### 14. warshall-step.ts

**Type:** PROGRAMMATIC  
**Generators:**
- `warshall-entry-change` - Which entry changes at step k?
- `warshall-matrix-step` - What is W_k?
- `warshall-concept` - Conceptual questions

**Example:**
> After processing node 1, which entry changes from 0 to 1?
> A: (2, 3)

---

## Generator Summary

| File | Type | Generators |
|------|------|------------|
| relation-finite-properties | PROGRAMMATIC | 3 |
| relation-infinite-properties | POOL-BASED | 3 |
| relation-closures | PROGRAMMATIC | 2 |
| relation-operations | PROGRAMMATIC | 1 |
| equivalence-classes | PROGRAMMATIC | 3 |
| hasse-diagram-check | PROGRAMMATIC | 3 |
| function-properties | POOL-BASED | 2 |
| relation-counting | PROGRAMMATIC | 2 |
| cartesian-product | PROGRAMMATIC | 4 |
| matrix-boolean-algebra | PROGRAMMATIC | 3 |
| poset-elements | PROGRAMMATIC | 3 |
| set-theory-filters | PROGRAMMATIC | 3 |
| discrete-counting | PROGRAMMATIC | 6 |
| warshall-step | PROGRAMMATIC | 3 |
| **Total** | | **41** |

**Summary:** 12 PROGRAMMATIC files, 2 POOL-BASED files, 41 generator types total.

---

## Usage

The pack is registered as `discrete-math-relations` in `src/lib/forest-factory/packs.ts`.

All generators follow the standard pattern:
- Export `generators` array with `ProblemGenerator` objects
- Each generator has `type`, `displayName`, and `generate(seed)` method
- Uses seeded RNG (`mulberry32`) for deterministic generation
