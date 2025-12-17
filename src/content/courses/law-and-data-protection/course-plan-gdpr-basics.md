# Course Plan: GDPR Fundamentals (The Data)

## Context
Continuing from "The Global Stage," we now zoom in on the core atom of the GDPR: **Data itself**. Before Bob can apply rules (Principles) or handle requests (Rights), he must understand *what* he is holding. Is a dynamic IP address personal data? Is an encrypted email safe? This module clears up the technical definitions that developers often get wrong.

## Narrative Continuation
Bob has accepted that GDPR applies to his startup, "DataVault." Now he's auditing his database schema and feature roadmap. He's constantly trying to find loopholes ("If I hash it, it's not data, right?"), and Alice (his legal/security advisor) keeps correcting his dangerous assumptions.

---

## Module 4: The Anatomy of Data
**Source Material**: "Basics of the GDPR" (Slides 1-30)

### Lesson 7: The Scope of "Personal"
- **Story**: Bob is cleaning up his database. He argues that "User_ID_99" and "Browser Fingerprint" are just technical metadata, not "people." Alice explains the concept of "Identifiability" and the "Mosaic Effect"—how isolated data points can be combined to single someone out. They also define what *isn't* personal data (corporate info, deceased persons) so Bob can stop worrying about the wrong things.
- **Learning Objectives**:
  - Define "Personal Data" (Identified vs. Identifiable).
  - Understand the threshold of "Reasonable Means" for identification.
  - Distinguish between "Direct" (Name) and "Indirect" (IP, patterns) identification.
  - List valid forms of data (Text, CCTV, Biological).
- **Key Concepts**: Natural Person, Identifiability, Singling Out, Reasonable Means, Corporate Data Exemption.
- **Source Mapping**: Slides 1-9, 13-15, 30 (What is not data).
- **Interactivity**: 
  - *Sorting Game*: "Personal or Not?" (Sort items like "Company Registration Number", "Dynamic IP", "John Doe's Email", "Grandmother's Death Cert" into buckets).

### Lesson 8: Radioactive Data (Special Categories)
- **Story**: Bob's marketing team suggests a "Mental Health Awareness" campaign where users track their mood and political leanings. Bob thinks it's great engagement. Alice hits the emergency brake: this is "Special Category Data" (Article 9). Bob learns that some data is "radioactive"—strictly regulated and requiring higher justification.
- **Learning Objectives**:
  - Identify "Special Categories" of data (Health, Biometric, Political, etc.).
  - Understand the stricter processing rules for Article 9 data.
  - Discuss the handling of Criminal Convictions (Article 10).
  - Recognize the higher risk and impact of processing sensitive data.
- **Key Concepts**: Article 9 (Special Categories), Article 10 (Criminal Data), Sensitive Data, Biometrics, Genetic Data.
- **Source Mapping**: Slides 10-12, 27-29.
- **Interactivity**: 
  - *Risk Flagging*: Given a user profile JSON object, highlight the fields that trigger Article 9 protections (e.g., `"political_view": "liberal"`, `"blood_type": "O+"`).

### Lesson 9: The Hashing Illusion (Anon vs. Pseudo)
- **Story**: Panicked by the strict rules, Bob decides to hash all user emails in the database. "Now it's anonymous! GDPR doesn't apply!" he cheers. Alice explains the difference between **Pseudonymisation** (reversible/linkable) and **Anonymisation** (irreversible). Bob learns that his hashed data is still personal data because *he* (or someone else) could potentially re-link it.
- **Learning Objectives**:
  - Distinguish between Anonymisation (GDPR exempt) and Pseudonymisation (GDPR applies).
  - Explain why Pseudonymisation is a security measure, not an exit strategy.
  - Understand the concept of "Re-identification".
- **Key Concepts**: Anonymisation, Pseudonymisation, Encryption, Re-identification, Data Masking.
- **Source Mapping**: Slides 16-20, 30 (Anonymisation exemption).
- **Interactivity**: 
  - *The Decryptor*: A visual simulator where users "mask" data. They see that if a "key" exists anywhere, the data is only pseudonymous. To make it anonymous, they must destroy the link permanently.

### Lesson 10: Prove It’s You (Authentication)
- **Story**: Bob builds the login system for DataVault. He needs to verify that the person claiming to be "User 99" is actually User 99. He explores different factors of authentication (Knowledge, Possession, Inherence) and how they relate to data protection (protecting the account from imposters).
- **Learning Objectives**:
  - Define Authentication vs. Identification.
  - Explain the three factors of authentication: Knowledge (Password), Possession (Token/Card), Inherence (Biometric).
  - Discuss Electronic Signatures as a form of auth.
- **Key Concepts**: Authentication, Authorization, 2FA, Biometric Verification, Electronic Signatures.
- **Source Mapping**: Slides 21-26.
- **Interactivity**: 
  - *Auth Builder*: Assemble a Multi-Factor Authentication flow for a high-security banking app versus a low-security forum, choosing appropriate factors.
