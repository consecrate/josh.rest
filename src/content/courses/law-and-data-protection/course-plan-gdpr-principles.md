# Course Plan: GDPR Principles (The Rules)

## Context

Having understood _what_ data is (Module 4), Bob now faces the core rules of _how_ to handle it. This module covers **Article 5 of the GDPR**, known as the "Principles." These are not optional guidelines; they are the iron laws of data protection. Violating them attracts the maximum fines (up to €20M or 4% of revenue).

## Narrative Continuation

Bob has his database schema ready. Now he wants to launch features: a newsletter, a credit check system, and an AI recommendation engine. For every feature, Alice (his legal co-founder) stops him and asks: "Which principle allows this?" Bob learns that he can't just "do things" with data anymore; he needs a justification and a plan for every single byte.

---

## Module 5: GDPR Principles

**Source Material**: "GDPR Principles" (Slides 1-141)

### Lesson 11: The Golden Rule (Lawfulness, Fairness, Transparency)

- **Story**: Bob wants to buy an email list to jumpstart his user base. "It's lawful if I pay for it!" he argues. Alice explains that **Lawfulness** means having a valid legal basis (Article 6), **Fairness** means not tricking people, and **Transparency** means telling them the truth. The purchased list fails all three.
- **Learning Objectives**:
  - Understand the triad of Article 5(1)(a): Lawfulness, Fairness, Transparency.
  - Distinguish between "Legal" (having a basis) and "Fair" (meeting expectations).
  - Analyze "Adverse Effects"—how data processing can harm people (e.g., price discrimination).
- **Key Concepts**: Article 5(1)(a), Lawfulness, Fairness (Reasonable Expectations), Transparency, Adverse Effects.
- **Source Mapping**: Slides 1-9, 58-68 (Fairness/Transparency details).
- **Interactivity**:
  - _The Fairness Meter_: Rate scenarios on a scale of "Fair" to "Creepy" (e.g., "App tracks location for delivery" vs "App tracks location to sell to advertisers").

### Lesson 12: The Legal Basis Buffet (Lawfulness Deep Dive)

- **Story**: Bob realizes he needs a "Lawful Basis" for everything. He tries to force users to "Consent" to everything in the signup flow. Alice stops him: "You don't need consent to ship the product!" They explore the **6 Lawful Bases** like a menu—choosing the right one for the right task (Contract for shipping, Legal Obligation for taxes, Legitimate Interest for fraud checks).
- **Learning Objectives**:
  - Memorize the 6 Lawful Bases (Consent, Contract, Legal Obligation, Vital Interests, Public Task, Legitimate Interests).
  - Match real-world processing activities to the correct basis.
  - Understand why "Consent" is often the _worst_ basis to choose for core services.
- **Key Concepts**: Article 6, The 6 Bases, Necessity, Vital Interests vs. Public Task.
- **Source Mapping**: Slides 10-12, 28-41.
- **Interactivity**:
  - _Basis Matcher_: Drag cards (e.g., "Processing Credit Card", "Saving Life in ER", "Sending Newsletter") to the correct Lawful Basis slot.

### Lesson 13: The Consent Trap (Valid Consent)

- **Story**: Bob decides to send marketing emails. He adds a pre-ticked box saying "I love spam" to his checkout. Alice shreds it. "Silence is not consent, Bob." They engineer a valid consent flow: Granular, Opt-in, and Easy to Withdraw.
- **Learning Objectives**:
  - Define the 4 conditions of valid consent: Freely Given, Specific, Informed, Unambiguous.
  - Explain why "Bundled Consent" (TOS) is invalid.
  - Understand the "Right to Withdraw" (it must be as easy to leave as to join).
- **Key Concepts**: Article 7, Opt-in vs Opt-out, Granularity, Withdrawal, Pre-ticked boxes.
- **Source Mapping**: Slides 13-27.
- **Interactivity**:
  - _Fix the Form_: You are given a "Dark Pattern" signup form. You must remove the pre-checked boxes and unbundle the terms to make it GDPR compliant.

### Lesson 14: Stay on Target (Purpose Limitation)

- **Story**: Bob's AI team wants to use the "Shipping Address" database to train a "Wealth Predictor" model based on neighborhoods. Alice intervenes: "We collected addresses for _shipping_, not _profiling_." This is **Purpose Limitation**. You can't swap purposes mid-stream unless it's "Compatible."
- **Learning Objectives**:
  - Define Purpose Limitation: Specified, Explicit, Legitimate.
  - Analyze "Compatibility"—when can you repurpose data? (e.g., Stats/Research is okay; Marketing usually isn't).
  - Understand the consequences of "Function Creep."
- **Key Concepts**: Article 5(1)(b), Purpose Specification, Compatible Purpose, Function Creep.
- **Source Mapping**: Slides 69-78.
- **Interactivity**:
  - _Pivot or Pause?_: Bob wants to use data X for new purpose Y. You decide: Is it "Compatible" (Go ahead) or "Incompatible" (Get new consent)?

### Lesson 15: The Diet (Data Minimization)

- **Story**: Bob's database schema includes fields for "Religion" and "Shoe Size" just in case. "Data is the new oil!" he says. Alice replies, "Data is the new toxic waste." They apply **Data Minimization**: collecting only what is _strictly necessary_ for the immediate purpose.
- **Learning Objectives**:
  - Define Data Minimization: Adequate, Relevant, Limited.
  - Differentiate between "Nice to have" and "Necessary."
  - Analyze the risks of hoarding excessive data (Liability > Asset).
- **Key Concepts**: Article 5(1)(c), Necessity, Proportionality, Data Hoarding.
- **Source Mapping**: Slides 79-93.
- **Interactivity**:
  - _Schema Audit_: Delete columns from a database table that aren't necessary for the stated purpose (e.g., deleting "Date of Birth" from a "Newsletter Subscription" table).

### Lesson 16: Clean Up Your Room (Accuracy & Storage Limitation)

- **Story**: A user complains that DataVault is sending bills to their old address. Bob forgot to update it (**Accuracy**). Then, he finds a backup hard drive from 2010. "Why are we keeping this?" Alice introduces **Storage Limitation**: data must have an expiration date.
- **Learning Objectives**:
  - Define Accuracy: Keeping data correct and up-to-date.
  - Define Storage Limitation: No indefinite retention.
  - Discuss "Right to Rectification" and Retention Schedules.
- **Key Concepts**: Article 5(1)(d) & (e), Data Decay, Retention Policies, Historical Archiving exceptions.
- **Source Mapping**: Slides 94-114.
- **Interactivity**:
  - _The Shredder_: You are the retention script. Based on the policy (e.g., "Tax records: 7 years", "CCTV: 30 days"), decide which files to delete and which to keep.

### Lesson 17: Fort Knox (Integrity & Confidentiality)

- **Story**: Bob leaves his laptop open at a coffee shop. Alice has a heart attack. She explains the **Security Principle** (Integrity & Confidentiality). It's not just about encryption; it's about organizational measures (locking screens, access controls) and preventing accidental loss (backups).
- **Learning Objectives**:
  - Define Integrity (Data is not altered) and Confidentiality (Data is not seen by unauthorized people).
  - Understand Article 32: Technical vs. Organizational measures.
  - Discuss the "Risk-Based Approach" to security.
- **Key Concepts**: Article 5(1)(f), CIA Triad (Confidentiality, Integrity, Availability), Encryption, Pseudonymisation.
- **Source Mapping**: Slides 115-126.
- **Interactivity**:
  - _Security Audit_: Identify vulnerabilities in Bob's office photo (e.g., password on post-it, unlocked screen, open window).

### Lesson 18: Prove It (Accountability)

- **Story**: A Data Protection Authority (DPA) sends a letter: "Demonstrate compliance." Bob says, "I follow the rules!" The DPA says, "Show me the logs." Bob learns that **Accountability** means the burden of proof is on _him_. He must document every decision, policy, and breach.
- **Learning Objectives**:
  - Define Accountability: The "Boss Principle" that governs all others.
  - Understand the shift of Burden of Proof to the Controller.
  - List the tools of accountability: Records of Processing (ROPA), DPO, Impact Assessments (DPIA).
- **Key Concepts**: Article 5(2), Article 24, Burden of Proof, Compliance Documentation.
- **Source Mapping**: Slides 127-141.
- **Interactivity**:
  - _The Auditor_: Review Bob's "Compliance Folder." What's missing? (e.g., No Privacy Policy, No Data Breach Log, No Vendor Contracts).
