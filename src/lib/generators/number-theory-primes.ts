import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { tex, displayTex } from './katex-utils';

/**
 * Check if a number is prime
 */
function isPrime(n: number): boolean {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

/**
 * Get prime factors
 */
function getPrimeFactors(n: number): number[] {
    const factors: number[] = [];
    let d = 2;
    let temp = n;
    while (temp >= d * d) {
        if (temp % d === 0) {
            factors.push(d);
            temp /= d;
        } else {
            d++;
        }
    }
    factors.push(temp);
    return factors;
}

/**
 * Compute GCD
 */
function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        a %= b;
        [a, b] = [b, a];
    }
    return a;
}

// Generator 1: Prime/Composite Check
const primeCheckGenerator: ProblemGenerator = {
    type: 'number-theory-prime-check',
    displayName: 'Prime or Composite Check',

    generate(seed: number): Problem {
        const rng = mulberry32(seed);

        // Pick a number that's not obviously prime (e.g. not even, not ending in 5)
        let n: number;
        do {
            n = randInt(rng, 50, 400);
        } while (n % 2 === 0 || n % 5 === 0);

        const prime = isPrime(n);
        const correct = prime ? "Prime" : "Composite";
        const options = shuffleWithSeed(["Prime", "Composite"], rng);
        const correctIndex = options.indexOf(correct);

        let explanation: string;
        if (prime) {
            const limit = Math.floor(Math.sqrt(n));
            explanation = `To check if ${n} is prime, we test divisibility by primes up to $\\sqrt{${n}} \\approx ${limit}$.<br><br>Testing: 2, 3, 5, 7, ...<br><br>Since no primes up to ${limit} divide ${n}, it is **Prime**.`;
        } else {
            const factors = getPrimeFactors(n);
            explanation = `${n} is **Composite** because it can be factored: $${n} = ${factors[0]} \\times ${n / factors[0]}$.`;
        }

        return {
            question: `Is $${n}$ prime or composite?`,
            options,
            correctIndex,
            explanation
        };
    },
};

// Generator 2: Sophie Germain Identity
const sophieGermainGenerator: ProblemGenerator = {
    type: 'number-theory-sophie-germain',
    displayName: "Sophie Germain's Identity",

    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const n = randInt(rng, 2, 10);
        const value = Math.pow(n, 4) + 4;

        const correct = "Composite for all $n > 1$";
        const options = shuffleWithSeed([
            "Composite for all $n > 1$",
            "Prime for all $n$",
            "Prime if $n$ is prime",
            "Composite only for even $n$"
        ], rng);
        const correctIndex = options.indexOf(correct);

        return {
            question: `For $n > 1$, is $n^{4} + 4$ prime or composite?`,
            options,
            correctIndex,
            explanation: `This is a classic application of **Sophie Germain's Identity**:
${displayTex(`a^4 + 4b^4 = (a^2 + 2b^2 + 2ab)(a^2 + 2b^2 - 2ab)`)}
Setting $b = 1$:
${displayTex(`n^4 + 4 = (n^2 + 2n + 2)(n^2 - 2n + 2)`)}
For $n = ${n}$:
$${n}^4 + 4 = (${n}^2 + 2(${n}) + 2)(${n}^2 - 2(${n}) + 2) = ${n * n + 2 * n + 2} \\times ${n * n - 2 * n + 2} = ${value}$.
Since both factors are greater than 1 for all $n > 1$, the expression is **always composite**.`
        };
    },
};

// Generator 3: Pairwise Relatively Prime
const pairwiseRelativelyPrimeGenerator: ProblemGenerator = {
    type: 'number-theory-pairwise-coprime',
    displayName: 'Pairwise Relatively Prime',

    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const isActuallyCoprime = rng() < 0.5;

        let set: number[] = [];
        if (isActuallyCoprime) {
            // Generate 3-4 numbers that are pairwise coprime
            const pool = [2, 3, 5, 7, 11, 13, 17, 19, 23];
            const selectedPrimes = shuffleWithSeed(pool, rng).slice(0, 4);
            set = selectedPrimes.map((p, i) => {
                // Mix it up with powers or products of distinct primes
                if (i === 1 && rng() < 0.5) return p * p;
                return p;
            });
        } else {
            // Start with coprime and break one pair
            const pool = [2, 3, 5, 7, 11, 13];
            const selected = shuffleWithSeed(pool, rng).slice(0, 3);
            const common = selected[0];
            set = [selected[0], selected[1], common * selected[2]];
        }

        set.sort((a, b) => a - b);

        let allCoprime = true;
        const failures: string[] = [];
        for (let i = 0; i < set.length; i++) {
            for (let j = i + 1; j < set.length; j++) {
                const g = gcd(set[i], set[j]);
                if (g !== 1) {
                    allCoprime = false;
                    failures.push(`$\\gcd(${set[i]}, ${set[j]}) = ${g}$`);
                }
            }
        }

        const correct = allCoprime ? "Yes" : "No";
        const options = shuffleWithSeed(["Yes", "No"], rng);
        const correctIndex = options.indexOf(correct);

        let explanation = `A set is **pairwise relatively prime** if every possible pair of numbers in the set has a GCD of 1.<br><br>`;
        if (allCoprime) {
            explanation += `Checking all pairs in $\\{${set.join(', ')}\\}$:<br>All pairs have $\\gcd = 1$.<br><br>**Answer: Yes.**`;
        } else {
            explanation += `Checking pairs in $\\{${set.join(', ')}\\}$:<br>We found ${failures.join(', ')}.<br><br>**Answer: No.**`;
        }

        return {
            question: `Are the integers $${set.join(', ')}$ pairwise relatively prime?`,
            options,
            correctIndex,
            explanation
        };
    },
};

// Generator 4: Mersenne/Factorial Primes Theory
const specialPrimesTheoryGenerator: ProblemGenerator = {
    type: 'number-theory-special-primes',
    displayName: 'Special Primes Theory',

    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const types = ['mersenne', 'factorial', 'n4plus4', 'odd-power'];
        const selectedType = types[randInt(rng, 0, types.length - 1)];

        let question = "";
        let correct = "";
        let reason = "";
        let distractors: string[] = [];

        switch (selectedType) {
            case 'mersenne':
                question = "If $2^n - 1$ is prime, then $n$ must be:";
                correct = "Prime";
                reason = "This is a property of Mersenne primes. If $n = ab$, then $2^a - 1$ divides $2^{ab} - 1$.";
                distractors = ["Even", "A power of 2", "Composite"];
                break;
            case 'factorial':
                question = "Is the number $n! - 1$ always prime for $n > 2$? ";
                correct = "No, it depends on $n$";
                reason = "For $n=5$, $5! - 1 = 119 = 7 \\times 17$, which is composite.";
                distractors = ["Yes, always prime", "Always composite", "Prime only for even $n$"];
                break;
            case 'n4plus4':
                question = "Is $n^4 + 4$ prime for any $n > 1$?";
                correct = "No, it is composite for all $n > 1$";
                reason = "By Sophie Germain's Identity, $n^4 + 4 = (n^2 + 2n + 2)(n^2 - 2n + 2)$.";
                distractors = ["Yes, if $n$ is even", "Yes, if $n$ is prime", "Yes, for all $n$"];
                break;
            case 'odd-power':
                question = "Is $2^{2000} + 1$ prime or composite?";
                correct = "Composite";
                reason = "Since 2000 has an odd factor (e.g., 5), we can factor $x^k + 1$ where $k$ is odd. Here, $(2^{400})^5 + 1$ is divisible by $2^{400} + 1$.";
                distractors = ["Prime", "Neither prime nor composite", "Depends on the value of $2^{2000}$"];
                break;
        }

        const options = shuffleWithSeed([correct, ...distractors], rng);
        const correctIndex = options.indexOf(correct);

        return {
            question,
            options,
            correctIndex,
            explanation: reason
        };
    }
};

export const generators = [
    primeCheckGenerator,
    sophieGermainGenerator,
    pairwiseRelativelyPrimeGenerator,
    specialPrimesTheoryGenerator
] as const;
