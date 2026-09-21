---
name: vocabulary-control
description: "Control terminology and prevent documentation drift. Use when introducing, renaming, or retiring a term in governing text, design, schema, or instructions; when the same fact appears in two documents; or when reviewing text for restatement, silent renames, or parallel rules."
license: MIT
metadata:
    skill-type: standard
---

# Vocabulary control

Every term is a cost. Every restatement is a fork. This skill governs term admission and keeps the corpus from drifting.

## Introducing a term

A new term must earn its place before it is written into governing text, design, schema, or a commissioning instruction. Exhaust these outcomes in order:

1. **Reuse** an existing project term with its existing meaning.
2. **Rewrite** the surrounding claim so the new term is unnecessary.
3. **Let context carry** an ordinary word when no governance consequence turns on its exact meaning.
4. **Constrain by context** when the same word has different acceptable meanings in different layers or domains; the constrained meaning must state where it applies.
5. **Replace** an existing weak term when it is overloaded, has drifted, or invites false authority. Replacement retires the old term; it does not create a synonym.
6. **Define** a new term only when ambiguity would change an obligation, authority boundary, identity claim, custody claim, evidence claim, privacy posture, or review requirement.

A proposed term states:

- the outcomes above that were considered and why they failed;
- the single meaning proposed;
- the documents the term will govern;
- existing terms it replaces, if any.

A term enters the vocabulary only by explicit approval. Until admitted, it appears only in proposal text.

Two names for one thing is drift. One name for two things is worse.

## Drift control

Drift is any divergence between governing text, the repository, and actual behaviour.

- **One home per fact.** Every rule, boundary, and definition has exactly one authoritative location. Other documents reference it by location; they do not restate it. Restatement forks; forks drift.
- **Reference, don't paraphrase.** Paraphrase becomes a second version. Exception: a standalone document is permitted to restate briefly the conventions needed for independent reading; restatements are subordinate, and a conflict is a defect in the restatement.
- **No silent renames.** Established names change only by explicit decision. A rename enumerates every occurrence to update; a partial rename is drift, not progress.
- **Surgical changes.** Amend the smallest text that carries the change. Do not rewrite a document to improve it while changing one rule. Improvement without authorization is drift with good intentions.
- **No parallel rules.** A proposal that repeats an existing rule is not admitted. A proposal that contradicts or extends an existing rule escalates the existing rule for decision; it is not filed beside it.

## Writing rules for governing text

Prose quality in governing text follows `prose-discipline`. The vocabulary-specific additions are:

- State rules as obligations, not narration. One sentence, one obligation.
- Describe implemented behaviour as fact only after verifying it from code, schema, or tests. Describe decided-but-unbuilt behaviour as decided, explicitly.
- Do not write history into governing text. History lives in commits and pull requests.
- Do not write aspiration into governing text. Aspiration lives in proposals until approved.
- Text that requires interpretation to follow is not finished.

## Final rule

One name, one meaning, one home.
