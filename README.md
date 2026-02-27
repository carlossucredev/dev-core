## ◆ DevCore

> Stop watching tutorials. Start building real things.

DevCore is an open community platform for developers who learn by doing. Every week a new challenge drops. You solve it, share your solution on GitHub, and learn from how others approached the same problem.

**Live:** [carlossucredev.github.io/dev-core](https://carlossucredev.github.io/dev-core)

---

## What's inside

The platform has four sections:

**Home** — Overview of the latest challenge, recent fundamentals content, community stats, and a newsletter signup.

**Challenges** — 8 coding challenges across 3 difficulty levels (Beginner, Intermediate, Advanced). Each challenge opens a modal with the full problem description, rules, example input/output, and a hint. Solutions are submitted via GitHub.

**Fundamentals** — 4 tracks of core computer science knowledge, each lesson opening as a full-page article with SVG diagrams, complexity tables, code examples, and callouts. Tracks:
- Data Structures (Arrays, Linked Lists, Stacks & Queues, Hash Maps, Binary Trees, Graphs)
- Algorithms (Big O, Binary Search, Recursion, Sorting, Dynamic Programming, Greedy)
- System Design (Framework, Scalability, Caching, Load Balancing, SQL vs NoSQL)
- Clean Code (Naming, Functions, Comments, Refactoring)

**Community** — Activity feed with solution posts, code snippets, leaderboard, active challenges widget, and Discord link.

---

## Tech stack

No framework. No build tool. No dependencies.

```
devcore/
├── index.html   — HTML structure, all 4 pages as SPA sections
├── style.css    — All styles (GitHub-dark palette, DM Sans + DM Mono)
└── app.js       — Navigation, challenge data, lesson content, page system
```

Plain HTML, CSS, and JavaScript. Works on GitHub Pages with zero configuration — just push and it's live.

---

## How the SPA works

All four pages (`home`, `challenges`, `fundamentals`, `community`) live in the DOM simultaneously. The JavaScript navigation toggles a single `.active` class to show/hide them with a fade animation.

Lesson pages are generated dynamically — when a lesson is opened, JavaScript creates a new `.page` element, injects the lesson HTML (including inline SVGs), and activates it. The "Back to Fundamentals" button removes the page and reactivates the fundamentals section.

```js
// Navigate between sections
function navigateTo(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Open a lesson as a full page
function openLesson(id) {
  // Creates/updates #lesson-page element with full content
  // Activates it using the same .page system
}
```

---

## Challenges

| # | Title | Level |
|---|-------|-------|
| 01 | Reverse a String Without Built-ins | Beginner |
| 02 | FizzBuzz — But Make It Extensible | Beginner |
| 03 | Implement a Stack with Min() in O(1) | Intermediate |
| 04 | Build a Rate Limiter | Intermediate |
| 05 | Build a REST API with Auth from Scratch | Intermediate |
| 06 | LRU Cache Implementation | Advanced |
| 07 | Design a URL Shortener | Advanced |
| 08 | Design a Key-Value Store | Advanced |

To submit a solution: solve the challenge in any language, push your code to a public GitHub repository, and drop the link in the community feed with the tag `#challenge-XX`.

---

## Design

- **Colors:** GitHub dark palette (`#0d1117` bg, `#161b22` surface, `#e8ff47` accent)
- **Typography:** DM Sans (UI) + DM Mono (code, labels, metadata)
- **Layout:** 1080px centered column with vertical border lines — consistent across all viewport widths
- **Diagrams:** SVG inline — no image hosting needed, scales perfectly, works offline

---

## Roadmap

The platform was designed to scale in phases without rewriting:

**Phase 1 — Now (static):** GitHub Pages + this repo. GitHub Discussions for challenge submissions. Zero backend, zero cost.

**Phase 2 — After validation (~200 users):** Spring Boot backend. `GET /challenges`, `POST /submissions`, GitHub OAuth. PostgreSQL on Railway free tier.

**Phase 3 — Growth (1000+ users):** User profiles, ranking system, streak tracking, notifications. Decision point: free community vs. paid tier.

---

## Running locally

No install needed. Just open `index.html` in a browser:

```bash
git clone https://github.com/carlossucredev/devcore
cd devcore
open index.html   # macOS
# or: double-click index.html in your file manager
```

---

## Deploying to GitHub Pages

1. Push the three files (`index.html`, `style.css`, `app.js`) to a public GitHub repository
2. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
3. GitHub Pages will serve it at `https://yourusername.github.io/repo-name`

Custom domain can be added later via a `CNAME` file.

---

## Built by

[@carlossucredev](https://github.com/carlossucredev) — fullstack developer, building in public.

- YouTube: [youtube.com/@carlossucredev](https://youtube.com/@carlossucredev)
- GitHub: [github.com/carlossucredev](https://github.com/carlossucredev)
