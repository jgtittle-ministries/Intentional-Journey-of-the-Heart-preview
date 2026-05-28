# Proposal Template

*Every proposed refinement to a claim in the registry is submitted using this template. The template is structured to enforce the four-factor confidence test at the platform level: proposals that leave any of sections 3a through 3d blank are returned for strengthening, not rejected.*

*A machine-fillable copy lives at `PROPOSAL_TEMPLATE.md` in the project repository root.*

---

# Proposal: [Short descriptive title]

## Proposal metadata

| Field | Value | Notes |
| --- | --- | --- |
| Proposal ID |  | Assigned on submission |
| Target claim |  | e.g., V1.Exp1, V2.Exp3, V3.Exp8 |
| Proposal type |  | refinement / minority_dissent / open_question / new_claim / confidence_adjustment |
| Proposer name |  |  |
| Proposer tradition |  | Reformed / Evangelical / Charismatic / Mystical / other (describe) |
| Proposer contact |  | Email or other way to reach you during the comment period |
| Submission date |  | YYYY-MM-DD |

## 1. What are you proposing?

One paragraph.

- **If you are refining a canonical text:** quote the current canonical text, then give your proposed replacement. Be explicit about what you are changing and what you are keeping.
- **If you are proposing a new minority dissent:** state the minority position clearly and indicate which canonical claim it is a dissent *from*.
- **If you are proposing a confidence adjustment:** state the current confidence percentage and the one you propose, with a one-sentence summary of why.
- **If you are proposing a new claim:** state the claim as a single proposition, in the voice of an existing claim entry.

## 2. Scriptural support

List the scripture texts that ground your proposal. Use standard citation (Book Chapter:Verse). For each text, indicate whether it is **primary** (carrying the main weight of the argument) or **confirming** (corroborating a point made primarily elsewhere).

- [Text 1] — primary — [one sentence on what this text contributes]
- [Text 2] — confirming — [one sentence]
- (add more as needed)

## 3. The Four-Factor Derivation

Your proposal must address all four factors. A proposal that leaves any section blank will be returned for strengthening, not rejected.

### 3a. Independent scriptural lines

What are the multiple scriptural witnesses, approaching the claim from different angles, that together support your proposal? Not a single proof-text — the factor asks for *multiple* texts approaching the question differently. If you have only one text, say so honestly; your proposal may be better framed as a minority dissent or an open question than as a canonical refinement.

### 3b. Experiential corroboration

What have you observed in your own formation, in the lives of others, or in ministry settings that corroborates this proposal? Be specific. If you have not personally observed what the proposal describes, name the communities or individuals you are drawing from and indicate what they have reported. Generalities weaken this section; specifics strengthen it.

### 3c. Conceptual coherence

How does your proposal fit with adjacent claims in the corpus? List the claim IDs that are most directly affected. If your proposal creates tension with another claim, name the tension honestly — trying to hide it will only slow Council review. If the tension is real, that may be a reason to submit a preserved dissent rather than a canonical refinement.

### 3d. Consistency with tradition

Which Christian traditions have articulated this or something close to it? Be specific — name authors, works, or theological streams. The project is explicitly cross-tradition, so a proposal recognizable in several traditions is stronger than one drawn from only one stream. If your proposal is genuinely new and has no clear traditional anchor, say so; that is not disqualifying, but it should be acknowledged and it will typically push the claim toward preservation as an open question rather than canonical status.

## 4. Downstream Impact Acknowledgment

Every claim in the registry lists the upstream claims it depends on. Your proposal affects every claim whose `upstream_dependencies` field includes your target.

For each downstream claim, briefly indicate whether your proposal:

- **Strengthens it** — no change needed downstream.
- **Weakens it** — the downstream claim may need confidence adjustment.
- **Invalidates it** — the downstream claim needs serious reconsideration.
- **No effect** — explain why, despite the dependency relationship.

If you are not sure how to identify the downstream claims, the schema tooling will generate the list for you when you submit. You are responsible for engaging with each one; you are not responsible for finding them yourself.

## 5. What would count as evidence against your proposal?

This is the disconfirmability requirement (see V4.M3). State concretely what observation, scriptural challenge, or test result would cause you to withdraw this proposal, or cause the Council to reject it.

A proposal whose author cannot name what would disconfirm it is a proposal the author has not tested honestly. Such proposals will not be accepted as canonical, though they may be preserved as open questions if the Council judges the question worth holding.

## 6. Summary for the open comment period

In one short paragraph (three sentences or fewer), summarize the proposal as you would want another contributor to encounter it — someone who has not read this whole document. This is the text that will be posted at the start of the 14-day comment period.

## 7. (Optional) Anything else the Council should know

Background, personal context, pastoral concern, or other factors you think bear on the proposal. This section is optional and does not carry evidentiary weight, but the Council reads it.

---

*By submitting this proposal, I affirm that:*

- *I hold the rights to submit the material under the project's license (CC BY 4.0).*
- *I have represented my sources accurately and have not fabricated citations or experience.*
- *I am submitting in good faith as part of the shared inquiry, not to advance an agenda foreign to the project's stated aim.*
- *I accept that my proposal, whether accepted, rejected, or preserved as dissent, will remain in the project's historical record.*

**Proposer signature (digital or physical):** _________________________
