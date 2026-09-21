# Secure AI Workforce

**Hire AI employees. Customize them for your industry. Control and secure everything they do.**

A working prototype of a universal, multi-industry platform for deploying "AI employees" — where every action an AI employee attempts is checked by a central **Security Control Engine** before it's allowed to run.

This is a real, running Next.js application (not a static mockup). Every button, toggle, and form is wired to actual server-side logic and an in-memory data store, so you can click through the full loop: deploy an employee, simulate an action, watch it get allowed / blocked / sent for human approval, and see it show up in the logs and analytics.

---

## What's included

| Page | Route |
|---|---|
| Landing page | `/` |
| Business dashboard | `/dashboard` |
| Industry selection | `/industries` |
| AI Employee Marketplace | `/marketplace` |
| Create AI Employee (wizard) | `/employees/new` |
| AI Employee list | `/employees` |
| AI Employee details (+ live simulator) | `/employees/[id]` |
| Knowledge base | `/knowledge-base` |
| Workflow builder | `/workflows` |
| Tool / integration management | `/integrations` |
| Permissions & security policies | `/security/policies` |
| Action logs (audit trail) | `/security/logs` |
| Security alerts | `/security/alerts` |
| Human approval center | `/security/approvals` |
| Analytics dashboard | `/analytics` |

### The Security Control Engine

The core of the product lives in [`lib/security-engine.ts`](./lib/security-engine.ts). Every simulated action goes through it and is evaluated in order:

1. **Identity & access check** — does this employee even have the tool connected? If not, it's blocked before anything else is considered, and flagged as suspicious.
2. **Risk scoring** — a 0–100 score from the data sensitivity involved and the action's category (financial actions score higher than routine communication, etc).
3. **Policy matching** — the most specific matching rule wins (role + industry + category beats a general "applies to all" rule).
4. **Threshold check** — either the matched policy or the employee's own configured approval threshold can force a human decision.
5. **Verdict** — `ALLOW`, `BLOCK`, or `REQUIRE_APPROVAL`. The engine never executes anything itself — it only returns a verdict.

Try it live: open any AI employee's detail page and use the **"Simulate an action"** panel on the right.

---

## Tech stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript**, strict mode
- **Tailwind CSS v4**
- **Recharts** for the analytics charts
- **lucide-react** for icons
- No external database — see [Data & persistence](#data--persistence) below.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Data & persistence

This prototype uses an **in-memory data store** ([`lib/store.ts`](./lib/store.ts)) seeded with five example AI employees across different industries, sample policies, logs, and alerts. All mutations (creating an employee, simulating an action, approving a request, editing a workflow, etc.) happen through Next.js Server Actions in [`lib/actions.ts`](./lib/actions.ts) and mutate that in-memory store directly.

**This means data resets whenever the server restarts**, and won't be shared across multiple server instances in a real deployment. That's intentional for a prototype — it keeps the whole thing runnable with zero setup, no database, no environment variables.

When you're ready to make this real, the natural next step is to swap `lib/store.ts` for a real database (Postgres via Prisma/Drizzle is a good default) and turn the functions in `lib/actions.ts` into real queries — the function signatures and call sites in the UI don't need to change.

## Project structure

```
app/
  page.tsx                    Landing page
  (app)/                      Authenticated app shell (sidebar + topbar)
    dashboard/
    industries/
    marketplace/
    employees/
      page.tsx                List
      new/                    Create wizard
      [id]/                   Detail page + live simulator
    knowledge-base/
    workflows/
    integrations/
    security/
      policies/
      logs/
      alerts/
      approvals/
    analytics/
components/                   UI components (shared + feature-specific)
lib/
  types.ts                    Core domain types
  reference-data.ts           Industries, role templates, integrations catalogue
  store.ts                    In-memory "database" + seed data
  security-engine.ts          The Security Control Engine — pure decision logic
  actions.ts                  Server Actions (all mutations)
```

## Design notes

The visual language deliberately reuses three colors everywhere — green (allow), amber (needs approval), red (blocked) — so the verdict system reads as one coherent language across dashboards, logs, and alerts rather than a generic admin-panel skin. See [`app/globals.css`](./app/globals.css) for the token system.

Fonts are self-hosted system stacks (no external font requests), which keeps builds fast and works in offline or network-restricted environments. If you have unrestricted internet at build time and want the original intended typefaces, swap in `next/font/google` with **Space Grotesk** (display), **Inter** (body/UI), and **IBM Plex Mono** (machine data: IDs, timestamps, logs) in `app/layout.tsx`.

## What to build next

This prototype demonstrates the architecture end-to-end but intentionally leaves out things a production platform would need:

- **Authentication & multi-tenancy** — right now there's a single hardcoded business (`lib/store.ts`); no login, no per-user roles.
- **Real tool integrations** — connecting to an actual CRM, email provider, calendar, etc. Currently these are represented as toggles only.
- **A real database** — see [Data & persistence](#data--persistence) above.
- **Real AI employees** — the "employees" here follow scripted workflows; wiring in an actual LLM (e.g. via the Claude API) to read the knowledge base, decide what action to take, and call the Security Control Engine before executing would be the natural next step.
- **Notifications** — emailing/Slacking an admin when something lands in the Approval Center.

---