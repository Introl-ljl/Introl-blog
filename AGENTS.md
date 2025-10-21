# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/` – Route pages (Astro). Example: `src/pages/index.astro`.
- `src/components/` – UI components (`.astro`/`.svelte`). Example: `ArchivePanel.svelte`.
- `src/layouts/` – Shared layouts.
- `src/content/` – Markdown content. Posts live in `src/content/posts/`.
- `src/assets/`, `public/` – Static assets (place public files under `public/`).
- `scripts/` – Dev helpers. Example: `scripts/new-post.js`.
- `dist/` – Build output (generated).

## Build, Test, and Development Commands
Use pnpm (enforced via preinstall):
- `pnpm dev` – Run local dev server.
- `pnpm build` – Production build + Pagefind index.
- `pnpm preview` – Preview the production build.
- `pnpm check` – Astro diagnostics (content/schema).
- `pnpm type-check` – TypeScript checks.
- `pnpm format` / `pnpm lint` – Format and lint with Biome.
- `pnpm new-post -- <path/name>` – Scaffold a Markdown post in `src/content/posts/`.

## Coding Style & Naming Conventions
- Formatter/Linter: Biome (`biome.json`). Tabs for indentation; JS strings use double quotes.
- Components: PascalCase (e.g., `PostCard.astro`, `ProjectFilter.svelte`).
- Pages/routes: lower-case filenames (e.g., `about.astro`).
- Keep content front‑matter minimal and valid (see `scripts/new-post.js` template).

## Testing Guidelines
- No unit test framework is configured. Before submitting:
  - Run `pnpm check` and `pnpm type-check`.
  - Build and preview: `pnpm build && pnpm preview`.
- If adding tests, prefer `*.test.ts` colocated in a future `tests/` directory.

## Commit & Pull Request Guidelines
- Use Conventional Commit prefixes: `feat:`, `fix:`, `docs:`, etc.
  - Examples: `feat: add Footer component`, `fix: correct timeline layout`.
- PR requirements:
  - Clear description and scope; link related issues.
  - Screenshots/GIFs for UI changes; note breaking changes.
  - Ensure `pnpm format`, `pnpm lint`, `pnpm check`, and `pnpm build` succeed.

## Security & Configuration Tips
- Copy `.env.example` to `.env`; do not commit secrets.
- Deployment via Netlify (`netlify.toml`).
- Large/static media: prefer `public/` and reference with absolute paths.
