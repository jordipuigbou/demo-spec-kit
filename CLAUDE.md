<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at [specs/002-layout-sidebar-topbar/plan.md](specs/002-layout-sidebar-topbar/plan.md)
<!-- SPECKIT END -->

## Testing Standards

### Framework Selection

Choose the test framework that is **native to the technology stack** used for development — the one that requires the least glue code and is already understood by the language ecosystem. Favour frameworks with strong AI-agent support: clear, verbose error messages; deterministic output; wide training-data coverage in public models; and first-class CLI interfaces that an agent can drive without interactive prompts.

Guiding criteria, in priority order:

1. **Same ecosystem** — if the production code is TypeScript, use Vitest or Jest; if Python, use pytest; if Java/Kotlin, use JUnit 5; if Go, use the standard `testing` package with `testify`. Do not introduce a framework from a different language runtime.
2. **AI-agent friendliness** — prefer frameworks where: test files are plain source files (not DSL configs), failure output is structured and machine-parseable, and the runner exits with a non-zero code on failure without extra flags.
3. **JUnit XML support out-of-the-box** — the framework must be able to emit JUnit XML natively or via an officially maintained reporter, without third-party monkey-patching.
4. **Active maintenance** — choose the framework with the largest active community in that ecosystem; avoid abandoned or niche alternatives unless the stack mandates it.

When a project uses multiple languages (e.g., a TypeScript frontend and a Python backend), each component picks its own native framework independently — do not force uniformity across language boundaries.

### AC-to-Test Mapping

Every acceptance criterion (AC) defined in spec.md MUST have at least one corresponding test. AC coverage MUST be 100% — no AC may remain untested when a feature is considered complete. Verify coverage using the AC Coverage Matrix in tasks.md before closing any user story.

### AC Annotation in Test Reports

Every test that covers an acceptance criterion MUST annotate its output with the AC identifier so that CI reports are traceable to requirements. The annotation key is `acceptance-criteria` and the value is the AC identifier in the format `SPXXX-USYY-CRZZ` (e.g., `SP010-US01-CR01`).

Use the simplest method available for the test framework in use:

| Framework | Method |
| --------- | ------ |
| **Vitest ≥4.1** | Use `context.annotate`: `await annotate('acceptance-criteria', 'SP010-US01-CR01')` inside the test body. This writes `<property name="acceptance-criteria" value="SP010-US01-CR01"/>` into the JUnit XML output via the `onTestAnnotate` reporter hook — no test-name prefix needed. For Vitest <4.1, fall back to embedding the AC id as a test-name prefix: `[SP010-US01-CR01] should …`. |
| **Playwright** | Use the native tag API: `{ tag: ['@ac-SP010-US01-CR01'] }`. The Playwright JUnit reporter writes tags as `<property name="acceptance-criteria" value="SP010-US01-CR01"/>` in the output. |
| **pytest** | Use `pytest-metadata` or a custom `record_property` fixture call: `record_property("acceptance-criteria", "SP010-US01-CR01")`. This writes a `<property>` element into the JUnit XML for that test. |
| **JUnit (Java)** | Annotate the test method with `@Tag("acceptance-criteria=SP010-US01-CR01")` or use a custom `@ExtendWith` listener that adds a `<property>` to the Surefire/Failsafe XML. |
| **Jest** | Prefix the test name with the AC identifier (`[SP010-US01-CR01] should …`). If using `jest-junit`, set the `JEST_JUNIT_CLASSNAME` env var or use `testResultsProcessor` to inject a `<property>` node. |
| **RSpec** | Use `metadata`: `it "does x", :"acceptance-criteria" => "SP010-US01-CR01" do … end`. The `RspecJunitFormatter` will emit the metadata as a property. |

For any framework not listed above, embed the AC identifier as a prefix in the test name. This guarantees it appears in the JUnit `<testcase name>` attribute and is greppable in any CI system.

### Required Test Reports

Every test execution — regardless of level (unit, integration, E2E) — MUST produce both:

1. **JUnit XML report** — machine-readable, consumed by CI (e.g., `junit.xml`, `test-results.xml`). Required for AC traceability queries and merge gate enforcement (Constitution §V).
2. **HTML report** — human-readable summary of results, coverage, and failures. Must be produced alongside the JUnit XML in the same output directory.

Configure the test runner to emit both formats by default (not only on CI). If the framework requires two separate reporter entries, add both to the project config and commit them — do not rely on ad-hoc CLI flags.
