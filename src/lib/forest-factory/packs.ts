import type { Pack } from './types';

const PACKS: readonly Pack[] = [
  {
    id: 'discrete-math-relations',
    name: 'Relations & Functions',
    description: 'Properties, closures, equivalence classes, partial orders',
    generators: [
      // Relation properties
      'relation-properties-which',
      'relation-properties-is',
      'relation-properties-fails',
      'relation-infinite-properties',
      'relation-is-equivalence',
      'relation-is-partial-order',
      // Closures
      'relation-closure-pairs',
      'relation-closure-result',
      // Operations
      'relation-operations',
      // Equivalence classes
      'equivalence-class-modulo',
      'equivalence-class-bitstring',
      'equivalence-class-count',
      // Hasse diagrams
      'hasse-edge-exists',
      'hasse-immediate-elements',
      'hasse-minmax-elements',
      // Function properties
      'function-properties',
      'function-classify',
      // Counting
      'relation-counting',
      'relation-counting-formula',
      // Cartesian product
      'cartesian-product-size',
      'cartesian-product-membership',
      'cartesian-product-element',
      'cartesian-product-properties',
      // Matrix algebra
      'matrix-boolean-entry',
      'matrix-boolean-result',
      'matrix-boolean-property',
      // Poset elements
      'poset-minmax',
      'poset-greatest-least',
      'poset-bounds',
      // Set theory
      'set-list-elements',
      'set-intersection-size',
      'set-complement',
      // Discrete counting
      'counting-bitstring-weight',
      'counting-injective-functions',
      'counting-total-functions',
      'counting-symmetric-relations',
      'counting-binomial',
      'counting-permutation',
      // Warshall's algorithm
      'warshall-entry-change',
      'warshall-matrix-step',
      'warshall-concept',
    ],
  },
] as const;

const packMap = new Map<string, Pack>(PACKS.map((p) => [p.id, p]));

export function getPack(id: string): Pack | undefined {
  return packMap.get(id);
}

export function listPacks(): readonly Pack[] {
  return PACKS;
}
