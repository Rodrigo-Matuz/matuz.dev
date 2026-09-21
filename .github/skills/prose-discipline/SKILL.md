---
name: prose-discipline
description: "Always-required standard wherever prose is used. Governs human legibility and semantic drift in documentation, instructions, reports, comments, reviews, and agent interaction. Use whenever prose is read, written, reviewed, or transformed."
license: MIT
metadata:
    skill-type: standard
---

# Prose style

Prose governs what humans read; code governs what machines run. They need different disciplines. A correct but unreadable document has failed its reader.

## Applicability

This standard is always required wherever prose is used.

It applies to prose in governing text, documentation, instructions, workorders, reports, comments, reviews, and agent interaction, regardless of profile, deliverable, workflow, or user interaction.

Human legibility and drift control are the same reliability concern. LLMs operate through human language; if prose is difficult for a human to interpret reliably, treat the model input or output as defective.

## Summary

This skill sets the minimum prose quality bar. Clarity comes before compression, and the reader should understand on one pass. Precision limits semantic drift for humans and language models.

## Priority order

When principles conflict, resolve in this order:

1. **Clarity** — the reader understands on one pass
2. **Accessibility** — concepts are introduced before being compressed
3. **Accuracy** — the content is structurally correct
4. **Compression** — no word is wasted

Clarity and compression frequently conflict. Clarity wins.

## Voice

Prose governed by this standard is:

- calm — no urgency, no alarm, no hype
- authoritative — states facts, not opinions dressed as facts
- understated — the structure carries the argument; the prose does not push it
- pragmatic — oriented toward consequence, not description for its own sake

Authority is earned through clarity. It is not asserted through volume, repetition, or confident-sounding language.

## Accessibility

The reader should not need to decode meaning. Every sentence should be clear on first contact.

- introduce a concept before compressing it
- reduce cognitive load — if two readings of a sentence are possible, eliminate one
- do not use ambiguity as a stylistic device
- prefer explicit nouns over pronouns unless the referent is unambiguous
- the reader should feel guided, not tested

## Sentence structure

- short declarative sentences for emphasis — use selectively
- explanation before compression — never the reverse
- one conceptual move per paragraph
- paragraphs of one to three sentences as the default
- one-line paragraphs reserved for structural conclusions, not for every point
- avoid long runs of one-line paragraphs — they create pressure without context

## Section flow

Each section completes one conceptual cycle:

1. observation — what is true
2. explanation — why it is true or how it works
3. operational implication — what follows from it
4. structural resolution — the conclusion, stated plainly

A section that stops at observation or explanation is unfinished. A section that opens with its conclusion before establishing the context is unreadable.

## Structural lines

A structural line is a compressed statement that resolves a section's argument. It must:

- be preceded by sufficient explanation
- resolve a clearly established idea
- feel inevitable given the preceding context

If a structural line can be removed without loss of meaning, remove it. If it cannot be understood without re-reading the section, expand the section first.

One structural line per section is the norm. Two is the maximum.

## Subject discipline

Keep the system, process, or document as the primary subject of each sentence. Avoid unnamed human actors when the action can be expressed through the mechanism itself.

Preferred:

```
The workorder authorizes the change.
The validator rejects the file.
The boundary holds.
```

Avoid:

```
Someone needs to authorize the change.
You should run the validator.
They held the boundary.
```

Use pronouns only when the referent is unmistakable.

## Compression limits

Do not compress before the reader has the context to receive it. Do not substitute compression for explanation.

Avoid:

- continuous aphorisms without buildup
- sentence fragments as substitutes for reasoning
- repetition that restates rather than advances

Repetition is permitted only when it reinforces doctrine across a document — a short recurring phrase that develops meaning each time it appears.

## What to avoid

- volume as a substitute for clarity
- hedging language that avoids commitment
- passive constructions that obscure the subject
- filler openings
- emotional language as pressure
- persuasion through assertion rather than structure

The hedges and filler openings named above read like this:

```
may potentially, could possibly, it is worth noting that
In order to, It is important to, As mentioned
```

## Capitalization

Sentence case for all headings and titles. Capitalize only the first word, proper nouns, and established acronyms. Avoid title case.

## Reviewing existing prose

A review applies the same criteria as drafting. It reaches a different conclusion when the prose already meets them.

Prose that meets the criteria stands as written. Rewriting conforming text risks the meaning that text already carried and returns nothing the reader can use.

Name the failing criterion before proposing any change to existing prose. A change that cannot name one is preference, and preference does not displace established text.

Where a criterion does fail, revise the span that carries the failure and leave the surrounding structure as the author set it.

The section-flow cycle describes how a section is built. It is not a quota to apply to a passage under review, and a passage that already resolves needs no structural line added.

A review that finds nothing says so.

## Pre-submission clarity check

Before submitting or sending prose, verify:

- can a reader explain this section after one read?
- is every concept introduced before it is compressed?
- does each section complete the full observation → explanation → implication → resolution cycle?
- is the system or process the subject of each paragraph, not a generic human actor?
- does any structural line resolve its section, or does it merely restate it?

If any check fails, revise before submitting.

## Final rule

One pass. One meaning. No assembly required.
