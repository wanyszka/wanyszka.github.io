# ORF 309 · Midterm Studio

An interactive, step-by-step study site built from past ORF 309 midterms. Students replay a past exam one move at a time: at every step they choose what comes next, see why that move is the natural one, diagnose real mistakes quoted from the official grading comments, and watch the written solution assemble in a panel beside them.

Everything lives in `site/`. It is a static site with no build step: plain HTML, CSS and JavaScript, with KaTeX and Google Fonts loaded from CDNs (an internet connection is needed for math rendering and typography).

## Run it locally

Open `site/index.html` directly in a browser, or serve the folder:

```
cd ORF309subpage/site
python -m http.server 8309
```

and open <http://127.0.0.1:8309/>.

Progress (completed steps, first-try accuracy) is stored in the browser's `localStorage`. The footer has a "Reset my progress" button.

## What is in it

| Route | Content |
|---|---|
| `#/` | Landing page with the list of exams. |
| `#/exam/<id>` | Problem list for one exam. |
| `#/exam/<id>/<pid>` | The walkthrough for one problem, with the "Your solution" panel. |
| `#/playbook` | The recurring moves (each with an animated figure), a pre-computation checklist, and "red flags" compiled from grading comments. Section links are plain in-page anchors (`#mv-ltp`); the router treats any hash that does not start with `/` as an anchor. |

Walkthroughs cover Fall 2026 (5 problems), Fall 2023 (3) and Fall 2022 (3) Midterm 1, in `site/js/content/f2026.js`, `f2023.js`, `f2022.js`. The Playbook is `site/js/content/playbook.js`.

## Files

| File | Role |
|---|---|
| `site/js/app.js` | Router, step engine, answer checking, progress, the solution panel, playbook rendering. |
| `site/js/figures.js` | Animated figures: a small scene/tween engine on SVG with KaTeX-rendered HTML labels, plus the figure definitions (`area`, `timeline`, `indicators`, `tree`, `race`, `renormalize`, `jensen`, `lattice`). |
| `site/js/content/*.js` | Exam content and the playbook (data only). |
| `site/css/style.css` | Styling, modelled on an academic project page: Noto Sans text, Google Sans headings, blue accent `#598be7`, white cards with soft shadows, grey nav/footer bars. |

## How a walkthrough is structured

Each problem has a `statement`, a list of `parts` (usually a *Setup* part first, then (a), (b), …), and `takeaways`. Each part is a list of **steps**, revealed one at a time:

| `type` | What it does |
|---|---|
| `note` | Explanatory text/math. |
| `mcq` | Multiple choice. `choices: [{ text, correct, feedback }]`. `multi: true` for select-all (then put the overall explanation in the step's `feedback`). Add a `quote` to turn it into a *spot the error* step. |
| `input` | Free answer, checked against `numeric` (with optional `tol`) and/or a list of accepted `answers` strings (whitespace, `*`, braces vs. parentheses and unicode minus are normalised). `display` is shown when the answer is revealed. |
| `reveal` | "Try it yourself, then reveal": shows `html` on click. |

Any step can also carry:

- `why` (blue "Why this move." callout) and `watch` (red "Careful." callout), shown once the step is answered;
- `solution`: an HTML/LaTeX fragment appended to the **Your solution** panel when the step is completed. Together, the fragments of a problem form a complete written solution in the style of the official ones. (On narrow screens the fragment is also shown inline under the step.)
- `figure: { name, opts }`: an animated figure from `figures.js`, rendered above the prompt. Figures autoplay once when scrolled into view. Controls: **Play/Pause/Resume**, **Frame ›** (while paused, advances the animation by about a tenth of a second per click, so a scene can be read one frame at a time), **Scene ›** (plays the next scene then stops), **Replay**, and a speed selector (1×, ½×, ¼×). The engine runs on a virtual clock (`ctx.clock`) that stands still while paused, so every figure gets these controls for free. Some figures have a parameter slider (`area` with `slider`).

Interactive steps gate the *Continue* button until answered. After two wrong attempts a "Show the answer" button appears.

Content strings are written with the `R` tag (`String.raw`) so LaTeX backslashes survive. Inline math is `\( ... \)`, display math `\[ ... \]`. Macros available: `\P \E \Var \Cov \Binom \Geom \Exp \ind \given`. Avoid backticks and `${` inside content strings, and write `\lt` / `\gt` instead of `<` / `>` inside figure labels (they are HTML).

## Adding a figure

In `figures.js`, register `reg.myfigure = function (ctx, opts) { ...; return { scenes: [{ caption, run: async () => {...} }], reset, params }; }`. `ctx` gives you the SVG (`ctx.svg`, 640×360 viewBox by default), `ctx.tween(ms, t => ...)`, `ctx.anim(node, from, to, ms)`, `ctx.wait(ms)` and KaTeX labels (`ctx.label(id, html, x, y, {color, size, align})`, `ctx.text`, `ctx.moveLabel`, `ctx.show`). Scenes must check the promises they await (they resolve `false` when the figure was reset) if they loop.

## Adding another exam

1. Create `site/js/content/<id>.js` that calls `ORF309.exams.push({...})` following the shape of the existing files.
2. Add a `<script src="js/content/<id>.js">` line in `site/index.html` before `js/app.js`.
3. Optionally reference its problems from the Playbook via `seen: ['<id>/<pid>']`.

## Integrating into the main site later

The main site is built with Hugo. Since this subpage has no build step, it can be dropped into the Hugo `static/` directory (for example `static/orf309/`) and will be served as-is at `/orf309/`. Nothing in the main site needs to change for that. The only external dependencies are the KaTeX and Google Fonts CDNs; both could be vendored if offline use matters.

## Source material

The walkthroughs follow the official exam statements and solutions in `course_files_export (1)` and `course_files_export (2)`. The "why" commentary, the figures and the spot-the-error distractors are a study aid written for this site, not official course documents.
