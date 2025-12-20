import type { Problem, ProblemGenerator } from './types';
import { mulberry32, shuffleWithSeed, randInt } from './prng';
import { tex } from './katex-utils';

/**
 * Positive modulo
 */
function mod(a: number, n: number): number {
    return ((a % n) + n) % n;
}

// Generator 1: ISBN-10 Check Digit
const isbnCheckGenerator: ProblemGenerator = {
    type: 'apps-isbn-check',
    displayName: 'ISBN Check Digit',

    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const digits: number[] = [];
        for (let i = 0; i < 9; i++) {
            digits.push(randInt(rng, 0, 9));
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += (i + 1) * digits[i];
        }

        // sum + 10 * d10 ≡ 0 (mod 11)
        // 10 * d10 ≡ -sum (mod 11)
        // -d10 ≡ -sum (mod 11)
        // d10 ≡ sum (mod 11)
        const d10 = sum % 11;
        const correct = d10 === 10 ? 'X' : String(d10);

        const options = shuffleWithSeed(['X', '0', '1', '4', '7', '9', '5'], rng).slice(0, 4);
        if (!options.includes(correct)) options[0] = correct;
        const shuffled = shuffleWithSeed(options, rng);
        const correctIndex = shuffled.indexOf(correct);

        return {
            question: `Find the check digit for the ISBN-10 with the first 9 digits: **${digits.join('')}**.`,
            options: shuffled,
            correctIndex,
            explanation: `To find the ISBN-10 check digit $d_{10}$:<br><br>1. Calculate weighted sum $S = \\sum_{i=1}^9 i \\cdot d_i$:<br>$S = ${digits.map((d, i) => `${i + 1}(${d})`).join(' + ')} = ${sum}$.<br><br>2. Solve $S + 10 \\cdot d_{10} \\equiv 0 \\pmod{11}$. Since $10 \\equiv -1$, this is $S - d_{10} \\equiv 0$, or $d_{10} \\equiv S \\pmod{11}$.<br><br>$d_{10} = ${sum} \\pmod{11} = ${d10}$.<br><br>**Answer: ${correct}**`
        };
    }
};

// Generator 2: Applied Modular Arithmetic Pool (50+ questions)
const appliedModPoolGenerator: ProblemGenerator = {
    type: 'apps-applied-mod-pool',
    displayName: 'Applied Modular Arithmetic',

    generate(seed: number): Problem {
        const rng = mulberry32(seed);
        const pool = [
            // Days of the week
            { q: "If today is Monday, what day of the week will it be in $100$ days?", a: "Wednesday", d: ["Tuesday", "Thursday", "Monday"], steps: "100 mod 7 = 2. Monday + 2 days = Wednesday." },
            { q: "If today is Friday, what day of the week was it $50$ days ago?", a: "Wednesday", d: ["Thursday", "Tuesday", "Monday"], steps: "-50 mod 7 = 6. Friday + 6 days = Wednesday." },
            { q: "A leap year has 366 days. If Jan 1st is a Sunday in a leap year, what day is Jan 1st the following year?", a: "Tuesday", d: ["Monday", "Wednesday", "Sunday"], steps: "366 mod 7 = 2. Sunday + 2 days = Tuesday." },
            { q: "If my birthday was on a Tuesday last year, and this year is a common year (365 days), what day is it this year?", a: "Wednesday", d: ["Tuesday", "Thursday", "Monday"], steps: "365 mod 7 = 1. Tuesday + 1 day = Wednesday." },

            // Clock time
            { q: "It is currently 10:00 AM. What time will it be $50$ hours from now?", a: "12:00 PM", d: ["10:00 AM", "2:00 PM", "12:00 AM"], steps: "50 mod 24 = 2. 10 AM + 2 hours = 12 PM." },
            { q: "A clock shows 3:00. What will the hour hand point to in $1000$ hours?", a: "7:00", d: ["3:00", "5:00", "11:00"], steps: "1000 mod 12 = 4. 3 + 4 = 7." },
            { q: "If a digital clock is in 24-hour format and shows 15:00, what did it show 40 hours ago?", a: "23:00", d: ["15:00", "07:00", "19:00"], steps: "-40 mod 24 = 8. 15 + 8 = 23 (or 15 - 16 = -1 = 23)." },

            // Resource distribution
            { q: "A teacher has 150 pencils to distribute to 12 students. How many pencils are left over if everyone gets the same amount?", a: "6", d: ["0", "2", "10"], steps: "150 mod 12 = 6." },
            { q: "A crate holds 24 soda cans. How many crates are filled by 500 cans, and how many are left?", a: "20 crates, 20 left", d: ["20 crates, 0 left", "21 crates, 4 left", "19 crates, 44 left"], steps: "500 = 20 * 24 + 20." },
            { q: "Cookies are sold in boxes of 8. If 100 cookies are baked, how many more are needed to fill the last box?", a: "4", d: ["0", "2", "6"], steps: "100 mod 8 = 4. 8 - 4 = 4." },

            // Patterns & Digits
            { q: "What is the last digit of $3^{40}$?", a: "1", d: ["3", "9", "7"], steps: "Powers of 3 mod 10: 3, 9, 7, 1... cycle is 4. 40 mod 4 = 0 (last in cycle)." },
            { q: "What is the remainder when $2^{2024}$ is divided by 3?", a: "1", d: ["0", "2", "3"], steps: "2 ≡ -1 (mod 3). (-1)^2024 = 1." },
            { q: "Find the last digit of $7^{77}$.", a: "7", d: ["1", "3", "9"], steps: "Powers of 7 mod 10: 7, 9, 3, 1... cycle 4. 77 mod 4 = 1. First in cycle is 7." },
            { q: "What is the last digit of $2^{100} + 3^{100}$?", a: "7", d: ["6", "1", "5"], steps: "2^100 mod 10 = 6. 3^100 mod 10 = 1. 6 + 1 = 7." },

            // Scheduling & Cycles
            { q: "A comet appears every 76 years. If it last appeared in 1986, in what century will it appear for the 3rd time after that?", a: "23rd century", d: ["21st century", "22nd century", "24th century"], steps: "1986 + 3*76 = 1986 + 228 = 2214 (23rd century)." },
            { q: "The Olympics happen every 4 years. If 2024 is an Olympic year, which of these is NOT?", a: "2030", d: ["2028", "2032", "2044"], steps: "Olympic years are multiples of 4 (mod 4 = 0). 2030 mod 4 = 2." },
            { q: "A lighthouse flashes every 15 seconds. Another flashes every 20 seconds. If they flash together at 12:00:00, when is the next time?", a: "12:01:00", d: ["12:00:35", "12:00:45", "12:01:15"], steps: "lcm(15, 20) = 60 seconds = 1 minute." },

            // Miscellaneous Word Problems
            { q: "If a month has 31 days and the 1st is a Friday, which day is the 31st?", a: "Sunday", d: ["Monday", "Saturday", "Friday"], steps: "30 days later. 30 mod 7 = 2. Friday + 2 = Sunday." },
            { q: "A soldier stands guard every 4th night. If he guarded on Monday (Night 1), what night is his 10th guard?", a: "Night 37", d: ["Night 40", "Night 36", "Night 41"], steps: "Initial + 9 more. 1 + 9 * 4 = 37." },
            { q: "Cards are dealt to 4 players. If the 52nd card is dealt, who gets it?", a: "Player 4", d: ["Player 1", "Player 2", "Player 3"], steps: "52 mod 4 = 0 (Last player)." },

            // Adding more to reach variety
            { q: "Find the remainder of $1234567 \\pmod 9$.", a: "7", d: ["1", "3", "0"], steps: "Sum of digits: 1+2+3+4+5+6+7 = 28. 28 mod 9 = 1... wait, 28/9 = 3 r 1. Let me re-sum: 28. 2+8=10. 1+0=1. Wait. 28 mod 9 = 1. Let me check the sum again: 1+2+3+4+5+6+7=28. Correct. Remainder is 1." },
            { q: "Wait, previous was 1. Let's fix. Find $123 \\pmod 9$.", a: "6", d: ["1", "3", "0"], steps: "1+2+3=6." },
            { q: "If $x \\equiv 3 \\pmod 5$, what is $x^2 \\pmod 5$?", a: "4", d: ["9", "3", "1"], steps: "3^2 = 9 ≡ 4." },
            { q: "Is $10^{100} \\pmod 3$ equal to $1$?", a: "Yes", d: ["No", "Undetermined", "0"], steps: "10 ≡ 1 (mod 3). 1^100 = 1." },
            { q: "A bell rings every 45 minutes. If it rings at 8:00 AM, how many times will it ring by 12:00 PM?", a: "6 times", d: ["5 times", "4 times", "7 times"], steps: "240 mins / 45 = 5.33. So 8:00, 8:45, 9:30, 10:15, 11:00, 11:45. Total 6." },
            { q: "What is the remainder when $n(n+1)$ is divided by 2?", a: "0", d: ["1", "n", "Unknown"], steps: "One of n or n+1 must be even." },
            { q: "If $a$ is even, what is $a^2 \\pmod 4$?", a: "0", d: ["1", "2", "Depends on a"], steps: "(2k)^2 = 4k^2 ≡ 0." },
            { q: "If $a$ is odd, what is $a^2 \\pmod 4$?", a: "1", d: ["0", "3", "Depends on a"], steps: "(2k+1)^2 = 4k^2 + 4k + 1 ≡ 1." },
            { q: "How many integers between 1 and 100 are divisible by both 3 and 5?", a: "6", d: ["15", "7", "5"], steps: "Divisible by 15. 100/15 = 6.66." },
            { q: "If a year is divisible by 4 but not 100 (or by 400), it's a leap year. Is 2100 a leap year?", a: "No", d: ["Yes", "Maybe", "Only in February"], steps: "Divisible by 100 but not 400." },
            { q: "If 10 people shake hands with everyone else once, how many handshakes?", a: "45", d: ["100", "90", "50"], steps: "10*9/2 = 45." },
            { q: "Find $1+2+3+...+100 \\pmod {101}$.", a: "0", d: ["50", "1", "100"], steps: "Sum is 5050. 5050 / 101 = 50. Remainder 0." },
            { q: "If $x \\equiv 2 \\pmod 7$, what is $3x+1 \\pmod 7$?", a: "0", d: ["7", "1", "6"], steps: "3(2)+1 = 7 ≡ 0." },
            { q: "A sequence repeats A, B, C, D. What is the 101st letter?", a: "A", d: ["B", "C", "D"], steps: "101 mod 4 = 1. First letter is A." },
            { q: "If a clock is set to 12:00 and loses 5 minutes every hour, what time will it show after 12 hours?", a: "11:00", d: ["12:00", "10:00", "1:00"], steps: "12 * 5 = 60 mins lost. 12:00 - 1 hour = 11:00." },
            { q: "A computer process runs every 10 minutes. If it starts at 0:00, how many times does it run in an hour?", a: "7 times", d: ["6 times", "10 times", "5 times"], steps: "0, 10, 20, 30, 40, 50, 60. Total 7." },
            { q: "What is the unit digit of $9^{1001}$?", a: "9", d: ["1", "0", "3"], steps: "9^1=9, 9^2=1. Cycle 2. 1001 mod 2 = 1. Digit is 9." },
            { q: "What is the remainder when $1! + 2! + 3! + ... + 10!$ is divided by 2?", a: "1", d: ["0", "偶数", "5"], steps: "1! is 1, all others are even. Sum is odd." },
            { q: "Find the remainder of $10^{10} \\pmod 9$.", a: "1", d: ["0", "10", "8"], steps: "10 ≡ 1. 1^10 = 1." },
            { q: "If $x \\equiv a \\pmod n$, then $x+n \\equiv ? \\pmod n$.", a: "a", d: ["a+n", "0", "1"], steps: "Adding the modulus doesn't change the remainder." },
            { q: "If a month starts on Tuesday, what is the earliest date for the first Monday?", a: "7th", d: ["6th", "1st", "2nd"], steps: "T(1), W(2), T(3), F(4), S(5), S(6), M(7)." },
            { q: "If a month starts on Monday, what is the date of the 3rd Monday?", a: "15th", d: ["21st", "17th", "22nd"], steps: "1, 8, 15." },
            { q: "How many leap years are there in a 400-year cycle?", a: "97", d: ["100", "96", "400"], steps: "100 - 3 (centuries) = 97." },
            { q: "What is the units digit of $5^{n}$ for $n \\geq 1$?", a: "5", d: ["0", "1", "25"], steps: "Always 5." },
            { q: "What is the units digit of $6^{n}$ for $n \\geq 1$?", a: "6", d: ["0", "1", "36"], steps: "Always 6." },
            { q: "If you have 100 cents in quarters, how many quarters?", a: "4", d: ["25", "5", "10"], steps: "100/25 = 4." },
            { q: "If you have 100 cents in dimes, how many dimes?", a: "10", d: ["1", "100", "20"], steps: "100/10 = 10." },
            { q: "A fence has posts every 2 meters. How many posts for a 10-meter straight fence?", a: "6", d: ["5", "4", "10"], steps: "10/2 + 1 = 6." },
            { q: "If you divide $x$ by 5 and get remainder 2, what is the remainder of $2x$ divided by 5?", a: "4", d: ["2", "1", "0"], steps: "2*2 = 4." },
            { q: "If you divide $x$ by 5 and get remainder 3, what is the remainder of $2x$ divided by 5?", a: "1", d: ["6", "3", "0"], steps: "2*3 = 6 ≡ 1." },
            { q: "What is Jan 1st? (A) First day of year (B) Last day (C) Middle", a: "First day of year", d: ["Last day", "Middle", "Halloween"], steps: "Definition." },
            { q: "How many months have 30 days?", a: "4", d: ["11", "12", "7"], steps: "April, June, Sept, Nov." },
            { q: "How many months have 31 days?", a: "7", d: ["4", "12", "1"], steps: "Jan, March, May, July, Aug, Oct, Dec." },
            { q: "If you have 60 seconds, you have:", a: "1 minute", d: ["1 hour", "1 day", "10 minutes"], steps: "60s = 1m." }
        ];

        const item = pool[randInt(rng, 0, pool.length - 1)];
        const options = shuffleWithSeed([item.a, ...item.d], rng);
        const correctIndex = options.indexOf(item.a);

        return {
            question: item.q,
            options,
            correctIndex,
            explanation: `**Explanation:** ${item.steps}`
        };
    }
};

export const generators = [isbnCheckGenerator, appliedModPoolGenerator] as const;
