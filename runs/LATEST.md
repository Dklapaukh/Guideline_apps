Scheduled build run, 20 Nov 2026 (seventh run, 10 pm).

Your feedback: nothing new on the design review page or on any app.

Built:
- App 17: Bomb threat by phone (NZ). From the NZ Police "Bomb threat checklist" card (main source) and NZ Police
  pages, with the Australian-NZ counter-terrorism committee's (ANZCTC) guide where it adds or differs (labelled
  Australian, and it says 000; the app always says 111).
  - First choice: a caller is threatening now / it came by email or social media / someone found a suspicious
    item / the call has already ended.
  - During the call: "Call started", then the exact words, then the card's 10 questions, one per screen, in the
    NZ card's order, each with a box to type the answer and an exit for "caller hung up".
  - After: who to tell (the card's fields, including "Trace 111"), the caller's voice, language, background
    noises and call details in the card's order.
  - Evacuate, partly evacuate, search or stay is shown as the employer's or incident manager's decision, never
    made by the app. Each choice is logged; a search that finds something goes to the suspicious item route.
  - Suspicious item: the Australian "no mobiles or radios within 25 m" warning comes first, then the owner
    question, the three "is it suspicious?" checks, and the 100 m / 500 m distances (Australian, for a found item
    only).
  - Handover screen for Police.
- Reviewer found 3 missed instructions (the "is it suspicious?" checks, "advise security", the second-blast
  warning) and 14 findings, the main one that the item screen said "call 111" before the mobile-phone warning.
  All fixed in one round.
- Scores: to fix 0, to check 0, all apps. 116 of 116 quotes exact (web copy). Tests: 36 of 36 pass.

Building blocks added:
- Typing boxes ("Write:" lines). A box on a screen for free text, such as the caller's exact words. What is
  typed goes into the Log with the clock time, stays when you go Back, shows on the Finished screen, and never
  leaves the phone. Every app was rebuilt with it (no change to how earlier apps look).

Gaps in the guideline (each said on screen):
- The NZ card is dated 11/02 and no newer NZ version was found.
- Neither source says whether to hang up or keep the line open, or how to keep the caller talking.
- No rule or distance for evacuating after a phone threat with nothing found; NZ leaves it to the employer.
- NZ gives no distances and nothing on mobiles or radios near an item; those come from the Australian guide.
- The card doesn't explain "Trace 111" or "Members name".
- Nothing says what to do after a search finds nothing.

Needs you:
- Optional: delete the unused duplicate sick leave page (https://claude.ai/artifact/QkrFs1WcJrRDvke7wBzHNP).
- Try "Change the look" in any app and say which should be the default (still open).

Note for later runs: the test explorer stops at 400 routes and app 17 needs 367 to reach every screen, so an app
with many more branches may need the explorer's limit looked at (never loosened to hide a failure).

Next: guideline 18 (person overboard from a boat).
