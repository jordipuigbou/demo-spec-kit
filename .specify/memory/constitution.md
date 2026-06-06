<!--
Sync Impact Report
==================
Version change: TEMPLATE (0.0.0) → 1.0.0

Added principles:
  - I. Test-First Development (NON-NEGOTIABLE) [new]
  - II. Testing Pyramid Compliance [new]
  - III. Code Quality Standards [new]
  - IV. Specification-Driven Quality [new]
  - V. Continuous Quality Gates [new]
  - VI. Defect Prevention Over Detection [new]

Added sections:
  - QA Workflow Standards (replaces [SECTION_2_NAME])
  - Review & Approval Process (replaces [SECTION_3_NAME])

Templates status:
  - .specify/templates/plan-template.md ✅ updated (Constitution Check gates aligned to 6 principles)
  - .specify/templates/spec-template.md ✅ reviewed, aligned (no changes required)
  - .specify/templates/tasks-template.md ✅ reviewed, aligned (TDD-first structure already present)

Deferred TODOs: none
-->

# Spec Kit QA Demo Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

Every feature MUST follow Test-Driven Development (TDD). Tests MUST be written and confirmed
failing before any implementation code is written. The Red-Green-Refactor cycle MUST be
strictly followed:

- **Red**: Write a failing test that captures the acceptance scenario
- **Green**: Write the minimum code to make the test pass
- **Refactor**: Improve structure without breaking existing tests

No production code may be written without a corresponding failing test. This principle is
absolute and admits no exceptions.

**Rationale**: TDD produces demonstrably fewer defects, forces explicit requirement
understanding before coding, and ensures test coverage by construction rather than
as a retroactive measure.

### II. Testing Pyramid Compliance

Test suites MUST conform to the following pyramid distribution:

- **Unit tests**: ≥ 70% of total test count — isolated, fast (< 100 ms each), no I/O
- **Integration tests**: 20–25% of total test count — test interactions between components
- **End-to-End (E2E) tests**: ≤ 10% of total test count — full user journey validation

Each layer MUST meet minimum coverage thresholds:

- Unit: 80% line coverage overall, 90% for business-critical modules
- Integration: every inter-component contract MUST have at least one integration test
- E2E: every P1 user story MUST have at least one E2E acceptance test

**Rationale**: Pyramid distribution maximises signal speed (fast feedback from unit tests)
while ensuring integration points and critical user paths are verified at higher layers.

### III. Code Quality Standards

All code MUST pass automated quality gates before merging:

- **Static analysis**: Zero errors tolerated; warnings MUST be resolved or explicitly
  suppressed with a documented justification comment
- **Code coverage**: MUST meet the thresholds in Principle II; coverage MUST NOT decrease
  between releases
- **Linting & formatting**: MUST comply with project-configured rules; no manual overrides
  permitted
- **Cyclomatic complexity**: MUST NOT exceed 10 per function; complex logic MUST be
  decomposed into smaller, independently testable units

**Rationale**: Automated quality gates remove subjective judgment from enforcement and
establish a consistent, reproducible quality bar that applies equally under deadline pressure.

### IV. Specification-Driven Quality

Every feature MUST have a specification with explicit acceptance scenarios before
development begins:

- Acceptance scenarios MUST follow Given-When-Then format
- Every test MUST be traceable to a specific acceptance scenario or functional requirement
- No test may be written for functionality not captured in the specification
- Untestable requirements are invalid — requirements MUST be rewritten until they are
  concrete and verifiable

**Rationale**: Traceability between requirements and tests prevents both over-engineering
(building untested features) and under-specification (implementing without clear acceptance
criteria). It also makes regression failures immediately interpretable.

### V. Continuous Quality Gates

CI/CD pipelines MUST enforce all quality gates automatically on every branch and PR:

- All tests (unit + integration + E2E) MUST pass before a branch can be merged
- Coverage thresholds MUST be verified on every PR
- Static analysis MUST run on every commit
- Quality gate failures block merge without exception; overrides MUST be documented in
  writing by a designated Quality Owner and attached to the PR

**Rationale**: Manual quality enforcement is error-prone and inconsistent. Automated gates
ensure every change meets the same standard regardless of team pressure or urgency.

### VI. Defect Prevention Over Detection

The project prioritises preventing defects from entering the codebase over detecting them
after the fact:

- Code reviews MUST explicitly evaluate quality risks, not only logical correctness
- Type checking (static types or type hints) is MANDATORY where the language supports it
- Security scanning MUST run on every commit via automated tooling
- Dependency vulnerability scanning MUST be part of the CI pipeline
- Performance regression tests MUST run for any change affecting a performance-critical path

**Rationale**: Defects found after merge cost significantly more to fix than defects caught
during review. Prevention tooling is a force multiplier that compounds in value as the
codebase grows.

## QA Workflow Standards

**Test naming**: Tests MUST follow the convention `test_<unit>_<scenario>_<expected_outcome>`
(or the project-language equivalent) so that failure messages are self-documenting without
reading the test body.

**Test isolation**: Test data MUST be isolated per test. Shared mutable state between tests
is forbidden. Each test MUST set up and tear down its own fixtures.

**Flaky tests**: A test that fails intermittently is treated as a defect. It MUST be fixed
or removed immediately. Suppression with a skip/xfail marker is only permitted when an
associated tracking issue exists and a resolution date is set in the marker comment.

**Test documentation**: Complex test scenarios MUST include a single-line comment explaining
the non-obvious WHY (e.g., a boundary condition, a regression guard, or a specific bug being
prevented). Trivial tests MUST NOT include comments — the test name is sufficient.

**Reporting**: Every CI run MUST produce a structured test report (JUnit XML or equivalent).
Test result trends MUST be visible and reviewed at the end of each sprint.

## Review & Approval Process

Pull requests MUST include:

- A passing CI run with all quality gates green
- At least one peer-review approval from a team member other than the author
- For changes to core business logic: at least one review from a senior team member or
  Quality Owner
- An explicit reference to the acceptance scenario(s) the change satisfies

Reviewers MUST verify:

- Tests exist for every acceptance scenario covered by the change
- Coverage thresholds are met or exceeded
- No quality gate suppressions exist without documented justification
- Complexity thresholds are respected (Principle III)
- Test isolation is maintained (no shared mutable state introduced)

## Governance

This constitution supersedes all other development practices and agreements for this project.
Amendments MUST be documented, reviewed by the full team, and merged with a versioned commit
message referencing the new version number.

**Amendment procedure**:

1. Propose the change as a PR modifying this file with a rationale section
2. All team members MUST have 48 hours to review before merge
3. Merge requires unanimous approval or a Quality Owner override with documented rationale

**Versioning policy**: Semantic versioning (MAJOR.MINOR.PATCH). MAJOR for principle removals
or redefinitions; MINOR for new principles or materially expanded guidance; PATCH for
clarifications, wording fixes, or non-semantic refinements.

**Compliance reviews**: Quality gate compliance MUST be reviewed at the close of each sprint.
Persistent non-compliance MUST trigger a retrospective and principle refinement within the
following sprint.

All PRs and reviews MUST verify compliance with this constitution. Use
`.specify/memory/constitution.md` as the authoritative reference.

**Version**: 1.0.0 | **Ratified**: 2026-06-06 | **Last Amended**: 2026-06-06
