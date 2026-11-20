# Review: 15-seizure-first-aid (seizure first aid, NZ: Epilepsy NZ, St John, ANZCOR, KidsHealth; 5 minutes, 111)

Verdict: Faithful and honest on numbers and on source differences. All 102 quotes are exact. Every time and phone number comes from the sources: 5 and 10 minutes, "up to an hour", 111, 0800 611 116 and 0800 374 537. No doses or cluster limits are invented, and the gaps (not breathing, cluster, how long to stay, rescue medicine, handover wording) are said plainly on screen and in Notes. Every screen is short (30 to 62 shown words, with quotes folded away). It needs changes before sign-off. The most serious problems: (1) after "It has stopped", the "not responding? Call 111" reminders keep buzzing after the person has woken up, and on the child screens while KidsHealth says a sleepy child may sleep up to an hour; (2) at 5 minutes the start-screen Timer and the 5-minute reminder buzz together for the same thing, the Timer is lost as soon as the helper leaves the first screen, and both count from when the app opened, not from when the seizure began; (3) urgent cases are hidden: a seizure in water takes two taps (start, then the 111 list, then "In water"), and "roll at once if food, fluid or vomit in the mouth" is only on the "More" screen; (4) "Not breathing normally" followed by "Breathing normally now" goes to "It has stopped", which stops the seizure reminder even if the seizure is still going; (5) KidsHealth's infographic lines (heading unreadable) are used as call-111 triggers without saying so. 5 instructions are missing.

Checked: the template against source.txt (sections A, A2, B, C, D) line by line, and meta.json and findings.json. Built with `node tools/build.mjs guidelines/15-seizure-first-aid`: 20/20 steps reachable, 0 fix, 0 check, 8 info (5 app-wording lines; unused amounts "3 %" and "2 minute", both background; no reviewer; web-fetch copy), 102/102 quotes exact, 6/6 number lines quoted. The app-check worker drove every route: 0 problems, 6 endings, no steps missing. Words shown per screen (quotes folded): during 62, fever 59, not-breathing 59, fever-after 58, recovery 56, handover 56, start 52, plan 52; the rest are under 50. Driven by hand in the fake browser: stops at 2 minutes → after → recovery → waking → recovered → handover → doctor → Finish; reaches 5 minutes on the start screen → five-min → Call 111 → stopped → not responding → Call 111 → ambulance → Finish; 5 minutes on the "More" screen (reminder bar only, no five-min screen); another seizure after 1 minute (not-waking reminders stop, new 5-minute timer and reminder) → five-min → stopped (not-waking reminders restart); child with fever → 111 list → stopped → resting → Finish; in water → not breathing → breathing normally now → after; not breathing from start → breathing normally now → after; stopped → not responding → 11 minutes → waking. No dead ends and no page errors. Record buttons: Seizure started, Seizure stopped, 111 called, Another seizure started. Ambulance arrival is logged by its answer.

## Findings

1. **The "not responding? Call 111" reminders keep buzzing after the person wakes, and during a child's normal sleep (most serious).**
   Where: `after` and `fever-after` (`Remind: after 5 minutes` / `after 10 minutes`). They are stopped only at `handover` (Stop: all) or by `another`. They keep running on `waking`, `recovery` and `called`.
   Source: A "The person is non-responsive for more than 5 minutes after the seizure ends" / B "Allow them to sleep until they are fully recovered, but check for a response every few minutes." / D "After the jerking or stiffness stops, your child will usually sleep for a while (up to an hour)." / D "Most tamariki are sleepy after a seizure, but if they are hard to wake ... see a doctor urgently." / D "your child is not waking up and responding after the seizure".
   Problem: tested. "It has stopped" at 2:00, then "Waking up" at once. At 7:00, on the `waking` screen, the bar turns to "After 5 min not responding? Call 111 ... NOW" and buzzes, although the person is awake. On `fever-after` the same bar buzzes at 5 minutes on the same screen that says "They may sleep up to an hour". No source says whether a person who is asleep but rousable counts as "non-responsive" (Epilepsy NZ) or "not waking" (St John). The app leaves the helper to work out which applies while a buzzer tells them to call. The child bar is labelled "(Epilepsy NZ, ANZCOR)", but the Epilepsy NZ poster is for adults, and the `fever-after` quote is ANZCOR only. After 111 has been called, the 10-minute St John bar still buzzes "Call 111".
   Fix: add `Stop: After` to `waking` and to `called` (all three not-waking reminders start with "After", and nothing else does). On `recovery` and `fever-after`, add a `Say:` along these lines: "The sources do not say whether sleeping counts as not responding. If you cannot wake them, treat it as not responding." Label that line as app wording, or quote B's "cannot be woken up" from What to look for. On `fever-after`, relabel the 5-minute bar "(ANZCOR)" and add a line that KidsHealth gives no time, not just "KidsHealth gives no time for 'not waking'" at the end of a long Say. Note the choice in Notes.

2. **Two clocks for the same 5 minutes; the Timer is lost when the helper moves on; both count from opening the app.**
   Where: `start` and `another`: `Timer: 5 minutes -> five-min` and `Remind: after 5 minutes: Seizure 5 minutes ...`. Record "Seizure started".
   Source: C "Time the seizure." / A2 "Time the seizure if you can (if someone is nearby ask them to assist)" / D "check the time if you can to see how long the seizure lasts".
   Problem: tested. At 5:00 on `start` the Timer shows "due" and the reminder bar shows "NOW" at the same moment, with two buzzes and two log lines. If the helper has tapped any answer (e.g. "More", which most will), the Timer is gone and the `five-min` screen, with its "or follow the timing in their own plan" line, is never shown. Only the bar appears. Notes admit "both may buzz". Also, both clocks start when the screen opens, and the "Seizure started" Record is a separate tap. A helper who opens the app a minute or two into the seizure is a minute or two late at "5 minutes". Nothing on screen tells them to allow for that.
   Fix: drop the `Timer:` from `start` and `another`, and keep the reminder, which survives moving between screens. Put a "Still going at 5 minutes" answer on `start`, `during`, `called` and `another` that goes to `five-min`, so that screen can always be reached. Add a short `Say:` on `start`: "The clock counts from when you opened this screen. If it started earlier, allow for that." Label it as app wording. Or drop the "Seizure started" Record, since the Start tap is already logged, and say the log time is when you opened the app.

3. **Seizure in water is two taps deep, and "roll at once if food, fluid or vomit in the mouth" is hidden behind "More".**
   Where: `start` answers; the `water` step is reached only from `call-list` and `called`. The food/fluid/vomit roll is a sub-bullet on `during`.
   Source: A2 "A seizure in water (pool, bath, ocean) is a life threatening emergency and an ambulance (111) should always be called as soon as possible." / C "A seizure in water is a life-threatening situation." / A "Roll onto side after jerking stops OR immediately if food / fluid / vomit in mouth" / A2 "If they have food, fluid or vomit in their mouth roll them on to their side immediately".
   Problem: the water screen holds the urgent "keep their face above the water" action, but the path to it is start → "Call 111? See the list" → read the list → "In water". On `call-list`, the vomit line is only a reason to call 111. The action ("roll them onto their side immediately") is only on `during`, inside a three-way "sources differ" list, behind the start answer "More: their side, mouth, plan".
   Fix: add "In water" as a start answer (second, after "Not breathing normally"), and also on `during` and `another`. Add a `Do:` line on `start` (or a start answer "Food, fluid or vomit in the mouth" going to a short screen): "Food, fluid or vomit in the mouth? Roll them onto their side now." Quote A2.

4. **"Breathing normally now" goes to the "It has stopped" screen even if the seizure is still going; several screens have no "not breathing" exit.**
   Where: `not-breathing` answers ("Breathing normally now" -> `after`, "Ambulance arrived"). `called`, `five-min`, `another`, `fever-call` and `confused` have no "Not breathing normally" answer. `another` and `five-min` have no "In water".
   Source: C "shallow breathing or breathing may stop temporarily" / A "Person has breathing difficulties after jerking stops" / C "If unresponsive and not breathing normally, follow ANZCOR Basic life support flow chart."
   Problem: `not-breathing` is the second answer on the first screen, so it is mostly reached during the seizure. Tested: start → Not breathing → Breathing normally now lands on `after`. That runs `Stop: Seizure`, which ends the 5-minute bar and starts the not-waking bars, even though nobody said the seizure stopped. The `after` screen's Record says "Seizure stopped", which invites a wrong time in the log. A helper on `called` or `another` whose person stops breathing has to go back or go round.
   Fix: on `not-breathing`, give "Breathing again, seizure still going" -> `during` and "Breathing again, seizure has stopped" -> `after`, and add "Another seizure started" -> `another`. Add "Not breathing normally" -> `not-breathing` to `called`, `five-min`, `another`, `fever-call` and `confused`.

5. **KidsHealth's infographic lines are used as call-111 triggers, but their heading could not be read.**
   Where: `fever-call` ("2 or more in a row", "Head injury or other injury"); `another` (quote "2 or more seizures in a row" (KidsHealth)); `fever` ("Video it if you can").
   Source: D "[Infographic] - Your child's seizure lasts longer than 5 minutes / - Your child has 2 or more seizures in a row / - Your child has had a head injury or injured themselves during the seizure". The source note says the "infographic heading unreadable".
   Problem: the list looks like a call-ambulance list, because the next lines say "If the seizure lasts more than 5 minutes call an ambulance". But it could just as well be "see a doctor if". The app shows these lines as "Child: call 111 if" with no flag, which silently settles an unknown (trap 13). It is safe in direction, and injury is also an Epilepsy NZ and ANZCOR trigger, so the risk is small, but it should be visible.
   Fix: in Notes, and in one short line on `fever-call` ("2 or more in a row and injury come from a KidsHealth picture whose heading could not be read"), say the infographic heading is unknown. Add the ANZCOR injury quote ("concerned about any aspect of the person's care such as injury") to the injury line so it does not rest on the infographic alone.

6. **KidsHealth's "lie your child down on their side" during the seizure was picked away, not shown.**
   Where: `fever` (no side line); `fever-after` uses only the after-seizure wording. Notes (2) say "the fever screens use the after-seizure wording".
   Source: D What to do: "lie your child down on their side" (listed with "wait a few minutes for the seizure to stop") / D Key points: "after the seizure, lie your child down on their side, in the recovery position" / St John febrile: "When the convulsion is over ... roll the child onto their side".
   Problem: KidsHealth's own two lines differ, and the adult `during` screen shows every source's timing. The child screen silently uses one (trap 5).
   Fix: add to `fever`: "KidsHealth's 'What to do' says lie your child on their side; its key points and St John say after the seizure." Quote both.

7. **Missed instruction: "If possible, ease the person's fall."**
   Where: not on `start` or `during`. Also not shown: "Lay the person down" from the same ANZCOR line.
   Source: C "If possible, ease the person's fall." / C "Lay the person down and turn the person on the side when practical."
   Fix: add to the `start` `Do:` line: "If you can, ease their fall." Quote C. Counted as 1 missed instruction.

8. **Missed instruction: watch their breathing during the seizure, and keep re-checking it afterwards.**
   Where: `start`/`during` (no breathing watch); `recovery` (only "check for a response every few minutes").
   Source: A "Observe and monitor breathing" / C "Maintain an airway and frequently reassess the person, particularly their breathing" / C "Frequently reassess, particularly their airway and breathing".
   Problem: breathing is checked once on `after` and then not mentioned again. `recovery` asks about a response, not breathing. A person lying asleep on their side is exactly when breathing should be watched.
   Fix: add `Do: Watch their breathing.` on `start` (quote A) and `Do: Keep checking their breathing and airway often.` on `recovery` and `fever-after` (quote C). Counted as 1 missed instruction.

9. **Missed instruction: wheelchair or stroller brakes on.**
   Where: left out "to keep the during screen short" (Notes, last line).
   Source: A2 "Make sure the wheelchair or the stroller is secure, by putting the brakes on."
   Problem: it is a safety action, not background. Screen length is not a good reason here, because `during` shows only 62 words.
   Fix: add one line on `start` or `during`: "In a wheelchair or stroller? Put the brakes on." Note that the rest of that section was not captured. Counted as 1 missed instruction.

10. **Missed instruction: in water, tilt the head back for a clear airway and follow the ambulance call taker.**
    Where: `water` (Notes: "Tilt the person's head back" left out on purpose).
    Source: A2 "Tilt the person's head back to ensure a clear airway" / C "Support the person in the water with the head tilted so the face is out of the water." / A2 "Follow the instructions of the ambulance operator, who will instruct you step-by-step while an ambulance is dispatched." / A2 "Assistance from others or use of a floatation device may be useful when removing a person from water."
    Problem: keeping the face above water and keeping the airway clear are two separate actions, and both sources give the head tilt. The water screen is the one screen where "follow the call taker" matters most, and it does not say it. The water screen's "Out, and it has stopped" also joins two separate events. A helper who has the person out while they are still jerking has no answer.
    Fix: change the `Do:` to "Support their head: face above the water, head tilted back." Quote A2 and C. Add "Follow the 111 call taker's instructions" (A2) and "Get others or a float to help lift them out" (A2). Split the answer into "Out of the water, still going" -> `during` and "Out, and it has stopped" -> `after`. Counted as 1 missed instruction.

11. **Missed instruction: stay calm.**
    Where: not on `start` or `fever`.
    Source: A2 "Stay calm and remain with the person" / D "the most important thing is to try to keep calm, and keep your child safe".
    Fix: `start`: "Stay calm and stay with them." (quote A2). `fever`: "Try to keep calm and keep your child safe." (the current quote "keep your child safe" is cut from this very sentence). Counted as 1 missed instruction.

12. **"Breathing difficulty" drops "after jerking stops".**
    Where: `call-list` bullet "Injured, food or vomit in the mouth, or breathing difficulty". Quote "breathing difficulties".
    Source: A "Person has breathing difficulties after jerking stops".
    Problem: the qualifier is cut from both the line and the quote (trap 10). During the jerking, C says "shallow breathing or breathing may stop temporarily", so a helper may call for something the poster sees as expected. Calling is the safe direction, so this is minor, but the quote should be whole.
    Fix: "or breathing difficulty after the jerking stops", quoting the whole poster line. St John's "not breathing well" and KidsHealth's "having trouble breathing" have no qualifier and can be quoted alongside.

13. **Duplicate taps: answer and Record on the same screen.**
    Where: `after`/`fever-after` (answer "It has stopped" plus Record "Seizure stopped"); `start` (Start tap plus Record "Seizure started"); `another` (answer "Another seizure started" plus Record of the same name).
    Problem: the answer is already logged with its time (tested). The Record adds a second, separate tap that a helper with busy hands will often skip, so its count can disagree with the log. The handover screen asks for "how many seizures", which the log answers anyway.
    Fix: keep the Records only where no answer logs the event (`called` and `not-breathing` "111 called"). Or keep them and say in Notes that the answer lines are the times to trust. This is the same pattern as asthma finding 7.

14. **Small points (no count).**
    - Sources list: the Epilepsy NZ "Seizure First Aid" page (https://epilepsy.org.nz/Seizure-First-Aid) is quoted for "serious injury", "diabetes or an underlying health condition", "(or there is a cluster of seizures)" and "(or follow the timing in their personal SMP)", but only the tonic-clonic URL is listed. Add the second `Source:` line.
    - `start` warning merges St John's plain "DO NOT move the person, or try to restrain them" with Epilepsy NZ's "unless in danger" and ANZCOR's "unless this is essential to avoid injury". The result is fine, but say in Notes that St John has no "unless".
    - St John's "check for a MedicAlert pendant or bracelet" is left out on purpose. It is what tells a stranger that the `plan` route (St John: no ambulance for known epilepsy under 5 minutes) applies. Consider one line on `plan`.
    - `confused` has no way back if jerking starts. ANZCOR says a focal seizure "may sometimes progress to a generalised seizure". Add "Jerking started" -> `during`.
    - A child who has another seizure goes to `another` -> `after`, the adult screens. The content still applies (ANZCOR covers children), but St John's "nothing to drink until fully conscious" and KidsHealth's sleep line are lost. Consider a "child with a fever" answer on `another`, or accept this and note it.
    - `unresponsive` has no "Another seizure started" answer.
    - Gaps (not breathing, cluster limit, how long to stay, what to tell 111, handover) are said on screen and in Notes. Good, keep them.

Missed instructions: 5 (findings 7, 8, 9, 10, 11)

## After the review (fix round 1)
Fixed: every finding, including all 5 missed instructions. One clock for the 5-minute seizure limit (the reminder
bar; timers removed); the "not waking" bars stop once the person wakes or 111 is called; "In water" and "roll at
once if vomit is in the mouth" are on the first screen; "breathing again" no longer assumes the seizure stopped;
"Not breathing normally" is an answer on every screen that lacked it; KidsHealth picture lines are labelled.
The extra Record buttons were dropped because each screen visit is already logged with its time.
Left as is: the 5-minute screen is not an answer on the start, called or another-seizure screens (111 is already
due or called there); the "not waking" bars do not restart if the person wakes and then stops responding again;
the start and child-with-fever screens are about 90 words. Build after fixes: 0 fix, 0 check, 119 of 119 quotes exact.
