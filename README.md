# Glofox — Gym Performance Dashboard Take-Home

Welcome, and thanks for interviewing with us.

This is a **React.js front-end take-home**. Aim for about **1–2 hours** of focused work. A solid, coherent core beats an unfinished kitchen sink — stop at the **3-hour hard maximum** even if stretch goals are unfinished.

You will discuss your submission in a follow-up technical conversation: design choices, React trade-offs, and how you would evolve the experience.

## The domain

Glofox is a SaaS platform for boutiques, studios, and gyms. Operators manage **many locations**. Your task is to improve a small **gym performance dashboard** that shows locations with bookings, revenue, and related statistics on a map and in a list.

## Timebox and what “done” means

**Required (core):**

1. **Filter** gyms by meaningful criteria you choose and can justify for an operator
2. **Highlight high-performing gyms** using a definition you own and can defend
3. Keep the **map, list, summary statistics, and selected gym** coherent as filters and selection change
4. Handle **loading, empty, and error** states in a way that does not confuse the user
5. Automated tests for the behaviours you consider highest risk
6. An **`AGENTS.md`** file with practical guidance for AI coding tools / future contributors in this repo
7. A short write-up (`SUBMISSION.md`) with assumptions, trade-offs, known gaps, and approximate time spent

If those work and the UI stays understandable, you are done enough to submit.

## What you are given

- A Vite + React + TypeScript client
- An Express + SQLite API with seeded gym data (~300 locations)
- A starter layout: summary strip, gym list, map (Leaflet), and selected-gym panel
- The starter loads **all** gyms and supports basic selection — product filtering and high-performer highlighting are intentionally incomplete

### Gym fields (API JSON, `snake_case`)

| Field | Meaning |
|-------|---------|
| `id` | Stable gym id |
| `name` | Display name |
| `city` / `country` | Location labels |
| `latitude` / `longitude` | Map coordinates |
| `bookings_count` | Bookings in the reporting window |
| `revenue_cents` | Revenue in **integer cents** |
| `capacity` | Venue capacity |
| `member_count` | Active members |
| `utilization` | Ratio useful for performance discussions |
| `avg_rating` | Average rating |

Money in the API is always integer **cents**. How you display it in the UI is up to you.

## Required behaviour (detail)

### Filtering

Add filtering that helps an operator narrow the dataset. Which dimensions you expose, how state is modelled, and whether filtering is client-side or server-side are **your** decisions — be ready to explain them.

### High-performing gyms

Decide what “high performing” means for this product slice (for example a revenue threshold, utilization band, composite score, or relative ranking). Highlight those gyms clearly in the experience. There is **no** single correct formula.

### Coherent UI state

When filters change or a gym is selected:

- The list, map, summary strip, and detail panel should not contradict each other
- Empty filter results should be obvious
- Selection should behave sensibly when the selected gym disappears from the filtered set

### Reliability

The API supports a deliberate failure mode for practising error UI:

```http
GET /api/gyms?fail=1
```

There are **no** artificial sleeps or hidden timers in the exercise. Do not add fake network delays to simulate performance problems.

### `AGENTS.md`

Create an `AGENTS.md` that you would be happy to leave in a real repository. It is intentionally open-ended. Useful topics often include code-quality expectations, testing expectations, how AI tools should (and should not) change this codebase, and what belongs in repo instructions versus team docs. We will discuss your choices in the live review.

## Deliberately open decisions

These are not hidden requirements — make a coherent choice and be ready to explain it:

- Exact filter model and UI controls
- Definition of “high performing”
- Client vs server filtering
- State management approach (React state, context, external library, …)
- Whether to keep Leaflet or swap the map library
- CSS / component structure
- Exact empty / error copy and layout

## What we evaluate

- **Correctness and coherence** of filtering, highlighting, and panel sync
- **React and front-end judgement** — structure, state, effects, rendering choices you can explain
- **Product sense** — useful defaults for an operator, clear empty/error states
- **Tests** — which ones you chose and why
- **Performance awareness** — what you noticed with this dataset and whether any optimisation is justified
- **Ownership** — you can walk through and modify your solution, including AI-assisted code
- **`AGENTS.md` quality** — maintainable guidance, not cargo-cult rules

Stretch features are optional. Core completeness beats volume. A simple, accessible, maintainable solution scores better than a flashy fragile one.

## A note on AI tools

You are welcome to use AI assistants (Cursor, Copilot, ChatGPT, or anything else). Use them the way you would on the job: as a collaborator whose output you understand and own.

In the follow-up we will ask you to walk through your code and the choices behind it. If you would rather not use AI, that is also fine.

## Running the starter

Requires **Node.js 20+**.

```bash
npm install
npm run dev
```

- Client: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3001](http://localhost:3001) (proxied from the Vite client as `/api`)

Useful scripts:

```bash
npm run dev:client   # Vite only
npm run dev:server   # API only
npm run seed         # rebuild the SQLite seed database
npm test             # Vitest (scaffold only — add the tests that matter)
```

The SQLite file is created under `data/gyms.sqlite` on first API start (git-ignored).

### API

| Endpoint | Notes |
|----------|-------|
| `GET /api/health` | Liveness |
| `GET /api/gyms` | All gyms (`data`, `total_count`). Add `?fail=1` to force `500`. |
| `GET /api/gyms/:id` | Single gym, or `404` |

## Suggested layout (optional)

```text
src/
├── App.tsx                 # loads gyms; wires panels
├── api/                    # HTTP helpers
├── components/             # list, map, summary, detail
├── utils/
server/
├── index.ts                # Express API
├── db.ts / seed.ts         # SQLite + seed
```

You may reorganise freely. Prefer clarity over frameworks for their own sake.

## Stretch (optional)

Only if the core is solid — do not block submission on these:

- Marker clustering or list virtualisation for larger datasets
- URL-synced filter state
- Stronger accessibility polish (keyboard map/list parity, live regions)
- Server-side filtering / pagination
- Richer selection behaviour (map fly-to, shared highlight styles)

## Submitting

1. Complete the core scope, `AGENTS.md`, and `SUBMISSION.md`.
2. Share your solution as instructed by your recruiter (zip, private repo, or branch).

---

### `SUBMISSION.md` template

Copy to `SUBMISSION.md` and fill in:

```markdown
## Time spent
Approximately: _

## Assumptions
-

## Product / UX choices
-

## React / architecture choices
-

## Tests
What I covered and why:

## Performance notes
What I observed and what I would / would not change:

## Known gaps / what I would do next
-

## AI tools used (optional)
-
```

Good luck — we look forward to talking through your solution.
