---
name: user-docs
description: "Standard for user-facing documentation. Use when writing or changing user guides, how-to pages, or task documentation for end users — not architecture documents, agent standards, PR descriptions, or test reports."
license: MIT
metadata:
  skill-type: deliverable
  prose-setting: end-user
  skill-dependency: prose-discipline
---

# User documentation standard

User docs must match what the system does now. Write them to help a user finish a task.

Do not present planned work as current behaviour. Do not turn internal rules or design text into user instructions.

Write for the person doing the task. Use clear steps, expected results, warnings, examples, and recovery help.

Leave out code detail unless it changes what the user must do.

## Structure

Each user guide makes these points clear:

* who the page is for;
* the task it covers;
* prerequisites;
* steps;
* expected result;
* common failures;
* any known uncertainty.

## Accuracy

Check behaviour before you document it. Use code, tests, CLI help, an API schema, or an approved instruction as evidence.

If a feature does not exist yet, call it planned only when the work allows planned documentation.

Do not invent:

* commands;
* flags;
* config keys;
* permissions;
* workflows;
* screenshots;
* API fields;
* file paths.

## Safety and privacy

Keep the project's safety and privacy rules intact.

Do not tell users to handle sensitive data in an unsafe way. Do not present a claim without evidence. Do not bypass review or give automated tools authority they do not have.

Use clearly fake values in examples. Never expose a real sensitive value.

## Commands and examples

* Commands must be ready to copy.
* Keep examples small and accurate.
* State any setup a command needs.
* Mark a destructive command before showing it.

## Tone

Prose follows `prose-discipline`.

Write at the level of the user's task. Use plain words when they carry the same meaning.

Explain internal design only when the user needs it to complete the task.

## Relationship to implementation

A documentation defect does not grant authority to change code.

If the system is hard to explain, improve the docs within the approved scope. A code change needs its own approval.

## Final rule

User docs describe what the system lets a user do now. They do not turn intent into fact.