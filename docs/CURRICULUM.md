# Guideline queue

Simple first, then harder. Level 1: a straight line of steps, timers. Level 2: branching questions, repeating
cycles. Level 3: inputs and look-up tables, several clocks at once. Level 4: scores or calculators, parallel
tracks. Level 5: the final exam.

Mixed medical, non-medical, workplace and education. Workplace and study processes (leave, resigning,
submissions, complaints, privacy) often have only a few decision points, but people get them wrong because the
rules are spread over long pages, so they gain most from "the right step at the right time".

One (sometimes two) per run, in order, unless the owner's feedback asks for something else. Use New Zealand
sources where they exist; for a row that names "a NZ university", pick one whose page can be read and say which in
meta.json. Mark the status when done; if a guideline can't be found or used, mark it "skipped: reason" and move on.
Add new rows as ideas come up (the owner can also ask for any guideline in a comment).

| # | Guideline | Type | Level | Status |
|---|---|---|---|---|
| 1 | Cooling freshly cooked food (MPI Yellow Card S39-00002) | non-medical | 1 | built |
| 2 | Burns first aid (cool the burn, St John / Health NZ) | medical | 1 | built |
| 3 | Earthquake: Drop, Cover, Hold, then what to do after (NEMA Get Ready) | non-medical | 1 | queued |
| 4 | Submitting a university assignment: checks before and after you submit (a NZ university's published guidance) | education | 1 | queued |
| 5 | Resigning from a job: giving notice, final pay and holiday pay (Employment New Zealand) | workplace | 1 | queued |
| 6 | Adult choking (ANZCOR guideline 4) | medical | 2 | queued |
| 7 | Asking for an assignment extension or special consideration (a NZ university's policy) | education | 2 | queued |
| 8 | Workplace fire: evacuation and extinguisher use (Fire and Emergency NZ) | non-medical | 2 | queued |
| 9 | Requesting annual holidays and what the employer must do (Employment New Zealand) | workplace | 2 | queued |
| 10 | Asthma attack first aid, repeat cycles (Asthma NZ / Asthma Australia 4x4x4) | medical | 2 | queued |
| 11 | Sick leave: telling your employer and proof of sickness (Employment New Zealand) | workplace | 2 | queued |
| 12 | Tsunami: Long or Strong, Get Gone, then return (NEMA) | non-medical | 2 | queued |
| 13 | Changing a car tyre safely at the roadside (NZTA / AA) | non-medical | 2 | queued |
| 14 | Power cut: what food to keep or throw out, by hours without power (MPI) | non-medical | 3 | queued |
| 15 | Raising a problem at work: steps from talking to mediation (Employment New Zealand) | workplace | 3 | queued |
| 16 | Anaphylaxis action plan, adrenaline by weight, repeat after 5 minutes (ASCIA) | medical | 3 | queued |
| 17 | Privacy breach: is it serious harm, and notifying (Office of the Privacy Commissioner) | workplace | 3 | queued |
| 18 | Low blood sugar: 15-15 treat and recheck cycles (Diabetes NZ / Health NZ) | medical | 3 | queued |
| 19 | Taking on a new employee: agreement, right to work, tax code (Employment New Zealand / IRD) | workplace | 3 | queued |
| 20 | Notifiable workplace event: what to do and when (WorkSafe NZ) | workplace | 4 | queued |
| 21 | Cyber security incident first steps (CERT NZ / NCSC) | non-medical | 4 | queued |
| 22 | Adult sepsis screening and first-hour actions (Health NZ) | medical | 4 | queued |
| 23 | Stroke: FAST, time windows and pre-alert (St John / Health NZ) | medical | 4 | queued |
| 24 | FINAL EXAM: Cardiac arrest (St John EAS 3.14), scored against Pocket Resus recordings | medical | 5 | locked until every other row is built or skipped |

## The final exam (last row)
Only when every other row is done (built or skipped). The builder makes the cardiac arrest app from the guideline alone,
exactly like the others. Then, and only then, a separate agent reads (never writes) the public Pocket_Resus
repository, replays its recorded cases where they can be mapped onto the new app, and reports how many steps
agree, plus every difference in plain English. Differences are expected: Pocket Resus also contains design
decisions that are not in the guideline.
