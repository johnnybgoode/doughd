# Turborepo Express + React template

This repo is a full-stack monorepo starter template that integrates an ExpressJS backend and React frontend with modern development tools like [turborebo](https://turborepo.dev/), [vite](https://vite.dev/), [tsx](https://tsx.is/), [biome](https://biomejs.dev/), [vitest](https://vitest.dev/), [playwright](https://playwright.dev/), and more.

### Quick Start

**1. Clone the repo**

```sh
git clone https://github.com/johnnybgoode/turborepo-express-react.git
```

Or use this repository as a template to create a new project right in GitHub.

**2. Install dependencies**

```sh
pnpm install
```

**3. Start the dev servers**

```sh
pnpm dev
```

That's it! The apps are served at:

- Frontend: [`http://localhost:3000`](http://localhost:3000)
- Backend: [`http://localhost:3001`](http://localhost:3001)

### Additional commands

- `pnpm build`: Create production builds for each app.
- `pnpm clean`: Remove production build artifacts.
- `pnpm format`: Run `biome format` and write formatted files for all apps/packages.
- `pnpm lint`: Run `biome check` and write safe fixes for all apps and configured packages.
- `pnpm test`: Execute unit and integration tests for each app. Use the options below to filter tests:
    - `pnpm test [--filter api|web]`: Execute all tests for the specified app.
    - `pnpm test --filter web -- [--project browser|unit]`: Execute `web` app tests for the given provider.
    - `pnpm test [--filter api|web -- pattern]`: Execute test files matching `pattern` for the specified app.

### Project structure

This repo consists of the following structure:

```sh
turborepo-express-react/
├── apps/
│   └── api/            ExpressJS backend
│   └── web/            Vanilla React frontend
├── packages/
│   └── biome-config/   Shared biome linter and formatter configuration
│   └── tsconfig/       Shared typescript configuration
│   └── vitest-config/  Shared vitest configuration
```