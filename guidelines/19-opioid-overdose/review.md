# Review: 19-opioid-overdose

Verdict: Pass with fixes. The template is faithful line by line: 96 of 96 quotes are exact, every Australian line is labelled, and the main differences between sources are shown, not hidden. But the 2-minute timer is not justified honestly, and it leads straight to a screen that says "Give another dose". The 20-minute bar says it counts "since first dose", which is not always true. The rescue-breathing screen has no honest answer for "still not breathing". The woke screen never says the person still needs the ambulance. Fix findings 1 to 6 before publishing; the rest are smaller.

Checked by: an independent reviewer (AI) on 20 Nov 2026. I compared template.md with source.txt (sources A to H) and the meta.json sourceNote line by line, and checked it against docs/LESSONS.md. Then I built the app: 11 steps, all reachable; 0 fix, 0 check, 10 info; 96 of 96 quotes exact; 13 of 13 number lines quoted. I ran the explorer (202 routes, 18 endings, no problems). In the fake browser I tapped through these routes by hand:
- kit -> dose -> timer -> another dose -> woke -> dropped -> dose -> handover -> Finished
- kit -> six dose loops -> not breathing -> rescue breathing -> back to check
- no kit -> not breathing -> no kit -> woke -> dropped
- not sure
- the 20-minute bar: when it starts, when it fires, and what happens after OK

What worked: Record buttons log the clock time and count. "Naloxone dose given" showed "3×" after three doses, and "6×" after six loops. The Log keeps every tap with its time. The 2:00 timer counts down (0:59 after 61 s), buzzes at zero and offers "Time's up: continue" to the check screen. It restarts on each visit to wait. Stop: all on handover stops the 20-minute bar.

## Findings

1. **wait / check: the 2-minute timer is the one value that contradicts the NZ kit, and its explanation is not honest.**
   - What is wrong: the Notes call 2 minutes "the shortest time Healthify's printed range allows". They say the clash with the kit pamphlet is "a real contradiction between the two main NZ sources". But the three NZ sources for injectable naloxone do share a time:
     - Healthify: "If the person doesn't respond in 2 to 5 minutes, you will need to give a second dose."
     - Kit pamphlet: "If there has been no response after 3-5 minutes administer another dose of naloxone"
     - The Level: "If after 3 minutes the person is still unconscious (not 'coming to'), you can repeat the above steps"

     3 minutes fits all three. The contradiction comes from choosing 2 minutes, not from the sources. 2 minutes is supported only by the lower end of Healthify's range, by Nyxoid (not available in NZ), and by NSW (Australian, a different product). Worse, when the timer ends, the next screen (check) opens with "No response yet? Give another dose with a new ampoule, needle and syringe." So in practice the app does give the next dose at 2 minutes, even though the wait screen says "It is not a rule to give the next dose at 2 minutes". A frightened bystander will do what the button after the timer says. This is LESSONS traps 1 and 6.
   - Suggested fix: set `Timer: 3 minutes -> check`. Explain it honestly in the step and in Notes: "3 minutes is the only time inside all three NZ sources for the injection: Healthify 'in 2 to 5 minutes', the kit pamphlet 'after 3-5 minutes', The Level 'after 3 minutes'." Keep the list of differences, but remove "the kit pamphlet says 3-5 minutes, so you can wait longer", and remove the "real contradiction" sentence from Notes. If the author keeps 2 minutes, the check screen must not start with "Give another dose". It should say something like "Kit pamphlet: give another dose if there has been no response after 3-5 minutes".
   - Whose fault: the template's. The sources do differ, but they overlap.

2. **give / woke: the 20-minute bar does not count "since first dose", and the screen says it does.**
   - What is wrong: the woke screen says "The 20-minute bar counts from the first dose you tapped", and the bar's text is "Naloxone 20 min since first dose". In the fake browser:
     - The bar starts when the give screen opens, before any dose is tapped. If someone takes 3 minutes to prepare the ampoule, the bar fires 3 minutes before 20 minutes since the dose.
     - After the bar fires and the person taps OK, it is removed. The next visit to give (dropped -> "Give another dose") starts a new 20-minute bar, with the same "since first dose" text. That bar actually counts from the latest dose. The Notes say it "is not restarted by later doses", which is only true until OK is tapped.
   - Suggested fix: reword the bar to "Naloxone may wear off about now (20 min)". Change the woke line to "The 20-minute bar starts when you first open the give screen; it starts again if you give a dose after it has gone off." Fix the Notes to match. The quotes stay as they are: "Naloxone only lasts 20 minutes and they could drop again." (Healthify). If a dose-tap start is wanted, that needs a runtime feature (a reminder started by a Record), which is a 3c question.
   - Whose fault: the template's (the wording). The runtime cannot start a bar from a Record tap.

3. **breathe: no honest answer for "still not breathing", and no way back to another dose.**
   - What is wrong: the answers are "Breathing, not awake, I have a kit", "Breathing, not awake, no kit", "They woke up" and "Ambulance arrived". If they are still not breathing, which is the most dangerous case, no answer fits. The helper with a kit has to tap "Breathing, not awake" to reach another dose. The sources say to keep giving naloxone while waiting:
     - The Level: "If you know how to do CPR, you can do this while you're waiting for the naloxone to take effect."
     - NSW (Australian): "If person is not recovering, repeat naloxone injections every 2 to 3 minutes." and "Continue until ambulance arrives."

     Also, the breathe -> check route skips the wait timer. The check screen then says "Give another dose" whatever the time since the last dose.
   - Suggested fix: add `- Still not breathing, I have a kit: another dose is due -> give` and `- Still not breathing, no kit -> breathe` (or the breathe screen's own Record count), with the Say "Keep up rescue breathing; follow the 111 call-taker". Put a line on check: "Check the Log for the time of the last dose before giving another."
   - Whose fault: the template's.

4. **woke: does not say they still need the ambulance (missed instruction).**
   - What is wrong: when someone wakes up, the bystander (or the person) may think it is over. The woke screen says stay with them, but never that they still need medical help, or that the ambulance should still come. The sources say this:
     - The Level: "That person may need medical help after you give them naloxone."
     - Medsafe: "NYXOID is to be given right away following a suspected overdose and does not take the place of emergency medical care."
     - Healthify A5 is headed "Do I still need to call the paramedics if naloxone has worked?", and its answer is the wear-off text.
     - health.gov.au (Australian): "It is vital to call an ambulance because naloxone only lasts for about 30 to 90 minutes and the person can overdose again once it wears off."
   - Suggested fix: add as the first Do on woke: `Do: Keep the ambulance coming, even if they seem fine. They may still need medical help.`, quoting "That person may need medical help after you give them naloxone." (The Level). Add a Notes line: no NZ source says what to do if the person wants to leave or refuses the ambulance; follow the 111 call-taker.
   - Whose fault: the template's (left out). What to do if they refuse is a gap in the guideline.

5. **breathe: "Naloxone does not work against slowed breathing" is shown as fact, though it clashes with the other sources.**
   - What is wrong: the kit pamphlet line "naloxone is not effective against respiratory depression" is quoted exactly. But Healthify says naloxone's wearing off "could cause breathing to stop again" (so naloxone restores breathing). Healthify 'Opioid overdose' says "it can reverse the effects of opioids and save lives". A bystander who reads "naloxone does not work against slowed breathing" may decide the injection is pointless and stop. The pamphlet probably means "naloxone may not restart breathing fast enough, so breathe for them", but that is a guess, and the app must not fill it in.
   - Suggested fix: keep the quote, but label the clash: "The kit pamphlet says 'naloxone is not effective against respiratory depression'. Healthify says naloxone wearing off 'could cause breathing to stop again'. The sources do not explain this; keep giving naloxone as the kit says, and breathe for them." Add it to Notes as a guideline contradiction (LESSONS trap 5).
   - Whose fault: the guideline's (unclear). The template shows it without the conflict.

6. **give: two opposite instructions for the ampoule dot, with no tie-break, and the "see the leaflet" line is missing (missed instruction).**
   - What is wrong: the screen shows The Level ("Hold the ampoule with the blue dot facing towards you." / "Snap open the vial by pushing the top away from you.") and the kit pamphlet ("Turn the dot on the Naloxone vial away from you then push to snap top off vial"). Both are shown fairly. But the frightened person, holding a glass ampoule, gets two opposite orders and no way to choose. The main source gives the tie-break, and it is not in the app: "For detailed instructions on how to give naloxone also see the leaflet in the emergency kit" (Healthify A3).
   - Suggested fix: add `Do: Follow the leaflet in your kit if it differs.`, quoting "see the leaflet in the emergency kit" (Healthify). Put the kit pamphlet's dot line first, and The Level's after it as "The Level says the opposite".
   - Whose fault: the guideline's (the contradiction); the template's (the missing Healthify line).

7. **Kit route: "stay with the person until the paramedics arrive" only appears after they wake (missed instruction).**
   - What is wrong: Healthify's first "thing to remember" is "Always call an ambulance (dial 111) and stay with the person until the paramedics arrive." Healthify 'Opioid overdose' also says "Stay with the person." The no-kit screen shows this. The start screen says only "Stay on the phone", so on the kit route the "stay with them" instruction first appears on woke.
   - Suggested fix: on start, change to `Do: Stay with them and stay on the phone.`, quoting "stay with the person until the paramedics arrive." (Healthify) and "Stay with the person." (Healthify, Opioid overdose).
   - Whose fault: the template's.

8. **give: too much on one screen while preparing an injection, and the Record button is at the bottom.**
   - What is wrong: give has a reminder bar, the kit contents, six Do lines with nine quotes, a dot contradiction, a dose-amount note and a Warning, and only then the "Naloxone dose given" button. The button that matters most for the paramedics comes after a long scroll.
   - Suggested fix: split into `prepare` (needle, swirl, dot, draw up) and `give` (inject, needle safe, Record right below the inject line). Move the dose-amount note and the kit contents to Notes or to the end of prepare.
   - Whose fault: the template's.

9. **safe: a five-bullet comparison of sources on an urgent screen.**
   - What is wrong: before naloxone, safe lists when each source places the recovery position, with five quotes. That is right for Notes, but heavy for someone who is about to inject. The NZ order (kit step 3 before step 4) is the one the app follows, and it is correct and quoted.
   - Suggested fix: keep one line, "NZ kit pamphlet: on their side before naloxone. Other sources differ (see Notes)", and move the rest to Notes, where it already is.
   - Whose fault: the template's (minor).

10. **start: the safety check comes after the call, unlike the kit pamphlet's step 1, and the Ask mixes two questions.**
    - What is wrong:
      - The kit pamphlet's order is "1. Safety: Check the person is in a safe place and that you can't wake them up" and then "2. Call an ambulance (111)". The app calls 111 first and checks safety on the next screen. Healthify 'Opioid overdose' and The Level put the call first, so this is defensible, but the Notes do not mention it.
      - "Do you have a naloxone kit?" has "Not sure it is an overdose" as an answer. That is a different question.
    - Suggested fix: add a Notes line on why 111 comes first (C1 "Call 111 for help if you suspect someone has overdosed on opioids." and The Level step 1 before step 2), and that the kit pamphlet puts safety first. Reword the Ask to "What now?", with the answers "I have a naloxone kit", "No kit" and "Not sure it is an overdose".
    - Whose fault: the template's (minor). The sources differ.

11. **unsure: a second "111 called" button doubles the count.**
    - What is wrong: start already has "Record: 111 called". Tapping it there and again on unsure logs "2×", which reads as two calls at handover.
    - Suggested fix: on unsure, use `Do: Call 111 if you have not already.` (a tick, not a Record), or drop the Record.
    - Whose fault: the template's (minor).

12. **woke: "Medsafe gives no time" claims more than was captured.**
    - What is wrong: source.txt says only selected lines of the Medsafe CMI were captured. "[The leaflet gives no time for how long naloxone lasts.]" is a researcher's note about a partial copy. The screen states it as fact.
    - Suggested fix: "The part of the Medsafe leaflet that was captured gives no time." Or drop the sentence.
    - Whose fault: the template's (minor). The copy was partial.

13. **woke: the withdrawal list is shortened.**
    - What is wrong: the screen lists "restless or irritable, aches, dizzy, anxious, fast heartbeat, confused". It drops "nervous" and "weakness", and turns "body aches" into "aches". Only two of the six items are quoted.
    - Suggested fix: list all six as printed, and quote each: "feeling nervous, restless or irritable", "body aches", "dizziness or weakness", "anxiety", "fast heartbeat", "confusion.".
    - Whose fault: the template's (minor).

14. **breathe: NZ sources don't say to roll them onto their back to breathe for them; the app doesn't say so plainly.**
    - What is wrong: the person was put on their side on safe. Rescue breathing needs them on their back, but only NSW (Australian) says so ("Roll the person onto their back"). The screen packs this into a summary of the NSW steps, so it is easy to miss that the NZ sources are silent on it (LESSONS trap 13). The NSW summary also adds "airway cleared" without quoting "Clear the airway of any blockages".
    - Suggested fix: add "NZ sources do not say how to position them for rescue breathing; follow the 111 call-taker." Quote "Roll the person onto their back" and "Clear the airway of any blockages" (NSW, Australian) on the NSW line.
    - Whose fault: the guideline's gap. The template doesn't state it.

15. **check: no warning when the 5 ampoules are used up.**
    - What is wrong: the explorer kept looping to a 7th dose with "6×" on the counter. The screen says "The kit has 5 ampoules" once, in a block of text. The runtime cannot branch on a Record count.
    - Suggested fix: add the answer "No ampoules left -> no-kit" on check (dropped already has it). The text is fine as it is.
    - Whose fault: the template's (minor).

## Checked with no problem found
- No dose, time or threshold is invented. "5 x 1ml Naloxone 0.4mg ampoules", "2 breaths every 5 seconds", 20 / 20 to 90 / 30 to 90 minutes and every wait time are quoted as printed, with their units. The dose amount is honestly stated as not given in words. The NSW 0.4 ml Prenoxad dose is rightly left out.
- Every Australian line says "Australian" on screen (needles, recovery position, repeat every 2 to 3 minutes, rescue-breathing steps, CPR, 30 to 90 minutes, hand the syringe to the crew). 000 never appears. Nyxoid is labelled as not available in NZ.
- These "do not / unless / only" lines are kept: "don't assume they are asleep", "Do not leave people to 'sleep it off'", "Naloxone only works if someone has taken an opioid", "if you know how" (CPR and rescue breathing, twice), "only lasts 20 minutes", "If after giving the second dose".
- Each difference is shown on the screen where it matters, with every source: how many doses (second dose only vs no maximum), how long naloxone lasts, when to do rescue breathing, recovery position order, and the call order (in Notes).
- Gaps stated: what to do after the 5 ampoules, CPR steps, rescue-breathing technique, dose amount, and what else to tell paramedics.
- Version, Sources and the empty "Reviewed by:" are correct. The prototype banner shows.
- Left out on purpose, and fine: risk factors, storage, "not a safety net", where to get kits, rare serious side effects, the Nyxoid spray method.

Missed instructions: 3:
- Healthify A3 "see the leaflet in the emergency kit" (finding 6).
- "Stay with the person" on the kit route before they wake (finding 7).
- "That person may need medical help after you give them naloxone", keeping the ambulance coming after they wake (finding 4).

Also partial:
- The withdrawal list (finding 13).
- NSW "Call for help from other people if you are alone." (Australian), covered only by "or have someone call".

## After fixes
Author round 1 (20 Nov 2026). Rebuilt: 14 steps, all reachable; 0 fix, 0 check, 8 info; 118 of 118 quotes exact; 20 of 20 number lines quoted.

1. Fixed. Both wait timers are 3 minutes, explained as the only time inside all three NZ injection sources (Healthify 2 to 5, kit 3-5, The Level after 3); the "you can wait longer" line and the "real contradiction" note are gone. The screen after the timer (check) asks "Breathing well, or waking?" and lists each source's rule for another dose instead of opening with "Give another dose".
2. Fixed by restructuring: the once-only 20-minute bar is on wait-first, reached only after the first dose screen (inject); repeat doses go through again and wait, which have no bar, so it never restarts on later doses. Text now "may wear off about now (20 min after the first dose)"; woke screen and Notes say when it starts. Left: reaching wait-first again by Back can restart a dismissed bar (runtime limit, in Notes).
3. Fixed. breathe has "Still not breathing, I have a kit: another dose" (to again) and "Still not breathing, no kit: keep breathing"; it says keep up rescue breathing and follow the 111 call-taker. check says to look at the last dose time first.
4. Fixed. woke opens with "Keep the ambulance coming" (The Level "That person may need medical help after you give them naloxone"), plus health.gov.au (Australian). Gap (refusing the ambulance) in Notes.
5. Fixed as a labelled clash on breathe (kit "not effective against respiratory depression" vs Healthify "could cause breathing to stop again"), both actions kept; in Notes as a guideline contradiction.
6. Fixed. prepare starts "Follow the leaflet in your kit" (Healthify A3); kit pamphlet's dot line first, "The Level says the opposite" second. The contradiction itself is the guideline's (left visible).
7. Fixed. start says stay with them until the paramedics arrive (Healthify A4, C3).
8. Fixed. Split into prepare (needle, swirl, dot, draw up, dose-amount note) and inject (inject, Record right below, needle safe); repeat doses use a short again screen.
9. Fixed. safe has one line on the order; the full comparison is in Notes.
10. Fixed. Ask is "What now?" with "I have a naloxone kit / No kit / Not sure it is an overdose"; Notes explain why 111 comes first and that the kit pamphlet puts safety first.
11. Fixed. unsure has "Call 111 if you have not already" (a tick, no Record).
12. Fixed. "The part of the Medsafe leaflet that was captured gives no time."
13. Fixed. All six withdrawal items as printed, each quoted.
14. Fixed. breathe says NZ sources do not say how to position them; follow the 111 call-taker. NSW line quotes "Roll the person onto their back" and "Clear the airway of any blockages" (Australian). The gap is the guideline's.
15. Fixed. check has "No ampoules left" (to no-kit). The runtime can't branch on the count (left; not needed).
Missed instructions: all 3 added (findings 4, 6, 7). Also added NSW "Call for help from other people if you are alone." (Australian) on start.
