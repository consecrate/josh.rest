import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed } from './prng';
import { pickRandom } from './relation-utils';

interface InfiniteRelation {
  name: string;
  set: string;
  notation: string;
  props: {
    reflexive: boolean;
    symmetric: boolean;
    antisymmetric: boolean;
    transitive: boolean;
  };
  notes?: string;
}

const RELATIONS: InfiniteRelation[] = [
  // --- Number Theory ---
  {
    name: 'Equality',
    set: 'ℤ',
    notation: 'x = y',
    props: { reflexive: true, symmetric: true, antisymmetric: true, transitive: true },
    notes: 'The identity relation',
  },
  {
    name: 'Inequality',
    set: 'ℤ',
    notation: 'x \\neq y',
    props: { reflexive: false, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'Symmetric but not transitive (1≠2, 2≠1, but 1=1)',
  },
  {
    name: 'Less than',
    set: 'ℝ',
    notation: 'x < y',
    props: { reflexive: false, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Strict order: irreflexive and asymmetric',
  },
  {
    name: 'Less or equal',
    set: 'ℤ',
    notation: 'x \\le y',
    props: { reflexive: true, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'A total (linear) order',
  },
  {
    name: 'Greater than',
    set: 'ℝ',
    notation: 'x > y',
    props: { reflexive: false, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Strict order',
  },
  {
    name: 'Divisibility',
    set: 'ℤ⁺',
    notation: 'x \\mid y',
    props: { reflexive: true, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Partial order on positive integers',
  },
  {
    name: 'Congruence mod n',
    set: 'ℤ',
    notation: 'x \\equiv y \\pmod n',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Classic equivalence relation',
  },
  {
    name: 'Coprime',
    set: 'ℤ⁺',
    notation: '\\gcd(x, y) = 1',
    props: { reflexive: false, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'Only 1 is coprime to itself; not transitive',
  },
  {
    name: 'Same Parity',
    set: 'ℤ',
    notation: 'x \\equiv y \\pmod 2',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation',
  },
  {
    name: 'Absolute Value Equality',
    set: 'ℝ',
    notation: '|x| = |y|',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation (x = ±y)',
  },
  {
    name: 'Diff is Multiple of k',
    set: 'ℤ',
    notation: 'k \\mid (x - y)',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Same as congruence mod k',
  },
  {
    name: 'Unit Distance',
    set: 'ℝ',
    notation: '|x - y| = 1',
    props: { reflexive: false, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'Not transitive',
  },
  {
    name: 'Sum is Even',
    set: 'ℤ',
    notation: 'x + y \\text{ is even}',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalent to same parity',
  },
  {
    name: 'Product is Odd',
    set: 'ℤ',
    notation: 'xy \\text{ is odd}',
    props: { reflexive: false, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Only true if BOTH are odd; false for evens',
  },
  {
    name: 'Divides Square',
    set: 'ℤ⁺',
    notation: 'x \\mid y^2',
    props: { reflexive: true, symmetric: false, antisymmetric: false, transitive: false },
    notes: 'Transitivity fails (8|16, 4|4, but 8∤4)',
  },
  {
    name: 'Share Common Factor',
    set: 'ℤ⁺',
    notation: '\\gcd(x, y) > 1',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'Reflexive for x>1; Not transitive (2,6,3)',
  },

  // --- Set Theory (Power Set) ---
  {
    name: 'Subset',
    set: '𝒫(S)',
    notation: 'A \\subseteq B',
    props: { reflexive: true, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Partial order on power set',
  },
  {
    name: 'Proper Subset',
    set: '𝒫(S)',
    notation: 'A \\subset B',
    props: { reflexive: false, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Strict partial order',
  },
  {
    name: 'Superset',
    set: '𝒫(S)',
    notation: 'A \\supseteq B',
    props: { reflexive: true, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Partial order',
  },
  {
    name: 'Disjoint',
    set: '𝒫(S)',
    notation: 'A \\cap B = \\emptyset',
    props: { reflexive: false, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'Reflexive only for empty set',
  },
  {
    name: 'Non-empty Intersection',
    set: '𝒫(S)',
    notation: 'A \\cap B \\neq \\emptyset',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'Reflexive for non-empty sets; Not transitive',
  },
  {
    name: 'Same Cardinality',
    set: 'Finite Sets',
    notation: '|A| = |B|',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation',
  },

  // --- Graph Theory ---
  {
    name: 'Adjacency',
    set: 'Vertices (Undirected)',
    notation: 'u \\sim v',
    props: { reflexive: false, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'Edges in simple graph (no loops)',
  },
  {
    name: 'Reachability',
    set: 'Vertices (DAG)',
    notation: 'u \\to^* v',
    props: { reflexive: true, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Partial order in a Directed Acyclic Graph',
  },
  {
    name: 'Reachability',
    set: 'Vertices (General)',
    notation: 'u \\to^* v',
    props: { reflexive: true, symmetric: false, antisymmetric: false, transitive: true },
    notes: 'Preorder; Symmetric iff strongly connected',
  },
  {
    name: 'Path Exists',
    set: 'Vertices (Undirected)',
    notation: '\\text{path}(u, v)',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation (Connected Components)',
  },
  {
    name: 'Isomorphism',
    set: 'Graph Set',
    notation: 'G_1 \\cong G_2',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation',
  },

  // --- Geometry ---
  {
    name: 'Perpendicular',
    set: 'Lines in Plane',
    notation: 'L_1 \\perp L_2',
    props: { reflexive: false, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'L1⊥L2 and L2⊥L3 implies L1∥L3',
  },
  {
    name: 'Parallel',
    set: 'Lines in Plane',
    notation: 'L_1 \\parallel L_2',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation (assuming L∥L)',
  },
  {
    name: 'Congruence',
    set: 'Triangles',
    notation: 'T_1 \\cong T_2',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation',
  },
  {
    name: 'Similarity',
    set: 'Triangles',
    notation: 'T_1 \\sim T_2',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation',
  },

  // --- Linear Algebra ---
  {
    name: 'Matrix Similarity',
    set: 'M_{n \\times n}',
    notation: 'A \\sim B',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'A = PBP⁻¹',
  },
  {
    name: 'Row Equivalence',
    set: 'M_{m \\times n}',
    notation: 'A \\sim_R B',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Same reduced row echelon form',
  },
  {
    name: 'Orthogonal',
    set: 'Vectors',
    notation: 'u \\cdot v = 0',
    props: { reflexive: false, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'Reflexive only for zero vector',
  },
  {
    name: 'Linear Dependence',
    set: 'Vectors',
    notation: '\\{u, v\\} \\text{ dep.}',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: false },
    notes: 'u,w dep implies u,w collinear? Not transitive (u=i, v=0, w=j)',
  },

  // --- Strings / CS ---
  {
    name: 'Prefix',
    set: 'Strings',
    notation: 'x \\text{ starts } y',
    props: { reflexive: true, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Partial order',
  },
  {
    name: 'Suffix',
    set: 'Strings',
    notation: 'x \\text{ ends } y',
    props: { reflexive: true, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Partial order',
  },
  {
    name: 'Substring',
    set: 'Strings',
    notation: 'x \\subseteq y',
    props: { reflexive: true, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Partial order',
  },
  {
    name: 'Same Length',
    set: 'Strings',
    notation: '|x| = |y|',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation',
  },
  {
    name: 'Lexicographic Order',
    set: 'Strings',
    notation: 'x \\le_{lex} y',
    props: { reflexive: true, symmetric: false, antisymmetric: true, transitive: true },
    notes: 'Total order (dictionary order)',
  },
  {
    name: 'Anagram',
    set: 'Strings',
    notation: 'sort(x) = sort(y)',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation (permutation)',
  },

  // --- Logic ---
  {
    name: 'Logical Equivalence',
    set: 'Propositions',
    notation: 'p \\iff q',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation',
  },
  {
    name: 'Implication',
    set: 'Propositions',
    notation: 'p \\implies q',
    props: { reflexive: true, symmetric: false, antisymmetric: false, transitive: true },
    notes: 'Preorder (Reflexive, Transitive)',
  },
  
  // --- Functions ---
  {
    name: 'Big-O',
    set: 'Functions',
    notation: 'f = O(g)',
    props: { reflexive: true, symmetric: false, antisymmetric: false, transitive: true },
    notes: 'Preorder (not antisymmetric: f=2g, g=f)',
  },
  {
    name: 'Theta',
    set: 'Functions',
    notation: 'f = \\Theta(g)',
    props: { reflexive: true, symmetric: true, antisymmetric: false, transitive: true },
    notes: 'Equivalence relation',
  },
];

type PropertyKey = 'reflexive' | 'symmetric' | 'antisymmetric' | 'transitive';

const PROPERTY_NAMES: Record<PropertyKey, string> = {
  reflexive: 'Reflexive',
  symmetric: 'Symmetric',
  antisymmetric: 'Antisymmetric',
  transitive: 'Transitive',
};

const infinitePropertiesGenerator: ProblemGenerator = {
  type: 'relation-infinite-properties',
  displayName: 'Infinite Relation Properties',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);

    // Pick a random relation and property
    const relation = pickRandom(RELATIONS, rng);
    const properties = Object.keys(PROPERTY_NAMES) as PropertyKey[];
    const property = pickRandom(properties, rng);

    const holds = relation.props[property];
    const correctAnswer = holds ? 'Yes' : 'No';

    const options = shuffleWithSeed(['Yes', 'No', 'Depends on n', 'Cannot be determined'], rng);
    const correctIndex = options.indexOf(correctAnswer);

    const allProps = properties.map((p) => {
      const h = relation.props[p];
      return `- **${PROPERTY_NAMES[p]}**: ${h ? '✓ Yes' : '✗ No'}`;
    });

    return {
      question: `Consider the relation "${relation.name}" on **${relation.set}** defined by:\n$$${relation.notation}$$\n\nIs this relation **${PROPERTY_NAMES[property]}**?`,
      options,
      correctIndex,
      explanation: `**${relation.name}** ($${relation.notation}$) on ${relation.set}:\n\n${allProps.join('\n')}\n\n${relation.notes ? `_Note: ${relation.notes}_` : ''}\n\n**Answer:** ${correctAnswer}`,
    };
  },
};

const identifyEquivalenceGenerator: ProblemGenerator = {
  type: 'relation-is-equivalence',
  displayName: 'Is It an Equivalence Relation?',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const relation = pickRandom(RELATIONS, rng);

    const isEquivalence =
      relation.props.reflexive && relation.props.symmetric && relation.props.transitive;

    const correctAnswer = isEquivalence ? 'Yes, it is an equivalence relation' : 'No, it is not an equivalence relation';

    const options = shuffleWithSeed(
      [
        'Yes, it is an equivalence relation',
        'No, it is not an equivalence relation',
        'Only if the set is finite',
        'It is a partial order instead',
      ],
      rng
    );
    const correctIndex = options.indexOf(correctAnswer);

    const checks = [
      `Reflexive: ${relation.props.reflexive ? '✓' : '✗'}`,
      `Symmetric: ${relation.props.symmetric ? '✓' : '✗'}`,
      `Transitive: ${relation.props.transitive ? '✓' : '✗'}`,
    ];

    return {
      question: `Is the relation "${relation.name}" on **${relation.set}** (defined by $${relation.notation}$) an **equivalence relation**?`,
      options,
      correctIndex,
      explanation: `An equivalence relation must be reflexive, symmetric, AND transitive.\n\n${checks.join(', ')}\n\n${isEquivalence ? 'All three properties hold!' : 'Not all three properties hold.'}\n\n**Answer:** ${correctAnswer}`,
    };
  },
};

const identifyPartialOrderGenerator: ProblemGenerator = {
  type: 'relation-is-partial-order',
  displayName: 'Is It a Partial Order?',

  generate(seed: number): Problem {
    const rng = mulberry32(seed);
    const relation = pickRandom(RELATIONS, rng);

    const isPartialOrder =
      relation.props.reflexive && relation.props.antisymmetric && relation.props.transitive;

    const correctAnswer = isPartialOrder ? 'Yes, it is a partial order' : 'No, it is not a partial order';

    const options = shuffleWithSeed(
      [
        'Yes, it is a partial order',
        'No, it is not a partial order',
        'Only if the set is finite',
        'It is an equivalence relation instead',
      ],
      rng
    );
    const correctIndex = options.indexOf(correctAnswer);

    const checks = [
      `Reflexive: ${relation.props.reflexive ? '✓' : '✗'}`,
      `Antisymmetric: ${relation.props.antisymmetric ? '✓' : '✗'}`,
      `Transitive: ${relation.props.transitive ? '✓' : '✗'}`,
    ];

    return {
      question: `Is the relation "${relation.name}" on **${relation.set}** (defined by $${relation.notation}$) a **partial order**?`,
      options,
      correctIndex,
      explanation: `A partial order must be reflexive, antisymmetric, AND transitive.\n\n${checks.join(', ')}\n\n${isPartialOrder ? 'All three properties hold!' : 'Not all three properties hold.'}\n\n**Answer:** ${correctAnswer}`,
    };
  },
};

export const generators = [
  infinitePropertiesGenerator,
  identifyEquivalenceGenerator,
  identifyPartialOrderGenerator,
] as const;
