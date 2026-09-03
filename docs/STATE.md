# State

Live dest: `C:\Users\braed\src\pink-garden`
GitHub: `omgbrasco/pink-garden` (public, Pages from `master`)
Live: https://omgbrasco.github.io/pink-garden/

Girlfriend gift. Fun/public. Not NSFW. Not Aria.

Cache **v26** (`BUILD = 26`, SW `dumpling-v26`). v26 tidied the Feedback tab into one compact box per Braedon's own-phone review; see CHANGELOG.

Open question from Braedon (not yet acted on): the translucent blur band at the very top of Chats/Feedback/Settings is iOS's own status-bar effect from `apple-mobile-web-app-status-bar-style: black-translucent` in index.html - not a CSS bug (checked: no stray backdrop-filter sits there). That setting is also what lets the Home garden's art blend under the status bar. Changing it globally would remove the blur everywhere but risks reintroducing the "black bar" class of regression already fought in v12/v20/v23 - don't flip it without Braedon confirming he's seen and accepts that trade-off. Last ship: a small on-screen skin-switch bubble (top-left, tap to flip blue/pink without going into Settings), a day-streak badge, and a new Feedback tab - she can type, dictate (iOS keyboard mic, free), or record a raw voice memo; it queues in `localStorage` and sends to a private gist once Braedon has entered a gist ID + token in Settings > Feedback sync. No git tags yet.

Default skin is the blue garden. Pink garden is opt-in via Settings, or the new top-left bubble on the home screen.

Grok Bot **Dumpling** is retired. Hired hands (Claude Code or Codex) open this folder. No replacement Grok bot.

**First network call this app makes, ever:** the Feedback tab, on purpose (see AGENTS.md). Everything else stays 100% local. The "How I work" panel in Settings was updated to say this honestly - don't let it drift back to claiming zero network activity while the Feedback tab exists.

## Not wired

- Feedback sync needs Braedon to actually create a private gist + a gist-scoped token and enter both in Settings > Feedback sync on his phone AND hers. Until that's done, her entries queue locally on her phone and nothing is lost, they just don't reach him yet.
- Speech bubble `#speech` may need a 16 Pro nudge. Screenshot before guessing.
- iOS page dictation is flaky in Safari. No cloud STT for the Feedback tab's raw voice memos either - they're saved as an audio clip only, not transcribed (no backend to do that without breaking the no-LLM rule).
- `originals/dumpling-icon-landscape.png` is unused. Keep. Do not serve.
- Golden-path jobs/adr/archive folders exist empty. Fill when a real coding job starts.

See `docs/HANDOFF.md` for the full scene and file map. Do not delete `originals/`.
