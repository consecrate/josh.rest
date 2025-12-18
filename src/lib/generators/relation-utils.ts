/**
 * Shared utilities for relation and set theory generators
 */

// Relation type: Array of [row, col] pairs (0-indexed)
export type Relation = [number, number][];

// ============ Matrix Conversion Functions ============

/** Create an n×n boolean matrix from a relation */
export function createMatrix(n: number, relation: Relation): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
  for (const [r, c] of relation) {
    if (r < n && c < n) matrix[r][c] = true;
  }
  return matrix;
}

/** Convert boolean matrix to relation (pairs) */
export function matrixToRelation(matrix: boolean[][]): Relation {
  const relation: Relation = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) relation.push([i, j]);
    }
  }
  return relation;
}

/** Format matrix for LaTeX display */
export function matrixToLatex(matrix: boolean[][]): string {
  const rows = matrix.map((row) => row.map((v) => (v ? '1' : '0')).join(' & '));
  return `\\begin{pmatrix} ${rows.join(' \\\\ ')} \\end{pmatrix}`;
}

/** Format relation as set of pairs (1-indexed for display) */
export function relationToLatex(relation: Relation): string {
  if (relation.length === 0) return '\\emptyset';
  const pairs = relation.map(([r, c]) => `(${r + 1}, ${c + 1})`);
  return `\\{ ${pairs.join(', ')} \\}`;
}

/** Format relation as set of pairs (0-indexed as-is) */
export function relationToLatexZeroIndexed(relation: Relation): string {
  if (relation.length === 0) return '\\emptyset';
  const pairs = relation.map(([r, c]) => `(${r}, ${c})`);
  return `\\{ ${pairs.join(', ')} \\}`;
}

// ============ Property Checkers ============

/** Check if relation is reflexive: ∀i: (i,i) ∈ R */
export function isReflexive(matrix: boolean[][]): boolean {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    if (!matrix[i][i]) return false;
  }
  return true;
}

/** Check if relation is symmetric: (i,j) ∈ R ⟹ (j,i) ∈ R */
export function isSymmetric(matrix: boolean[][]): boolean {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] !== matrix[j][i]) return false;
    }
  }
  return true;
}

/** Check if relation is antisymmetric: (i,j) ∈ R ∧ (j,i) ∈ R ⟹ i = j */
export function isAntisymmetric(matrix: boolean[][]): boolean {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && matrix[i][j] && matrix[j][i]) return false;
    }
  }
  return true;
}

/** Check if relation is transitive: (i,j) ∈ R ∧ (j,k) ∈ R ⟹ (i,k) ∈ R */
export function isTransitive(matrix: boolean[][]): boolean {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j]) {
        for (let k = 0; k < n; k++) {
          if (matrix[j][k] && !matrix[i][k]) return false;
        }
      }
    }
  }
  return true;
}

// ============ Closure Calculators ============

/** Compute reflexive closure: R ∪ {(i,i) | i ∈ A} */
export function reflexiveClosure(matrix: boolean[][]): boolean[][] {
  const n = matrix.length;
  const result = matrix.map((row) => [...row]);
  for (let i = 0; i < n; i++) {
    result[i][i] = true;
  }
  return result;
}

/** Compute symmetric closure: R ∪ R⁻¹ */
export function symmetricClosure(matrix: boolean[][]): boolean[][] {
  const n = matrix.length;
  const result = matrix.map((row) => [...row]);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j]) result[j][i] = true;
    }
  }
  return result;
}

/** Compute transitive closure using Warshall's algorithm */
export function transitiveClosure(matrix: boolean[][]): boolean[][] {
  const n = matrix.length;
  const result = matrix.map((row) => [...row]);
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        result[i][j] = result[i][j] || (result[i][k] && result[k][j]);
      }
    }
  }
  return result;
}

// ============ Boolean Matrix Operations ============

/** Matrix transpose */
export function matrixTranspose(matrix: boolean[][]): boolean[][] {
  const n = matrix.length;
  const m = matrix[0]?.length ?? 0;
  const result: boolean[][] = Array.from({ length: m }, () => Array(n).fill(false));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
}

/** Boolean matrix composition (multiplication): C[i][j] = ∃k: A[i][k] ∧ B[k][j] */
export function matrixCompose(A: boolean[][], B: boolean[][]): boolean[][] {
  const n = A.length;
  const m = B[0]?.length ?? 0;
  const p = B.length;
  const result: boolean[][] = Array.from({ length: n }, () => Array(m).fill(false));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let k = 0; k < p; k++) {
        if (A[i][k] && B[k][j]) {
          result[i][j] = true;
          break;
        }
      }
    }
  }
  return result;
}

/** Boolean matrix union (OR) */
export function matrixUnion(A: boolean[][], B: boolean[][]): boolean[][] {
  const n = A.length;
  const m = A[0]?.length ?? 0;
  return A.map((row, i) => row.map((v, j) => v || B[i][j]));
}

/** Boolean matrix intersection (AND) */
export function matrixIntersection(A: boolean[][], B: boolean[][]): boolean[][] {
  return A.map((row, i) => row.map((v, j) => v && B[i][j]));
}

/** Boolean matrix complement (NOT) */
export function matrixComplement(matrix: boolean[][]): boolean[][] {
  return matrix.map((row) => row.map((v) => !v));
}

// ============ Utility Functions ============

/** Deep clone a matrix */
export function cloneMatrix(matrix: boolean[][]): boolean[][] {
  return matrix.map((row) => [...row]);
}

/** Check matrix equality */
export function matricesEqual(A: boolean[][], B: boolean[][]): boolean {
  if (A.length !== B.length) return false;
  for (let i = 0; i < A.length; i++) {
    if (A[i].length !== B[i].length) return false;
    for (let j = 0; j < A[i].length; j++) {
      if (A[i][j] !== B[i][j]) return false;
    }
  }
  return true;
}

/** Generate a random boolean matrix */
export function randomMatrix(n: number, rng: () => number, density = 0.4): boolean[][] {
  return Array.from({ length: n }, () =>
    Array.from({ length: n }, () => rng() < density)
  );
}

/** Get pairs that differ between two relations */
export function relationDiff(from: Relation, to: Relation): Relation {
  const toSet = new Set(to.map(([r, c]) => `${r},${c}`));
  const fromSet = new Set(from.map(([r, c]) => `${r},${c}`));
  const added: Relation = [];
  for (const key of toSet) {
    if (!fromSet.has(key)) {
      const [r, c] = key.split(',').map(Number);
      added.push([r, c]);
    }
  }
  return added;
}

/** Binomial coefficient C(n, k) */
export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

/** Factorial n! */
export function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/** Permutation P(n, r) = n! / (n-r)! */
export function permutation(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= n - i;
  }
  return result;
}

/** GCD of two numbers */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b > 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** Check if n is prime */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/** Check if n is a perfect square */
export function isPerfectSquare(n: number): boolean {
  if (n < 0) return false;
  const sqrt = Math.sqrt(n);
  return Number.isInteger(sqrt);
}

/** Pick random element from array */
export function pickRandom<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Pick n unique random elements from array */
export function pickRandomN<T>(arr: readonly T[], n: number, rng: () => number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}
