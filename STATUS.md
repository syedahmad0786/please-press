# please-press — STATUS

## 2026-08-13 — blob env

- `/api/click` reads Blob token via `globalThis.process` so TypeScript no longer needs Node types. Persistence still uses Blob when the token is set, memory otherwise.

## 2026-08-13 — Live QA fix

Ending overlay used `display: grid`, which overrode `[hidden]`, so every visitor saw Act X instead of the button. Counter had the same leak at 0. Shipped `:not([hidden])` rules and re-verified the circular button + first click on production.

## 2026-08-13

- Built THE BUTTON. as a Vite + TypeScript museum piece with 14 acts, Web Audio, particles, fake system dialogs, lore, shareable ending card, and a best-effort `/api/click` global counter.
- Next: deploy to Vercel and create the GitHub repo.
