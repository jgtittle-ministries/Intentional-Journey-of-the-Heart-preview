# Part 1: Governance Model

## Preface to this revision

This document revises the governance model originally drafted before the four-volume schema conversion. That conversion — producing the claim registry files `vol1-claims.yml` through `vol4-claims.yml`, together encoding seventy-six claims, six preserved minority dissents and open questions, and roughly one hundred and fifty dependency edges — surfaced specific structural features the original model could not anticipate. Three founding documents were also drafted in the same pass: `CONTRIBUTING.md`, `SUCCESSION_LETTER.md`, and `PROPOSAL_TEMPLATE.md`. This revision integrates what the registry actually contains, what the conversion revealed, and what the drafted contributor documents already commit the project to.

The core architecture of the original model holds. What changed is in the details: how the schema must flex to accommodate Volume 4's different structure; how confidence tiers should receive differentiated governance treatment; how the analogy-class discipline from Volume 3 applies corpus-wide; how the bidirectional dependency between testing and earlier volumes should shape review cycles; and how the Council's first concrete actions should be ordered given that the registry already exists.

This document is a design proposal, not yet a ratified governance framework. Its adoption requires the founder's signature and, thereafter, the Council's first formal ratification vote.

## 1. Organizational structure

IJH is governed by a three-tier structure during the founder's active tenure, collapsing to two tiers thereafter. This section is substantively unchanged from the original model.

**Tier 1 — Founder / Editor-in-Chief (John G. Tittle).** The founder retains final editorial authority during his active tenure, exercising it sparingly and in public. A codified founder's veto sunsets upon the founder stepping down or incapacity, with the veto then held by the Theological Successor for five additional years, after which the Council becomes fully self-governing. This transition is formalized in the drafted Succession Letter (`SUCCESSION_LETTER.md`), which names both a Literary Executor (administrative authority) and a Theological Successor (editorial authority), and which allows but does not require the two roles to be held by the same person.

**Tier 2 — Council of Stewards (5 members).** Five seats, two-year staggered terms. **No more than two members from any single denomination, seminary, or publisher**, to protect cross-tradition commitment. As a starting proposal, not a mandate, one seat designated for each of the four tradition streams the work draws from (Reformed, Evangelical, Charismatic, Mystical), with a fifth at-large seat held initially by the founder himself. Three seats rotate in odd years, two in even.

**Tier 3 — Contributor body.** Anyone may submit proposed refinements using `PROPOSAL_TEMPLATE.md`. A subset of active contributors — defined as those who have had at least three substantive contributions accepted across at least two volumes over eighteen months — become Recognized Contributors whose names appear in the project masthead and who vote in Council elections once the founder's veto sunsets.

## 2. The claim registry

The registry is the authoritative record of what the project currently believes and at what confidence level. It exists in four files, one per volume (Volume 5 is a bibliography and does not need schema conversion). The files are the substantive output of the governance work done to date.

**Registry summary at ratification:**

| Volume | Claims | Minorities | Open Questions | Confidence Range |
| --- | --- | --- | --- | --- |
| Vol 1 — Foundation | 15 | 1 | 0 | 70–90% |
| Vol 2 — Therapeutic | 13 | 0 | 1 | 70–90% |
| Vol 3 — Quantitative | 12 | 1 | 2 | 35–85% |
| Vol 4 — Testing | 36 (+10 instruments) | 1 | 0 | 75–95% + inherited |
| **Total** | **76 claims** | **3** | **3** | **—** |

Every claim entry carries: a unique ID, canonical text, confidence percentage (or explicit null for claims whose confidence inherits from upstream), scripture references, external sources, upstream dependencies, downstream dependents, open questions, flip conditions, and — where relevant — minority positions attached as child entries. The full specification is in the registry files themselves; this section summarizes what the Council is responsible for stewarding.

**What the registry reveals about the corpus's shape.** The four volumes form a dependency pyramid rather than four independent works. Volume 1's four foundational axioms feed into everything. Volume 2 operationalizes Volume 1 for therapeutic use. Volume 3 attempts quantitative formalization, with its central equation (V3.Exp3) drawing on ten specific upstream claims from Volumes 1 and 2. Volume 4 closes the loop by providing empirical tests that feed results back to adjust earlier confidence ratings. A change anywhere in the graph has visible consequences elsewhere — which is precisely the structural feature the governance must steward.

The four `.yml` files (one for each of the first four volumes) are maintained as governance maintenance documents. A sample diagram and discussion of dependency relationships follows.

## IJH Sample Dependency Diagram v2

Given the scope (76 claims, 4 volumes, multiple dependency types), here are two diagrams: an overview showing the schema's structure, and a detailed view of the single most dependency-rich claim as a worked example. Here's the overview first.

Now the detail view — showing how the schema's fan-in structure works for the single most dependency-rich claim in the corpus, V3.Exp3 (the spiritual force equation). This is what a Council member should look at when deciding whether to approve a change to any of its upstream claims. Two things worth saying about these:

**What the overview shows.** Each volume is color-coded to represent its dominant confidence level, but that's a simplification — the real data is the mix. Volume 1 is mostly amber with two green anchors (the axioms and Fear of the Lord). Volume 2 anchors two claims at 90% (Heart Soil and Sin Blockage) and works outward from there. Volume 3 is the odd one: nine of its ten claims sit at 75% or below, with the red V3.Exp3 equation in the middle as a 40% frontier proposition, and V3.Exp9 (Glory Attractor) pulled up to 85% as the eschatological anchor. Volume 4 shows the bidirectional arrow — the only one in the diagram that runs upward — because testing results flow back to adjust the confidence levels on everything above it. That feedback loop is the governance model's heartbeat.

**What the detail shows.** The second diagram is a worked example of what the schema buys you at governance time. A Council member considering a proposal to refine V1.Exp8 (Prayer Resonance, currently 70%) can see immediately — not by reading prose, but by looking at the dependency graph — that the change propagates into V3.Exp3's h() factor. And because V3.Exp3 is multiplicative, a confidence shift in h() doesn't just shift one factor; it shifts the whole equation. That cascade is the thing the schema was built to make visible. The dotted connector on the right shows the second linkage: V1.Exp8's open question (the Mustard Seed threshold-vs-proportionality problem) specifically affects the functional form of h(), not just its confidence. Resolving that question is a prerequisite for the equation to take a specific testable shape.

Both diagrams deliberately omit a lot. Full-resolution dependency graphs for all 76 claims would be unreadable at this scale and wouldn't serve the visual's purpose, which is to make the schema's logic intuitive at a glance, not to catalog every edge. The authoritative graph lives in the YAML files; these diagrams are the map, not the territory.

One practical use for these: if we ever need to explain to a prospective Council member (or a publisher) what this project actually is, showing them the overview and then walking through the V3.Exp3 example will probably land faster than describing it in words. The visuals make the claim that this is a structured, inspectable, governable body of work much harder to wave away than prose can.

## 3. Schema extensibility

Volumes 1 through 3 share the "Proposed Law + Certainty %" structure; Volume 4 does not. It contains methodological principles, testable hypotheses, research questions, protocols, and open trails that the original schema did not anticipate. Rather than forcing this material into a box it did not fit, the Volume 4 conversion introduced five new type values: `methodological_principle`, `testable_hypothesis`, `research_question`, `protocol`, and `open_trail`. A sixth category — `instruments` — holds measurement tools as reference material outside the claim list entirely, since instruments are not propositions the Council would vote on.

This experience establishes a principle the Council should formalize at its first meeting: **the schema is designed to flex when the material genuinely changes shape, not when a contributor prefers a different structure.** The extension rule: a proposed new claim type requires explicit Council ratification. The proponent must show that no existing type fits — not that the new type is slightly more convenient. Every new type added to the schema itself becomes a governance-amendment-level change requiring two-thirds supermajority.

Volume 4's extensions pass this test: methodological principles are genuinely not claims-about-the-world but claims-about-how-to-test-claims, and treating them identically would have collapsed an important distinction. Future material added to the project (a sixth volume, a derivative commentary, a cross-tradition dialogue series) may require further extensions. The schema is a living artifact; it is not frozen.

A companion discipline: **the schema definition itself (`SCHEMA.md` in the repository, to be drafted as an early Council priority) is governed under the same two-thirds supermajority rule as the constitution.** CI validation should reject any claim entry that does not conform to the current schema. This prevents schema drift from accumulating silently as contributors add entries in idiosyncratic formats.

## 4. Contribution process

Every proposed refinement is submitted using `PROPOSAL_TEMPLATE.md`. The template is structured to enforce the four-factor confidence test at the platform level: proposals that leave any of sections 3a through 3d blank are returned for strengthening rather than reviewed. This discipline — which the founder has been using implicitly for over two decades — is now a hard requirement for any contributor who wants to affect the canonical record.

**Workflow (identical to original, summarized here):**

- The contributor identifies the target claim by ID, copies `PROPOSAL_TEMPLATE.md`, and fills every section.
- Submission opens a 14-day open comment period visible to all Recognized Contributors.
- After day 14, the Council issues one of four decisions: accept and merge; accept as preserved minority; reject with written reasons preserved; or escalate to the dissent-resolution protocol.

**One addition from the conversion experience.** Every proposal now also triggers an **automated downstream-impact report**. The registry's dependency graph is machine-readable, so the Council's tooling can generate — for any target claim — the full list of downstream claims affected, with their current confidence levels and whether they would need review. The proposer is responsible for engaging with each downstream claim in Section 4 of the template; the tooling is responsible for ensuring none are missed. This is the single most valuable mechanical feature the schema gives governance: **no contributor can revise a claim without confronting its downstream consequences.**

**Contributor onboarding.** The drafted `CONTRIBUTING.md` is the first file a new contributor reads. It sets the voice of the project (contemplative rather than software-paced; correction without contempt; preservation of dissent rather than erasure) and establishes the practical mechanics. The Council should resist the pressure to make this document longer as exceptions arise. A one-page contributor guide that actually gets read is worth more than a ten-page policy that doesn't.

## 5. Confidence tier governance

The registry reveals a three-tier confidence structure that the original governance model did not differentiate but should. Different tiers warrant different Council treatment.

**Tier 1 — Anchor claims (85% and above).** These are the structural backbone of the corpus: the four axioms (90%), the Fear of the Lord gateway (85%), the Sin Blockage law (90%), the Heart Soil diagnostic (90%), the Obedience Channel (85%), the Glory Attractor (85%), and V4.M3 Disconfirmability (95%, pending ratification). Revision proposals to Tier 1 claims should be treated as governance-level changes, not routine refinements — they require Council consent plus an optional 30-day extended comment period if any Council member requests it. Anchor claims are the ground from which other claims are calibrated; moving them moves much else.

**Tier 2 — Working claims (65–80%).** The majority of the corpus lives here. These are the claims the project actively refines, contests, and tests. Routine refinement procedures apply: 14-day comment period, consent-based Council approval, standard documentation. The project's normal rhythm of contribution and revision happens in Tier 2.

**Tier 3 — Frontier claims (below 65%).** V3.Exp3 (Spiritual Force equation, 40%), V3.Exp6 (Conservation Laws, 35%), V3.Exp8 (Miracles as threshold events, 55%) — and the preserved open questions attached to other claims — occupy frontier territory. **Proposed refinements to frontier claims should not be eligible for routine Council approval.** They require a research-program track: the proposer must present either new scriptural analysis at a higher level of rigor than the original, new empirical data from Vol 4-style testing, or new theological synthesis with explicit traditional grounding. Frontier claims move only when evidence accumulates, not when a well-argued proposal arrives. The Council's role with Tier 3 is less adjudication than research stewardship.

This tiering is not a hierarchy of importance — V3.Exp6 at 35% is arguably more important to the project's long-term ambitions than many Tier 2 claims — but a hierarchy of maturity. It governs pace, not priority.

## 6. Decision-making framework

**Lazy consensus** governs routine editorial work (typo fixes, citation corrections). Seven-day silence equals approval.

**Consent-based approval** governs substantive Tier 2 changes, minority admissions, and confidence adjustments within a tier. A proposal passes when no Council member objects within 14 days and a quorum of four is engaged.

**Two-thirds supermajority** is reserved for governance amendments, Council membership changes, schema extensions (see §3), Tier 1 anchor claim revisions, and any change to the four foundational axioms.

**New provision: research-program track** for Tier 3 frontier claims. Revision requires one Council member to sponsor the proposal into the track, and a minimum six-month active-testing window before the Council votes. This prevents frontier claims from being moved by rhetoric alone.

Every body remains answerable to another body. Council members are answerable to Recognized Contributors via a no-confidence mechanism (any contributor may initiate; two seconds trigger a 30-day rectification window). The founder is answerable to the Council through the sunset clause. No role is unaccountable.

**Note on how these procedures are actually used.** The voting procedures above are the formal backstop the Council uses when consensus cannot be reached through prayer and discernment — they are not the Council's primary mode of operation. Most Council work happens upstream of voting, in the deliberative rhythm described in Part 2 (The Council), Part III: in-person meetings two or three times a year, shorter video gatherings in between, and an explicit disposition that votes are rare and are not used to end a disagreement that has not yet been prayed through. The formal procedures here give the body the structural capacity to act when prayer and discernment alone cannot resolve a matter; they do not replace prayer and discernment.

**The open spiritual-authority question.** This governance model describes the internal structure through which the Council orders its own work, but it does not by itself answer the question of the broad-brush spiritual authority to which the whole body — founder, Council, and Recognized Contributors together — is itself answerable. That question is actively under discernment and is named explicitly in Part 2 (The Council), Part IV (Answerability). Readers of this governance document should understand that the Tier 1–Tier 2–Tier 3 structure above does not foreclose the resolution of that prior question; it describes the internal ordering that holds while the prior question is being discerned, and it is expected to be revisited as part of the body's response to whatever spiritual authority is clarified.

## 7. Disagreement resolution

The three-tag claim schema (canonical, minority, open) is the design specification for handling durable disagreement. Its details remain as in the original model. Three refinements from the conversion experience:

**Minority dissents distinguished from open questions.** A preserved minority (e.g., V1.Exp3.Mn1, the Hope → Love arrow dissent) is a competing position that the Council has declined to adopt but whose argument deserves permanent preservation. An open question (e.g., V1.Exp8's Mustard Seed question, V3.Exp6.Open1's Noether application) is a sub-question the Council has declined to resolve. The types serve different purposes: minorities preserve alternative readings; open questions preserve unresolved inquiry. Both are first-class content, not footnotes. The registry tracks them separately.

**Framework dissent versus claim dissent.** V3.Exp2.Mn1 (the Reformed-minimalist caution against adopting TFT as Volume 3's framework) is qualitatively different from V1.Exp3.Mn1 (an alternative reading of a specific claim). Framework dissents are harder to resolve because they have no single locus to argue about; they surface repeatedly as the framework is deployed against specific questions. The Council should track framework dissents with particular care and revisit them on a fixed cadence (annually, minimum) rather than only when challenged.

**Path preservation formalized.** When a canonical claim is revised, the prior version is demoted to minority status (tagged `formerly_canonical`) with its full argument preserved, not deleted. Downstream claims that cite the old version are auto-flagged for Council review. This discipline is what distinguishes a living tradition from a series of overwrites; the schema now enforces it mechanically.

## 8. The analogy-class discipline

Volume 3's conversion introduced a field the original model did not anticipate but which applies corpus-wide: every claim that uses a physical analogy (prayer as resonance, emotional knots as local minima, spiritual force as multiplicative) should be explicitly tagged as `illustrative` or `load_bearing_proposed`. An illustrative analogy helps the reader see the shape of a spiritual relationship by pointing to a physical one with similar structure; a load-bearing analogy claims the spiritual law has the same mathematical form as the physical law, precise enough to derive specific predictions. **Most of the analogies in the corpus are illustrative. A handful are proposed as load-bearing.**

The governance concern: **analogies drift from illustrative to load-bearing silently over time** — not through any single decision, but through accumulated usage in which an illustrative image is gradually cited as if it were a mathematical equivalence. The tag makes the drift visible and requires a deliberate Council vote to convert an analogy's class upward. A load-bearing analogy claim must be ratified by two-thirds supermajority (per §6), because it is effectively a claim that a piece of physics also applies to spiritual dynamics. That is not a decision to make by drift.

Volume 3 established the discipline; the Council should extend it backward across Volumes 1 and 2 during the first ratification pass. Most Vol 1 and Vol 2 claims will be tagged illustrative with little controversy; a small number will require conversation.

## 9. Testing and bidirectional dependency

Volume 4's relationship to Volumes 1–3 is bidirectional in a way that routine dependency graphs do not capture. The registry handles this correctly — every V4 testable hypothesis (V4.LotS-H1 through V4.LotS-I3) inherits its confidence from a specific V1 or V2 claim via the `confidence_inherited_from` field — but the governance implications warrant an explicit provision.

**Testing results flow upward to adjust earlier confidence ratings.** When a Vol 4 research cycle produces data on (say) RQ1, and that data bears on V2.Exp7's Affective Taxonomy hypothesis, the Council's task is to revise V2.Exp7's confidence level up or down according to what the data showed. This is not a routine refinement; it is an evidence-driven calibration. The Council should hold one scheduled **calibration cycle per year** — a focused meeting in which Vol 4 data from the prior cycle is reviewed and upstream confidence ratings are formally adjusted.

**What evidence counts, and what doesn't.** The disconfirmability requirement (V4.M3, held at 95% confidence) governs this. A proposed confidence adjustment upward requires evidence consistent with the claim's stated disconfirming conditions not being met. A proposed adjustment downward requires evidence that would have been specified in the original claim's `flip_conditions` field. Ad hoc confidence adjustments unsupported by disconfirmability-compliant evidence are not permitted — they would collapse the project into impressions without discipline.

**The Council's reporting obligation.** After each calibration cycle, the Council publishes a calibration report listing which claims had confidence adjusted, by how much, and on the basis of what evidence. This report is appended to the project's public record. A pattern of unjustified confidence inflation across calibration cycles would itself be grounds for a no-confidence motion against the Council.

## 10. Licensing

Unchanged from the original model: **CC BY 4.0 for the corpus, Developer Certificate of Origin (DCO) for contributions.** The drafted `CONTRIBUTING.md` establishes this commitment as part of the contributor agreement. The Council should resist pressure to change it — CC BY-ND would destroy translation and adaptation; CC BY-NC would eject the project from open-scholarship commons; bespoke "ministry" licenses have anti-model precedents (the NET Bible and the ESV are cautionary examples).

## 11. Platform

Unchanged from the original model: **GitHub for source, Quarto for rendering, Zenodo for preservation with DOIs, Hypothesis for public annotation.** The YAML-claim-per-entry structure is now proven to work across all four volumes; no platform change is indicated.

The early recruitment of a **technical co-maintainer** (the "research software engineer" role) remains a project priority. The registry is machine-readable, but someone has to maintain the validators, generate the downstream-impact reports for Council review, and keep the continuous-integration pipeline green. This role should not fall on the Theological Successor.

## 12. Succession planning

Unchanged in structure from the original model; the drafted `SUCCESSION_LETTER.md` implements Year 0–1 of the staged plan. The letter has six decision points the founder must fill in at signing: primary and alternate names for Literary Executor and Theological Successor, signing date, and reference to the broader will.

**The staged transition remains:**

- **Year 0–1:** Succession Letter signed, notarized, and held in triplicate (signer's papers, successors' copies, project repository). Council seats recruited.
- **Year 1–3:** Council seated by founder invitation. `GOVERNANCE.md` (this document, ratified) committed to the repository. Co-editors credited publicly.
- **Year 3–5:** Founder's veto sunsets. Fiscal sponsor engaged (Wabash Center, a sympathetic seminary board, or a community foundation — not a denominational publisher). Governance and fiscal oversight kept structurally separate.
- **Year 5+:** Incorporation as 501(c)(3) only if sustained donations warrant it or trademarks need to be held.

Copyright remains with individual authors and contributors under the CC BY 4.0 grant rather than assigned centrally. Forkability is preserved as the backstop of legitimacy.

## 13. First Council actions

The registry's existence changes what the Council's first meetings should focus on. The original model imagined the Council's first substantive project would be converting prose dependencies into the schema; that work has been done as demonstration. What remains is ratification, calibration, and the opening of contribution.

**Ordered agenda for the first twelve months of Council operation:**

1. **Ratify the schema definition** (`SCHEMA.md` to be drafted from the implicit specification in the four registry files). This is a governance-amendment-level decision and requires two-thirds supermajority. It should be the Council's first substantive vote.
2. **Walk through the registry** claim-by-claim, confirming or adjusting the encoded content. Each claim's `last_council_review` field moves from null to the date of confirmation. This is the act that converts the registry from *the founder's worked example* into *the Council's authoritative record*.
3. **Ratify the three drafted contributor documents** (`CONTRIBUTING.md`, `PROPOSAL_TEMPLATE.md`, `SUCCESSION_LETTER.md`) as formal project artifacts. Any proposed revisions are handled via normal governance proposals, not by direct editing.
4. **Identify early testing priorities.** The conversion surfaced three specific claims as high-leverage candidates for the first research cycles: V2.Exp6 (Tool Map, 70%, the lowest-confidence Part II claim and the most practically consequential for pastoral use); V3.Exp3 (Spiritual Force equation, 40%, ten upstream dependencies, central to Volume 3); and V3.Exp6 (Conservation Laws, 35%, lowest-confidence claim in the entire corpus). V3.Exp3's resolution also depends on V1.Exp8's Mustard Seed open question, which deserves parallel attention.
5. **Extend the analogy-class discipline** backward across Volumes 1 and 2, tagging each claim's use of physical analogy as `illustrative` or `load_bearing_proposed` (see §8).
6. **Recruit a technical co-maintainer.** Establish the CI pipeline, automated downstream-impact report generation, and claim-registry validation.
7. **Publish the opening of contribution.** A public announcement, modest in scope, that the project is now accepting proposals from Recognized Contributors and prospective contributors. No fanfare; the project's reputation should grow through the quality of its refinements, not through marketing.

This agenda is ambitious for twelve months. Some items will slip. The first two (schema ratification and registry walk-through) are non-negotiable; the rest can reorder as circumstance warrants.

## 14. Risks and mitigations

**The original model identified one primary long-horizon risk: schema drift as contributors and Council members change.** The registry conversion confirmed both the risk and the mitigation path.

*The risk materialized productively during conversion.* Volume 4's structure genuinely required new claim types. Without a discipline for evaluating and ratifying schema extensions, the registry would have accumulated idiosyncratic entries that fit neither the original V1–V3 pattern nor any principled alternative. The discipline introduced in §3 of this revision (extension rule, two-thirds supermajority for schema changes, CI validation) is the concrete form of the mitigation the original model named abstractly.

**Three additional risks the conversion surfaced:**

*Analogy drift (now addressed in §8).* The illustrative-to-load-bearing migration of physical analogies can happen invisibly over time. Mitigation: explicit `analogy_class` tag plus two-thirds supermajority for upward reclassification.

*Confidence inflation.* The pressure to move claims upward in confidence when evidence is ambiguous is real. Unchecked, it would collapse the project's epistemological honesty into wishful thinking. Mitigation: the disconfirmability-compliant evidence requirement for upward adjustments (§9), and the Council's annual calibration report made public.

*Cross-volume ID instability.* During conversion, Volume 1 references to Volume 2 and Volume 3 claims used informal aliases (`V2.SinBlockage`, `V3.Eq1`, `V3.FieldLocal`) that were later resolved to canonical IDs. A contributor editing Volume 1 without updating Volume 2 or Volume 3 could introduce dangling references. Mitigation: the schema's `aliases` field plus CI link-checking across files.

## Conclusion: what the revised model adds

The original governance model specified the structure. The revised model specifies the structure as it actually operates on the material the project produced. Three additions in particular are worth naming:

**The registry is now authoritative.** Before conversion, the governance described how a registry would be built. After conversion, the registry exists, and the governance describes how the Council stewards a real graph of seventy-six interconnected claims. The shift is from architectural design to operating manual.

**Three confidence tiers get different governance treatment.** The original model treated all claims identically. The registry revealed three tiers (anchor, working, frontier) with distinct maturities and distinct stakes, and the revised model differentiates their procedures accordingly.

**Bidirectional dependency is structurally tracked.** Volume 4's testing flows confidence adjustments upward into Volumes 1–3 via the annual calibration cycle, with disconfirmability-compliant evidence as the threshold for adjustment. This closes the loop the original model mentioned but did not operationalize.

The work that remains is not architectural. It is the work of seating the Council, holding the first ratification vote, walking through the seventy-six claims, and opening contribution. The drafted founding documents (`CONTRIBUTING.md`, `PROPOSAL_TEMPLATE.md`, `SUCCESSION_LETTER.md`) provide the procedural substrate; the four YAML registry files provide the substantive content; this revised governance model provides the connective framework. The project is ready to be handed from the founder to the Council when he judges the moment right.

---

*Signed and ratified by the founder: _______________________________________*

*Date: _______________*

*This revised model supersedes the original governance model of April 2026 and remains in force until subsequent revision by the Council under the two-thirds supermajority provision of §6.*
