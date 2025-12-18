https://gemini.google.com/app/8bd2165ed46cc65d

### **Part I: Vectors and Coordinate Geometry**

1. t / f: A vector is a quantity determined solely by its magnitude.
2. t / f: Two vectors are equal if they have the same length and direction.
3. t / f: The vector \vec{AB} represents the directed segment from point B to point A.
4. t / f: Temperature and time are examples of vectors.
5. t / f: The zero vector \vec{0} has zero length and an undefined (or arbitrary) direction.
6. t / f: If \vec{a} = \vec{b}, then |\vec{a}| = |\vec{b}|.
7. t / f: The sum of two vectors \vec{a} + \vec{b} follows the commutative law.
8. t / f: Vector addition is not associative.
9. t / f: For any vector \vec{a}, the sum \vec{a} + (-\vec{a}) equals the zero scalar.
10. t / f: The difference \vec{a} - \vec{b} is defined as \vec{a} + (-\vec{b}).
11. t / f: Multiplying a vector by a scalar \lambda changes the vector's direction if \lambda < 0.
12. t / f: If \lambda = 0, the product \lambda \cdot \vec{a} is the scalar 0.
13. t / f: The length of \lambda \cdot \vec{a} is equal to \lambda times the length of \vec{a}.
14. t / f: A unit vector has a length of 1.
15. t / f: The standard basis vectors \vec{e_1}, \vec{e_2}, \vec{e_3} in \mathbb{R}^3 are orthogonal to each other.
16. t / f: Any vector in \mathbb{R}^3 can be expressed as a linear combination of standard basis vectors.
17. t / f: The vector subtraction \vec{x} - \vec{y} is performed component-wise.
18. t / f: A linear combination of vectors \vec{x}\_1, \dots, \vec{x}\_m must equal the zero vector.
19. t / f: The dot product of two vectors results in a vector.
20. t / f: In \mathbb{R}^2, \vec{a} \cdot \vec{b} = a_1 b_1 + a_2 b_2.
21. t / f: You can calculate the dot product of a vector in \mathbb{R}^2 and a vector in \mathbb{R}^3.
22. t / f: \vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}.
23. t / f: \vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{b} \cdot \vec{c}.
24. t / f: Two non-zero vectors are orthogonal if their dot product is 1.
25. t / f: The norm of a vector |\vec{a}| is calculated as \sqrt{\vec{a} \cdot \vec{a}}.
26. t / f: The distance between points A and B is given by |\vec{A} + \vec{B}|.
27. t / f: If |\vec{a} + \vec{b}|^2 = |\vec{a}|^2 + |\vec{b}|^2, then vectors \vec{a} and \vec{b} are perpendicular.
28. t / f: The angle \varphi between two vectors can be found using \cos(\varphi) = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| |\vec{b}|}.
29. t / f: If \vec{a} \cdot \vec{b} > 0, the angle between them is obtuse (> 90^\circ).
30. t / f: The Cauchy-Schwarz inequality relates the dot product to the norms of the vectors.

### **Part II: Linear Equation Systems (LES)**

31. t / f: A linear equation can involve variables multiplied together (e.g., x_1 x_2).
32. t / f: A system of linear equations is consistent if it has at least one solution.
33. t / f: An inconsistent system has infinitely many solutions.
34. t / f: A homogeneous linear system always has at least one solution.
35. t / f: If the constant terms b_i are all zero, the system is inhomogeneous.
36. t / f: Two LES are equivalent if they have the same solution set.
37. t / f: Multiplying an equation by a zero constant is a valid elementary row operation.
38. t / f: Interchanging two equations produces an equivalent system.
39. t / f: A matrix is a rectangular array of numbers.
40. t / f: A matrix with m rows and n columns is of size n \times m.
41. t / f: The main diagonal of a matrix consists of entries a\_{ij} where i \neq j.
42. t / f: An augmented matrix includes the constants from the right-hand side of the LES.
43. t / f: In row echelon form, all nonzero rows are below any rows of all zeros.
44. t / f: In row echelon form, the leading entry of a row is to the right of the leading entry of the row above it.
45. t / f: A system in row echelon form can be solved using back-substitution.
46. t / f: Gaussian elimination transforms a matrix into reduced row-echelon form directly.
47. t / f: Reduced row-echelon form requires leading entries to be 1.
48. t / f: In reduced row-echelon form, columns with leading 1s can have non-zero entries above the pivot.
49. t / f: The rank of a matrix is the number of nonzero rows in its row-echelon form.
50. t / f: If rank(A) < number of variables, a consistent system has a unique solution.
51. t / f: If rank(A) = number of variables, a consistent system has a unique solution.
52. t / f: A homogeneous system with more variables than equations has infinitely many solutions.
53. t / f: A square LES has a unique solution if and only if its rank equals the number of unknowns.
54. t / f: Free variables correspond to columns without pivots.
55. t / f: Gauss-Jordan elimination is used to solve for variables explicitly in the matrix.
56. t / f: A system with a contradiction (e.g., 0=5 in a row) is consistent.
57. t / f: The trivial solution is the vector where all components are 1.
58. t / f: A pivot column is a column that contains a leading entry.
59. t / f: Elementary row operations can change the rank of a matrix.
60. t / f: If the augmented matrix has a row [0 \dots 0 | 0], the system is inconsistent.

### **Part III: Matrices**

61. t / f: A column vector is a matrix of size m \times 1.
62. t / f: Two matrices are equal if they have the same size and identical entries.
63. t / f: Matrix addition is only defined for matrices of the same size.
64. t / f: Matrix addition is commutative (A+B = B+A).
65. t / f: Scalar multiplication multiplies only the diagonal elements of a matrix.
66. t / f: Matrix multiplication is commutative (AB = BA) for all square matrices.
67. t / f: The product AB is defined only if the number of columns in A equals the number of rows in B.
68. t / f: If A is 2 \times 3 and B is 3 \times 4, then AB is 2 \times 4.
69. t / f: The entry c\_{ij} of C=AB is the dot product of the i-th row of A and the j-th column of B.
70. t / f: The distributive law A(B+C) = AB + AC holds for matrices.
71. t / f: If AB = 0, then either A=0 or B=0.
72. t / f: The transpose of a matrix A is obtained by swapping its rows and columns.
73. t / f: (A+B)^T = A^T + B^T.
74. t / f: (AB)^T = A^T B^T.
75. t / f: A symmetric matrix satisfies A = A^T.
76. t / f: A zero matrix acts as the identity for matrix addition.
77. t / f: A diagonal matrix has zeros everywhere except possibly on the main diagonal.
78. t / f: The identity matrix I is a scalar matrix with all entries equal to 1.
79. t / f: An upper triangular matrix has zeros above the main diagonal.
80. t / f: A square matrix A is regular if rank(A) = n.
81. t / f: A singular matrix has an inverse.
82. t / f: If A is invertible, then AB=AC implies B=C.
83. t / f: The inverse of A^{-1} is A.
84. t / f: (AB)^{-1} = A^{-1} B^{-1}.
85. t / f: We can compute the inverse of A by row reducing [A|I] to [I|A^{-1}].
86. t / f: If A is invertible, the system Ax=b has the unique solution x=A^{-1}b.
87. t / f: A^0 = I for any square matrix A.
88. t / f: (cA)^{-1} = c A^{-1} for a scalar c.
89. t / f: A matrix with a row of zeros cannot be invertible.
90. t / f: The transpose of an invertible matrix is invertible.

### **Part IV: Determinants**

91. t / f: The determinant is a vector assigned to a square matrix.
92. t / f: det(A) = 0 implies A is not invertible.
93. t / f: For a 2 \times 2 matrix, det \begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad + bc.
94. t / f: Sarrus' rule applies to matrices of any size.
95. t / f: The determinant of a triangular matrix is the product of its diagonal entries.
96. t / f: Swapping two rows of a matrix changes the sign of the determinant.
97. t / f: Multiplying a row by a scalar k multiplies the determinant by k.
98. t / f: Adding a multiple of one row to another changes the value of the determinant.
99. t / f: If a matrix has two identical rows, its determinant is 0.
100.  t / f: det(AB) = det(A) + det(B).
101.  t / f: det(A^T) = det(A).
102.  t / f: det(A^{-1}) = 1 / det(A).
103.  t / f: det(A+B) = det(A) + det(B) is generally false.
104.  t / f: A cofactor C*{ij} is defined as (-1)^{i+j} M*{ij}.
105.  t / f: Cofactor expansion can only be done along the first row.
106.  t / f: Cramer's rule is an efficient method for solving large systems of linear equations.
107.  t / f: Cramer's rule requires det(A) \neq 0.
108.  t / f: The adjoint matrix is the transpose of the cofactor matrix.
109.  t / f: A^{-1} = \frac{1}{\det(A)} \text{adj}(A).
110.  t / f: The determinant of an identity matrix is 0.
111.  t / f: A matrix with a zero column has a determinant of 0.
112.  t / f: If rows are linearly dependent, the determinant is 0.
113.  t / f: The absolute value of the determinant represents volume in \mathbb{R}^n.
114.  t / f: det(kA) = k det(A) for an n \times n matrix.
115.  t / f: Given a square matrix A such that det A = 0. Then the system Ax = 0 has non-trivial solutions.
116.  t / f: The minor M\_{ij} is the determinant of the submatrix leaving out row i and column j.
117.  t / f: Calculating a 25 \times 25 determinant by cofactor expansion is computationally fast.
118.  t / f: A regular matrix has a non-zero determinant.
119.  t / f: If det(A) = 4, then det(A^2) = 16.
120.  t / f: For a 3 \times 3 matrix, det(-A) = -det(A).

### **Part V: Vector Spaces**

121. t / f: \mathbb{R}^n is a vector space.
122. t / f: A vector space must be closed under vector addition and scalar multiplication.
123. t / f: The set of all integers is a vector space.
124. t / f: A subspace W must contain the zero vector.
125. t / f: The intersection of two subspaces is a subspace.
126. t / f: The union of two subspaces is always a subspace.
127. t / f: The set of all solutions to a homogeneous linear system is a subspace.
128. t / f: The set of solutions to an inhomogeneous system Ax=b (b \neq 0) is a subspace.
129. t / f: The span of a set of vectors is the set of all their linear combinations.
130. t / f: A set of vectors S spans V if every vector in V is a linear combination of S.
131. t / f: A set of vectors is linearly independent if the only solution to \sum c_i v_i = 0 is the trivial solution.
132. t / f: A set containing the zero vector is linearly dependent.
133. t / f: Two vectors in \mathbb{R}^2 are linearly dependent if they lie on the same line through the origin.
134. t / f: A basis is a linearly independent spanning set.
135. t / f: The standard basis for \mathbb{R}^3 has 3 elements.
136. t / f: All bases of a finite-dimensional vector space have the same number of elements.
137. t / f: The dimension of a vector space is the number of elements in its basis.
138. t / f: dim(\mathbb{R}^n) = n.
139. t / f: dim(M\_{m \times n}) = m + n.
140. t / f: If a set has more vectors than the dimension of the space, it must be linearly dependent.
141. t / f: If a set has fewer vectors than the dimension, it cannot span the space.
142. t / f: The null space of a matrix A is \{x \mid Ax = 0\}.
143. t / f: The column space of A is the span of its row vectors.
144. t / f: The dimension of the column space is the rank of the matrix.
145. t / f: Nullity is the dimension of the null space.
146. t / f: Rank(A) + Nullity(A) = number of columns of A.
147. t / f: Row operations change the column space of a matrix.
148. t / f: Row operations do not change the row space of a matrix.
149. t / f: Row operations do not change the null space of a matrix.
150. t / f: A basis for the column space is formed by the pivot columns of the original matrix.
151. t / f: Polynomials of degree \leq n form a vector space of dimension n.
152. t / f: P_2(x) has dimension 3.
153. t / f: The set of invertible 2 \times 2 matrices is a subspace of M\_{2 \times 2}.
154. t / f: Let S be a spanning set for a finite dimensional vector space V. Then, the dimension of V is equal to |S|.
155. t / f: Removing a vector from a linearly dependent set always leaves a linearly independent set.
156. t / f: Adding a vector to a spanning set still results in a spanning set.
157. t / f: A single non-zero vector is always linearly independent.
158. t / f: The dimension of the zero vector space \{0\} is 1.
159. t / f: The row space and column space have the same dimension.
160. t / f: Coordinates of a vector relative to a basis are unique.

### **Part VI: Linear Mappings**

161. t / f: A linear mapping must satisfy T(u+v) = T(u) + T(v).
162. t / f: A linear mapping must satisfy T(cu) = c T(u).
163. t / f: T(0) must equal 0 for a linear map.
164. t / f: f(x) = x^2 is a linear mapping.
165. t / f: Matrix multiplication T(v) = Av defines a linear mapping.
166. t / f: The kernel of T is the set of vectors that map to the zero vector.
167. t / f: The kernel of a linear transformation is a subspace of the domain.
168. t / f: The image (or range) of T is a subspace of the codomain.
169. t / f: A linear map is uniquely determined by its action on a basis.
170. t / f: Differentiation is a linear mapping on the space of polynomials.
171. t / f: The matrix of a linear transformation depends on the chosen bases.
172. t / f: The composition of two linear transformations is linear.
173. t / f: If the kernel of T is \{0\}, then T is one-to-one (injective).
174. t / f: A projection is a linear transformation.
175. t / f: Translation T(v) = v + a (a \neq 0) is a linear transformation.
176. t / f: The change-of-coordinates matrix is always invertible.
177. t / f: If A is the matrix of T relative to standard bases, then [T(x)] = A[x].
178. t / f: The rank of the transformation matrix is the dimension of the image of T.
179. t / f: Rotation about the origin is a linear mapping.
180. t / f: The kernel of the matrix transformation x \mapsto Ax is the null space of A.

### **Part VII: General Algebra (Logic & Sets)**

181. t / f: A statement is a sentence that is either true or false.
182. t / f: "What time is it?" is a statement.
183. t / f: The negation of True is False.
184. t / f: p \land q is true only if both p and q are true.
185. t / f: p \lor q is false only if both p and q are false.
186. t / f: The conditional p \Rightarrow q is false only when p is true and q is false.
187. t / f: A tautology is a statement that is always true.
188. t / f: A contradiction is a statement that is always false.
189. t / f: Two statements are logically equivalent if they have the same truth table.
190. t / f: \neg(p \land q) is equivalent to \neg p \land \neg q (De Morgan's Law).
191. t / f: p \Rightarrow q is equivalent to \neg p \lor q.
192. t / f: The order of precedence for logic operators places \neg (not) highest.
193. t / f: A set is an unordered collection of distinct objects.
194. t / f: \{1, 2, 3\} = \{3, 1, 2\}.
195. t / f: The empty set \emptyset is a subset of every set.
196. t / f: The power set of a set with n elements has 2^n elements.
197. t / f: The intersection A \cap B contains elements in both A and B.
198. t / f: The union A \cup B contains elements in A or B (or both).
199. t / f: The difference A - B contains elements in B but not in A.
200. t / f: Two sets are disjoint if their intersection is the empty set.
201. t / f: The Cartesian product A \times B consists of unordered pairs.
202. t / f: |A \times B| = |A| + |B|.
203. t / f: Sets can be represented by bit strings in a computer.
204. t / f: Modus Ponens is a valid rule of inference.
205. t / f: p \Leftrightarrow q is true when p and q have different truth values.
206. t / f: "If p then q" is the same as "p only if q".
207. t / f: The set of rational numbers is denoted by \mathbb{Q}.
208. t / f: The complement \bar{A} depends on the universal set U.
209. t / f: Identity law: p \land T \Leftrightarrow p.
210. t / f: Double negative: \neg(\neg p) \Leftrightarrow p.

### **Part VIII: Relations**

211. t / f: A binary relation from A to B is a subset of A \times B.
212. t / f: A relation R on A is reflexive if (a, a) \in R for all a \in A.
213. t / f: A relation is symmetric if (a, b) \in R implies (b, a) \in R.
214. t / f: A relation is antisymmetric if (a, b) \in R and (b, a) \in R implies a=b.
215. t / f: The "less than or equal to" (\leq) relation is symmetric.
216. t / f: The "strictly less than" (<) relation is transitive.
217. t / f: An equivalence relation must be reflexive, symmetric, and transitive.
218. t / f: Equivalence classes of an equivalence relation partition the set.
219. t / f: The relation "is parallel to" is an equivalence relation.
220. t / f: A partial ordering is reflexive, antisymmetric, and transitive.
221. t / f: In a poset, every pair of elements must be comparable.
222. t / f: A totally ordered set (chain) is a poset where every pair is comparable.
223. t / f: The transitive closure of a relation R is the smallest transitive relation containing R.
224. t / f: R^2 represents the composition R \circ R.
225. t / f: Warshall's algorithm is used to compute the transitive closure.
226. t / f: A Hasse diagram represents a partial ordering.
227. t / f: Loops (self-loops) are typically drawn in a Hasse diagram.
228. t / f: The relation represented by the identity matrix is reflexive.
229. t / f: If a relation matrix is symmetric (M = M^T), the relation is symmetric.
230. t / f: The composite of two functions is denoted f \circ g.
231. t / f: Lexicographic order is a way to order Cartesian products of posets.
232. t / f: n-ary relations are used in relational databases.
233. t / f: A primary key uniquely identifies a record in a database relation.
234. t / f: The projection operator in databases selects specific columns.
235. t / f: The selection operator in databases selects specific rows based on a condition.
236. t / f: The inverse relation R^{-1} consists of pairs (b, a) where (a, b) \in R.
237. t / f: The union of two reflexive relations is reflexive.
238. t / f: The intersection of two equivalence relations is an equivalence relation.
239. t / f: Congruence modulo n is an equivalence relation on integers.
240. t / f: A relation can be both symmetric and antisymmetric.

### **Part IX: Number Theory and Cryptography**

241. t / f: If a divides b, then b is a multiple of a.
242. t / f: If a|b and a|c, then a|(b+c).
243. t / f: A prime number has exactly two distinct positive divisors.
244. t / f: 1 is a prime number.
245. t / f: Every integer >1 has a unique prime factorization.
246. t / f: gcd(a, b) is the largest integer that divides both a and b.
247. t / f: lcm(a, b) is the smallest positive integer divisible by both a and b.
248. t / f: ab = \text{gcd}(a, b) \cdot \text{lcm}(a, b) for positive integers.
249. t / f: Two numbers are relatively prime if their gcd is 1.
250. t / f: a \mod n is the remainder when a is divided by n.
251. t / f: -2020 \mod 7 = 4.
252. t / f: (a + b) \mod n = ((a \mod n) + (b \mod n)) \mod n.
253. t / f: Euclid's algorithm is used to find the lcm of two numbers.
254. t / f: Bezout's theorem states gcd(a, b) can be written as ax + by.
255. t / f: The extended Euclidean algorithm finds the coefficients x and y for Bezout's identity.
256. t / f: \mathbb{Z}\_n is the set of integers \{1, \dots, n\}.
257. t / f: An inverse of a modulo n exists if and only if gcd(a, n) = 1.
258. t / f: 3 is the multiplicative inverse of 2 in \mathbb{Z}\_5.
259. t / f: Euler's totient function \phi(n) counts positive integers \leq n relatively prime to n.
260. t / f: If p is prime, \phi(p) = p - 1.
261. t / f: \phi(pq) = (p-1)(q-1) if p and q are distinct primes.
262. t / f: Fermat's Little Theorem states a^{p-1} \equiv 1 \mod p if p is prime and does not divide a.
263. t / f: RSA is a private-key cryptosystem.
264. t / f: In RSA, the public key consists of (n, e).
265. t / f: In RSA, n is the product of two large primes.
266. t / f: In RSA, the decryption exponent d is the inverse of e modulo \phi(n).
267. t / f: Caesar cipher is a substitution cipher.
268. t / f: In a shift cipher, f(p) = (p + k) \mod 26.
269. t / f: Public key cryptography allows anyone to encrypt a message, but only the holder of the private key can decrypt it.
270. t / f: Integer factorization is considered a "hard" problem, which secures RSA.
271. t / f: a \equiv b \mod n means n divides a - b.
272. t / f: A composite number is a positive integer that is not prime.
273. t / f: There are infinitely many prime numbers.
274. t / f: Modulo arithmetic arithmetic wraps around like a clock.
275. t / f: If p is prime, then \mathbb{Z}\_p is a field (every non-zero element has an inverse).
276. t / f: The prime number theorem gives an exact formula for the n-th prime. (Course content usually implies approximation or properties, statement is False).
277. t / f: Kerckhoff's principle states that security should rely on keeping the algorithm secret.
278. t / f: A hash function maps inputs of arbitrary length to fixed-length outputs.
279. t / f: ISBN codes use modular arithmetic for error checking.
280. t / f: Fast modular exponentiation uses the binary expansion of the exponent.

### **Part X: Miscellaneous & Integrative Checks**

281. t / f: All linear transformations from \mathbb{R}^n to \mathbb{R}^m can be represented by matrices.
282. t / f: The rank of a matrix equals the dimension of its image.
283. t / f: If A is n \times n and invertible, its columns form a basis for \mathbb{R}^n.
284. t / f: A set of vectors is a basis if it is a maximal linearly independent set.
285. t / f: The intersection of a plane through the origin and a line through the origin in \mathbb{R}^3 is always a subspace.
286. t / f: If T is linear, T(\vec{0}) = \vec{0}.
287. t / f: If A^2 = A, then A is called idempotent.
288. t / f: The inverse of a diagonal matrix is diagonal.
289. t / f: If A is orthogonal, then A^T = A^{-1}.
290. t / f: A system Ax=b has a solution if b is in the column space of A.
291. t / f: The dimension of M\_{2 \times 3} is 6.
292. t / f: The set of polynomials 1, x, x^2 is linearly independent.
293. t / f: The relation x^2 + y^2 = 1 defines a function.
294. t / f: \neg (\forall x P(x)) \Leftrightarrow \exists x \neg P(x).
295. t / f: A graph of an equivalence relation consists of disjoint cliques (complete graphs with self-loops).
296. t / f: For RSA, gcd(e, \phi(n)) must be 1.
297. t / f: If ab \equiv 0 \mod n, then a \equiv 0 or b \equiv 0 (for composite n).
298. t / f: 13 is a prime number.
299. t / f: The Euclidean algorithm terminates because the remainders strictly decrease.
