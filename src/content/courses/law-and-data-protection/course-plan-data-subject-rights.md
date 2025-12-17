# Course Plan: Data Subject Rights (The Users Strike Back)

## Context

We have covered the **Definition of Data** (Module 4) and the **Rules for Controllers** (Module 5). Now, the power dynamic shifts. The GDPR isn't just about what companies *must* do; it's about what users *can* demand. This module covers **Chapter 3 of the GDPR (Articles 12-23)**, detailing the rights of data subjects. For Bob, this means his "DataVault" app needs new features: export buttons, delete functions, and transparency dashboards.

## Narrative Continuation

Bob thought he was done after securing his database and writing a privacy policy. But then the emails start coming in. "Send me all my data." "Delete my account." "Stop analyzing my clicks." Bob realizes his app is a "Hotel California"—you can check in, but you can never leave. Alice tells him he needs to build "Exit Doors" and "Control Panels" to comply with Data Subject Rights (DSRs).

---

## Module 6: Data Subject Rights
**Source Material**: "Data Subjects Rights" (Slides 1-25)

### Lesson 19: The Transparency Window (Right to be Informed)
- **Story**: Bob thinks a 50-page "Terms of Service" in legalese is enough. Alice corrects him: "It must be concise, transparent, intelligible, and easily accessible." They design a "Layered Privacy Notice" for DataVault that actually makes sense to humans.
- **Learning Objectives**:
  - Understand the obligation to provide information (Articles 13 & 14).
  - Distinguish between Direct Collection (Art 13) and Indirect Collection (Art 14).
  - Identify *what* information must be provided (Identity, Purpose, Rights, Retention).
  - Master the "Layered Approach" to transparency.
- **Key Concepts**: Right to be Informed, Layered Notice, Intelligibility, Article 13 vs 14.
- **Source Mapping**: Slides 1-7 (General & Direct), Slides 15-16 (Exceptions/Methods).
- **Interactivity**: 
  - *Notice Builder*: Bob has a messy text block. You must drag and drop the correct sections (Identity, Purpose, Rights) into a "Layered Notice" UI to make it readable.

### Lesson 20: The "Give Me Everything" Button (Right of Access & Portability)
- **Story**: A user writes: "I want to see what you have on me." Bob prints out a SQL dump. Alice sighs. "They need to understand it, Bob." Then another user asks to move their playlist to a competitor. Bob feels betrayed, but Alice explains the **Right to Data Portability**.
- **Learning Objectives**:
  - Define Right of Access (Art 15): Confirmation, Copy, and Context.
  - Define Right to Data Portability (Art 20): Structured, Commonly Used, Machine-Readable.
  - Distinguish between "Access" (seeing data) and "Portability" (moving data).
  - Understand "Interoperability".
- **Key Concepts**: Subject Access Request (SAR), Data Portability, Interoperability, CSV/JSON formats.
- **Source Mapping**: Slides 8 (Access), Slides 18-20 (Portability).
- **Interactivity**: 
  - *Format Checker*: You receive a request for Portability. You have data in `ProprietaryBinaryBlob`, `HandwrittenNotes`, and `JSON`. Choose which format complies with the "Structured & Machine-Readable" requirement.

### Lesson 21: The History Eraser (Right to Rectification & Erasure)
- **Story**: A user gets married and changes their name (Rectification). Another user quits the platform and demands "Delete everything!" (Erasure). Bob panics: "But what about the invoices? I need those for tax!" Alice teaches him that the "Right to be Forgotten" is not absolute.
- **Learning Objectives**:
  - Define Right to Rectification (Art 16): Correcting inaccurate or incomplete data.
  - Define Right to Erasure (Art 17): Grounds for deletion (No longer necessary, Consent withdrawn).
  - Identify **Exceptions**: Legal Obligations, Public Interest, Defense of Claims.
  - Understand "Manifestly Unfounded or Excessive" requests.
- **Key Concepts**: Right to be Forgotten, Rectification, Undue Delay, Excessive Requests.
- **Source Mapping**: Slides 9-11 (Rectification), Slides 12-15 (Erasure).
- **Interactivity**: 
  - *The Erasure Judge*: Users submit deletion requests. You must HIT or HOLD based on the context (e.g., "Delete my forum posts" -> HIT; "Delete my unpaid bill" -> HOLD).

### Lesson 22: The Emergency Brake (Right to Restriction & Objection)
- **Story**: A user disputes a debt amount. They don't want it deleted, just "frozen" until resolved (Restriction). Another user screams "STOPEMAILINGME" (Objection). Bob learns to add "Pause" buttons and "Unsubscribe" links that actually work immediately.
- **Learning Objectives**:
  - Define Right to Restriction (Art 18): Freezing data without deleting it.
  - Define Right to Object (Art 21): Stopping processing based on "Legitimate Interest" or "Public Task".
  - Understand the **Absolute Right** to object to Direct Marketing.
- **Key Concepts**: Restriction of Processing, Right to Object, Direct Marketing, Legitimate Interest Balancing.
- **Source Mapping**: Slides 16-17 (Restriction), Slides 20-22 (Objection).
- **Interactivity**: 
  - *The Marketing Switch*: Design a compliant "Unsubscribe" flow. When a user objects to marketing, what happens to their email in the database? (Delete? No, move to a "Suppression List").

### Lesson 23: The Black Box (Automated Decision Making)
- **Story**: Bob deploys "LoanBot 3000" to automatically approve or deny credit. It rejects Alice (the lawyer) because she lives in a "high-risk" zip code. Alice sues. She demands "Human Intervention." Bob learns that computers shouldn't decide people's fate without supervision.
- **Learning Objectives**:
  - Define Automated Individual Decision-Making (Art 22).
  - Understand "Solely Automated" vs "Human in the Loop".
  - Explain "Legal or Similarly Significant Effects".
  - Discuss the right to obtain an explanation of the logic.
- **Key Concepts**: Profiling, Automated Decision Making (ADM), Human Intervention, Meaningful Information.
- **Source Mapping**: Slides 22-24 (ADM & Profiling).
- **Interactivity**: 
  - *Human in the Loop*: Review an AI decision workflow. Spot where the "Human Intervention" should happen to make it GDPR compliant.
