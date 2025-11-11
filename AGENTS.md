# AGENTS.md

Guidance for AI coding agents working inside this repository. Use it alongside `README.md` and `CLAUDE.md`.

## Repo Snapshot

- **Stack**: Next.js App Router, React 19, TypeScript, Tailwind, pnpm workspaces.
- **Domain**: Demo Stripe-powered store; Stripe always runs in _Test Mode_ with data managed via the Product Catalog.
- **Key dirs**: `app` (routes/layouts), `actions` (server actions), `ui` (shared components), `lib` (Stripe + commerce-kit utilities), `hooks`.
- **Env**: Copy `.env.example` → `.env` and pull secrets from the 1Password item “The Store (Demo Dev Playground).” Update `env/server.ts` or `env/client.ts` when adding vars.

## Required Commands

- Install deps: `corepack enable && corepack install` then `pnpm install`.
- Local dev: `pnpm dev` (Next.js on localhost:3000).
- Quality gates: `pnpm lint`, `pnpm format`, `pnpm check-types`, `pnpm build`.
- Tests live in lint/typecheck; no Jest/Vitest suite today.

## Branch & Change Policy

- Never commit platform snippets to `main`. Spin feature branches off `main`, document the branch’s use case in `README.md` → “Branch Use,” then raise a PR back to `main`.
- For PoC/snippet work, create a branch per platform, apply snippets there, and record any setup instructions in `README.md`.

## Agent Workflow

1. **Collect context first**: skim `README.md`, `CLAUDE.md`, and affected route/component files; inspect `app/(store)` layout patterns before modifying UI.
2. **Respect architecture**: server components fetch data, client components handle interactions; keep mutations in `actions/*.ts` and leverage existing helpers in `lib/utils.ts`.
3. **Stripe & carts**: use `commerce-kit` helpers (e.g., `Commerce.cartAdd`, `Commerce.productBrowse`). Cart state is driven by the `yns_cart` cookie—avoid custom storage.
4. **PostHog tracking**: preserve server/client capture calls; new flows should continue emitting relevant events via `posthogServer` or `posthog?.capture`.
5. **Cache & revalidation**: reuse existing cache tags and helpers when introducing server actions so that product/cart views stay in sync.

## Testing & Verification

- Run `pnpm lint`, `pnpm check-types`, and targeted `pnpm build` when touching shared layouts, middleware, or config.
- For UI behavior changes, manually verify via `pnpm dev` at `/`, `/cart`, `/order/success`, and modal routes such as `/cart-overlay`.
- Confirm Stripe-related changes using test cards (default: `4242 4242 4242 4242`, any future expiry, CVC 123).

## Deployment Notes

- Preferred host is Vercel under the `cro-metrics-code` GitHub account. Hobby tier is insufficient for org projects; ensure deployments originate from that account or a collaborator invite.
- Docker is unsupported by default; only toggle `DOCKER=1` in `.env` if intentionally preparing a container build (and remove `ENABLE_EXPERIMENTAL_COREPACK`).

## Helpful References

- `CLAUDE.md` → agent-specific commands, architecture, utilities.
- `README.md` → onboarding, Stripe metadata tables, branching instructions.
- `images/` → documentation assets referenced in README.

When in doubt, document assumptions in PR descriptions and update this file if new agent workflows emerge.
