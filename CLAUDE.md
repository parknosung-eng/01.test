# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

## Repository Overview

**Project:** 01.test
**Description:** Application project (early stage — minimal scaffolding present)
**Remote:** parknosung-eng/01.test
**Current state:** Empty skeleton with only a README.md. No application code, dependencies, tests, or build tooling have been added yet.

---

## Repository Structure

```
/
├── README.md       # Minimal project stub
└── CLAUDE.md       # This file
```

As the project grows, update this section to reflect the actual structure.

---

## Git Workflow

### Branches

- `master` — stable/production branch; do not push directly
- `claude/<session-id>` — AI-generated feature/task branches (e.g., `claude/claude-md-mm8jumvcsw5bj00q-9Bi4S`)

### Branch Naming Convention

AI assistant branches must follow:
```
claude/<task-slug>-<session-id>
```

### Committing

- Write clear, imperative commit messages (e.g., `Add user authentication module`)
- Keep commits focused and atomic
- Do not skip pre-commit hooks (`--no-verify` is forbidden unless explicitly requested)

### Pushing

Always push with tracking:
```bash
git push -u origin <branch-name>
```

If a push fails due to network errors, retry with exponential backoff: 2s → 4s → 8s → 16s (max 4 retries).

**Never push to `master` directly.** Open a pull request instead.

---

## Development Conventions

> These conventions should be updated as the project matures and a stack is chosen.

### General Principles

- Prefer editing existing files over creating new ones
- Avoid over-engineering; implement only what is requested
- Do not add comments or docstrings to code that was not changed
- Keep changes minimal and focused on the task at hand

### Security

- Never commit secrets, credentials, or `.env` files
- Validate all external input at system boundaries
- Avoid command injection, XSS, SQL injection, and other OWASP Top 10 issues

---

## Commands

> This section will be populated once the project has a defined stack.

Common placeholders to fill in when the stack is set up:

```bash
# Install dependencies
# <package-manager> install

# Run tests
# <test-runner>

# Run linter
# <linter>

# Build
# <build-command>

# Start development server
# <dev-server-command>
```

---

## Environment Variables

No environment variables are required at this time. Add an `.env.example` file and document variables here when they are introduced.

---

## Notes for AI Assistants

1. **This repository is in its initial state.** Before adding code, confirm the intended stack and architecture with the user.
2. **Keep changes reviewable.** Prefer small, well-scoped commits.
3. **Update this file** whenever significant structural or workflow changes are made to the project.
4. **Do not infer a tech stack** — the project description ("app") is intentionally vague. Ask or wait for explicit direction.
