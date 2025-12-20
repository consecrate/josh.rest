import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { tex, displayTex } from './katex-utils';

/**
 * Compute modular inverse using EEA
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
 * Modular exponentiation
 */
function modPow(base: number, exp: number, n: number): number {
    let res = 1;
    base = base % n;
    while (exp > 0) {
        if (exp % 2 === 1) res = (res * base) % n;
        base = (base * base) % n;
        exp = Math.floor(exp / 2);
    }
    return res;
}

// Generator 1: Caesar Cipher
const caesarGenerator: ProblemGenerator = {
    type: 'crypto-caesar',
    displayName: 'Caesar Cipher',

    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const messages = ["HELLO WORLD", "STAY SAFE", "MATH IS FUN", "AGENTIC CODING", "DEEPMIND TASK"];
        const text = messages[randInt(rng, 0, messages.length - 1)];
        const shift = randInt(rng, 1, 25);

        const encrypt = (s: string, k: number) => {
            return s.split('').map(c => {
                if (c === ' ') return ' ';
                const code = c.charCodeAt(0) - 65;
                return String.fromCharCode(((code + k) % 26) + 65);
            }).join('');
        };

        const ciphertext = encrypt(text, shift);
        const correct = ciphertext;

        const wrongs = new Set<string>();
        while (wrongs.size < 3) {
            const w = encrypt(text, randInt(rng, 1, 25));
            if (w !== correct) wrongs.add(w);
        }

        const options = shuffleWithSeed([correct, ...Array.from(wrongs)], rng);
        const correctIndex = options.indexOf(correct);

        return {
            question: `Encrypt the message **"${text}"** using a Caesar cipher with a shift of $${shift}$ to the right.`,
            options: options.map(o => tex(o)),
            correctIndex,
            explanation: `To encrypt with a Caesar shift of $${shift}$:<br><br>Each letter $x$ is replaced by $E(x) = (x + ${shift}) \\pmod{26}$.<br><br>Example: A (0) $\\rightarrow$ ${String.fromCharCode(65 + (shift % 26))} (${shift % 26}).<br><br>Original: ${text}<br>Shifted: **${ciphertext}**`
        };
    }
};

// Generator 2: RSA Small Modulus
const rsaSmallGenerator: ProblemGenerator = {
    type: 'crypto-rsa-small',
    displayName: 'RSA (Small)',

    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const primes = [3, 5, 7, 11, 13];
        let p = primes[randInt(rng, 0, primes.length - 1)];
        let q = primes[randInt(rng, 0, primes.length - 1)];
        while (p === q || p * q < 30) {
            p = primes[randInt(rng, 0, primes.length - 1)];
            q = primes[randInt(rng, 0, primes.length - 1)];
        }

        const n = p * q;
        const phi = (p - 1) * (q - 1);

        // Find valid e
        let e = 3;
        while (e < phi) {
            if (phi % e !== 0 && modInverse(e, phi) !== null) break;
            e += 2;
        }

        const m = randInt(rng, 2, n - 2);
        const c = modPow(m, e, n);

        const correct = c;
        const wrongs = new Set<number>();
        wrongs.add(m);
        wrongs.add(modPow(m, 2, n));
        while (wrongs.size < 3) {
            const w = randInt(rng, 1, n - 1);
            if (w !== correct) wrongs.add(w);
        }

        const options = shuffleWithSeed([correct, ...Array.from(wrongs).slice(0, 3)], rng);
        const correctIndex = options.indexOf(correct);

        return {
            question: `In an RSA system with $p = ${p}$, $q = ${q}$, and public exponent $e = ${e}$, encrypt the message $m = ${m}$.`,
            options: options.map(o => tex(String(o))),
            correctIndex,
            explanation: `**Step 1:** Calculate modulus $n = p \\times q = ${p} \\times ${q} = ${n}$.<br><br>**Step 2:** Calculate cipher $c = m^e \\pmod n = ${m}^{${e}} \\pmod{${n}}$.<br><br>${m}^{${e}} \\equiv **${correct}** \\pmod{${n}}$.`
        };
    }
};

// Generator 3: Crypto Theory Pool (50+ questions)
const cryptoTheoryGenerator: ProblemGenerator = {
    type: 'crypto-theory-pool',
    displayName: 'Cryptography Theory',

    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const pool = [
            // RSA Theory
            { q: "What is the primary security assumption behind the RSA algorithm?", a: "Difficulty of factoring large composite numbers", d: ["Strength of symmetrical keys", "Difficulty of solving discrete logs", "Speed of prime number generation"] },
            { q: "In RSA, how is the private key $d$ related to the public exponent $e$?", a: "$ed \\equiv 1 \\pmod{\\phi(n)}$", d: ["$e + d = n$", "$d = e^{n-1}$", "$ed = n$"] },
            { q: "Which value is used to encrypt a message in RSA?", a: "The public exponent $e$ and modulus $n$", d: ["The private key $d$ only", "The prime factors $p$ and $q$", "The totient function $\\phi(n)$"] },
            { q: "A 'dangerous' message $m$ in RSA is one where:", a: "$\\gcd(m, n) > 1$ and $< n$", d: ["$m$ is a prime number", "$m$ is larger than $n$", "$\\gcd(m, n) = 1$"] },
            { q: "If $\\gcd(m, n) = p$, why is this message $m$ dangerous in RSA?", a: "It allows an attacker to compute $p = \\gcd(m, n)$ and factor $n$", d: ["It makes encryption impossible", "It reveals the public key", "It slows down decryption"] },

            // Diffie-Hellman
            { q: "What problem provides the security for the Diffie-Hellman Key Exchange?", a: "The Discrete Logarithm Problem", d: ["The Prime Factorization Problem", "Collision resistance", "Hash function pre-image"] },
            { q: "In Diffie-Hellman, if Alice sends $g^a \\pmod p$ and Bob sends $g^b \\pmod p$, the shared key is:", a: "$g^{ab} \\pmod p$", d: ["$g^{a+b} \\pmod p$", "$(g^a + g^b) \\pmod p$", "$g^{a/b} \\pmod p$"] },
            { q: "Which of the following describes the goal of Diffie-Hellman?", a: "Secure key exchange over an insecure channel", d: ["Authentication of signatures", "Encryption of long files", "Fast hashing of passwords"] },
            { q: "A 'Man-in-the-Middle' attack is most effective against which unauthenticated protocol?", a: "Diffie-Hellman Key Exchange", d: ["AES-256 Encryption", "SHA-256 Hashing", "RSA Public Key Access"] },
            { q: "What prevents an attacker from finding $a$ from $g^a \\pmod p$ in Diffie-Hellman?", a: "Computation of discrete logs is infeasible for large $p$", d: ["The modulus $p$ is secret", "The value $g$ is encrypted", "$a$ is much larger than $p$"] },

            // Ciphers
            { q: "How many possible keys are there for a Caesar cipher?", a: "25 (excluding the identity shift)", d: ["26", "Infinity", "10,000"] },
            { q: "Which type of cipher rearranges the positions of characters without changing them?", a: "Transposition Cipher", d: ["Substitution Cipher", "Block Cipher", "Stream Cipher"] },
            { q: "A Caesar cipher is a specific type of:", a: "Monoalphabetic Substitution Cipher", d: ["Polyalphabetic Substitution Cipher", "Transposition Cipher", "Asymmetric Cipher"] },
            { q: "The Vigenère cipher improved on the Caesar cipher by being:", a: "Polyalphabetic", d: ["Faster to compute", "Monoalphabetic", "A transposition cipher"] },
            { q: "Which cipher was used by Julius Caesar for military communication?", a: "Shift cipher with key 3", d: ["Vigenère cipher", "Enigma machine", "ROT13"] },

            // Breaking Ciphers
            { q: "What technique is most effectively used to break simple substitution ciphers?", a: "Frequency Analysis", d: ["Brute Force Factorization", "Extended Euclidean Algorithm", "Discrete Log Analysis"] },
            { q: "In frequency analysis, which letter is typically the most common in English text?", a: "e", d: ["t", "a", "s"] },
            { q: "A 'Known-Plaintext Attack' occurs when the attacker:", a: "Knows both a piece of plaintext and its corresponding ciphertext", d: ["Has access to the physical server", "Only knows the encryption algorithm", "Knows the victim's social security number"] },
            { q: "What makes a 'Brute Force' attack against a Caesar cipher practical?", a: "Small key space ($25$ possible keys)", d: ["Vulnerability to frequency analysis", "Predictability of English words", "The use of prime numbers"] },
            { q: "Which math tool is central to analyzing linear relationships in modular arithmetic?", a: "Extended Euclidean Algorithm", d: ["Sieve of Eratosthenes", "Taylor Expansion", "Matrix Inversion"] },

            // Modular Inverse & Equations
            { q: "An element $a$ in $\\mathbb{Z}_n$ has a multiplicative inverse if and only if:", a: "$\\gcd(a, n) = 1$", d: ["$a$ is prime", "$n$ is prime", "$a < n$"] },
            { q: "In $\\mathbb{Z}_{11}$, every non-zero element has an inverse because:", a: "11 is prime", d: ["11 is odd", "11 is small", "11 is a perfect number"] },
            { q: "If $\\gcd(a, n) = 2$, how many multiplicative inverses does $a$ have in $\\mathbb{Z}_n$?", a: "0", d: ["1", "2", "Unlimited"] },
            { q: "Which algorithm efficiently finds modular inverses?", a: "Extended Euclidean Algorithm", d: ["Fermat's Primality Test", "RSA Key Generation", "Bubble Sort"] },
            { q: "If $ax + ny = 1$, what is the inverse of $a$ modulo $n$?", a: "$x \\pmod n$", d: ["$y \\pmod n$", "$1$", "$a^{-1} \\cdot n$"] },

            // General Concepts
            { q: "Symmetric-key cryptography is defined by using:", a: "The same key for both encryption and decryption", d: ["A pair of public and private keys", "Only prime number keys", "Keys that double in size every year"] },
            { q: "Asymmetric cryptography is also known as:", a: "Public-key cryptography", d: ["Modular cryptography", "Hash-based security", "Symmetric encryption"] },
            { q: "The 'Totient Function' $\\phi(n)$ counts:", a: "Integers less than $n$ that are relatively prime to $n$", d: ["Divisors of $n$", "Prime factors of $n$", "Multiples of $n$ less than $n^2$"] },
            { q: "Bézout's identity states that $\\gcd(a, b)$ can be expressed as:", a: "$ax + by$ for some integers $x, y$", d: ["$a^x + b^y$", "$\\frac{a}{b} \\pmod p$", "$x^2 + y^2$"] },
            { q: "Mersenne primes are numbers of the form:", a: "$2^p - 1$ where $p$ is prime", d: ["$n! + 1$", "$p^2 - q^2$", "$x^4 + 1$"] },

            // History & People
            { q: "Who is famous for breaking the Enigma code during WWII?", a: "Alan Turing", d: ["John von Neumann", "Claude Shannon", "Ada Lovelace"] },
            { q: "The Diffie-Hellman Key Exchange was published in:", a: "1976", d: ["1944", "2001", "1994"] },
            { q: "RSA is named after Rivest, Shamir, and Adleman. When was it introduced?", a: "1977", d: ["1955", "1991", "1970"] },
            { q: "Who formulated the logic of 'one-time pads' being unbreakable?", a: "Claude Shannon", d: ["Alan Turing", "Martin Hellman", "Ronald Rivest"] },
            { q: "The Chinese Remainder Theorem originates from the work of:", a: "Sun Zi (early centuries AD)", d: ["Pythagoras", "Euclid", "Newton"] },

            // Potentially Tricky Theory
            { q: "If $n = p \\cdot q$, then $\\phi(n)$ is:", a: "$(p-1)(q-1)$", d: ["$pq - 1$", "$p + q - 1$", "$(p+1)(q+1)$"] },
            { q: "Euler's Theorem states that $a^{\\phi(n)} \\equiv 1 \\pmod n$ if:", a: "$\\gcd(a, n) = 1$", d: ["$a$ is prime", "$n$ is prime", "$a > n$"] },
            { q: "What is the result of $a^{p} \pmod p$ when $p$ is prime?", a: "$a$", d: ["$1$", "$0$", "$a-1$"] },
            { q: "In a transposition cipher, if the block size is $m$, how many possible permutations are there?", a: "$m!$", d: ["$2^m$", "$m^2$", "$m \\times (m-1)$"] },
            { q: "Fermat's 'Little Theorem' is a specific case of which broader theorem?", a: "Euler's Theorem", d: ["Lagrange's Theorem", "Binomial Theorem", "Chinese Remainder Theorem"] },

            // Cryptography Standards
            { q: "Which hash function is commonly used for data integrity check (though not collision-proof)?", a: "MD5", d: ["AES", "RSA", "Diffie-Hellman"] },
            { q: "Advanced Encryption Standard (AES) is a:", a: "Symmetric block cipher", d: ["Asymmetric stream cipher", "Hash function", "Key exchange protocol"] },
            { q: "Which key size is considered modern standard for AES?", a: "256 bits", d: ["16 bits", "1024 bits", "56 bits"] },
            { q: "The 'Birthday Attack' is a vulnerability in:", a: "Hash functions (collisions)", d: ["RSA factoring", "Caesar shift", "One-time pads"] },
            { q: "A 'Digital Signature' provides:", a: "Authentication and Non-repudiation", d: ["Privacy only", "Encryption of the message", "Faster delivery"] },

            // More random crypto/number theory facts to hit 50+
            { q: "The set of all integers $x$ such that $x \\equiv a \\pmod n$ is called a:", a: "Congruence class", d: ["Prime factor set", "Multiplicative group", "Ideal"] },
            { q: "What is the smallest positive integer $x$ such that $x \\equiv 1 \\pmod 2$ and $x \\equiv 1 \\pmod 3$?", a: "1", d: ["5", "7", "6"] },
            { q: "In common RSA usage, what is the most typical value for the public exponent $e$?", a: "65537", d: ["3", "11", "2"] },
            { q: "Why is 65537 a popular RSA exponent?", a: "It is prime and has only two bits set (efficient encryption)", d: ["It is the largest known prime", "It makes factoring impossible", "It is easier to memorize"] },
            { q: "What does 'Perfect Secrecy' mean in cryptography?", a: "Ciphertext reveals no information about the plaintext", d: ["The key can never be stolen", "Encryption is zero-latency", "The message is impossible to delete"] },
            { q: "Which cipher achieved 'Perfect Secrecy' as proven by Shannon?", a: "One-Time Pad", d: ["Enigma", "RSA", "Vigenère"] },
            { q: "Can Fermat's Little Theorem be used if the modulus $n$ is composite?", a: "No, $n$ must be prime", d: ["Yes, always", "Yes, if $\\gcd(a, n) = 1$", "No, $a$ must be prime"] },
            { q: "In RSA, what happens if $m=1$?", a: "Encryption results in $c=1$, leaking the message", d: ["The computer crashes", "Decryption fails", "The key rotates"] },
            { q: "What is the multiplicative inverse of $1$ in any $\\mathbb{Z}_n$?", a: "1", d: ["$n-1$", "$0$", "Does not exist"] }
        ];

        const item = pool[randInt(rng, 0, pool.length - 1)];
        const options = shuffleWithSeed([item.a, ...item.d], rng);
        const correctIndex = options.indexOf(item.a);

        return {
            question: item.q,
            options,
            correctIndex,
            explanation: `**Correct Answer:** ${item.a}`
        };
    }
};

export const generators = [caesarGenerator, rsaSmallGenerator, cryptoTheoryGenerator] as const;
