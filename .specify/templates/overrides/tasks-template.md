---

description: "Task list template for feature implementation"
---

<!--
  ============================================================================
  PROJECT OVERRIDE — SUPERSEDES FRAMEWORK DEFAULTS

  This template overrides the default tasks-template.md provided by spec-kit.
  Where this template conflicts with framework defaults or skill instructions,
  THIS TEMPLATE TAKES PRECEDENCE.

  Key override: The framework default treats test tasks as OPTIONAL and does
  not distinguish between test levels. Per project constitution §I (Test-First
  — NON-NEGOTIABLE) and §II (Testing Pyramid Compliance), test tasks are
  MANDATORY and MUST be explicitly categorised as Unit, Integration, or E2E.
  This is not negotiable.
  ============================================================================
-->

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests & AC Traceability (MANDATORY — overrides framework default)**: Every acceptance criterion (AC) defined in the spec.md MUST be mapped to at least one test task. Tests are NOT optional — this is required by project constitution §I (Test-First) and §IV (Specification-Driven Quality).

**AC Identifier Global Uniqueness**: AC identifiers MUST be globally unique across the entire project. The format includes the feature's spec number as prefix: `[AC-SP{spec}-US{story}-CR{criterion}]` where `{spec}` is the zero-padded feature number extracted from the branch name (e.g., `010` from branch `010-my-feature`). This ensures no collisions between ACs from different features.

**Test Level Strategy**: The test level for each AC is determined by the project constitution §II (Testing Pyramid Compliance). The pyramid MUST be respected at the feature level:

- **Unit tests** (≥ 70% of test count): isolated, fast (< 100 ms), no I/O, no external dependencies
- **Integration tests** (20–25% of test count): verify interactions between components or services
- **E2E tests** (≤ 10% of test count): full user journey validation — use sparingly, justify explicitly

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- **[AC-SP{spec}-US{story}-CR{criterion}]**: Globally unique acceptance criterion identifier — links the test task to a specific AC from spec.md
- Include exact file paths in descriptions

## AC-to-Test Traceability Rules

1. **Every AC must have a test**: For each acceptance scenario or criterion in spec.md, there MUST be at least one test task tagged with its `[AC-SP{spec}-US{story}-CR{criterion}]` identifier.
2. **Test level follows the constitution**: Assign the lowest-cost level that can faithfully verify the AC. See the Test Level Decision Guidelines below.
3. **No untested ACs**: If an AC cannot be tested at any level, flag it explicitly with `⚠️ NOT TESTABLE: [reason]` and propose an alternative verification method.
4. **Pyramid distribution is enforced per feature**: Before closing a feature, verify that the test count distribution matches §II thresholds. If distribution is off, reassess level choices before proceeding.

## Test Level Decision Guidelines

Each AC test task MUST include a **Test Decision Record** that justifies the chosen test level and framework. Use the following levels ordered by cost (lowest → highest):

| Cost | Level | When to use | Target distribution |
|------|-------|-------------|---------------------|
| 🟢 Low | **Unit** | Pure logic, transformations, calculations, utilities with no external dependencies or I/O. Must run in < 100 ms. | ≥ 70% of tests |
| 🟡 Medium | **Integration** | Interactions between two or more components, services, or system boundaries (e.g., service + DB, API + downstream service). Real dependencies allowed; external network may be mocked at boundary. | 20–25% of tests |
| 🔴 High | **E2E** | Full user journey spanning the entire stack — requires a running application and real browser or API client. Use ONLY for P1 acceptance criteria that cannot be verified at integration level. | ≤ 10% of tests |

### Test Decision Record format (required for each test task)

Every test task description MUST follow this structure:

```
[ID] [P?] [Story] [AC-SP{spec}-US{story}-CR{criterion}] [Level] test: [what it verifies]
  📋 Level: [Unit | Integration | E2E]
  💡 Why this level: [1-2 sentence justification for choosing this level over cheaper alternatives]
  🔧 Framework: [framework name and version if relevant]
  📐 Why this framework: [1-sentence justification — reference project conventions or tech stack]
  📁 File: [exact test file path]
```

### Level selection criteria

- **Choose Unit** when: the AC validates pure logic (data transformation, calculation, validation rules) that has no side effects, no I/O, and no external dependencies. Tests MUST run in isolation without any real service or database.
  - ⚠️ Reminder: Unit tests MUST form ≥ 70% of the suite (Constitution §II). If the majority of a story's ACs resolve to Integration or E2E level, reassess — some ACs may be decomposable into unit-verifiable logic.

- **Choose Integration** when: the AC validates behavior that involves interaction between layers — e.g., a service writing to a database, an API calling a downstream dependency, a message being published and consumed. External dependencies that are out of scope for the feature may be mocked at the boundary; in-scope interactions must use real instances.

- **Choose E2E** when: the AC validates a **P1 critical user journey** that can only be verified end-to-end — a complete flow from the user's perspective that crosses multiple system boundaries and cannot be decomposed. **Must be explicitly justified** — explain why integration-level testing is insufficient.
  - ⚠️ E2E tests MUST NOT exceed 10% of total test count (Constitution §II). If this threshold would be exceeded, review whether some E2E candidates can be promoted to integration level.

### Framework selection

Framework choices MUST align with the project's tech stack as defined in plan.md. **Always consult the target component or layer's README or CLAUDE.md** before selecting a framework — do not assume uniformity across a multi-component project. Record the choice in the Test Decision Record so reviewers can verify it is consistent with project conventions.

Common patterns (adjust to your actual stack):

| Level | Typical frameworks |
|-------|--------------------|
| Unit | Jest, Vitest, pytest, JUnit, Go test, RSpec |
| Integration | Supertest, pytest + testcontainers, Spring Boot Test, Vitest (with real DB), Playwright component mode |
| E2E | Playwright, Cypress, Selenium, pytest + httpx (API E2E) |

### Mocking strategy (Constitution §I)

External systems MUST be mocked **at the component boundary** to enable fully local test execution:

- **Unit tests**: mock all dependencies — no network, no filesystem, no real services
- **Integration tests**: mock only out-of-scope external systems; real instances for in-scope components (e.g., real Postgres via testcontainer, mocked third-party API)
- **E2E tests**: use a dedicated test environment — no mocking of in-scope services; external payment/email/analytics providers may be stubbed

## Edge Case Handling Rules

Edge cases listed in spec.md MUST be treated as additional testable behaviors — **not as deferred work**.

1. **Assign to the owning user story**: Each edge case belongs to the user story whose functionality it extends. Place its test and implementation tasks **inside that story's phase**, not in the Polish phase.
2. **Test-first applies (Constitution §I)**: Edge case code changes are production code. They MUST have a failing test before implementation — same TDD cycle as ACs.
3. **Use the same Test Decision Record format**: Every edge case test task MUST include the full `📋 Level / 💡 Why / 🔧 Framework / 📐 Why framework / 📁 File` record.
4. **Include in the AC Coverage Matrix**: Edge case test tasks MUST appear in the story's AC Coverage Matrix with the prefix `Edge:` in the AC column.
5. **Phase N (Polish) is NOT for edge cases**: New behavior — including edge cases — MUST NOT be deferred there.

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Acceptance criteria from spec.md — EVERY AC must map to a test task
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently (with every AC verified)
  - Delivered as an MVP increment

  AC-TO-TEST MAPPING IS MANDATORY:
  - Extract all acceptance scenarios/criteria from each user story in spec.md
  - Assign each an identifier: [AC-SP{spec}-US{story}-CR{criterion}]
  - Create a test task for each AC, tagged with its identifier
  - Choose the test level based on the project constitution (§II pyramid)
  - Include an AC Coverage Matrix at the end of each user story phase
  - Verify pyramid distribution (≥70% unit / 20-25% integration / ≤10% E2E)

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting, formatting, and static analysis tools
- [ ] T004 [P] Configure test runners for each level (unit / integration / E2E)
- [ ] T005 [P] Configure CI pipeline with quality gates (Constitution §V)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Setup database schema and migrations framework
- [ ] T007 [P] Implement authentication/authorization framework
- [ ] T008 [P] Setup API routing and middleware structure
- [ ] T009 Create base models/entities that all stories depend on
- [ ] T010 Configure error handling and structured logging infrastructure
- [ ] T011 Setup environment configuration management
- [ ] T012 [P] Setup test infrastructure: unit runner, integration fixtures (e.g., testcontainers), E2E environment

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

**Acceptance Criteria** (from spec.md):

- AC-SP{spec}-US01-CR01: [First acceptance criterion]
- AC-SP{spec}-US01-CR02: [Second acceptance criterion]
- AC-SP{spec}-US01-CR03: [Third acceptance criterion — must be P1 to justify E2E]

### Tests for User Story 1 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I — NON-NEGOTIABLE):**
> 1. **Write** tests for every AC below
> 2. **Review**: test intent MUST be approved by reviewer before proceeding
> 3. **Red**: run the relevant test command and verify the new tests FAIL
> 4. **Green**: implement until tests pass — run the SAME command and verify ZERO failures
> 5. **Refactor**: clean up, then run ALL test tiers to confirm no regressions
>
> **"Run tests" means executing the command in a terminal and reading the output — not assuming the result.**
>
> **Each test MUST include a Test Decision Record (level + justification + framework + rationale).**

#### Unit Tests (🟢 — target ≥ 70% of story test count)

- [ ] T013 [P] [US1] [AC-SP{spec}-US01-CR01] Unit test: [describe what AC-SP{spec}-US01-CR01 verifies at unit level]
  - 📋 Level: Unit
  - 💡 Why this level: [e.g., "Validates pure validation logic with no external dependencies — isolated and fast"]
  - 🔧 Framework: [e.g., Jest / Vitest / pytest / JUnit]
  - 📐 Why this framework: [e.g., "Designated unit test runner for this component per project conventions"]
  - 📁 File: `[e.g., src/[feature]/__tests__/[name].test.ts]`

- [ ] T014 [P] [US1] [AC-SP{spec}-US01-CR02] Unit test: [describe what AC-SP{spec}-US01-CR02 verifies at unit level]
  - 📋 Level: Unit
  - 💡 Why this level: [justification]
  - 🔧 Framework: [framework]
  - 📐 Why this framework: [rationale]
  - 📁 File: `[exact test file path]`

#### Integration Tests (🟡 — target 20–25% of story test count)

- [ ] T015 [P] [US1] [AC-SP{spec}-US01-CR02] Integration test: [describe what AC-SP{spec}-US01-CR02 verifies at integration level — note: same AC may need both unit and integration]
  - 📋 Level: Integration
  - 💡 Why this level: [e.g., "Validates that the service correctly persists data to the database — requires real Postgres via testcontainer; pure unit mocking would not verify the SQL mapping"]
  - 🔧 Framework: [e.g., pytest + testcontainers / Supertest / Vitest with real DB]
  - 📐 Why this framework: [e.g., "Testcontainers provides a real Postgres instance without external infrastructure; consistent with other integration tests in the project"]
  - 📁 File: `[e.g., tests/integration/test_[name].py]`

#### E2E Tests (🔴 — target ≤ 10% of story test count, P1 ACs only)

- [ ] T016 [US1] [AC-SP{spec}-US01-CR03] 🔴 E2E test: [describe what AC-SP{spec}-US01-CR03 verifies end-to-end]
  - 📋 Level: E2E
  - 💡 Why this level: [e.g., "P1 critical user journey that spans login → checkout → confirmation. The cross-page navigation, session persistence, and real payment stub require a running application — integration tests cannot verify this full flow"]
  - 🔧 Framework: [e.g., Playwright / Cypress / pytest + httpx]
  - 📐 Why this framework: [e.g., "Playwright is the designated E2E runner for browser-based flows; configured in test/e2e/"]
  - 📁 File: `[e.g., test/e2e/[name].test.ts]`

### Edge Case Tests for User Story 1

<!--
  Edge cases from spec.md that relate to this user story go here —
  NOT deferred to Phase N (Polish). Each follows the same Test Decision Record format.
-->

- [ ] TXXX [P] [US1] [Edge: description] [Unit | Integration | E2E] test: [edge case behavior]
  - 📋 Level: [Unit | Integration | E2E]
  - 💡 Why this level: [1-2 sentence justification]
  - 🔧 Framework: [framework]
  - 📐 Why this framework: [1-sentence justification]
  - 📁 File: `[exact test file path]`

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create [Entity1] model in `src/[feature]/[entity1].[ext]`
- [ ] T018 [P] [US1] Create [Entity2] model in `src/[feature]/[entity2].[ext]`
- [ ] T019 [US1] Implement [Service] in `src/[feature]/[service].[ext]` (depends on T017, T018)
- [ ] T020 [US1] Implement [endpoint/page/feature] in `src/[location]/[file].[ext]`
- [ ] T021 [US1] Add input validation and error handling at system boundaries (Constitution §VI)
- [ ] T022 [US1] Add structured logging for user story 1 operations

### AC Coverage Matrix — User Story 1

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP{spec}-US01-CR01 | T013 | Unit | 🟢 | [framework] | [why this level] |
| AC-SP{spec}-US01-CR02 | T014, T015 | Unit + Integration | 🟢🟡 | [framework] | [unit for pure logic; integration for DB persistence] |
| AC-SP{spec}-US01-CR03 | T016 | E2E | 🔴 | [framework] | [P1 cross-system journey — integration insufficient] |
| Edge: [description] | TXXX | [level] | [cost] | [framework] | [why this level] |

**Test Level Distribution — User Story 1**:
- 🟢 Unit: X tests ([X]%) — target ≥ 70%
- 🟡 Integration: X tests ([X]%) — target 20–25%
- 🔴 E2E: X tests ([X]%) — target ≤ 10%

> ✅ All ACs + edge cases covered. If any AC or edge case is missing a test, add it before proceeding.
> ⚠️ Review 🔴 E2E entries — each one must have an explicit justification for why integration-level is insufficient.
> ⚠️ Review pyramid distribution — if unit < 70% or E2E > 10%, reassess level choices before proceeding.

**Checkpoint**: User Story 1 fully functional, all ACs verified, pyramid distribution checked, refactoring complete (Red → Green → Refactor ✓)

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

**Acceptance Criteria** (from spec.md):

- AC-SP{spec}-US02-CR01: [First acceptance criterion]
- AC-SP{spec}-US02-CR02: [Second acceptance criterion]

### Tests for User Story 2 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I):** Write → Review intent → Red → Green → Refactor
> **Each test MUST include a Test Decision Record (level + justification + framework + rationale).**

#### Unit Tests (🟢)

- [ ] T023 [P] [US2] [AC-SP{spec}-US02-CR01] Unit test: [describe what AC-SP{spec}-US02-CR01 verifies]
  - 📋 Level: Unit
  - 💡 Why this level: [justification]
  - 🔧 Framework: [framework]
  - 📐 Why this framework: [rationale]
  - 📁 File: `[exact test file path]`

#### Integration Tests (🟡)

- [ ] T024 [P] [US2] [AC-SP{spec}-US02-CR02] Integration test: [describe what AC-SP{spec}-US02-CR02 verifies]
  - 📋 Level: Integration
  - 💡 Why this level: [justification]
  - 🔧 Framework: [framework]
  - 📐 Why this framework: [rationale]
  - 📁 File: `[exact test file path]`

#### E2E Tests (🔴 — only if P1 AC, justify explicitly)

<!--
  Add E2E tasks here only if this story has a P1 AC that genuinely requires
  full-stack verification. Otherwise, omit this section.
-->

### Implementation for User Story 2

- [ ] T025 [P] [US2] Create [Entity] model in `src/[feature]/[entity].[ext]`
- [ ] T026 [US2] Implement [Service] in `src/[feature]/[service].[ext]`
- [ ] T027 [US2] Implement [endpoint/page/feature] in `src/[location]/[file].[ext]`
- [ ] T028 [US2] Integrate with User Story 1 components (if needed)

### AC Coverage Matrix — User Story 2

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP{spec}-US02-CR01 | T023 | Unit | 🟢 | [framework] | [why this level] |
| AC-SP{spec}-US02-CR02 | T024 | Integration | 🟡 | [framework] | [why this level] |

**Test Level Distribution — User Story 2**:
- 🟢 Unit: X tests ([X]%) — target ≥ 70%
- 🟡 Integration: X tests ([X]%) — target 20–25%
- 🔴 E2E: X tests ([X]%) — target ≤ 10%

> ✅ All ACs covered. If any AC is missing a test, add it before proceeding.
> ⚠️ Review pyramid distribution before proceeding.

**Checkpoint**: User Stories 1 AND 2 both work independently, all ACs verified, pyramid distribution checked (Red → Green → Refactor ✓)

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

**Acceptance Criteria** (from spec.md):

- AC-SP{spec}-US03-CR01: [First acceptance criterion]
- AC-SP{spec}-US03-CR02: [Second acceptance criterion]

### Tests for User Story 3 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I):** Write → Review intent → Red → Green → Refactor
> **Each test MUST include a Test Decision Record (level + justification + framework + rationale).**

#### Unit Tests (🟢)

- [ ] T029 [P] [US3] [AC-SP{spec}-US03-CR01] Unit test: [describe what AC-SP{spec}-US03-CR01 verifies]
  - 📋 Level: Unit
  - 💡 Why this level: [justification]
  - 🔧 Framework: [framework]
  - 📐 Why this framework: [rationale]
  - 📁 File: `[exact test file path]`

#### Integration Tests (🟡)

- [ ] T030 [P] [US3] [AC-SP{spec}-US03-CR02] Integration test: [describe what AC-SP{spec}-US03-CR02 verifies]
  - 📋 Level: Integration
  - 💡 Why this level: [justification]
  - 🔧 Framework: [framework]
  - 📐 Why this framework: [rationale]
  - 📁 File: `[exact test file path]`

#### E2E Tests (🔴 — only if P1 AC, justify explicitly)

<!--
  Add E2E tasks here only if this story has a P1 AC that genuinely requires
  full-stack verification. Otherwise, omit this section.
-->

### Implementation for User Story 3

- [ ] T031 [P] [US3] Create [Entity] model in `src/[feature]/[entity].[ext]`
- [ ] T032 [US3] Implement [Service] in `src/[feature]/[service].[ext]`
- [ ] T033 [US3] Implement [endpoint/page/feature] in `src/[location]/[file].[ext]`

### AC Coverage Matrix — User Story 3

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP{spec}-US03-CR01 | T029 | Unit | 🟢 | [framework] | [why this level] |
| AC-SP{spec}-US03-CR02 | T030 | Integration | 🟡 | [framework] | [why this level] |

**Test Level Distribution — User Story 3**:
- 🟢 Unit: X tests ([X]%) — target ≥ 70%
- 🟡 Integration: X tests ([X]%) — target 20–25%
- 🔴 E2E: X tests ([X]%) — target ≤ 10%

> ✅ All ACs covered. If any AC is missing a test, add it before proceeding.
> ⚠️ Review pyramid distribution before proceeding.

**Checkpoint**: All user stories independently functional, all ACs verified, pyramid distribution checked (Red → Green → Refactor ✓)

---

[Add more user story phases as needed, following the same pattern — each MUST include AC listing, level-grouped test tasks, and AC Coverage Matrix with pyramid distribution]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Cross-cutting review, cleanup, and validation across all user stories

> **⚠️ IMPORTANT**: This phase is for **review and hardening** only. It MUST NOT contain new behavior, including edge cases. Edge cases belong in their respective user story phases.

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX Security review and hardening (validate Constitution §VI compliance: input validation at boundaries, secrets management, dependency audit, auth standards)
- [ ] TXXX Dependency vulnerability scan (Constitution §VI)
- [ ] TXXX Run quickstart.md validation
- [ ] TXXX Run linter, formatter, and static analysis on all modified components — verify zero errors
  - Read terminal output and confirm zero errors before marking complete
- [ ] TXXX Run ALL test tiers independently and verify zero failures across all stories
  - Unit: `[command for unit tests]`
  - Integration: `[command for integration tests]`
  - E2E: `[command for E2E tests]`
  - Read terminal output and confirm pass/fail counts for each tier
  - Do NOT mark this task complete without concrete terminal output

---

## Global AC Coverage Summary

**Purpose**: Consolidated view of AC-to-test traceability and pyramid compliance across all user stories

| User Story | Total ACs | Edge Cases | 🟢 Unit | 🟡 Integration | 🔴 E2E | Coverage | Untested ACs |
|------------|-----------|------------|---------|----------------|--------|----------|--------------|
| US1 | X | X | X | X | X | 100% | — |
| US2 | X | X | X | X | X | 100% | — |
| US3 | X | X | X | X | X | 100% | — |
| **Total** | **X** | **X** | **X** | **X** | **X** | **100%** | **—** |

**Global Pyramid Distribution**:
- 🟢 Unit: [total] tests ([X]%) — MUST be ≥ 70% (Constitution §II)
- 🟡 Integration: [total] tests ([X]%) — MUST be 20–25% (Constitution §II)
- 🔴 E2E: [total] tests ([X]%) — MUST be ≤ 10% (Constitution §II)

> 📊 **Pyramid compliance gate**: If distribution is outside the §II thresholds, the feature MUST NOT proceed to merge. Reassess level choices and update the tasks accordingly.

> 📊 **Edge case coverage**: All edge cases from spec.md must be distributed into their story phases with full Test Decision Records — not deferred to Polish.

> ⚠️ **GATE**: Do not proceed to Phase N (Polish) unless Global AC Coverage is 100%, all edge cases have test tasks, AND the pyramid distribution is within §II thresholds.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational; can proceed in parallel when staffed
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational — may integrate with US1 but must be independently testable
- **User Story 3 (P3)**: Can start after Foundational — may integrate with US1/US2 but must be independently testable

### Within Each User Story

- **AC extraction first**: List all acceptance criteria from spec.md before writing any task
- **TDD cycle is mandatory (Constitution §I)**: Write tests → Review intent → Red → Green → Refactor
- **Each test MUST include a Test Decision Record**: level, justification, framework, rationale, file path
- **Test level follows the pyramid (Constitution §II)**: Unit is the default; choose Integration or E2E only when the AC nature requires it
- **Unit tests MUST be the majority** — if most ACs in a story are Integration or E2E, reassess
- **E2E tests (🔴) require explicit justification** for why Integration level is insufficient, and are restricted to P1 ACs
- **External systems mocked at component boundaries** for fully local unit and integration execution
- Models before services; services before endpoints; core implementation before integration
- **AC Coverage Matrix + pyramid distribution must be verified** before marking any story complete

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- Once Foundational is complete, all user stories can start in parallel (if team capacity allows)
- All unit test tasks within a story marked [P] can run in parallel
- All integration test tasks within a story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (including test infrastructure)
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (TDD — write tests first, verify Red, then implement)
4. **STOP and VALIDATE**: All ACs verified, pyramid distribution within §II thresholds
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation + test infrastructure ready
2. Add User Story 1 → TDD → Verify pyramid → Deploy/Demo (MVP!)
3. Add User Story 2 → TDD → Verify pyramid → Deploy/Demo
4. Add User Story 3 → TDD → Verify pyramid → Deploy/Demo
5. Each story adds value without breaking previous stories or degrading pyramid compliance

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently; each developer owns their story's pyramid distribution

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- **[AC-SP{spec}-US{story}-CR{criterion}]** maps each test task to a specific acceptance criterion. `{spec}` is the zero-padded feature number from the branch name.
- **Every AC in spec.md MUST appear as a test task** — no exceptions (Constitution §IV)
- **Every edge case in spec.md MUST appear as a test task inside its owning story phase** — not in Polish
- **Every test task MUST include a Test Decision Record** — level + justification + framework + rationale
- **Test pyramid MUST be respected** (Constitution §II): ≥ 70% unit / 20–25% integration / ≤ 10% E2E — check at story level AND globally
- **🔴 E2E tests are expensive and restricted**: only for P1 critical user journeys; must justify why integration-level is insufficient; MUST NOT exceed 10% of total test count
- **🟡 Integration tests for cross-component behavior**: use real in-scope dependencies; mock only out-of-scope external systems
- **🟢 Unit tests for pure logic**: no dependencies, no I/O, run in < 100 ms — the default for isolated behavior
- Verify tests fail before implementing (Red before Green)
- Commit after each task or logical group
- Stop at each checkpoint to validate story independently and verify pyramid distribution
- Complete the AC Coverage Matrix (with level + cost + framework + justification + edge cases + pyramid distribution) before marking any story as done
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence, untested ACs, unjustified E2E tests, edge cases deferred to Polish, pyramid distribution violations
