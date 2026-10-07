# Builder's toolkit

My playbook for every new project. Learned building Pink Garden (v1 to v31). Copy what fits.

Diary and lessons: `docs/JOURNEY.md`. This file is the reusable part.

## 1. Day one of a new project

- **Repo + free hosting** that goes live from the main branch (GitHub Pages works for static sites).
- **A rules file for AI helpers** (`CLAUDE.md` / `AGENTS.md`): who it's for, the non-negotiables, and a "this bit us" list. Template in section 8.
- **A `docs/` folder:**
  - `STATE.md`: what's live right now
  - `CHANGELOG.md`: one line per ship, newest first
  - `BACKLOG.md`: ideas parked so they don't get lost
  - `JOURNEY.md`: lessons, 3 lines per ship
  - `REVERSING.md`: how to undo safely
- **One version number**, bumped in every place on every ship.
- **Two-agent reviews from day one:** copy the "Two agents" section into `AGENTS.md`, add the PR template, and create the `review-handoff` label (see section 9).

## 2. The loop for every change

1. New branch.
2. One small idea per change.
3. Test it: real sentences, every screen size, then *look* at the screenshots.
4. Open a PR covering what changed, why, how it was tested, and how to undo it.
5. Get a screenshot of the finished product before deciding.
6. Merge. Merging is the ship.
7. Two minutes on the real phone.
8. Add one `JOURNEY.md` entry.

## 3. Working with AI helpers

**Prompts that worked:**
- "Read the repo first. Suggest 3 small improvements she'd notice, build the first one, and open a PR. Don't deploy."
- "Make sure it works on every iPhone size." This got a 12-size test run.
- "Send me a screenshot of the finished product."

**Habits:**
- Side ideas get parked as one `Later:` line, not chased.
- One job per chat. After about 20 messages, start fresh with a one-paragraph handoff.
- Approval is per change. "Merge" means this PR, not the next one.
- When the helper finds a bug in passing, it says whether the bug was already there or it caused it.

## 4. Testing kit

| Test | Catches |
|---|---|
| Real sentences people would say | "I'm tired" turning the moon red (v29) |
| Every screen size, automated | Clipped buttons, sideways scroll, overlaps |
| Look at screenshots | An empty chip no test checked for (v30) |
| JS errors on every run | A startup bug that silently stopped feedback sending (v31) |
| Fake mic + fake network | Voice memos and sync, without a phone or a server |

**iPhone sizes to test (points, portrait):**

| Phone | Size |
|---|---|
| SE 2/3 | 375×667 |
| 12/13 mini | 375×812 |
| 13 / 14 / 16e | 390×844 |
| 14 Pro / 15 / 16 | 393×852 |
| 16 Pro / 17 / 17 Pro | 402×874 |
| Air | 420×912 |
| 14 Plus / 13 Pro Max | 428×926 |
| 15/16 Plus, 15 Pro Max | 430×932 |
| 16/17 Pro Max | 440×956 |

As a home-screen app, subtract the status bar from the height. Test with the home-indicator gap (34pt) and without it (SE).

## 5. iPhone web app kit

- **Tags:** `viewport-fit=cover`, `apple-mobile-web-app-capable`, a status bar style, and a square 512×512 icon.
- **Safe areas:** pad the top and bottom with `env(safe-area-inset-*)`.
- **Height:** use `window.innerHeight`. Never `screen.height`.
- **Keyboard:** keyboard height = `innerHeight - visualViewport.height`. Don't trust `visualViewport.offsetTop` on iOS 26. Test it by faking `visualViewport` in the browser.
- **Taps:** buttons at least 44pt.
- **Updates:** the service worker cache name carries the version, so bump it to ship. On the phone, force-quit the icon to pick up the update.
- **Hard limits of a no-server app:**
  - Data lives on one phone. No sync and no backup.
  - Push notifications need a server to send them (iOS 16.4+, home-screen apps only, the person has to allow them). A web app can't schedule its own alarm.
  - Mic and dictation in Safari are flaky. Always offer typing too.
- **Reminders without a server:** save the due time. When the app opens, comes back to the front, or a timer ticks, the character says it. Be honest in the reply: "come see me after 5". It's free and private, but the app has to be opened.

## 6. Design rules

- **Show, don't tell.** No paragraphs in the app.
- **One screen, one job.** Home is the character and the chat. Everything else lives in a menu.
- **Teach with a what's-new card.** It shows once, after the update, with the character explaining in a bubble and a "Show me" button that does the thing.
- **Fewest decisions.** Feedback is "type it or say it". Tap to record, tap again to send.
- **Every tap answers back:** a toast, a bounce, a sound.
- **Remove things all the way,** including leftover code and copy.

## 7. Industry practices

**Doing:**
- Version control with small PRs
- Changelog
- Revert, don't reset
- Offline-first web app
- Cache versioning
- A rules file for helpers
- In-app release notes (what's-new card)
- Test across screen sizes

**Next, biggest payoff first:**
1. **CI:** run the size and chat tests on every PR automatically, so a broken PR can't merge.
2. **Real-phone check** before merge, for the keyboard, mic and feel.
3. **A git tag per ship,** for one-tap rollback.
4. **Backup/export** of user data, if it ever matters.

## 8. Templates

**Rules file (`CLAUDE.md` / `AGENTS.md`):**
```
# <Project>: who it's for, in one line
Live: <url>   Branch: <main>
Non-negotiables: <stack limits, privacy, no-gos>
Ship: bump version in <places>, PR, merge, tell me how to see it.
After building: send me phone screenshots of the finished product.
This bit us: <rule> (vNN, why)
```

**PR description** (lives in `.github/pull_request_template.md`):
```
Built by: Claude or Codex
Reviewer: the other one
## What she'll see
## Why
## Tested (sizes, real sentences, screenshots)
## Not tested (needs a real phone)
## Review tickets fixed first
## Undo
```

## 9. Two agents reviewing each other (Claude ⇄ Codex)

They don't share memory, so **GitHub is the shared brain**. It works on every device, and I can read it on my phone.

1. **Tag the work:** `claude/...` or `codex/...` branches, plus `Built by:` in the PR.
2. **Each one reviews only the other's work,** never its own.
3. **A review leaves one small ticket:** an issue labeled `review-handoff`, about 15 lines. It names the exact commit, numbered findings (`file:line`, bug or nit), and what was and wasn't checked.
4. **Every new build starts by reading open tickets** and fixing the bugs first. The builder replies `Fixed in <sha>`, and the reviewer closes the ticket.
5. **I test on my phone, and I'm the only one who merges.**
6. **Caught bugs get one line in `docs/REVIEWS.md`.** Caught twice means it becomes a rule in `AGENTS.md`.

**Paste once into each agent's own settings** (Claude: personal preferences / custom instructions; Codex: its custom instructions), so it works in every repo:
```
Two-agent reviews (Claude ⇄ Codex): Before starting new work in any repo, check open GitHub issues labeled "review-handoff" and fix their bug items first; reply "Fixed in <sha>" on each. When asked to review, review only work the other agent built (branch claude/* or codex/*, or "Built by:" in the PR), never your own. After a review, leave one short "review-handoff" issue: the exact commit reviewed, numbered findings (file:line, bug or nit), what you checked and didn't. Braedon tests on his phone and is the only one who merges.
```
