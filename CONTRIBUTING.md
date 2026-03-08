# Contributing to CruxAnalytics

Thank you for your interest in contributing! This document explains how to set up the project locally and submit changes.

---

## Quick Start (Dev Container)

The fastest way to start is with **GitHub Codespaces** or a local **Dev Container**:

1. Click **Code → Open with Codespaces** in the GitHub repo, or
2. Open the repo folder in VS Code → click **"Reopen in Container"** (requires Docker + Dev Containers extension).

The container automatically installs Node 20, pnpm, and starts MySQL. Skip to [Running the app](#running-the-app).

---

## Manual Setup

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| pnpm | ≥ 9 |
| MySQL | 8.x (or use Docker Compose) |

### 1. Clone the repo

```bash
git clone https://github.com/Jon-human-in-the-loop/CruxAnalytics.git
cd CruxAnalytics
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the database

```bash
# With Docker (recommended):
docker compose up -d db

# Or point to an existing MySQL instance and skip this step.
```

### 4. Configure environment

```bash
cp .env.example .env
# Edit .env – at minimum set DATABASE_URL
```

Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://root:root@localhost:3306/crux` |
| `USE_MOCK_AUTH` | Skip OAuth, use a dev user | `true` |
| `OPENAI_API_KEY` | For AI insights (optional) | – |
| `PORT` | API server port | `3000` |
| `EXPO_PORT` | Metro bundler port | `8081` |

### 5. Run database migrations

```bash
pnpm db:push
```

### 6. Running the app

```bash
pnpm dev          # starts API server + Expo web concurrently
```

Open [http://localhost:8081](http://localhost:8081) in your browser.

---

## Project Structure

```
app/          – Expo Router screens (tabs, modals, etc.)
components/   – React Native UI components
lib/          – Business logic, calculators, storage helpers
server/       – Express + tRPC backend
shared/       – Drizzle ORM schema (shared by client + server)
locales/      – i18n strings (en.json, es.json)
public/       – Static web assets (manifest, icons, SW, API docs)
```

---

## Development Guidelines

- **TypeScript everywhere** – avoid `any` unless strictly needed.
- **No new dependencies** without a discussion issue first.
- **Translations** – add keys to both `locales/en.json` and `locales/es.json` for every user-visible string.
- **Tests** – run `pnpm test` before opening a PR. Add tests for new calculation logic.
- **Formatting** – run `pnpm format` before committing (Prettier).

---

## Pull Request Process

1. Fork the repo and create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes and ensure `pnpm test` passes.
3. Open a PR against `main` with a clear title and description.
4. Link any relevant issues with `Closes #123`.

---

## Reporting Issues

Use the [GitHub Issues](https://github.com/Jon-human-in-the-loop/CruxAnalytics/issues) tracker.
Please include steps to reproduce, expected vs. actual behaviour, and your OS/browser.

---

## License

By contributing, you agree your code will be released under the [MIT License](LICENSE).
