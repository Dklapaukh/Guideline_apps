# How Guideline Apps works

## The idea
Most procedural guidelines are the same few building blocks in different orders: steps, questions with answers,
tick-box actions, writing boxes, timers, repeating reminders, look-up tables and a record of what was done. The value of an app
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

## Where things live
| File | Does (main function) |
|---|---|
| `template/guideline-template.md` | the blank template with its help text |
| `engine/template.js` | reads a template into a spec (`readTemplate`) |
| `engine/check.js` | links steps and lists findings (`checkSpec`; tables `checkTable`, branding `checkLook`) |
| `engine/quotes.js` | quote matching (`findQuote`) and amounts with units (`amounts`) |
| `engine/util.js` | durations, conditions (`parseCondition`, `testCondition`), names (`slug`, `closest`), table keys (`readKey`, `keyMatches`, `isNotStated`), positions (`readLatLon`, `toDdm`) |
| `engine/looks.js`, `engine/looks/*.css`, `engine/runtime.css` | the looks and the base stylesheet (`LOOKS`, `scopeLook`, brand colour checks) |
| `engine/page.js` | safe HTML (`escapeHtml`, `scriptSafe`) and the one-file app page (`appPage`), shared by builder, review page and studio |
| `engine/runtime.js`, `engine/app-entry.js` | draws and runs the app (`mount`); the entry starts it from the embedded spec |
| `tools/build.mjs` | builds one guideline folder (`buildGuideline`) |
| `tools/build-all.mjs` | builds every app, the studio and the dashboard into `site/` |
| `tools/review.mjs`, `studio/review.html` | the design review page (`site/review.html`) |
| `tools/screenshot.mjs` | phone-size screenshots of a built app (`--look=<id>` picks a look, `--open` opens every fold, `--tall` shows a long screen whole) |
| `studio/studio.html`, `studio/studio-entry.js` | the studio page |
| `tests/checker.test.mjs` | reader and checker: every kind of finding, junk input never throws |
| `tests/runtime.test.mjs` | the runtime: clocks, Back, reminders, details and tables, Record, Write boxes (draw, Log, Back, HTML escaped, damaged save), Stop, looks and branding, app tips, the More fold, the one Sources fold per screen (escaped, flags), Location boxes (fake GPS success, refusal, error, missing), the Rescue look |
| `tests/apps.test.mjs`, `tests/helpers/app-check.mjs`, `tests/helpers/explore.mjs`, `tests/helpers/fake-browser.mjs` | every guideline builds and every route works in a fake browser (jsdom, fake clock); each app runs in its own worker thread, and the explorer closes every page it opens, so memory stays low |

The **Studio** (`site/studio.html`) is the "guideline in, app out" website without AI: paste a template (and the
guideline text), see the checks and a working preview as you type, download the finished app.

## The template (what an author fills in)
Full help text is inside `template/guideline-template.md`. Line types:

| Line | Does |
|---|---|
| `Say:` / plain text / `- bullet` | text on the screen |
| `More:` | text that is useful but not needed at a glance (may carry Quotes, like Say). All the step's More lines share one collapsed "More detail" fold below the step's other lines, above the question and buttons. Counts as an instruction (an unquoted one is an `info`) |
| `Tip:` | the app's own suggestion about flow or tools ("One person calls while the skipper steers back"), never guideline advice. Drawn with the bold badge "App tip · not from the guideline" in its own style, with the tip text lighter (regular weight, muted colour) than the guideline's own lines in every look. Never needs a Quote and is not counted as an unquoted instruction. A Quote under a Tip is a `check` (use `Say:`); a Tip with any number (amount, time, distance, dose, phone number) is a `check` ("Tips must not add numbers"); an empty Tip is a `fix` and is left out |
| `Do:` | tick-box action (ticks are logged) |
| `Warning:` | highlighted caution |
| `Quote: "exact words" (page)` | supports the line above; checked word for word against the saved guideline text. Shown in the screen's one collapsed "Sources for this screen" fold (below) |
| `Ask:` + `- Answer -> step` | a question; each answer goes to a step (or `end`). The Log shows the answer as its own line (question, then answer) right after the step it was given on, before the next step's line |
| `Next: step` | the main button (several `Next:` lines with conditions: the first that applies) |
| `Timer: 20 minutes -> step` | counts down on this step; at zero it buzzes and offers to move on |
| `Remind: every 4 minutes: text` | a reminder bar on every screen until stopped; "Done" logs it and restarts the count |
| `Stop: text` or `Stop: all` | stops reminders |
| `Show: Table name` (or `Table: Column`) | the table row for the current details (e.g. dose by weight) |
| `Record: Adrenaline given` | a button that logs a time stamp and counts taps (it says "Not tapped yet" until the first tap); it and the Log show the clock time of day (14:32) as well as time since start, for handover |
| `Write: Caller's exact words` | a labelled box to type into (one per line; also `Write down:`, `Text box:`). The text is saved to the Log with both times when the person taps "Save to Log", leaves the box, or leaves the step; it stays in the box on Back and through a reload, and only on this phone (never sent anywhere). No label, or a box outside `## Steps`, is a `fix`; two boxes with one label on a step is a `check` |
| `Location: Where it happened` | a Write box for a position (also `Position:`, `GPS:`) with a big "Use GPS position" button. A tap asks the phone once (high accuracy, 20 s timeout) and fills the box with `lat, lon (±N m, GPS at HH:MM)` in decimal degrees to 5 places, saves it to the Log (the box's status line is the one confirmation), and shows degrees and decimal minutes under the box (`41°17.123'S 174°46.567'E`); the Log entry carries both forms. No location on the phone or page (e.g. inside a sandboxed page), a refusal, an error or a timeout shows "This phone or page can't share its location here. Type the position instead." and the box still works. Same saving, Back, reload and Finished behaviour as Write; never sent anywhere. Same label findings as Write (no label: called "Position"); a `Location:` under `## Inputs` is read as an input |
| `End:` | marks a last step |
| `Brand:` / `Brand colour:` / `Look:` (top) | company name and colour; the look the app opens in |
| `Note:` | for authors, never shown |
| `[if Weight < 10]` at the end of any line or answer | condition on the inputs: `=`/`is`, `is not`, `<`, `<=`, `>`, `>=`, `under`, `over`, `at least`, `at most`; join details with `and`; `or` only between values of one detail (`Group = Adult or Child`) |

**Sources on screen**: a line's quotes are not drawn under the line. Each step screen has ONE collapsed "Sources for
this screen (N)" fold at the bottom: a numbered list in screen order (step quotes, the timer's, each shown line's,
the reminders'), each with the quote, its place, "Supports: <short form of the line>" and "quote not confirmed" if
the checker could not find it word for word. Lines hidden by a condition leave their quotes out.

Inputs (`## Inputs`): numbers with a range and unit, or choices. Tables (`## Tables`): markdown tables keyed by an
input; rows can be words or number bands (`0-5`, `under 5`, `over 40`, `40+`); `-` means "not stated" and shows
as "Not stated in the guideline", never zero.

## Findings: forgiving, never breaking
`fix` = the app can't do what the template says; it uses a safe fallback (shows the problem in place, offers
"Finish", shows the whole table) and carries on. `check` = possibly wrong: contradictions (same answer to two
places, a line's number differs from its quote, the same reminder with two intervals, two timers on a step,
overlapping or gapped table bands, duplicate rows), a Tip with a number or a Quote, unreachable steps, loops with no way to finish, quotes not
found or only nearly found (with the guideline's actual wording). `info` = worth knowing (unquoted numbers,
guideline numbers the template never uses, no reviewer).

The checker suggests the likely fix ("Did you mean ...?") using name similarity. It never changes meaning on its
own; the author decides.

## What each build run adds
When a guideline needs something the runtime can't do (a counter, a score calculator, parallel tracks, a
second timer), the run adds it as a new line type: reader + checker + runtime + tests + this page, and every
earlier app must still pass. That is how the builder "learns": the library of building blocks grows, and the
queue in `docs/CURRICULUM.md` gets harder.

## Spec (what the runtime reads)
`{ title, about, sources[{name, link}], warning, audience, reviewedBy, version, brand{name, colour}, look, inputs[], tables[], steps[], start }`.
A step: `{ id, title, lines[{kind (say, more, tip, do, warning, record, write, location, show, note), text, quotes[], cond}], ask{question, options[{label, to, target, cond}]},
next, nexts[], timer{ms, label, to, target}, reminders[{ms, every, once, text, id}], stop, end }`. An input:
`{ id, label, unit, type: number|choice, options[], min, max, optional, whole }`. A table: `{ id, title, key, keyInput,
columns[], rows[{key, cells, match}] }`; an open band end (`over 40`) is stored as `null` and means "no limit". `target` is filled
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
draw a progress bar. Current looks (the list itself, in this order, is `LOOKS` in `engine/looks.js`):

| Look | Borrowed from |
|---|---|
| clinic | patient and wellbeing apps: calm cards, one teal action colour |
| wayfinding | transit maps and road signs: bold type, actions as stations on a red line, sign-yellow cautions |
| flightdeck | aviation checklists and cockpit displays: dark, high contrast, monospace numbers |
| rescue | marine safety gear and lifeboat / ISO 7010 safety signs: high-vis orange and navy on a light ground (readable in sunlight), big bold type, every tap target at least 64px for wet or cold hands, a chunky orange main button, big navy Record buttons with an orange dot, cautions as yellow-and-black hazard bands |

Every look styles the shared blocks: the app-tip badge, the "More detail" and "Sources" folds and the GPS button.

Every app carries all the looks (`engine/looks.js` lists them and scopes each sheet to `html[data-look="<id>"]`),
so the person using it can switch under About ("Change the look" on the start screen); the choice is kept on that
phone. The app opens in the template's `Look:` or else the default, Clinic (the owner's favourite in round 1; the
owner found Wayfinding easiest to follow). The review page marks its copies `data-look-lock` so each shows one look.

**Company branding**: `Brand:` (name, shown in the top bar) and `Brand colour:` (hex) at the top of a template. The
runtime sets `--brand`; each look decides where it goes (Clinic: every action colour; Wayfinding: the route line;
Flight deck: a stripe on the top bar, so its dark colours stay readable; Rescue: a thick stripe under the top bar, because
its orange, yellow and red carry safety meaning and must not change). A colour that can't be read is a `fix`
finding and is ignored; one too light for white text is a `check`.
