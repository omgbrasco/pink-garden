# Dev journey: Pink Garden

What building this taught me, so the next project starts smarter.

**How to use:** after each ship, add one entry at the top of "Entries". Three lines max. What changed, what bit you, what you'd do again.

## Entries

### v32 (2026-10-04): pink is home, the night garden becomes midnight pink
- Changed: pink garden is the default. The night garden is now a dark version of the pink theme, not a separate navy look.
- Bit me: test screenshots got committed into the repo (fixed, root PNGs ignored). iOS 26 broke the keyboard lift with a bogus `offsetTop`. Found it from a single phone screenshot plus a web search, then reproduced it with a fake keyboard before fixing.
- Do again: theme colors as variables. One set of components, two color sets.

### v31 (2026-10-03): less reading, more showing
- Changed: Settings cut to Garden + Feedback ("type it or say it"). What's-new card: Dumpling explains each update once. My list + reminders, kept in the app with no server.
- Bit me: a startup-order bug that would have silently stopped feedback sending. Only caught because the size test fails on any JS error.
- Do again: always fail tests on JS errors. Send screenshots of the finished product, not descriptions.

### v30 (2026-10-02): clean home + side menu
- Changed: tab bar gone. Home is just Dumpling. ☰ menu holds Chat history, garden switch, fireflies, Settings. Feedback moved into Settings.
- Bit me: an empty voice-memo chip had been showing in the Feedback box. No test caught it; it only showed up when someone looked at a screenshot.
- Do again: check every iPhone size automatically (9 sizes × 2 gardens), then actually look at the screenshots.

### v29 (2026-10-01): Dumpling stops misreading words
- Changed: "I'm tired" no longer turns the moon red. Command words match whole words only.
- Bit me: this was broken for many versions because nobody typed normal sentences. Only commands got tested.
- Do again: first PR instead of pushing straight to live. Test with things she'd actually say.

## Lessons so far (v1 to v30)

### iPhone web apps
- Test on the real phone. Desktop lies. Safari's toolbar looked like a keyboard to the code and made Dumpling vanish (v15).
- Don't fight the screen height. A `screen.height` trick pushed the tab bar off her 13 (v23). Use the real visible height plus safe areas.
- The app icon must be square (512×512) or iOS stretches it (v14).
- iOS caches hard. Bump one version number everywhere, then force-quit the icon. Icon art only changes if she deletes it and adds it again.

### Shipping
- Never force-push or reset the live branch. Revert, then bump the version forward (`docs/REVERSING.md`).
- Small PR → look at screenshots → merge. Merging is the deploy.
- Write down *why*, not just what. The changelog and `AGENTS.md` stop the same mistake twice.

### Product
- Remove things all the way. The joke egg left in v18, but its reply lived until v29.
- Less on screen wins. v30 cut the tab bar and the home screen got better.
- Her data stays on her phone. No accounts, no servers, fewer things to break.

### Working with AI helpers
- Give them rails. `AGENTS.md` holds every "this bit us" rule, and every helper reads it first.
- One job per chat. Long chats drift.
- Ask for a test run and screenshots before you merge.

## Industry practices

Moved to `docs/TOOLKIT.md` section 7, so there's one list to keep current.

## Template

```
### vNN (YYYY-MM-DD): title
- Changed:
- Bit me:
- Do again / never again:
```
