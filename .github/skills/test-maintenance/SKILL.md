---
name: test-maintenance
description: Persistent repository test maintenance rules. Use when creating, modifying, consolidating, or retiring persistent repository tests. Does not govern test execution or validation.
license: MIT
metadata:
  skill-type: standard
---

# Test maintenance

Persistent tests protect current repository contracts. They are not a record of every defect, probe, or workorder.

## Add tests only for a coverage gap

Add or expand a persistent test only when:

* the commissioned change creates or changes a stable repository contract;
* that contract needs persistent automated protection;
* deterministic tooling does not already enforce it;
* existing tests do not already cover it adequately.

A bug, edge case, review finding, workorder, or testable property does not by itself justify a persistent test.

## Extend the existing owner

Before adding coverage:

* identify the test family that owns the contract;
* extend that family where possible;
* create a new test target only for a real ownership, tier, fixture, runtime, or dependency boundary.

Keep one primary persistent owner for each contract.

## Keep temporary evidence temporary

Do not persist:

* exploratory probes;
* reviewer checks;
* validation experiments;
* one-time diagnostics;
* operational verification;
* independent assurance evidence.

## Do not duplicate deterministic checks

Formatting, linting, static analysis, schema checks, prose checks, vocabulary checks, and equivalent deterministic tooling remain the owner of those properties.

Do not reproduce those checks as repository tests.

## Remove redundant coverage

When stronger coverage supersedes weaker assertions, remove the redundant tests rather than preserving both.

## Execution is out of scope

This standard governs the maintained repository test surface.

It does not define which tests Tester, reviewers, CI, or operators should execute.

## Final rule

Maintain the smallest persistent test surface that protects the current repository contracts.