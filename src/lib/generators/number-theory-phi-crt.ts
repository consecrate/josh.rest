import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { tex, displayTex } from './katex-utils';

/**
 * Compute GCD
 */
function gcd(a: number, b: number): number {
    while (b) {
        a %= b;
        [a, b] = [b, a];
    }
    return a;
}

/**
 * Modular inverse using EEA
 */
function modInverse(a: number, n: number): number | null {
    let [oldR, r] = [a, n];
    let [oldS, s] = [1, 0];

    while (r !== 0) {
        const q = Math.floor(oldR / r);
        [oldR, r] = [r, oldR - q * r];
        [oldS, s] = [s, oldS - q * s];
    }

    if (oldR !== 1) return null;
    return ((oldS % n) + n) % n;
}

/**
 * Get prime factorization as a map (prime -> exponent)
 */
function getPrimeFactorization(n: number): Map<number, number> {
    const factors = new Map<number, number>();
    let d = 2;
    let temp = n;
    while (temp >= d * d) {
        if (temp % d === 0) {
            factors.set(d, (factors.get(d) || 0) + 1);
            temp /= d;
        } else {
            d++;
        }
    }
    if (temp > 1) {
        factors.set(temp, (factors.get(temp) || 0) + 1);
    }
    return factors;
}

// Generator 1: Euler Phi Function
const eulerPhiGenerator: ProblemGenerator = {
    type: 'number-theory-phi',
    displayName: "Euler's Phi Function",

    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const types = ['prime', 'prime-power', 'composite'];
        const type = types[randInt(rng, 0, types.length - 1)];

        let n: number;
        let correct: number;
        let explanation: string;

        if (type === 'prime') {
            const primes = [13, 17, 19, 23, 29, 31];
            n = primes[randInt(rng, 0, primes.length - 1)];
            correct = n - 1;
            explanation = `Since $${n}$ is prime, every positive integer less than $${n}$ is relatively prime to it.<br><br>$\\phi(p) = p - 1$<br>$\\phi(${n}) = ${n} - 1 = **${correct}**$.`;
        } else if (type === 'prime-power') {
            const bases = [2, 3, 5];
            const p = bases[randInt(rng, 0, bases.length - 1)];
            const k = p === 2 ? randInt(rng, 3, 5) : randInt(rng, 2, 3);
            n = Math.pow(p, k);
            correct = Math.pow(p, k) - Math.pow(p, k - 1);
            explanation = `For a prime power $p^k$, the formula is $\\phi(p^k) = p^k - p^{k-1}$.<br><br>$\\phi(${p}^{${k}}) = ${p}^{${k}} - ${p}^{${k - 1}} = ${n} - ${Math.pow(p, k - 1)} = **${correct}**$.`;
        } else {
            const composites = [10, 12, 14, 15, 18, 20, 21, 22, 24, 26];
            n = composites[randInt(rng, 0, composites.length - 1)];
            const factors = getPrimeFactorization(n);
            let phi = n;
            let factorParts: string[] = [];
            for (const p of factors.keys()) {
                phi = phi * (p - 1) / p;
                factorParts.push(`(1 - \\frac{1}{${p}})`);
            }
            correct = phi;
            explanation = `The general formula for $\\phi(n)$ is $n \\prod_{p|n} (1 - \\frac{1}{p})$, where the product is over distinct prime factors.<br><br>The prime factors of $${n}$ are $\\{${Array.from(factors.keys()).join(', ')}\\}$.<br><br>$\\phi(${n}) = ${n} \\times ${factorParts.join(' \\times ')} = ${n} \\times ${Array.from(factors.keys()).map(p => `${p - 1}/${p}`).join(' \\times ')} = **${correct}**$.`;
        }

        const wrongs = new Set<number>();
        wrongs.add(n);
        wrongs.add(correct + 1);
        wrongs.add(correct - 1);
        while (wrongs.size < 3) {
            const w = randInt(rng, 2, n);
            if (w !== correct) wrongs.add(w);
        }
        const options = shuffleWithSeed([correct, ...Array.from(wrongs).slice(0, 3)], rng);
        const correctIndex = options.indexOf(correct);

        return {
            question: `Find $\\phi(${n})$.`,
            options: options.map(o => tex(String(o))),
            correctIndex,
            explanation
        };
    },
};

// Generator 2: Chinese Remainder Theorem (2 equations)
const crtGenerator: ProblemGenerator = {
    type: 'number-theory-crt',
    displayName: 'Chinese Remainder Theorem',

    generate(seed: number): Problem {
        const rng = mulberry32(seed);

        // Pick two coprime moduli
        const m1List = [3, 5, 7];
        const m2List = [4, 11, 13];
        const n1 = m1List[randInt(rng, 0, m1List.length - 1)];
        const n2 = m2List[randInt(rng, 0, m2List.length - 1)];

        const xTrue = randInt(rng, 1, n1 * n2 - 1);
        const a1 = xTrue % n1;
        const a2 = xTrue % n2;

        const correct = xTrue;
        const n = n1 * n2;

        // Derivation steps
        const invN1 = modInverse(n1, n2)!;
        const diff = (a2 - a1 + n2) % n2;
        const k = (diff * invN1) % n2;

        const explanation = `We need to solve the system:
${displayTex(`x \\equiv ${a1} \\pmod{${n1}}`)}
${displayTex(`x \\equiv ${a2} \\pmod{${n2}}`)}

**Step 1:** From the first equation, $x = ${n1}k + ${a1}$.

**Step 2:** Substitute into the second equation:
${displayTex(`${n1}k + ${a1} \\equiv ${a2} \\pmod{${n2}}`)}
${displayTex(`${n1}k \\equiv ${a2 - a1} \\equiv ${diff} \\pmod{${n2}}`)}

**Step 3:** Multiply by the inverse of $${n1}$ modulo $${n2}$. 
The inverse of $${n1}$ mod $${n2}$ is $${invN1}$ (since $${n1} \\times ${invN1} = ${n1 * invN1} \\equiv 1 \\pmod{${n2}}$).
${displayTex(`k \\equiv ${diff} \\times ${invN1} \\equiv ${k} \\pmod{${n2}}`)}

**Step 4:** Substitute $k = ${k}$ back into $x = ${n1}k + ${a1}$:
$x = ${n1}(${k}) + ${a1} = ${n1 * k} + ${a1} = **${correct}**$.

The solution is $x \\equiv ${correct} \\pmod{${n}}$.`;

        const wrongs = new Set<number>();
        wrongs.add((correct + n1) % n);
        wrongs.add((correct + n2) % n);
        wrongs.add((a1 + a2) % n);
        while (wrongs.size < 3) {
            const w = randInt(rng, 1, n - 1);
            if (w !== correct) wrongs.add(w);
        }
        const options = shuffleWithSeed([correct, ...Array.from(wrongs).slice(0, 3)], rng);
        const correctIndex = options.indexOf(correct);

        return {
            question: `Find the smallest positive integer $x$ such that:
${displayTex(`x \\equiv ${a1} \\pmod{${n1}}`)}
${displayTex(`x \\equiv ${a2} \\pmod{${n2}}`)}`,
            options: options.map(o => tex(String(o))),
            correctIndex,
            explanation
        };
    }
};

export const generators = [eulerPhiGenerator, crtGenerator] as const;
