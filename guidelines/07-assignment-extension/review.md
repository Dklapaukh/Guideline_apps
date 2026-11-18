# Review: 07-assignment-extension (AUT special consideration / short extension)

Verdict: Faithful and well quoted (73/73 quotes exact, no invented dates, links or outcomes). It needs changes before sign-off: the past-due and commitment routes contradict themselves, "I'm not sure" leads to a "too late" screen, and the after-due-date route leaves out two actions.

Checked: the template against source.txt line by line. Built the app (`node tools/build.mjs guidelines/07-assignment-extension`: 16/16 steps reachable, 0 fix, 0 check, 5 info) and drove these routes in the fake browser: couple of extra days (yes and no), medical after the due date, mental health before the due date, planned commitment, due date passed (not sure; and yes then commitment), what happens next, and not-eligible then equipment failure. No page errors. The "19 Nov 2026" read date matches NZ time on the run date, so it is not a finding.

## Findings

1. **Past-due route asks the same question twice and then offers an answer that's already ruled out (most serious usability issue).**
   Where: `past-due` → `reason` → (any report screen) → `when-apply`.
   Source: "You can submit an SCA up to 5 working days after your assessment due date."
   Problem: the student has already said "my due date has passed" and "5 working days or fewer". `when-apply` then asks again and offers "Before the due date, or on the day", which would send them to `apply-before` and the wrong evidence clock (5 working days from applying instead of from the original due date). This is LESSONS trap 6 (what starts the clock).
   Fix: give `past-due → Yes` its own path that ends at `apply-after`. One way is an input or flag ("Due date passed") with `[if ...]` conditions on the `Next:` lines of the report, other-reason and commitment screens, so they skip `when-apply`. Another is a `reason-after` copy of the reason screen. Either way, past-due students should never see the "before the due date" option.

2. **"I'm not sure" goes to a screen titled "More than 5 working days have passed".**
   Where: `past-due`, answer `- I'm not sure -> too-late`.
   Source: gives no way to count working days, but it does allow applying up to 5 working days after.
   Problem: a stressed student who may still be in time is told, in effect, that it's too late. That is a meaning the page doesn't support, and it is a near dead end.
   Fix: send "I'm not sure" to its own short screen. It should say that the page allows up to 5 working days, that the page doesn't define working days, and to contact the Student Hub now (quoted email and phone), then offer "Carry on and apply" (→ reason) or Finish. Or retitle `too-late` neutrally ("Check if you're still in time") and change its wording for the unsure case.

3. **The commitment rule is undercut on the past-due route, and "doesn't say what happens" softens a "must".**
   Where: `commitment` (line 130), reached from `past-due` → `reason`.
   Source: "Essential sporting, cultural or religious commitments (applications must be made before the date of the commitment)" (and the same for AUT-related).
   Problem: the page does say something: applications for these must be made before the commitment. If a commitment-based application is late, the page's rule is not met. The template's "The page doesn't say what happens if the commitment has already happened" reads like a loophole. On the past-due route the commitment has almost certainly passed, yet `Next: when-apply` offers both apply routes.
   Fix: turn `commitment` into a one-decision screen. Ask "Has the commitment date passed?" Yes → a screen that says plainly the page requires applying before the commitment date, that it doesn't say whether late applications are considered, and to contact the Student Hub/AUTSA (quoted). No → `apply-before`. Since the commitment is planned and must come first, it should normally be before the due date. Also update the Notes line on commitments.

4. **Missed instruction: telling the teaching department is never offered as an action.**
   Where: `apply-after` (line 186). The failing-grade warning is the only mention.
   Source: "If you don't have a valid reason for missing the due date or have not notified your AUT teaching department within the required time, you will receive a failing grade for your assignment or examination."
   Problem: the warning names a duty (notify your teaching department) but no step tells the student to do it, and the page attaches a failing grade to it. A student could apply through the tool and still not notify their department.
   Fix: add `Do: Tell your AUT teaching department (the page doesn't say how or exactly when, so do it as soon as you can).` and quote the same line. Keep the existing "within the required time" gap note. This adds no new fact: the page itself makes notifying the department a condition. Counted below as 1 missed instruction.

5. **The after-due-date route leaves out the first-time Microsoft "accept" step.**
   Where: `apply-after` (lines 181-191). `short-apply` and `apply-before` both have it.
   Source: "When you're accessing the tool for the first time, you'll be asked by Microsoft to approve access to the new software. Make sure you click on 'accept' and proceed."
   Problem: this rule applies to everyone using the tool but is shown on only two of the three apply routes. The student on the most time-pressured route doesn't see it.
   Fix: add the same line and quote to `apply-after`. While there, make it the same line type everywhere. It's `Do:` on `short-apply` and `Say:` on `apply-before`; use `Do:` on all three.

6. **When the Student Impairment Report is due is unclear, and Notes doesn't flag it.**
   Where: `report-medical`/`report-mental` say the report goes "with your application". `apply-before` (line 177) puts it under "evidence", due within 5 working days of applying.
   Source: "you need to provide a completed Student Impairment Report to accompany your Special Consideration Application form" versus "You must upload your supporting evidence within 5 working days of submitting your application."
   Problem: the page doesn't say whether the report must be attached when you apply or can follow within the evidence window. The app gives both readings on different screens. This is LESSONS traps 5, 6 and 13.
   Fix: on `apply-before` and `apply-after`, say "The page says the Student Impairment Report should accompany your application, and evidence is due within 5 working days. It doesn't say whether the report can come later. If you can't get it in time, apply anyway and contact the Student Hub." Add the same to `## Notes`. Don't pick one reading silently.

7. **The not-eligible title adds a softening word the source doesn't have.**
   Where: `### not-eligible: These usually don't count`.
   Source: "Exceptional circumstances do not include:". The only exception is "unless they relate to an officially notified failure of university equipment".
   Problem: "usually" changes the meaning (LESSONS trap 10). The body correctly says "AUT does not count these", so the title and body disagree.
   Fix: retitle to "These don't count" or "Not exceptional circumstances". The equipment exception already has its own line and answer.

8. **The not-eligible screen offers a short extension even when that's impossible.**
   Where: `not-eligible`, answer "Check if I can get a short extension". Also reachable from `past-due` → `reason`.
   Source: "You must apply by midnight the day BEFORE your assessment is due".
   Problem: on the past-due route this sends the student round a loop (short-check → No → short-no → reason) to a door already shut on the `past-due` screen. This is a minor route-placement issue and mostly goes away once finding 1 adds a past-due flag.
   Fix: add `[if not past due]` (or similar) to that answer and to the "A short extension needs no reason" line.

9. **Weak quote support on two lines.**
   - `short-no` line 58 ("If something serious is affecting you, you can apply for special consideration instead. You'll need evidence."). It quotes "If you need further extensions for the same course..." That quote only covers the "already used my one short extension" case, not the deadline-missed or test/exam cases. Better quotes: "If you need more time than 3 days because of valid exceptional circumstances, you need to apply for the standard extension and provide evidence", plus the intro "If this happens, you can apply for special consideration for that assessment."
   - `reason` line 70 ("Special consideration is for serious things outside your control."). It quotes "Exceptional circumstances can be due to:", which doesn't support "serious ... outside your control". Use the intro quote: "seriously affected by exceptional circumstances beyond your control".

10. **The equipment-failure route gets no evidence guidance.**
    Where: `not-eligible` → "AUT announced its equipment had failed" → `when-apply` → apply.
    Source: "The specific requirements for your application will depend on the situation and are explained in the Special Consideration Application (SCA) form."
    Problem: unlike the other-reason and commitment screens, this route never says what to send. The apply screens only mention the Student Impairment Report.
    Fix: send this answer to `other-reason`, which already carries the "depends on your situation, the form explains it" line. Or add that line and quote to `when-apply`/the apply screens so every route sees it.

11. **The start screen repeats the banner.**
    Where: `start` line 13 repeats the top `Warning:` word for word.
    Problem: on a phone the first screen opens with the same caution twice before the student reaches the question. It is minor, but it adds length on the screen where a stressed student most needs brevity.
    Fix: drop the `Say:` (the banner already shows it), or shorten it to "AUT students only."

12. **Long screens on the medical and mental-health routes (usability).**
    Where: `report-medical` (5 blocks plus the COVID-19 paragraph) and `report-mental` (2 Says, 4 Do steps, external practitioner, counselling).
    Problem: these are the routes most likely to be used by unwell or distressed students. Each screen packs several separate jobs: what you need, who fills it in, the outside-AUT option, COVID, and urgent support. Nothing is wrong in the content.
    Fix: consider one decision per screen. For example: "Will someone at AUT or your own doctor/practitioner fill in the report?" → a short screen for each. Show the counselling line first on `report-mental` so urgent support isn't at the bottom. Don't add any crisis numbers that aren't in source.txt (rule 3). If the owner wants one, it needs a quoted source.

13. **(Info) "Injury" and the "due date" wording for tests and exams.**
    Where: `reason` answer "An illness or injury (including COVID-19)". Also `when-apply`/`past-due` use "due date" for everything.
    Source: "Medical or emotional/mental conditions". The page covers tests and exams under "assessment", and the failing-grade line says "assignment or examination".
    Problem: "injury" is a fair plain-English reading of "medical" and is acceptable. "Due date" is less clear for a student whose exam was affected.
    Fix (optional): "A medical reason (illness, injury, COVID-19)". On `when-apply`, say "due date (or test/exam date)". Mention this in Notes.

## Coverage check (source line → template)
Every instruction in source.txt appears somewhere in the template: the intro, the SCA 5-working-day limit, both evidence clocks, the failing grade (correctly placed only on the after-due-date route, as on the page), the tool and Microsoft accept, all six exceptional-circumstance types with both "before the commitment" rules, the COVID-19 lines, all three exclusions with the "unless", all seven short-extension rules including the example, the Student Impairment Report and suitably qualified person, the nurses, the Hub booking path, counselling, external practitioner, AUTSA (process difficulties and an unfair outcome), and the Hub email and phone. No dropped "not", "only", "unless" or "up to" in quotes. "3 calendar days" versus "5 working days" is kept distinct everywhere. Judgement words ("can be taken into account") are shown as text. The one action not given as a step is notifying the teaching department (finding 4). The Microsoft step is missing on one route (finding 5), but it appears elsewhere, so it isn't counted as missed.

Missed instructions: 1

## Round 1 fixes

All 13 findings fixed. Rebuilt: 30/30 steps reachable, 0 fix, 0 check, 4 info (app wording on 2 screens, no reviewer, web-fetch copy). 113/113 quotes exact. The explorer drove 297 routes, saw all 30 steps, reached 49 endings and found no problems. `npm test`: 18 pass, 0 fail.

1. Past-due students now go through their own copies of the reason screens (`reason-after`, `report-medical-after`, `med-nurse-after`, `report-mental-after`, `mental-hub-after`, `sir-external-after`, `other-reason-after`, `commitment-after`, `not-eligible-after`). Every one of them leads to `apply-after`. A graph walk from `past-due` confirms they never reach `when-apply`, `apply-before`, `reason` or the short-extension screens. This needs separate steps because conditions only work on inputs. Notes says to keep the two copies the same.
2. "I'm not sure" now goes to a new `not-sure` screen ("Check if you're still in time"). It says the page allows up to 5 working days but doesn't say how to count them, gives a Do: to contact the Student Hub now (email and phone quoted), and offers "Carry on and apply" (goes to `reason-after`) or Finish.
3. `commitment` and `commitment-after` state the rule plainly: "applications must be made before the date of the commitment". Each then asks "Has the date of the commitment passed?" If it has, the new `commitment-passed` screen repeats the rule, says the page doesn't say whether a late application can be considered, and points to the Student Hub (Do:) and AUTSA. If it hasn't, the student goes to `when-apply` (or `apply-after` on the past-due route). The old "doesn't say what happens" line is gone. Notes updated.
4. `apply-after` now has a Do: to tell the AUT teaching department as soon as possible, stating the failing grade and that the page doesn't say how or exactly when. It quotes the failing-grade sentence.
5. All three apply screens now have the first-time Microsoft "accept" step as a Do:, with both quotes.
6. Both apply screens show both readings of when the Student Impairment Report is due ("accompany your application" versus "evidence within 5 working days"), say the page doesn't settle which, and point to the Student Hub. Added to Notes. The app does not tell students to "apply anyway", because the page doesn't say that.
7. The not-eligible screens are now titled "These don't count".
8. `not-eligible-after` has no short-extension line or answer.
9. `short-no` now quotes the intro special-consideration line and the "more time than 3 days ... provide evidence" line (the further-extensions quote is kept). `reason` and `reason-after` now quote "seriously affected by exceptional circumstances beyond your control".
10. The equipment-failure answer now goes to `other-reason` (or `other-reason-after`), now titled "What to send", which carries the "depends on the situation ... SCA form" line.
11. The repeated banner line was removed from `start`.
12. The medical and mental-health routes now ask one question each ("Who will fill in your report?") and lead to short screens: `med-nurse`, `mental-hub` (booking steps) or `sir-external`. On the mental-health screen the counselling line comes first. No crisis numbers were added.
13. The answer now reads "A medical reason (illness, injury, COVID-19)". `start`, `past-due` and `when-apply` say "due date (or test or exam date)" where it fits. Mentioned in Notes.

Could not fix: none. Trade-off: the screen count went up from 16 to 30, because of the past-due copies and the split report screens. Each route still shows about 3 to 7 screens.
