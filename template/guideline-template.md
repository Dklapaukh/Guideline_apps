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

> "Reviewed by" stays empty until a person has checked every step against the guideline. Until then the
> app shows "Not reviewed".

## Inputs

> Details the app asks for at the start (they can be changed later). Leave this section out if none are needed.
> - Name (unit): number, lowest-highest[, optional]
> - Name: choice: Option A | Option B | Option C
> - Name: yes/no

- Weight (kg): number, 1-200, optional
- Age group: choice: Adult | Child | Infant

## Tables

> Look-up tables (doses, sizes, settings...). "Key:" says which input picks the row.
> Row names can be words ("Adult"), or number bands: "0-5", "5.1-10", "under 5", "over 40", "40+".
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
>   Warning:  highlighted caution                Note:   for authors only, never shown
>   Quote:    "exact words from the guideline" (page)  - supports the line above it
>   Ask:      a question, followed by answers:   - Answer text -> step-id
>   Next:     step-id (or "end")                 End:    marks the last step (optional closing text)
>   Timer:    20 minutes -> step-id              counts down on this step, then offers to move on
>   Remind:   every 5 minutes: Reassess          keeps reminding (on every screen) until stopped
>   Stop:     Reassess  (or "all")               stops a reminder
>   Show:     Example dose                       shows the table row for the current details
>   Record:   Dose given                         a button that logs the time each time it's tapped
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
