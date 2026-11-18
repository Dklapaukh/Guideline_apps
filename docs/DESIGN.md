# How Guideline Apps works

## The idea
Most procedural guidelines are the same few building blocks in different orders: steps, questions with answers,
tick-box actions, timers, repeating reminders, look-up tables and a record of what was done. The value of an app
is showing **the right information at the right time** instead of a page of text. So there is one generic app
(the runtime) and each guideline is just data for it.

```
guideline (web page / PDF)
   │  AI step 1: draft the template, quoting the guideline for every instruction
   ▼
template.md   ◄── people can write or correct this by hand (the main way to make an app accurate)
   │  plain code: engine/template.js reads it (forgiving)
   ▼
spec          ◄── plain code: engine/check.js links steps and lists findings (fix / check / info)
   │  plain code: tools/build.mjs packs spec + runtime into one file
   ▼
app.html      ◄── tested by tests/helpers/explore.mjs (every route, in a fake browser)
                  AI step 2: an independent reviewer compares the template with the guideline
```

The **Studio** (`site/studio.html`) is the "guideline in, app out" website without AI: paste a template (and the
guideline text), see the checks and a working preview as you type, download the finished app.

## The template (what an author fills in)
Full help text is inside `template/guideline-template.md`. Line types:

| Line | Does |
|---|---|
| `Say:` / plain text / `- bullet` | text on the screen |
| `Do:` | tick-box action (ticks are logged) |
| `Warning:` | highlighted caution |
| `Quote: "exact words" (page)` | supports the line above; checked word for word against the saved guideline text |
| `Ask:` + `- Answer -> step` | a question; each answer goes to a step (or `end`) |
| `Next: step` | the main button (several `Next:` lines with conditions: the first that applies) |
| `Timer: 20 minutes -> step` | counts down on this step; at zero it buzzes and offers to move on |
| `Remind: every 4 minutes: text` | a reminder bar on every screen until stopped; "Done" logs it and restarts the count |
| `Stop: text` or `Stop: all` | stops reminders |
| `Show: Table name` (or `Table: Column`) | the table row for the current details (e.g. dose by weight) |
| `Record: Adrenaline given` | a button that logs a time stamp and counts taps |
| `End:` | marks a last step |
| `Note:` | for authors, never shown |
| `[if Weight < 10]` at the end of any line or answer | condition on the inputs (`=`, `is`, `is not`, `<`, `>`, `and`, `or`) |

Inputs (`## Inputs`): numbers with a range and unit, or choices. Tables (`## Tables`): markdown tables keyed by an
input; rows can be words or number bands (`0-5`, `under 5`, `over 40`, `40+`); `-` means "not stated" and shows
as "Not stated in the guideline", never zero.

## Findings: forgiving, never breaking
`fix` = the app can't do what the template says; it uses a safe fallback (shows the problem in place, offers
"Finish", shows the whole table) and carries on. `check` = possibly wrong: contradictions (same answer to two
places, a line's number differs from its quote, the same reminder with two intervals, two timers on a step,
overlapping or gapped table bands, duplicate rows), unreachable steps, loops with no way to finish, quotes not
found or only nearly found (with the guideline's actual wording). `info` = worth knowing (unquoted numbers,
guideline numbers the template never uses, no reviewer).

The checker suggests the likely fix ("Did you mean ...?") using name similarity. It never changes meaning on its
own; the author decides.

## What each nightly run adds
When a guideline needs something the runtime can't do (a counter, a score calculator, parallel tracks, a
second timer), the run adds it as a new line type: reader + checker + runtime + tests + this page, and every
earlier app must still pass. That is how the builder "learns": the library of building blocks grows, and the
queue in `docs/CURRICULUM.md` gets harder.

## Spec (what the runtime reads)
`{ title, about, sources[{name, link}], warning, audience, reviewedBy, version, inputs[], tables[], steps[], start }`.
A step: `{ id, title, lines[{kind, text, quotes[], cond}], ask{question, options[{label, to, target, cond}]},
next, nexts[], timer{ms, label, to, target}, reminders[{ms, every, text, id}], stop, end }`. `target` is filled
by the checker (`__end` = finish; `null` = broken link, shown as a finding). Written to `guidelines/*/spec.json`.

## Source text quality
Quotes can only be checked against a saved copy of the guideline (`source.txt`). The workspace can't download
most websites directly, so `meta.json` says how good the copy is: `pdf` (exact, from a PDF in `sources/`),
`search-snippet` / `search-snippet-partial` (exact words from web search excerpts, may be incomplete),
`web-fetch` (a fetch tool's rendering, may be reworded: a missing quote may be the copy's fault). Dropping the
guideline PDF into `sources/` makes checking exact.

## Looks and the owner's design brief
The owner's brief (18 Nov 2026): the apps must look good as well as work. Clean, modern, mostly cards, but the
design can change to suit the job. Whatever the user does should follow modern design practice and be as simple
and obvious as possible. The audience is not technical, so ask for as few decisions or inputs at a time as possible
and make the person feel supported. Show the owner more than one design and borrow ideas from many fields. Anything
for the owner to review gets a link and a very easy way to give feedback; the owner reviews on a phone.

How it works: the base stylesheet is `engine/runtime.css`. A **look** is one extra stylesheet in `engine/looks/<id>.css`
that only restyles (no change to what the app does). `tools/review.mjs` builds `site/review.html`, which shows the
newest app in every look with one-tap reactions and a comment box; feedback is saved in that page's database and
read at the start of each run. The runtime sets `--p` (share of the timer used, 0 to 1) on `.timer` so a look can
draw a progress bar. Current looks:

| Look | Borrowed from |
|---|---|
| clinic | patient and wellbeing apps: calm cards, one teal action colour |
| flightdeck | aviation checklists and cockpit displays: dark, high contrast, monospace numbers |
| wayfinding | transit maps and road signs: bold type, actions as stations on a red line, sign-yellow cautions |

Published apps use the base look until the owner picks one; then that look becomes the base stylesheet.
