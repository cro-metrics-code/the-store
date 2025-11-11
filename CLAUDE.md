# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development**:

- `pnpm dev` - Start Next.js dev server on localhost:3000
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server

**Code Quality**:

- `pnpm lint` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - Type check without emitting files

**Prerequisites**:

- Node.js v22.x (specified in engines, but tested on v20+)
- pnpm v10+ (enable with `corepack enable && corepack install`)

## Project Context

This is a demo e-commerce site built for testing at Cro Metrics. It runs in Stripe Test Mode using test cards. Environment variables are stored in `.env` (copy from `.env.example`) with values in 1Password under "The Store (Demo Dev Playground)".

**Important**: DO NOT add platform snippets to `main` branch. Create feature branches from `main` for platform-specific testing.

## Architecture

### Next.js App Router Patterns

**Parallel Routes for Modal UX**:

- `app/(store)/@modal/(.)cart-overlay/` intercepts `/cart-overlay` navigation to display as modal instead of full page
- Store layout receives `{children, modal}` props to render both slots
- Pattern: `router.push('/cart-overlay?add={productId})` triggers modal with optimistic cart update

**Layout Hierarchy**:

- Root layout: PostHog provider, analytics, toast notifications
- Store layout: Fetches account data via `Commerce.accountGet()`
- Cart layout: Wraps checkout in `StripeElementsContainer` with client secret

### Commerce-Kit Integration

`commerce-kit` (npm package) abstracts Stripe API operations for products, carts, orders:

**Key Functions**:

- `Commerce.productBrowse()` / `Commerce.productGet({ slug })` - Product fetching
- `Commerce.cartCreate()` / `Commerce.cartGet(id)` / `Commerce.cartAdd()` - Cart operations
- `Commerce.cartAddOptimistic()` - Add to cart with optimistic UI
- `Commerce.orderGet(paymentIntentId)` - Fetch order after payment
- `Commerce.shippingBrowse()` - Fetch available shipping rates

**Cart Storage**:

- Cookie (`yns_cart`) stores minimal data: `{ id, linesCount }`
- Full cart state lives in Stripe via commerce-kit
- Server actions read cookie ID → fetch/update from commerce-kit → update cookie

### Stripe Integration

**Payment Flow**:

1. Add to cart → server action in `actions/cart-actions.ts`
2. Navigate to `/cart` → `CheckoutCard` server component fetches shipping rates
3. `StripePayment` client component handles form submission with Stripe Elements
4. `stripe.confirmPayment()` processes payment
5. Webhook (`/api/stripe-webhook/route.ts`) receives `payment_intent.succeeded`
6. Webhook decrements product stock, creates tax transaction, revalidates cache
7. Redirect to `/order/success?payment_intent={id}` → fetch order via `Commerce.orderGet()`

**Product Metadata** (stored in Stripe):

- `slug` (required) - URL pathname
- `variant` - Product variant (e.g., "small", "medium")
- `category` - Grouping (e.g., "apparel", "accessories")
- `order` - Sort order (lower = first)

### Server Components vs Client Components

**Server Components** (default):

- Pages/layouts fetch data from commerce-kit
- Pass data as props to client components
- Use `'use server'` directive at top of file
- Wrap async data fetching in `<Suspense>` with fallback

**Client Components** (`'use client'`):

- Forms: `AddToCartButton`, `StripePayment`
- State management: `CartSummaryTable` (uses `useOptimistic`)
- Stripe Elements (requires browser APIs)
- PostHog tracking components

**Server Actions Pattern**:

- File: `actions/cart-actions.ts` and `ui/checkout/checkout-actions.tsx`
- Marked with `'use server'` directive
- Called from client components via form actions or transitions
- Update cart in commerce-kit, revalidate cache tags

### PostHog Analytics

**Server-side tracking** in cart actions:

- Extract `distinctId` from PostHog cookie via `getDistinctId()`
- Use `posthogServer.capture()` for cart events

**Client-side tracking**:

- `PostHogProvider` wraps app in root layout
- Tracker components fire on render: `ProductViewedTracker`, `CartViewedTracker`, etc.
- Event capture in UI interactions: `posthog?.capture()`

### Environment Variables

**Client** (`env/client.ts`):

- Prefix with `NEXT_PUBLIC_*`
- Import via `import { env } from '@/env/client'`
- Examples: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`

**Server** (`env/server.ts`):

- Import via `import { env } from '@/env/server'`
- Examples: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ENABLE_STRIPE_TAX`

After adding env vars to `.env`, update the appropriate `env/*.ts` file for type safety (using `@t3-oss/env-nextjs`).

## Code Conventions

**File Naming**: kebab-case for all files/folders (e.g., `cart-actions.ts`)

**Component Organization**:

- `/_components/` folder in route for route-specific components
- `/ui/` folder at root for shared components

**Import Aliases**:

- `@/*` - Root directory
- `@ui/*` - UI components directory

**Types**:

- Store in `/types` directory as `example-types.ts`
- Export from `/types/index.ts`
- Prefer interfaces over type aliases

**Data Fetching**:

- Fetch in server components, pass as props to clients
- Use server actions from `/actions` for mutations
- Implement Suspense for async data with loading fallback

## Important Utilities

**Money Handling** (`lib/utils.ts`):

- `formatMoney()` - Stripe minor units → formatted currency string
- `getStripeAmountFromDecimal()` / `getDecimalFromStripeAmount()` - Convert dollars ↔ cents
- Handles multi-decimal currencies (JPY, BHD)

**Cart Calculations** (`lib/utils.ts`):

- `calculateCartTotalNetWithoutShipping()` - Subtotal
- `calculateCartTotalPossiblyWithTax()` - Total with tax if enabled

**Cookie Management** (`lib/cart.ts`):

- `getCartCookieJson()` - Read cart ID from cookie
- `setCartCookieJson()` - Write cart ID + item count
- `clearCartCookie()` - Remove on checkout completion

**Debouncing** (`hooks/use-debounced-value.ts`):

- Used for address form changes before triggering server actions

## Notes

- React Server Components require serializable data; use `structuredClone()` on Stripe SDK responses to remove class instances
- Stripe operates in Test Mode for this demo (never charges real money)
- Use test card: `4242 4242 4242 4242` with any future date and 3-digit CVC
- Product data comes entirely from Stripe Product Catalog (manage in Stripe dashboard)
