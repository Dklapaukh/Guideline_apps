# Guideline queue

Simple first, then harder. Level 1: a straight line of steps, timers. Level 2: branching questions, repeating
cycles. Level 3: inputs and look-up tables, several clocks at once. Level 4: scores or calculators, parallel
tracks. Level 5: the final exam. Mixed medical and non-medical. One (sometimes two) per night, in order, unless
the owner's comments ask for something else. Use New Zealand sources where they exist. Mark the status when
done; if a guideline can't be found or used, mark it "skipped: reason" and move on. Add new rows as ideas come
up (the owner can also ask for any guideline in a comment).

| # | Guideline | Type | Level | Status |
|---|---|---|---|---|
| 1 | Cooling freshly cooked food (MPI Yellow Card S39-00002) | non-medical | 1 | built |
| 2 | Burns first aid (cool the burn, St John / Health NZ) | medical | 1 | built |
| 3 | Earthquake: Drop, Cover, Hold, then what to do after (NEMA Get Ready) | non-medical | 1 | queued |
| 4 | Adult choking (ANZCOR guideline 4) | medical | 2 | queued |
| 5 | Workplace fire: evacuation and extinguisher use (Fire and Emergency NZ) | non-medical | 2 | queued |
| 6 | Asthma attack first aid, repeat cycles (Asthma NZ / Asthma Australia 4x4x4) | medical | 2 | queued |
| 7 | Tsunami: Long or Strong, Get Gone, then return (NEMA) | non-medical | 2 | queued |
| 8 | Power cut: what food to keep or throw out, by hours without power (MPI) | non-medical | 3 | queued |
| 9 | Anaphylaxis action plan, adrenaline by weight, repeat after 5 minutes (ASCIA) | medical | 3 | queued |
| 10 | Low blood sugar: 15-15 treat and recheck cycles (Diabetes NZ / Health NZ) | medical | 3 | queued |
| 11 | Changing a car tyre safely at the roadside (NZTA / AA) | non-medical | 2 | queued |
| 12 | Notifiable workplace event: what to do and when (WorkSafe NZ) | non-medical | 4 | queued |
| 13 | Cyber security incident first steps (CERT NZ / NCSC) | non-medical | 4 | queued |
| 14 | Adult sepsis screening and first-hour actions (Health NZ) | medical | 4 | queued |
| 15 | Stroke: FAST, time windows and pre-alert (St John / Health NZ) | medical | 4 | queued |
| 16 | FINAL EXAM: Cardiac arrest (St John EAS 3.14), scored against Pocket Resus recordings | medical | 5 | locked until levels 1-4 are built |

## The final exam (row 16)
Only when rows 1-15 are done (built or skipped). The builder makes the cardiac arrest app from the guideline alone,
exactly like the others. Then, and only then, a separate agent reads (never writes) the public Pocket_Resus
repository, replays its recorded cases where they can be mapped onto the new app, and reports how many steps
agree, plus every difference in plain English. Differences are expected: Pocket Resus also contains design
decisions that are not in the guideline.
