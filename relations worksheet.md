Relations & Functions - Explanatory Solutions

1. Describe $\mathbb{Z} \times \mathbb{Z}$
   Answer: The set of all ordered pairs of integers.
   Derivation:
   The Cartesian product $A \times B$ is defined as $\{(a,b) \mid a \in A, b \in B\}$.
   Substituting $A=B=\mathbb{Z}$:

$$\mathbb{Z} \times \mathbb{Z} = \{(x, y) \mid x \in \mathbb{Z}, y \in \mathbb{Z}\}$$

Geometrically, this represents the integer grid points on the 2D plane.

2. Number of relations $A \to B$ where $|A|=m, |B|=n$
   Answer: $2^{mn}$
   Derivation:

A relation from $A$ to $B$ is a subset of the Cartesian product $A \times B$.

The size of the Cartesian product is $|A \times B| = |A| \cdot |B| = m \cdot n$.

The number of possible subsets (the power set) of a set with size $k$ is $2^k$.

Therefore, the number of relations is $2^{|A \times B|} = 2^{mn}$.

3. Is $f(x) = \frac{x}{x+1}$ invertible?
   Answer: Yes.
   Derivation:
   A function is invertible if it is one-to-one (injective).
   Test for Injectivity: Assume $f(a) = f(b)$.

   $$
   \begin{aligned}
   \frac{a}{a+1} &= \frac{b}{b+1} \
   a(b+1) &= b(a+1) \
   ab + a &= ab + b \
   a &= b
   \end{aligned}
   $$

   Since $f(a) = f(b) \implies a = b$, the function is injective and thus invertible on its codomain.

4. For which $a \in \mathbb{R}$ is $f(x)=ax$ invertible? Find $f^{-1}$.
   Answer: $a \neq 0$. Inverse: $f^{-1}(y) = \frac{y}{a}$.
   Derivation:
   Condition: For invertibility, we need to be able to solve $y = ax$ uniquely for $x$.

$$x = \frac{y}{a}$$

This division is only defined if $a \neq 0$. If $a=0$, $f(x)=0$ for all $x$, which is not one-to-one.
Inverse: Swapping variables $x$ and $y$: $x = ay \implies y = \frac{x}{a}$.

5. Investigate properties of $R_5$ on $\mathbb{Z}: (x,y) \in R_5 \iff 5 \mid (x-y)$.
   Answer: Equivalence Relation (Reflexive, Symmetric, Transitive).
   Derivation:

Reflexive: Is $x \sim x$?
Check: $x - x = 0$. Since $5 \mid 0$, it is reflexive.

Symmetric: If $x \sim y$, is $y \sim x$?
Assume $5 \mid (x-y)$, so $x-y = 5k$.
Then $y-x = -(x-y) = -5k = 5(-k)$.
Since $-k \in \mathbb{Z}$, $5 \mid (y-x)$. It is symmetric.

Transitive: If $x \sim y$ and $y \sim z$, is $x \sim z$?
Assume $x-y = 5k$ and $y-z = 5j$.
Add equations: $(x-y) + (y-z) = 5k + 5j$.
$x - z = 5(k+j)$.
Thus $5 \mid (x-z)$. It is transitive.

Antisymmetric: No.
Counter-example: $1 \sim 6$ ($5 \mid -5$) and $6 \sim 1$ ($5 \mid 5$), but $1 \neq 6$.

6. Is $=$ an equivalence relation?
   Answer: Yes.
   Derivation:

Reflexive: $a = a$ (Always true).

Symmetric: $a = b \implies b = a$.

Transitive: $a = b \land b = c \implies a = c$.

7. Is $>$ an equivalence relation?
   Answer: No.
   Derivation:

Reflexive Check: Is $a > a$? False.
Since it fails reflexivity, it is not an equivalence relation.

8. Is $\geq$ an equivalence relation?
   Answer: No.
   Derivation:

Reflexive: $a \geq a$ (True).

Symmetric Check: If $a \geq b$, does $b \geq a$?
Counter-example: $3 \geq 2$ is true, but $2 \geq 3$ is false.
Since it fails symmetry, it is not an equivalence relation (it is a partial order).

9. $A = \{x \in \mathbb{Z}^+ \mid 2 \mid x, x \le 30\}$.
   (a) Find $A$.
   Answer: $A = \{2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30\}$.
   Derivation: List all even positive integers up to 30.

(b) $B = \{x \in A \mid 6 \mid x\}, C = \{x \in A \mid 8 \mid x\}$. Find $B \cup C, B \cap C$.
Derivation:

Filter $A$ for multiples of 6: $B = \{6, 12, 18, 24, 30\}$.

Filter $A$ for multiples of 8: $C = \{8, 16, 24\}$.

Union ($x \in B \lor x \in C$): $B \cup C = \{6, 8, 12, 16, 18, 24, 30\}$.

Intersection ($x \in B \land x \in C$): $B \cap C = \{24\}$ (only common element).

10. $R$ on $M_{n \times n}: (A,B) \in R \iff A = PBP^{-1}$ (Similarity). Is $R$ equivalence?
    Answer: Yes.
    Derivation:

Reflexive: $A = I A I^{-1}$. (Let $P=I$, identity matrix).

Symmetric:
$A = P B P^{-1} \implies P^{-1} A P = B \implies B = (P^{-1}) A (P^{-1})^{-1}$.
Let $Q = P^{-1}$. Then $B \sim A$.

Transitive:
$A = P B P^{-1}$ and $B = Q C Q^{-1}$.
Substitute $B$: $A = P (Q C Q^{-1}) P^{-1} = (PQ) C (PQ)^{-1}$.
Since $PQ$ is invertible, $A \sim C$.

11. $A = \text{webpages}, (a,b) \in R \iff \exists \text{ common link}$. Properties?
    Derivation:

Reflexive: Page $a$ has common links with itself (assuming it has links). Yes.

Symmetric: If $a, b$ share a link, then $b, a$ share the same link. Yes.

Transitive: No.
Example: $a$ links to $\{1\}$. $b$ links to $\{1, 2\}$. $c$ links to $\{2\}$.
$a \sim b$ (share 1). $b \sim c$ (share 2).
But $a \nsim c$ (share nothing).

12. $A=\{1,2\}, R \text{ on } 2^A: (B,C) \in R \iff B \subseteq C$.
    (a) Matrix $M_R$.
    Derivation:
    Set $2^A = \{\emptyset, \{1\}, \{2\}, \{1,2\}\}$. Size $2^2=4$.
    Rows/Cols indexed by subsets. Entry is 1 if Row $\subseteq$ Col.

$\emptyset \subseteq$ All (Row 1 is all 1s).

$\{1\} \subseteq \{1\}, \{1,2\}$ (Row 2).

$\{2\} \subseteq \{2\}, \{1,2\}$ (Row 3).

$\{1,2\} \subseteq \{1,2\}$ (Row 4).

(b) Properties.
Answer: Partial Order (Refl, Antisym, Trans).

Antisymmetric: $B \subseteq C \land C \subseteq B \implies B=C$.

Not Symmetric: $\{1\} \subseteq \{1,2\}$ but $\{1,2\} \not\subseteq \{1\}$.

13. $A=\{a,b,c\}$ Matrix operations.
    (a) $R^{-1}$.
    Derivation: The inverse relation matrix is the transpose $M^T$.
    $M_R$ is symmetric (equal to its transpose), so $R^{-1} = R$.

(b) $\overline{R}$.
Derivation: The complement relation. Flip 0s to 1s and 1s to 0s in the matrix.

$$M_R = \begin{pmatrix} 0 & 1 & 1 \\ 1 & 1 & 0 \\ 1 & 0 & 1 \end{pmatrix} \xrightarrow{\text{flip}} \begin{pmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{pmatrix}$$

Pairs: $\{(a,a), (b,c), (c,b)\}$.

(c) $R^2$.
Derivation: Matrix multiplication (Boolean). Row $i$ dot Col $j$.
Row 1 $(0,1,1)$ $\cdot$ Col 1 $(0,1,1)$ = $(0\land0) \lor (1\land1) \lor (1\land1) = 1$.
Doing this for all yields the Universal relation (all 1s).

14. Determine if $R_1, R_2$ are equivalence relations.
    Derivation:

Check $R_1$: Matrix is not symmetric across the main diagonal ($m_{12} \neq m_{21}$). Equivalence relations must be symmetric. No.

Check $R_2$:

Diagonal is all 1s (Reflexive).

Symmetric ($m_{ij} = m_{ji}$).

Block structure implies Transitivity (elements 1,2,3 are fully connected; 4 is isolated). Yes.

15. $R$: Direct flights.
    (a) $R^2$:
    Derivation: $(a,c) \in R^2 \iff \exists b : (a,b) \in R \land (b,c) \in R$.
    This means flight $a \to b$ AND flight $b \to c$.
    Result: Flights with exactly one stopover (transit).

(b) $R^3$:
Derivation: Similar logic, chains of length 3.
Result: Flights with exactly two stopovers.

(c) $R^{-1}$:
Derivation: $(a,b) \in R^{-1} \iff (b,a) \in R$.
Result: Direct flight from $b$ back to $a$ (Return leg).

16. Reflexive closure of $R = \{(a,b) \in \mathbb{Z}^2 \mid a \neq b\}$.
    Answer: $\mathbb{Z} \times \mathbb{Z}$.
    Derivation:
    Reflexive closure = $R \cup \Delta$, where $\Delta = \{(a,a)\}$.
    Current $R$ contains all pairs where $a \neq b$.
    Adding all pairs where $a = b$ gives all possible pairs.

17. Symmetric closure of $R = \{(a,b) \in \mathbb{Z}^2 \mid a \mid b\}$.
    Answer: $\{(a,b) \mid a \mid b \lor b \mid a\}$.
    Derivation:
    Symmetric closure = $R \cup R^{-1}$.
    $R = \{(a,b) : a \text{ divides } b\}$.
    $R^{-1} = \{(a,b) : b \text{ divides } a\}$ (swapped roles).
    Union: $a$ divides $b$ OR $b$ divides $a$.

18. $R$: Students with common class.
    (a) $R^2$:
    Derivation: Student $a$ shares class with $b$, $b$ shares class with $c$.
    $a$ and $c$ have a "common classmate" ($b$).

19. Transitive closure $R^*$ using Warshall's.
    Derivation:
    Matrix represents graph $2 \to 1, 3 \to 2, 1 \to 3, 1 \to 4$.
    Path: $3 \to 2 \to 1 \to 4$.
    Also cycle $1 \to 3 \to 2 \to 1$.
    Because of the cycle $1-2-3$, these three elements become fully connected in the closure. 4 is a sink.
    Result $W_n$: Top $3 \times 4$ block is all 1s.

20. $R = \{(1,2), (2,1), (2,3), (3,4), (4,1)\}$.
    (b) Symm closure:
    Derivation: Add reverse edges for any missing one.
    Given $(2,3) \in R$, add $(3,2)$.
    Given $(3,4) \in R$, add $(4,3)$.
    Given $(4,1) \in R$, add $(1,4)$.
    $(1,2)$ already has $(2,1)$.

21. Similarity of matrices: Equivalence?
    Answer: Yes (See derivation in Q10).

22. Bit strings: $s \sim t \iff \#_1(s) = \#_1(t)$.
    (a) Equivalence?
    Derivation:
    The number of 1s, let's call it $w(s)$ (weight), is a function mapping strings to integers.
    Any relation defined by $x \sim y \iff f(x) = f(y)$ is an equivalence relation because equality ($=$) on the outputs is an equivalence relation.

(c) Count strings length $n$ with exactly two 1s.
Answer: $\binom{n}{2}$.
Derivation:
We have $n$ positions. We need to choose 2 positions to place the '1's.
The order of selection doesn't matter.
Combination formula: $\binom{n}{k} = \frac{n!}{k!(n-k)!}$.
Here $\binom{n}{2} = \frac{n(n-1)}{2}$.

24. Rationals: $(a,b) \sim (c,d) \iff ad = bc$.
    Derivation:
    Think of $(a,b)$ as the fraction $\frac{a}{b}$.
    Condition $ad = bc \iff \frac{a}{b} = \frac{c}{d}$.
    This relation represents equality of rational numbers. Since equality is an equivalence relation, so is this.

25. Partial Ordering?
    Derivation:
    Requires: Reflexive (diagonal 1s), Antisymmetric (no symmetry off diagonal), Transitive.

(a) Not Antisymmetric: $m_{12}=1$ and $m_{21}=1$. (Fails).

(b) Diagonal 1s. Upper triangular (Antisymmetric). Transitive? Yes. (Partial Order).

(c) Diagonal 1s. No symmetric off-diagonal pairs. Transitive? Yes. (Partial Order).

28. Hasse Diagrams (Derivation of Edges).
    Concept: Draw an edge $a \to b$ if $a < b$ and there is no $c$ such that $a < c < b$. (Immediate successor).
    (a) Divisibility on $\{2,4,5,10,12,20,25\}$

Start with minimal elements: 2, 5.

Next layer (multiples):

$2$ divides $4, 10, 12, 20$. Immediate? $2 \to 4, 2 \to 10$. ($12$ is $4 \times 3$, $20$ is $10 \times 2$ or $4 \times 5$, check coverage).

$12$ is covered by 4 ($4 \times 3$) and 2 ($2 \times 6$). Path $2 \to 4 \to 12$. So draw $4 \to 12$. (Is $2 \to 12$ immediate? No, 4 is in between).

$10$ is covered by 2 and 5. Draw $2 \to 10, 5 \to 10$.

$20$ is covered by 4 and 10. Draw $4 \to 20, 10 \to 20$.

$25$ is covered by 5. Draw $5 \to 25$.
