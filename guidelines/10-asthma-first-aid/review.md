# Review: 10-asthma-first-aid (asthma attack first aid, NZ: 2 or 6 puffs, 6 breaths, 6 minutes, 111)

Verdict: Faithful and careful on numbers (47/47 quotes exact, every dose, breath count, time and phone number comes from the NZ sources; no invented thresholds; Australian 4-4-4 and 000 never used). The source differences are explained honestly in Notes. It needs changes before sign-off. The most serious problems: (1) when the person is not improving at 6 minutes, the app does not say "give 6 puffs now", and the reminder starts a new 6-minute count, so the first repeat can come about 12 minutes after the first puffs; (2) the known-allergy / adrenaline-first case is hidden behind the severity question, so a person with severe signs never sees it, and the screen never actually says "dial 111"; (3) "not breathing" is not on the first screen, and the severe route sends a non-breathing person to "Give 6 puffs". Also 4 instructions are missing, the age 12+ line is half-told, and every main screen is over 110 words.

Checked: the template against source.txt (sections A, B, C, D, E, E2) line by line, and meta.json, findings.json. Built into a scratch folder (`buildGuideline`: 14/14 steps reachable, 0 fix, 0 check, 8 info, 47/47 quotes exact, 5/5 number lines quoted). The explorer drove 118 routes, saw all 14 steps, reached 12 endings, no problems or page errors. Driven by hand in the fake browser: mild → 2 puffs → 6-minute timer runs out → improving → all OK → Finish; moderate → 6 puffs → timer → not improving → call 111 → reminder (6:00 countdown, DUE at 6:01, Done restarts it) → ambulance arrived (reminder stops, still stopped 7 min later); severe → call now → Next → 6 puffs → "Getting worse" during the timer → call 111 → not breathing → ambulance; mild → no reliever → reliever here now → 6 puffs; not sure → it is asthma → sit. The Record button counts taps and times ("2× · last 0 s ago"). Every route ends at handover or Finish; no dead ends.

## Findings

1. **No "give 6 puffs now" when not improving at 6 minutes; the first repeat is pushed to about minute 12 (most serious, trap 6).**
   Where: `check` → "No, they are not improving" → `call-111`; `Remind: every 6 minutes`.
   Source: D "after 6 minutes, repeat the whole sequence of 6 puffs." / A "If not improving after 6 minutes, call an ambulance ... Continue to use the reliever inhaler – 6 puffs every 6 minutes until help arrives." / A "REMEMBER ... repeat every 6 minutes."
   Problem: at minute 6 a repeat dose is due. The screen says only "Keep giving 6 puffs every 6 minutes", and the reminder bar shows a fresh 6:00 countdown from the moment the screen opens (tested). A frightened helper will wait for the bar, giving the second set at about minute 12. Notes says "the reminder starts when the not-improving screen is reached" but does not see this effect. On the "Getting worse" path from `wait` (e.g. at minute 2) the next prompt lands at minute 8, which is closer to right, so the two paths give different timing.
   Fix: make the first line of `call-111` a `Do:` "Give 6 puffs now, one at a time, 6 breaths per puff" (quote D's "repeat the whole sequence of 6 puffs"), then the 111 line, then "Then 6 puffs every 6 minutes". Say in Notes that the reminder counts from this screen, so the "now" line carries the minute-6 dose.

2. **Known allergy (adrenaline first) is hidden behind the severity question, and its screen never says to dial.**
   Where: `start` third answer "Not sure it is asthma, or they have a known allergy" → `not-sure`.
   Source: E "DIAL TRIPLE ZERO (000) FOR AN AMBULANCE IMMEDIATELY IF THE PERSON: ... is unsure if it is asthma / has a known allergy to food, insects or medication and has SUDDEN BREATHING DIFFICULTY, GIVE ADRENALINE FIRST (if available)".
   Problem: (a) the start screen asks "Is any of these [severe signs] true?". A person with a known allergy who is gasping will rightly tap "Yes: dial 111 now" and go to puffs; the word "FIRST" in the source is lost. Two decisions are mixed on one question. (b) On `not-sure` the only action line is "In New Zealand, the ambulance number is 111." It reports what Australia "says" but never tells the user to dial. E's instruction is "DIAL ... IMMEDIATELY". (c) After adrenaline, neither answer fits ("It is asthma" / "ambulance arrived"); E does not say what comes next, and the screen does not say that it does not.
   Fix: ask the allergy question before or with the severe signs, e.g. a first screen "Do they have a known allergy (food, insects or medication) and sudden breathing difficulty?" → `not-sure`, so the severe "Yes" cannot skip it. On `not-sure` make the action `Do: Dial 111 now.` (keep the "Asthma Australia, not NZ" label). Add "The guidance does not say what to do after adrenaline; tell the 111 call taker" and an answer "Adrenaline given / not available: carry on with asthma first aid" → `sit`. Note in Notes.

3. **"Not breathing" and other NZ 111 signs are missing from the first screen; a non-breathing person is sent to puffs.**
   Where: `start` list; `call-now` → `puffs-6` → `wait` (no "not breathing" answer until `call-111`).
   Source: D "Call 111 if your child: is floppy / is very tired or less responsive / is not breathing / has blue lips and tongue." D severe: "breathe rapidly", "have the muscles between their ribs sucking in (in-drawing)". C: "Complaining that the reliever medicine is not working". A: "If the child has severe asthma or is frightened, dial 111 ...".
   Problem: "is not breathing" and "very tired or less responsive" are not in the list, and the only route to `not-breathing` is from `call-111`. A person who is not breathing at the start goes Yes → call-now → "Give 6 puffs" → a 6-minute wait. The left-out D signs (rapid breathing, in-drawing) are named in Notes, but "very tired", "not breathing" and C's "complaining the reliever is not working" are not. The bullet list also drops A's "has severe asthma" (the quote has it, the bullet does not). Counted as 1 missed instruction.
   Fix: add "Not breathing" as a separate first answer on `start` → `not-breathing` (which already says to tell the 111 call taker). Add "Very tired or less responsive" to the bullets (D). Add C's "says the reliever is not working" to the `wait` warning. Add "not breathing or not responding" as an answer on `wait` and `check`.

4. **Age 12+ line: only half of poster B is shown, and the user is not told which to follow.**
   Where: `puffs-2`, `puffs-6` ("Aged 12 or over? The Foundation's poster for that age says instead: ...").
   Source: B "Help: If not improving, dial 111 for an ambulance immediately. Continue to use the RELIEVER inhaler every few minutes until the ambulance arrives." / B "Note: If a spacer can be used ..., inhale 1 puff through a spacer and take 6 breaths per puff." / D "take 6 puffs (adults and tamariki)".
   Problem: the line shows B's dose words but not B's timing: B has no 6-minute wait and says to dial 111 as soon as the person is not improving. A 12+ user reads "says instead", then is put on a 6-minute timer anyway, with nothing on screen saying B gives no wait. "Says instead" with no guidance leaves a frightened helper with two instructions and no way to choose. Keeping it as one line (no second route) is safe and honest in Notes, but on screen it should say what differs and that Health NZ (D) uses 6-6-6 for adults too. B's examples include Symbicort, Vannair and DuoResp (where one dose differs); the "follow their action plan" line covers this, which is fine. Counted as 1 missed instruction (B's Help step).
   Fix: replace with: "Aged 12 or over? The Foundation's adult poster says give one dose at a time, repeat if needed (up to 6 times for moderate or severe), and dial 111 as soon as they are not improving. It gives no wait time. Health NZ gives 6 puffs, 6 breaths, 6 minutes for adults too." Quote B's Help line. Better still, move it to a tap-to-open detail so the main screen stays short.

5. **Missed instruction: "Encourage your child to breathe as normally as possible."**
   Where: not in `puffs-2` / `puffs-6`. Also C's "six slow breaths" loses "slow".
   Source: C "Encourage your child to breathe as normally as possible." / "Make sure they take six slow breaths for each puff."
   Fix: add one short `Say:` on the puff screens ("Help them breathe as normally as possible; 6 slow breaths per puff"). Counted as 1 missed instruction.

6. **Missed instruction: see a doctor soon if attacks are more frequent or worrying.**
   Where: `all-ok`.
   Source: C "If your child's attacks are becoming more frequent or worrying, see your doctor as soon as possible."
   Fix: add one line after "Always see a doctor after an asthma attack". Counted as 1 missed instruction.

7. **Two buttons with the same words on the puff screens; and two separate "done" taps on the 111 screen.**
   Where: `puffs-2`/`puffs-6` (Record "2/6 puffs given" and answer "2/6 puffs given: start the 6-minute wait"); `call-111` (Record "6 puffs given" and reminder bar "Done").
   Problem: tapping the answer does not log the Record (tested: the log shows only the answer). On `call-111` the user must tap the Record button and the reminder's Done separately to log the dose and restart the count; tapping only the Record leaves the bar saying DUE. A frightened user will tap one.
   Fix: on the puff screens, drop the `Record:` (the answer is already logged with the time) or rename the answer "Done: start the 6-minute wait". On `call-111`, say on screen "Tap Done on the reminder bar after each set" or drop the Record there (the reminder's Done is logged). If the runtime could tie the two together, that is a change for a later run.

8. **No way out if the reliever runs out, or if they stop breathing, during the wait.**
   Where: `wait`, `check`, `call-111`, `monitor`.
   Problem: "There is no reliever inhaler here" is only on the puff screens. "Not breathing" is only on `call-111` (see 3). The wait screen offers "Getting worse" and "ambulance arrived" only.
   Fix: add "Not breathing or not responding" → `not-breathing` on `wait` and `check`; consider "The reliever has run out" → `no-reliever` on `call-111`.

9. **The severity question on `sit` has no severe answer, and "Moderate" hides that it covers severe.**
   Where: `sit` answers "Mild ..." / "Moderate: loud wheeze, hard to breathe, only short sentences".
   Source: A "MODERATE OR SEVERE SYMPTOMS Treat with 6 puffs".
   Problem: someone who answered "No" at start and then gets worse (or misjudged) sees only mild or moderate. Small risk, but the label should match the source.
   Fix: "Moderate or worse: loud wheeze, hard to breathe, only short sentences".

10. **Too many words per screen for a frightened user (usability).**
    Where (words on screen, app lines + quotes): `puffs-6` 132, `puffs-2` 127, `call-111` 127, `start` 116, `not-sure` 106, `monitor` 94, `no-reliever` 87. Others are under 80.
    Problem: in an emergency the helper must find "6 puffs, one at a time, 6 breaths" inside about 130 words. The quotes roughly double each screen. `start` lists six signs, each with a quote, before the question.
    Fix: on puff screens put the dose line first (`Do:`), then "spacer when possible"; move the action-plan line and the 12+ line into a detail. On `call-111` put "Give 6 puffs now" first and the "will not overdose" line last. On `start`, keep the bullets and quote only once at the end (one quote for A's list, one for D's).

11. **Small wording points (no count).**
    - `not-sure` and `no-reliever` say "Asthma Australia's guidance (not the NZ posters)". Good and honest; keep it. Fine to replace 000 with 111 as done.
    - `sit` and `call-now` use B's "Be calm and reassuring" for all ages; D also says "reassure them", so it is supported. Could quote D instead to avoid mixing the 12+ poster into the child line.
    - D's "If you are having the attack, get someone to stay with you" is left out; the app is for helpers (Audience), so this is fine, but mention it in Notes as left out on purpose.
    - Handover and not-breathing app wording are labelled as app wording / gaps (trap 13). Good.

Missed instructions: 4 (findings 3, 4, 5, 6)

## Fixed in round 1
1. `call-111` now starts with "Give 6 puffs now, one at a time, as before" (D: "repeat the whole sequence of 6 puffs."), then the 111 call, then "Repeat every 6 minutes until help arrives (tap Done on the reminder)". The check answer reads "No: give 6 more puffs and call 111". Notes explain that the reminder counts from this screen and that the "now" set carries the minute-6 dose, and that the sources don't say whether an early "worse" path should keep the original rhythm.
2. New `allergy` screen. It is reached from a start-screen answer placed above the severe-signs answer, and again from `call-now`, so a person with severe signs still sees it. It shows "Dial 111 now" as the action, the labelled Asthma Australia "GIVE ADRENALINE FIRST (if available)" line, and says the guidance doesn't say what comes next (follow the 111 call taker). The answer "Adrenaline given, or none here" goes on to asthma first aid. `not-sure` (now its own screen, reached from `sit`) also says "Dial 111 now".
3. The start screen has a "Not breathing" answer first. The bullets now include A's "has severe asthma", D's "very tired or less responsive", floppy, rapid breathing and in-drawing. C's "Complaining that the reliever medicine is not working" is in the `wait` warning. "Not breathing" exits were added on `call-now`, `wait`, `check`, `allergy`, `not-sure` and `no-reliever`. `not-breathing` now says to call 111 (D: "is not breathing").
4. Age 12+ is a separate screen (`adult-12`, from "Aged 12 or over? Read this" on both puff screens). It says one dose at a time, up to 6 times; dial 111 at once if not improving; that no wait time is given; and that Health NZ uses 6-6-6 for adults too and the app follows it. It has a "Not improving: dial 111" answer. B's Help line is quoted.
5. Both puff screens say "6 slow breaths per puff" (C: "six slow breaths for each puff.") and "Help them breathe as normally as possible" (C).
6. `all-ok` adds "Attacks more frequent or worrying? See a doctor as soon as possible." (C).
7. All Record buttons are removed. The answer buttons are now "Done: start the 6-minute wait", and the call-111 screen says to tap Done on the reminder (which is logged). Tying Record to an answer would need a runtime change; not done here.
8. "Not breathing or not responding" was added on `wait` and `check`, and "Reliever has run out" on `call-111`. No "reliever run out" exit on `wait`: puffs are not due during the wait.
9. The `sit` answer now reads "Moderate or worse: loud wheeze, hard to breathe, short sentences only".
10. The template has no tap-to-open detail line type, so screens were trimmed instead, with shorter quotes and the 12+ text moved to its own screen. Words per screen, including quotes (shown words only in brackets): start 88 (58), puffs-2/puffs-6 90 (52), call-111 90 (60), adult-12 86 (61), all-ok 78, no-reliever 70, sit 69, wait 68; the rest are under 65. The dose line now comes first on the puff screens, and "will not overdose" is last on `call-111`.
11. The reassure line now quotes D ("stay with them and reassure them.") instead of B. D's "get someone to stay with you" is noted in Notes as left out on purpose. The labelled Asthma Australia lines and the 111-for-000 swap are kept.

Rebuilt: 16/16 steps reachable, 0 fix, 0 check, 10 info (app-wording lines with no quote; the Australian 4-breath and 4-minute amounts not used; no reviewer; web-fetch copy), 56/56 quotes exact. Explorer: 257 routes, all 16 steps seen, 18 endings, no problems.
