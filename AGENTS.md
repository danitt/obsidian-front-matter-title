# AGENTS.md

## Commands

```sh
npm run dev          # watch build (esbuild, CJS output → main.js)
npm run build        # production build + type-check (only place tsc runs)
npm test             # jest (bail on first suite failure)
npm run eslint       # lint
npm run pretty       # prettier format
```

Type-check only: `npx tsc -noEmit -skipLibCheck` or `npm run build`.  
There is **no `typecheck` script** — `npm run typecheck` will error.

Run a single test file:
```sh
npx jest test/unit/Resolver/Resolver.spec.ts
npx jest --testPathPattern=Resolver
```

## Architecture

Single Obsidian plugin package (not a monorepo). Key directories:

- `main.ts` — Obsidian `Plugin` entry point
- `src/` — all application source; features under `src/Feature/`
- `config/` — InversifyJS DI container wiring (`inversify.config.ts`, `inversify.types.ts`)
- `test/unit/` — 36 Jest spec files
- `__mocks__/obsidian.ts` — manual mock replacing the entire `obsidian` npm package in tests
- `modules/api-provider/` — **git submodule** (must be initialised)

DI is InversifyJS 6 with `reflect-metadata` + `experimentalDecorators`/`emitDecoratorMetadata`. Service identifiers live in the `SI` object (`config/inversify.types.ts`).

## Non-obvious gotchas

**Git submodule required.** `modules/api-provider` is a submodule referenced by tsconfig path alias (`front-matter-plugin-api-provider`). Without it, compilation and tests fail:
```sh
git submodule update --init
```
CI uses `submodules: 'true'` in the checkout action.

**`main.js` is a committed build artefact.** Do not edit directly. Rebuild via `npm run build` or `npm run dev` after source changes.

**`PLUGIN_VERSION` is an esbuild-injected constant**, not a real variable. Tests that exercise code paths using it must set it manually:
```ts
(global as any).PLUGIN_VERSION = "test-version";
```
Only `App.spec.ts` currently does this; missing it causes a `ReferenceError`.

**Some tests import the real Inversify container** (`@config/inversify.config`) directly, making the DI container a shared singleton. Combined with `bail: true`, cross-test container state can hide failures.

**Prettier is pinned to 2.x** (`^2.8.8`). Do not upgrade to 3.x.

## Lint rules

- `@typescript-eslint/no-explicit-any` is **off** — `any` is used freely
- `@typescript-eslint/ban-ts-comment` is **off** — `@ts-ignore` is used freely
- `no-console` is **error** except `console.error` and `console.debug` are allowed; use `.catch(console.error)` pattern for promise errors

## Test setup

- Runner: Jest 29, `ts-jest`, environment: `node`
- Setup file: `jest.setup.ts` imports `reflect-metadata` (required for Inversify)
- Path aliases in tests: `@src/*` → `src/*`, `@config/*` → `config/*`
- `moduleDirectories` includes project root, so bare imports resolve from there
- Coverage always collected → `coverage/`; cache → `var/cache/`
- No snapshot tests
