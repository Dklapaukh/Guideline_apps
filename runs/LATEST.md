Scheduled build run, 19 Nov 2026 (evening, 6 pm).

Your feedback: nothing new on the design review page or on any app since the last run.

Built:
- App 9: Annual holidays (Employment New Zealand). First screen: "I want to ask for time off" / "My employer
  wants me to take holidays, or there's a closedown" / "I want to cash up some holidays" / "I'm an employer" /
  "Something else (cancelling, holiday pay, leaving a job)".
  - Asking: are you entitled yet (4 weeks after 12 months), how to ask, then "agreed", "said no" or "no answer".
    Not entitled yet leads to taking holidays in advance.
  - Employer wants you to take holidays: the 14 days' notice rule, annual closedowns (enough holidays, not
    enough, not entitled yet and the 8% payment), a second or different closedown, and a sudden closure.
  - Cashing up: up to 1 week a year, only once entitled, in writing, and what to do if you feel pressured.
  - Employers get their own screens for each of these.
- Reviewer found 5 missed instructions (the main one: the employer's cash-up limits) and 17 findings in all,
  including too much text per screen. All 17 fixed in one round. Longest screen is now 93 words.
- Scores: to fix 0, to check 0, all apps. 158 of 158 quotes exact (web copy). Tests: 22 of 22 pass.

Building blocks added: none. Test fix: the route tests ran out of memory once app 9 was added (the fake
browser keeps memory from every page it opens). Each app's routes now run in their own worker, so memory is
freed between apps. The checks themselves are unchanged.

Gaps in the guideline (each said on screen): Employment NZ doesn't say how far ahead to ask for leave, or what to
do if a request gets no answer. "Good reason" to refuse leave is not explained. The pages disagree on whether an
employer can cancel approved holidays, on whether you can be made to take holidays in advance for a closedown,
and on where the 8% for a part-year starts counting from. Some words on the cash-up page could not be read.

Needs you:
- Optional: save Employment NZ's annual holiday pages as PDFs into sources/ (the site is blocked from here), so
  quotes can be checked exactly. Same for FENZ, AUT and ANZCOR pages (still open).
- Try "Change the look" in any app and say which should be the default (still open).
- Is "a few steps away from buildings" in the earthquake app clear to you? (still open)

Next: guideline 10 (asthma attack first aid, Asthma NZ).
