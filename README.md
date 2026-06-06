# demo-spec-kit

A reference project demonstrating the [Spec Kit](https://github.com/jordipuigbou/spec-kit) specification-driven development workflow with an AI coding agent (Claude Code).

## What is Spec Kit?

Spec Kit is a CLI tool that turns natural-language feature descriptions into structured, traceable engineering artifacts — specification, implementation plan, and task list — before a single line of code is written. It enforces a **Test-First, Specification-Driven** quality approach through a built-in project constitution and integrates with AI coding agents via a managed context file (`CLAUDE.md`).

The typical workflow per feature:

```text
/speckit-specify   →  spec.md        (acceptance criteria, requirements, success metrics)
/speckit-clarify   →  spec.md        (gap-filling Q&A with the AI agent)
/speckit-plan      →  plan.md        (architecture, component design, tech decisions)
/speckit-tasks     →  tasks.md       (ordered, dependency-resolved task list)
/speckit-implement →  source code    (AI agent executes each task, test-first)
```

## Demo feature: QA Conferences Dashboard Spain

The `qa-conferences/` directory contains a **Next.js 16** single-page application built end-to-end using the Spec Kit workflow. It displays a responsive card grid of mocked QA and testing conference events in Spain.

All design artifacts live under `specs/001-qa-conferences-dashboard/`:

| Artifact | Description |
| --- | --- |
| [spec.md](specs/001-qa-conferences-dashboard/spec.md) | User stories, acceptance criteria, functional requirements |
| [plan.md](specs/001-qa-conferences-dashboard/plan.md) | Architecture, tech stack, project structure, constitution check |
| [tasks.md](specs/001-qa-conferences-dashboard/tasks.md) | Ordered implementation tasks with AC coverage matrix |

## Project structure

```text
demo-spec-kit/
├── specs/
│   └── 001-qa-conferences-dashboard/   ← design artifacts for the demo feature
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       ├── research.md
│       ├── data-model.md
│       └── contracts/
├── qa-conferences/                     ← Next.js application (demo feature)
│   ├── src/
│   │   ├── app/                        ← App Router entry points
│   │   ├── components/                 ← EventCard, EventGrid
│   │   ├── data/conferences.ts         ← static mocked event data (7 events)
│   │   └── types/
│   └── tests/e2e/                      ← Playwright E2E tests
├── .specify/                           ← Spec Kit configuration and extensions
├── CLAUDE.md                           ← AI coding agent context (managed by Spec Kit)
└── .github/workflows/ci.yml           ← CI pipeline
```

## Running the demo app

```bash
cd qa-conferences
npm install
npm run dev          # http://localhost:3000
```

## Running tests

```bash
cd qa-conferences

npm run test:ci      # Vitest unit + component tests (coverage + JUnit XML)
npm run test:e2e     # Playwright E2E tests
npm run test:all     # both suites
```

Test reports are written to `qa-conferences/reports/`:

- `reports/unit/junit.xml` and `reports/unit/html/` — Vitest
- `reports/e2e/junit.xml` and `reports/e2e/html/` — Playwright

## Tech stack (demo feature)

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.x (App Router, Turbopack) |
| Language | TypeScript 5.x, React 19.2 |
| Styling | Tailwind CSS 4.x |
| Unit/component tests | Vitest ≥4.1 + Testing Library |
| E2E tests | Playwright ≥1.60 |
| CI | GitHub Actions |

## CI

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request to `main`. It installs dependencies, runs both test suites, and uploads JUnit XML and HTML reports as artifacts for traceability.
