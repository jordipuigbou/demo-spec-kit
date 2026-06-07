# demo-spec-kit

A reference repository demonstrating the [Spec Kit](https://github.com/jordipuigbou/spec-kit) specification-driven development workflow with an AI coding agent (Claude Code).

## What is Spec Kit?

Spec Kit is a Claude Code skill set that turns a natural-language feature description into structured, traceable engineering artifacts — specification, implementation plan, and task list — before a single line of code is written. It enforces a **Test-First, Specification-Driven** quality approach through a built-in project constitution and keeps the AI coding agent aligned via a managed context file (`CLAUDE.md`).

The typical workflow per feature:

```text
/speckit-specify   →  spec.md        (acceptance criteria, requirements, success metrics)
/speckit-clarify   →  spec.md        (gap-filling Q&A with the AI agent)
/speckit-plan      →  plan.md        (architecture, component design, tech decisions)
/speckit-tasks     →  tasks.md       (ordered, dependency-resolved task list)
/speckit-implement →  source code    (AI agent executes each task, test-first)
```

Each command produces a versioned artifact under `specs/<feature-id>/` so the full decision trail — from requirement to merged code — is auditable at any point.

## About this demo

This repo contains a small **Next.js** web app built incrementally through the Spec Kit workflow. The app itself is intentionally simple; the point is to show what the process looks like in practice: how features are specified, how plans are generated, how tasks are derived, and how an AI agent implements them.

Every feature in the app has a corresponding `specs/<id>-<slug>/` directory with the full artifact chain:

| Feature | Spec artifacts | What was built |
| --- | --- | --- |
| `001-qa-conferences-dashboard` | [spec](specs/001-qa-conferences-dashboard/spec.md) · [plan](specs/001-qa-conferences-dashboard/plan.md) · [tasks](specs/001-qa-conferences-dashboard/tasks.md) | Responsive card grid of QA conference events in Spain |
| `002-layout-sidebar-topbar` | [spec](specs/002-layout-sidebar-topbar/spec.md) · [plan](specs/002-layout-sidebar-topbar/plan.md) · [tasks](specs/002-layout-sidebar-topbar/tasks.md) | Collapsible sidebar, top bar, and typography system |

## Repository structure

```text
demo-spec-kit/
├── specs/                          ← one directory per feature, all design artifacts
│   ├── 001-qa-conferences-dashboard/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   └── 002-layout-sidebar-topbar/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── qa-conferences/                 ← the demo Next.js application
│   ├── src/
│   └── tests/
├── .specify/                       ← Spec Kit configuration
├── CLAUDE.md                       ← AI agent context (managed by Spec Kit)
└── .github/workflows/ci.yml
```

## Running the app

```bash
cd qa-conferences
npm install
npm run dev          # http://localhost:3000
```

## Running tests

```bash
cd qa-conferences

npm run test:ci      # Vitest unit + component tests (JUnit XML + HTML report)
npm run test:e2e     # Playwright E2E tests
npm run test:all     # both suites
```

Reports are written to `qa-conferences/reports/`:

- `reports/unit/junit.xml` · `reports/unit/html/` — Vitest
- `reports/e2e/junit.xml` · `reports/e2e/html/` — Playwright

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js (App Router) |
| Language | TypeScript + React |
| Styling | Tailwind CSS |
| Unit/component tests | Vitest + Testing Library |
| E2E tests | Playwright |
| CI | GitHub Actions |
