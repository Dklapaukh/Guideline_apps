# Review: 09-annual-holidays (Employment New Zealand: annual holidays, closedowns, cash-ups, holiday pay)

Verdict: Carefully quoted and honest about gaps (141/141 quotes exact, no invented numbers, the three contradictions shown on screen). It needs changes before sign-off. The most serious problems: the employer's cash-up route skips the 1-week cap and the "not until entitled" rule, the "other closedown" choice is worded so it excludes the case it matters for, and the closedown "not enough holidays" screen leaves out that the person must first use the holidays they have. Also 5 instructions are missing, and the screens hold too much text for a phone.

Checked: the template against source.txt line by line, and meta.json. Built the app (`node tools/build.mjs guidelines/09-annual-holidays`: 33/33 steps reachable, 0 fix, 0 check, 23 info, 141/141 quotes exact, 25/25 number lines quoted). The explorer drove 108 routes, saw all 33 steps, reached 42 endings, and found no problems or page errors. I drove these routes by hand: ask for time off → declined → "employer now says when"; ask → no answer; not entitled → advance → Finish; closedown → not enough holidays → sick leave screen; closedown → not entitled; sudden closure; "employer wants me to take holidays in advance" → No; employee cash-up → agreed → paid; employer → cash-up → "felt pressured"; employer → require → No; and Back from `entitled` to `start`, then into `required`. Back worked. Every route goes where its answer says; no dead ends.

## Findings

1. **The employer's cash-up route skips the 1-week cap and the "not until entitled" rule (most serious).**
   Where: `employer` → "To cash up holidays" → `cashup-reply` directly.
   Source: "Annual holidays cannot be cashed-up until the employee gets their annual holiday entitlement." / "Employers must not allow employees to cash-up more than 1 week of their minimum entitlement each year." / "Requests to cash-up must be in writing."
   Problem: these rules are only on the employee screens (`cashup`, `cashup-ask`). An employer goes straight to "how to respond", so the app never tells the employer they must not agree to more than 1 week, or to a cash-up before the employee is entitled. That is the employer's main legal limit.
   Fix: point the employer answer to a short screen (or to `cashup` first) that says: not before entitlement; at most 1 week of the 4-week minimum each year (extra weeks above 4 only if the agreement or policy allows); the request must be in writing. Then go on to `cashup-reply`.

2. **"Another kind of closedown my employer and I agreed" excludes the case the rules are for.**
   Where: `required`, last answer → `other-closedown`.
   Source: "This could be because the employer wants to implement a closedown that is: not an annual closedown, or in addition to an annual closedown that has already happened in the last 12 months." / "The employer can only require their employees to take annual holidays for these other types of closedowns if: ... the employer has been unable to reach agreement with the employee ..."
   Problem: the three conditions on `other-closedown` matter most when the employee has *not* agreed (e.g. a second shutdown this year). An employee in that situation will not pick "my employer and I agreed", and none of the other answers fits, so they may wrongly pick "closes at the same time every year".
   Fix: reword the answer: "A different or extra closedown (not the usual yearly one)". Optionally say on `closedown` that only 1 annual closedown is allowed in any 12 months, and link to `other-closedown` for a second one.

3. **Closedown with "not enough holidays" leaves out that you must use the holidays you have.**
   Where: `closedown-short`.
   Source: "If at the start of the annual closedown an employee has [link words missing] they're able to use, they must do so (as long as they get 14 days' notice)."
   Problem: this "must" is only on `closedown-enough`. The "some, but not enough" screen starts with options (advance, unpaid leave), so it reads as if the employee can choose leave without pay instead of using their holidays.
   Fix: add as the first line of `closedown-short`: "You must use the holidays you have first (as long as you got 14 days' notice)", with the same quote. Counted as 1 missed instruction.

4. **"Not entitled" closedown screen leaves out half of what the employee loses, and two reasons for not being entitled.**
   Where: `closedown-not-entitled`.
   Source: "In this situation, the employee is then not otherwise entitled to: any annual holidays for the period of employment up to the start of the annual closedown / any pay for the period of the closedown." Also: "taken unpaid leave of more than a week and this has moved their anniversary date ..., or at some time, received pay for their annual holidays on a pay-as-you-go basis."
   Problem: only the "any pay" item is quoted; the screen never says the 8% replaces any holidays for the time worked so far. The `Warning:` also adds "other" ("not entitled to any other pay"), which is the app's wording, not the source's "not otherwise entitled to ... any pay". And the closedown question offers "I'm not entitled to holidays yet", but people who took more than a week unpaid leave or were paid pay-as-you-go may not know they count.
   Fix: add the "any annual holidays for the period of employment up to the start of the annual closedown" line with its quote. Add the two other reasons (one short line each) to `closedown-not-entitled`, or to the answer: "I'm not entitled yet (or not sure)". Counted as 1 missed instruction.

5. **Missed instruction: an employer cannot give less than 4 weeks, even if the agreement says so.**
   Where: not in the template. `employer` and `emp-request` never say it; `entitled` says "Your employment agreement says what your entitlement is", which, alone, could suggest the agreement can set less.
   Source: "You cannot give an employee less than 4 weeks annual holidays each year, even if their employment agreement says so."
   Fix: add to `entitled` (after the employment agreement line) and to `employer`: "Your employer cannot give you less than 4 weeks, even if your employment agreement says so." Counted as 1 missed instruction.

6. **Missed instruction: the cash-up workplace policy rules.**
   Where: not in the template (and not listed under "Left out" in Notes). `cashup-reply` mentions only that a policy can say requests need not be considered.
   Source: "The policy must not: allow an employee to cash-up more than 1 week of their 4-week minimum annual holiday entitlement each year / say how many requests to cash-up an employee can make." / "Employers who decide to develop a workplace policy about cashing-up should: consult with employees (and unions if applicable) / make sure new and existing employees know about the policy."
   Fix: add these to the employer cash-up screen from finding 1 (two short lines), or list them in Notes as left out on purpose, with the reason. Counted as 1 missed instruction.

7. **Missed instruction: use the agreed method consistently, and recalculate when the work pattern changes.**
   Where: `week`.
   Source: "The option agreed should be used consistently for that employee unless their situation changes." / "If the employee's work pattern does change, their situation must be reviewed, and their annual holiday entitlement recalculated based on the new work pattern." Also: "Your employer should discuss the consequences of the choice with you and help you choose the best option for your situation."
   Problem: the "must be reviewed and recalculated" duty is the one that protects people whose hours change, which is the same problem the screen warns about with "accrued" leave. The screen also gives no examples of what an unpredictable pattern could be based on ("the agreed hours in your employment agreement", "the days and hours you have been working in the weeks leading up ...", "another method ... agreed").
   Fix: add one line: "Once agreed, the same method should be used. If your work pattern changes, your entitlement must be reviewed and worked out again." Add the three bases as a short list. Counted as 1 missed instruction.

8. **Leaving screen: the two pages give different start points for the 8%, and the app does not say so.**
   Where: `leaving`, and compare `closedown-not-entitled`.
   Source (Managing page, leaving): "... or has worked a part-year since their last entitlement anniversary, you must pay them 8% of their total before-tax earnings from the time they started the job ..." Closedown page: "their last anniversary date for annual holidays, if they've already worked for their employer continuously for at least 12 months."
   Problem: read literally, the leaving sentence says 8% of earnings since the job started even for a part-year after an anniversary. The closedown page counts from the last anniversary. The app copies the leaving wording ("since they started") without flagging it. A person who has worked 3 years would get a very different figure. (LESSONS 5, 13.)
   Fix: keep the quote, but add: "The page says 'from the time they started the job'. For a part-year after an anniversary, the closedown page counts from the last anniversary instead. Employment New Zealand does not explain the difference: check with them." Add to Notes under Contradictions.

9. **Sudden closure: the employer page's "refuses" is dropped, and what happens when not all three are true is not said.**
   Where: `unexpected`; `emp-require`.
   Source: "If you close down your workplace unexpectedly ... and an employee refuses to take annual holidays with less than 14 days' notice and is willing and able to work – they cannot be made to take annual holidays."
   Problem: the employee screen lists three conditions from the employee page. The employer page adds a fourth: the employee refuses. An employee who says nothing may not be protected. Also, the screen does not say what applies if, e.g., 14 days' notice is given after a sudden closure (presumably the "can't agree on when" rule, but the source does not say).
   Fix: add "4. You say no to taking holidays" (quote the employer line), or a note under the list: "The employer page adds that this is when you refuse to take holidays." Add: "If not all of these are true, the guideline does not say directly; the 'can't agree on when' rule (14 days' notice) may apply." Put both in Notes.

10. **"Holidays in advance for a closedown: Yes" goes to a screen that does not answer the question.**
    Where: `required-advance` → Yes → `closedown`.
    Source: "An employer cannot require an employee to take annual holidays in advance, except when there is an annual closedown." / closedown page: "their employer can choose to also let them take annual holidays in advance" and "an employee could agree with their employer to take some annual holidays in advance in addition to the 8% payment."
    Problem: the closedown page itself only describes advance holidays as something the employer "can choose to let" you take or you "could agree" to. It never says the employer can *make* you. So the contradiction is wider than the two pages Notes names: the closedown page also leans to "by agreement only". The person who answers Yes then sees the general closedown screens and never gets an answer.
    Fix: add on `required-advance` (and in Notes, contradiction 2): "The closedown page itself only talks about taking holidays in advance if the employer lets you or you both agree." The "No" answer ends at once with no conclusion: send it to a short line "Then your employer cannot make you take holidays in advance", using the existing quote.

11. **The start answer for employers is too narrow.**
    Where: `start`, "I'm an employer and someone has asked for time off".
    Problem: the employer branch also covers advance, cash-up, cancelling and "I want staff to take holidays, or to close down". An employer planning a Christmas closedown will not pick "someone has asked for time off". They may pick "My employer wants me to take holidays", which speaks to employees.
    Fix: "I'm an employer" (with the detail on the next screen).

12. **`paid-before` mixes two things and the order is confusing.**
    Where: `ask-time` → `paid-before`.
    Problem: the screen titled "Getting paid for your holidays" then asks "What happened with your request?". A person who has just been told to ask their employer meets payment rules before they have an answer. "I haven't asked yet" ends the app with nothing more.
    Fix: put the question at the end of `ask-time` (or on its own step), and show the pay-before line on `agreed`, where it applies.

13. **Too much text on each screen, and quotes double the length (usability).**
    Where: every screen shows the app line and the full quote. Worst: `week` (145 words + 166 quoted), `holiday-pay` (131 + 164), `cancel` (133 + 116), `closedown-not-entitled` (127 + 162), `emp-require` (117 + 133), `advance` (118 + 117).
    Problem: on a phone that is 4-6 screens of scrolling for one step. `week` covers four different work patterns, plus accrual, on one screen. `holiday-pay` puts OWP, AWE, timing and payroll recalculation together.
    Fix: split `week` with a question ("Which is closest to how you work? Same days and hours / consistent but changing / unpredictable") and show only the matching line. Split `holiday-pay` into "how much" and "when it's paid". On `cancel`, move the employer-page contradiction to a short line ("The employer page puts it differently: see Notes") or a collapsible detail.

14. **"Saved copy" and "missing link" wording on the screens.**
    Where: `advance`, `emp-advance`, `cashup-paid`, `cashup-pressure`, `holiday-pay`, `leaving`.
    Problem: "the name of that document is missing from the saved copy" and "the next word (what it is 'per') and who can order a penalty are missing from the saved copy" are notes about how the text was captured, not something a phone user can act on. They make the app look broken. Being honest about the gap is right, but the wording is technical.
    Fix: on screen, say plainly what the person needs, e.g. "Penalties can be up to $10,000 (individual employer) or $20,000 per breach (company). See the Employment New Zealand page for details." Keep the "missing link words" explanation in `## Notes`. Better: save the pages as PDFs into `sources/` and fill the gaps.

15. **Mixed "you" on shared screens.**
    Where: `leaving` ("When you leave a job, your employer must pay you..." then "If the employee is not yet entitled ... the employer must pay..."), `cashup-reply` (employee reached from `cashup-ask`, employer from `employer`; the answer "I felt pressured" makes no sense for an employer).
    Fix: use one voice per screen ("the employee / the employer" on shared screens), or add a `[if Role = Employer]` choice so each sees their own wording and answers.

16. **Small softenings and cuts (LESSONS 10).**
    - `holiday-pay`: "One-off payments like bonuses are not included" drops "discretionary payments, and employer contributions to superannuation schemes", which are in the same quoted sentence. Add them.
    - `holiday-pay`: AWE for someone employed under 12 months ("the weekly average of their gross earnings for the time they have been employed") is left out. Notes says the AWE steps are left out, but this rule changes the answer for new staff; one line would cover it.
    - `cashup-pressure`: "may be able to keep the cash-up money" drops the next words "Recovering the payment would be treated as a deduction." Add them.
    - `ask-time`: `Do: Ask your employer before you take the time off.` is supported by a quote about the employer agreeing before time off. That is fair, but the employee page also says the employer "must allow you to take annual holidays when you want to unless they have a good reason not to", which is stronger and more direct for this screen. Consider using it.

17. **Pay-as-you-go is left out, but it is a real situation for casual and short fixed-term workers.**
    Where: Notes "Left out: pay-as-you-go 8% details".
    Source: "This can only happen if you: are on a fixed-term agreement of less than 12 months, or work so irregularly or intermittently that it is impossible in practice ..."
    Problem: listed as left out on purpose, so not counted as missed. But the "only if" conditions protect workers, and the `entitled` question has no answer for "I'm casual / paid holiday pay with every payslip". Such a person ends up on `advance`, which is wrong advice for them.
    Fix: add an answer to `entitled`: "I'm paid 8% holiday pay with my wages (casual or short fixed-term)" → a short screen quoting the two conditions and "Certain employees can agree to be paid at least 8% ... but only if they meet certain criteria."

Missed instructions: 5 (findings 3, 4, 5, 6, 7)

## Fixed after review

1. Fixed: employers now go to their own cash-up screens (`emp-cashup`, `emp-cashup-reply`), which give the 1-week limit, the "not until entitled" rule, the need for a written request, and the rule on extra weeks.
2. Fixed: the answer now reads "A different or extra closedown (not the usual yearly one)". `closedown` also has an answer, "This is a second closedown in 12 months", which leads to `other-closedown`.
3. Fixed: the first line of `closedown-short` now says to use the holidays you have first, with its quote.
4. Fixed: the screen now lists all three reasons for not being entitled. It now covers both things the employee loses (holidays up to the closedown, and pay for the closedown), with the source's wording and without "other". The answer now reads "Not entitled yet, or not sure". The content is split over `closedown-not-entitled`, `closedown-pay` and `closedown-date`.
5. Fixed: "cannot give less than 4 weeks, even if the agreement says so" is now on `entitled` and on `employer`.
6. Fixed: the workplace policy rules (what it must not do, consulting staff, telling staff) are on a new screen, `emp-cashup-policy`.
7. Fixed: `week-pattern` now says to use one method and to review when the pattern changes. `week-unpredictable` lists the three possible bases.
8. Fixed: a warning on `leaving-pay` flags the two different start points for the 8% payment. It is also contradiction 4 in Notes.
9. Fixed: the employer page's "refuses" wording is now on `unexpected`. The screen also says the guideline does not say what applies when not all the conditions are true. It does not suggest the "can't agree on when" rule, because the source does not say that rule applies.
10. Fixed: `required-advance` now shows that the closedown page talks only about advance holidays the employer allows or both sides agree to. "No" now leads to `advance-no`, which gives the answer.
11. Fixed: the start answer now reads "I'm an employer".
12. Fixed: the question about what happened is now on `ask-time`. The pay-before rule is now on `agreed`. "I haven't asked yet" now leads to `not-asked`.
13. Fixed: the longest screen is now 93 visible words. `week`, `holiday-pay`, `closedown-not-entitled`, `emp-require` and `leaving` were split. Quotes already sit in the closed "Guideline" box. The format has no collapsible block for app text, so background went to About or Notes instead.
14. Fixed: the screens now use the plain sentence "Employment New Zealand's page could not be read in full here; check the page itself." The technical detail is in Notes.
15. Fixed: each screen now uses one voice. Shared screens say "the employee" and "the employer". Employers have separate cash-up screens instead of a role input.
16. Fixed, all four points: the full list of OWP exclusions, the AWE rule for staff employed under 12 months, "would be treated as a deduction", and `ask-time` now uses "must allow you to take annual holidays when you want to".
17. Fixed: `entitled` has a new answer that leads to `payg`, which gives the "only if" conditions and the at-least-8% rate.

Rebuilt: 46 steps, all 46 reachable, 0 fix, 0 check, 158 of 158 quotes exact. `npm test`: 22 of 22 pass.
