---
name: verify
description: Run all quality gates (type-check, lint, format, build) to verify the project is clean before committing or creating a PR.
---

Run all quality gates in sequence. Stop and report on the first failure.

```bash
pnpm check-types && pnpm lint && pnpm format && pnpm build
```

If any step fails, show the errors clearly and suggest fixes. If all pass, confirm the project is clean.
