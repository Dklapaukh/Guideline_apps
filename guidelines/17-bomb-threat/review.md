# Review: 17-bomb-threat

Verdict: Pass with fixes; findings 1-12 and 14 fixed after review, and 13 partly fixed (C5 added, C3 left out by choice). What remains are gaps in the guidelines themselves, shown on screen and in Notes: Trace 111 and Members name are not explained, there is no evacuation distance for a phone threat, nothing on hanging up, and no next step after a search that finds nothing.

Checked by: an independent reviewer (AI) on 20 Nov 2026. I compared template.md with source.txt and the meta.json sourceNote line by line, then built the app (29 steps, all reachable, 0 fix, 0 check, 16 info, 105 of 105 quotes exact). I ran the explorer (232 routes, 19 endings, no problems) and tapped through these routes by hand: the full phone call to handover, hang-up before the questions, hang-up at q3, "call has ended" at the start, the email threat, evacuate then item then partial, search with nothing found, stay, and waiting. Every Write box saved to the Log with both times, showed on the Finished screen, and kept its text on Back.

## NZ Police card check
- **The 10 questions:** all present, word for word, in NZ order (q1 When, q2 Where, q3 look like, q4 kind, q5 what will make it explode, q6 type and quantity, q7 why, q8 name, q9 where are you, q10 address). One per screen, and each has a hang-up exit.
- **Every field on the card is present:** A2 exact wording; A3 report to, phone number, Trace 111, Police advised, date/time, member's name; A4 all 9 voice fields; A5 all 7 language fields; A6 all 8 noise fields plus standard, 111/cellular and STD; A7 sex and age; A8 date, time, duration and number called; A9 name, phone and signature.
- **Field order:** the app does not keep the card's order of sections:
  - The app asks for the exact wording (A2) before the questions (A1). This is sensible, and it matches ANZCTC.
  - The app puts sex and age (A7) on the voice screen, before threat language (A5) and background noises (A6).
  - The app shows the A8 duration on the "ended" screen. The A8 date and time have no box (see finding 4).
  - None of this changes meaning, but the order is not the card's order (finding 10).

## Findings

1. **item: the phone is used before the 25 m warning is shown.**
   - What is wrong: the item screen says "Call 111 and report it" and has a "Police called (111)" button. The Australian "Do not use mobile phones or radios within a 25 metre radius" comes only on the next screen, after the call. A person standing by the bag will call from their mobile right beside it. The Notes see the tension ("NZ page does not say where to call 111 from"), but the order of the screens works against the warning.
   - Suggested fix: show the 25 m warning on the item screen, above "Call 111", still labelled "Australian guide". Don't add a distance to call from: no source gives one.
   - Whose fault: the template's (the order). The guideline has a gap: NZ is silent on radios and mobiles.

2. **item / item-au: the "if" is dropped, so there is no route for "owner found" or "not suspicious".**
   - What is wrong: B2 applies to a bag "with no apparent reason for it being there", and its "keep away" bullet only applies "if there's no obvious owner". C4's actions apply "[If the item is suspicious:]", after its three questions (Is the item intentionally hidden? Does it look like an explosive device or hazardous material? Is it out of place?). The app asks people if anyone owns it, then goes straight on to call 111 and clear 100 m whatever the answer. The three C4 questions never appear on the item route; only the HOT summary sentence appears, on the search screen. This is LESSONS trap 10 ("only if" lost), applied to a whole route.
   - Suggested fix: after "Ask people nearby if anyone owns it", add `Ask: Is there an obvious owner or reason for it being there?`, with "Yes" going to a short screen ("The guides don't say what to do next; follow your workplace plan") and "No" going to keep away and call 111. Before item-au, show C4's three questions, labelled Australian.
   - Whose fault: the template's.

3. **ended: "the app works it out from the two times" is not true.**
   - What is wrong: the runtime does not work out a call length. The Log shows "Call started" and "Call ended" as times, and the person has to subtract one from the other. "Total time" on the Finished screen is the time since the app opened, not the call length.
   - Suggested fix: reword to "The Log shows when the call started and ended; the card asks for the length of the call". Or add a Write box "Duration of call". The runtime could also learn a duration line one day.
   - Whose fault: the template's.

4. **start -> "The threat call has ended": date, time and duration of the call are lost.**
   - What is wrong: on this route "Call started" is never recorded. Yet call-info still says "The date, time and length of the call are in the Log (call started, call ended)". There is no box for the A8 "Date: Time:" or "Duration of call:", or for ANZCTC's "Date and time of call". This route is likely: someone opens the app after the call is over.
   - Suggested fix: add `Write: Date and time of the call, and how long it lasted` on call-info (or on ended). Make the Say true for both routes.
   - Whose fault: the template's.

5. **tell -> "Go to the search or evacuate decision": the caller details can never be written.**
   - What is wrong: choosing this skips voice, sounds and call-info. Nothing on decide, waiting, evacuate, search, stay or handover leads back to them. So the card's A4 to A9 fields are lost for that run, and they are the facts that fade fastest. ANZCTC says this section "should be completed once the caller has hung up" (and once everyone has been told), so it belongs after tell, but it should not be impossible to reach.
   - Suggested fix: add an answer "Write the caller details now" on handover, or on waiting. Or make tell lead to voice with Next, and have call-info end at decide (as now), so the decision is still only a tap away.
   - Whose fault: the template's.

6. **tell: "Trace 111" is used as the quote behind "Call 111 and tell Police".**
   - What is wrong: on the card, "Trace 111 ...." is a field with a blank line to fill in. It is not an instruction to call 111. The NZ web quote ("In an emergency everyone should call 111") already supports the call. The Say admits that the card does not explain "Trace 111".
   - Suggested fix: drop the "Trace 111" quote from the "Call 111" line. Show it as its own field, for example `Write: Trace 111 (card field; ask Police what to put)`, so the card stays complete.
   - Whose fault: the template's (a quote that does not support its line). The guideline has a gap too: the card does not explain the field.

7. **tell: "Members name" is read as the Police member, and the screen says so as fact.**
   - What is wrong: the card prints "Members name:" with no explanation. It could mean the staff member who took the call. The Notes say this is the author's reading, but the screen says "Note the name of the Police member you spoke to", and the box is labelled "Police member's name".
   - Suggested fix: "The card asks for 'Members name' under 'Police advised' (probably the Police member you spoke to)". Label the box "Members name (card)".
   - Whose fault: both. The guideline is unclear, and the template states its own reading as fact.

8. **item: ANZCTC "advise security" is dropped.**
   - What is wrong: C4's "Call Triple Zero '000' and advise security;" has two parts. The Notes drop the whole line because NZ's "call 111" covers the first part. But "advise security" is not covered on the item route: there is no "Manager or security told" step there, unlike tell and online.
   - Suggested fix: on item-au, add `Do: Australian guide: tell security.` with a `Record: Manager or security told` button, and quote the line. Write 111 for 000 the same way the other screens do.
   - Whose fault: the template's.

9. **decide: the hedge "Generally speaking" is dropped, and "credible" becomes "real".**
   - What is wrong: the source says "Generally speaking, all threats should be deemed credible until proven otherwise". The app says "It says to treat every threat as real until shown otherwise". That is stronger than the source (LESSONS trap 10).
   - Suggested fix: "It says that, generally speaking, every threat should be treated as credible until shown otherwise".
   - Whose fault: the template's.

10. **Field order is not the NZ card's order (voice, sounds, call-info).**
    - What is wrong: sex and age (A7) are on the voice screen, before language (A5) and noises (A6). The kind of call (printed beside A6) is on call-info with A8 and A9. Nothing is missing, but someone comparing the screens with the paper card will find the order different.
    - Suggested fix: move "Sex and estimated age" to its own line on sounds, after background noises, or to the top of call-info. Then the order runs A4, A5, A6, A7, A8, A9. Or say in Notes why it was grouped this way.
    - Whose fault: the template's (minor).

11. **Stress and readability during the call: too much on the in-call screens.**
    - What is wrong:
      - "call" has two Record buttons with near-identical names ("Call started" and "Call recording started"), three ticks and a 40-word note about gaps. That is five things to act on while the phone is ringing.
      - q1 adds a comparison with the Australian order and two more quote blocks to the most urgent question.
      - "words" has a "Exact words written down" button that repeats what the Write box already logs.
      - Each "decision" screen has a Record button that repeats the answer the Ask already logged.
    - Suggested fix:
      - Rename "Call recording started" to "Recording on".
      - Move the gap note on "call" to the ended screen, where most of it already is.
      - Move the where/when comparison from q1 to Notes or About (it is already in Notes).
      - Drop "Exact words written down" and the "Decision: ..." Record buttons, or keep only the "... started" ones.
      - Keep one instruction per screen while the caller is on the line.
    - Whose fault: the template's.

12. **search: "Nothing found" goes straight to handover, with no "the guide does not say" line.**
    - What is wrong: neither source says what to do when a search finds nothing (stand down? keep searching? wait for Police?). The app moves on without saying so. This is LESSONS trap 13.
    - Suggested fix: on handover, or on a short screen after "Nothing found", say: "The guides do not say what to do if nothing is found. Follow Police and your workplace plan."
    - Whose fault: the guideline's gap. The template doesn't say it.

13. **Left out: the C5 secondary-explosions warning and the C3 search plan.**
    - What is wrong: C5's "Be aware that secondary explosions may occur at or near the original blast site, especially as rescue personnel arrive" is an instruction ("Be aware"). Notes say it was left out on purpose, as after-a-blast content. C3's "Create a plan that assigns staff members certain areas" is preparation, and is covered only by "Use your workplace's search plan".
    - Suggested fix: fine to leave both out. Optionally add the C5 line as an Australian Warning on evacuate and evacuate-part, next to the assembly-point warning, since it is about the same risk.
    - Whose fault: neither. This is a choice of scope, written down in Notes.

14. **Info: wording the author added.**
    - What is wrong: "STD (toll)" adds a gloss the card doesn't have. The Warning banner's "Best used by a colleague beside the person on the phone" is the app's own design advice. Both are harmless and don't change meaning, but neither is quoted.
    - Suggested fix: leave as is. Optionally mark them as app wording.
    - Whose fault: the template's (minor).

## Checked with no problem found
- Every Australian rule (000, 25 m, 100 m, 500 m, line of sight, CCTV) is labelled Australian, either on the line or in the screen's opening sentence. 111 is used everywhere and the app explains why, and no 000 line is shown as saying 111.
- No automatic decision: search or evacuate is asked as what the employer or incident manager decided, and "Not decided yet" waits.
- These "do not / unless / only" lines are kept: "Do not reply to, forward or delete", "don't touch it", "Do not touch, tilt or tamper", "if a vehicle ... at least 500 metres", "if possible, made in consultation", "If you are able to, record the call", "if displayed".
- All five steps for an email or social-media threat are there, in ANZCTC order, with "save and print".
- The web-log time span is rightly not shown, because its exact words were not captured.
- The gaps are said on screen: hanging up or keeping the line open, the evacuation distance for a phone threat, the chart that was not read, and the age of the card.
- Version, Sources and the empty "Reviewed by:" are all correct.

Missed instructions: 3 (the C4 item assessment questions with their "if the item is suspicious" condition, finding 2; C4 "advise security", finding 8; the C5 secondary-explosions warning, finding 13, left out on purpose). Also partial: the A3 "Trace 111" field and the A8 date, time and duration have no box on some routes (findings 4 and 6). C3 "create a plan" is preparation and is not counted.

## Fixed after review
Rebuilt: 33 steps, all reachable; 0 fix, 0 check, 14 info; 116 of 116 quotes exact. Explorer: 367 routes, 42 endings, no problems; `npm test` 36 of 36 pass.

1. Fixed. The Australian 25 m warning (mobiles and radios) is now on `item`, before 111 is called. The screen says the NZ page gives no distance and doesn't say where to call from. No distance was invented.
2. Fixed. `item` now asks "Is there an obvious owner, or a reason for it being there?":
   - Yes goes to `item-owned`. It quotes the B2 condition, says the guides give no next step, and offers "Still worried: treat it as unowned".
   - No goes to `item-noowner`: keep people away, call 111, the three C4 questions, and the description and location boxes.
   - At the end of `item-noowner`, "Yes to any" goes to `item-au`. "No to all three" goes to `item-not`, which says the guides don't cover this and Police direct.
3. Fixed. The claim that the app works out the call length is gone. `ended` now says the Log shows both times when both were tapped.
4. Fixed. `ended` now has a box for "Date and time of the call, and how long it lasted", quoting A8, so this is captured on every phone route. The wrong sentence on `call-info` was removed.
5. Fixed. The caller details can now be reached from `tell`, `waiting` ("Write the caller details now") and `handover` ("Caller details not written yet").
6. Fixed. "Trace 111" is no longer the quote behind calling 111. It is shown as its own card field, with an "Ask Police what to put" line and a box.
7. Fixed. The screen now says the card doesn't say whose name, "perhaps the Police member you spoke to". The box is labelled "Members name (card)".
8. Fixed. `item-au` has "Australian guide: advise security", quoting C4, with a "Manager or security told" Record and a line saying the NZ equivalent of Triple Zero is the 111 call already made.
9. Fixed. The `decide` line now keeps "generally speaking" and "credible".
10. Fixed. The details screens now follow the card's order: A4 on voice; A5, A6 and the kind of call on sounds; A7, A8 number called and A9 on call-info. Left on purpose and explained in Notes: A2 (exact words) still comes before A1 (questions), as ANZCTC does, and the A8 date, time and duration sit on `ended`.
11. Fixed:
    - `call` now has one Record ("Call started") and two ticks; the recording tick is merged into the number tick.
    - The gap note moved to `ended`.
    - The where/when comparison moved from q1 to `q-extra`.
    - The "Exact words written down" Record and the "Decision: ..." Records were dropped; the decision answer is already logged.
12. Fixed (the gap is the guideline's). "Nothing found" now goes to `search-none`, which has a Record and says plainly that the guides don't say what to do, so follow Police and the workplace plan.
13. Partly fixed. The C5 secondary-explosions line is now an Australian Warning on `evacuate` and `evacuate-part`. C3 "create a plan" is still left out as preparation, as Notes say.
14. Partly fixed. "(toll)" was removed from STD. The banner's design advice stays, and Notes say it is the app's own wording.

Left: only the guideline's own gaps listed in the verdict, and the web-log time span (exact words not captured). Missed instructions now: 0. The C4 questions, "advise security" and the C5 warning are all in the app.

