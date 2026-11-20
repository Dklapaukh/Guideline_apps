# App name goes here

> HOW TO USE THIS TEMPLATE
> Fill in what you can; leave out what you don't need. Lines starting with ">" are help text and are ignored.
> The builder reads this file with plain code (no AI), so what you write here is exactly what the app does.
> It is forgiving: if something is unclear, missing or contradictory, the app still builds and lists the
> problem under "Checks" with a suggestion. Nothing you type can break it.
> Filling this in yourself (or checking a draft that AI filled in) is the main way to make an app accurate.

About: One sentence on what the app helps someone do.
Source: Guideline name and number - https://link.to/the/guideline
Version: Guideline version or date
Audience: Who the app is for (e.g. "trained first aiders", "kitchen staff")
Warning: Optional banner shown on the start screen.
Reviewed by:
Brand:
Brand colour:
Look:

> "Reviewed by" stays empty until a person has checked every step against the guideline. Until then the
> app shows "Not reviewed".
> Optional company branding: "Brand:" is the organisation's name (shown at the top), "Brand colour:" a hex code
> such as #1d4ed8 (used for buttons or the route line, depending on the look). "Look:" is the design the app opens
> in: Clinic (the default), Wayfinding, Flight deck or Rescue (high-vis orange and navy, extra-large buttons, for use
> outdoors). The person using the app can always change the look under About.

## Inputs

> Details the app asks for at the start (they can be changed later). Leave this section out if none are needed.
> - Name (unit): number, lowest-highest[, optional]
> - Name: choice: Option A | Option B | Option C
> - Name: yes/no

- Weight (kg): number, 1-200, optional
- Age group: choice: Adult | Child | Infant

## Tables

> Look-up tables (doses, sizes, settings...). "Key:" says which input picks the row.
> Row names can be words ("Adult"), or number bands with no gaps: "up to 5", "over 5 to 10", "over 10".
> ("5-10" includes both ends, so "5-10" then "10-20" overlap at 10.) Add "whole" to a number input
> (e.g. "- Age (years): number, 0-120, whole") if only whole numbers are allowed; then "1-5", "6-10" has no gap.
> Write "-" for "the guideline doesn't give a value" (the app shows "Not stated in the guideline", never zero).

### Example dose
Key: Age group
Source: Guideline table 2, page 4
| Age group | Dose | Repeat |
|---|---|---|
| Adult | 0.5 mg | every 5 minutes |
| Child | 0.3 mg | every 5 minutes |
| Infant | - | - |

## Steps

> One "### id: Title" per screen. The first step is where the app starts.
> Each line starts with a word that says what it is:
>   Say:      text to show                       Do:     a tick-box action
>   More:     extra text, folded away under "More detail" (may have a Quote, like Say)
>   Tip:      the APP's own suggestion about flow or tools, shown as "App tip · not from the guideline".
>             Never guideline advice: no Quote under it and no numbers (no amounts, times, distances, doses or
>             phone numbers). If the guideline says it, use Say with its Quote instead.
>   Warning:  highlighted caution                Note:   for authors only, never shown
>   Quote:    "exact words from the guideline" (page)  - supports the line above it. Quotes are shown together
>             in one folded "Sources for this screen" list at the bottom of the screen.
>   Ask:      a question, followed by answers:   - Answer text -> step-id
>   Next:     step-id (or "end")                 End:    marks the last step (optional closing text)
>   Timer:    20 minutes -> step-id              counts down on this step, then offers to move on
>   Remind:   every 5 minutes: Reassess          keeps reminding (on every screen) until stopped
>   Remind:   after 6 hours: Deadline            happens once (a deadline that can't be pushed back)
>   Stop:     Reassess  (or "all")               stops a reminder
>   Show:     Example dose                       shows the table row for the current details
>   Record:   Dose given                         a button that logs the time each time it's tapped
>   Write:    Caller's exact words               a box to type into; the text goes in the Log with the time
>             (one box per Write: line; it keeps its text on Back. Use it when the guideline says to write something down.)
>   Location: Where it happened                a box for a position with a "Use GPS position" button: fills in the
>             phone's position (decimal and degrees-minutes) and saves it to the Log; it can also be typed in.
> Less text per screen: keep each screen to one or two short Say/Do lines, a Record or Location button and the
> question. Put background, alternatives and other countries' wording in More lines.
> Any line can end with a condition: [if Age group = Child] or [if Weight < 10] or [if A = x and B > 3].
> Answers can have conditions too: - Give second dose -> second-dose [if Age group is Adult]

### start: First step title
Say: What to do first.
Quote: "the guideline's own words for this" (page 1)
Do: An action to tick off.
Ask: A question with answers?
- Yes -> second
- No -> end

### second: Second step title
Show: Example dose
Record: Dose given
Remind: every 5 minutes: Check the person again
Timer: 10 minutes -> finished

### finished: Last step
Stop: all
End: Hand over and record what was done.

## Notes

> Anything for authors: open questions, decisions, where the guideline was unclear. Never shown in the app.
