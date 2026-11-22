# Job: set up the Dumpling brain server on Braedon's Windows PC

**Who runs this:** Claude Code (or Codex) on Braedon's Windows PC (RTX 3060 Ti, 8GB).
**Braedon says:** "do the Dumpling server job." Do every step yourself. Braedon is usually on his phone.
**Only stop for Braedon if** a step truly needs his click (Tailscale Funnel approval link, a UAC prompt). Then give him ONE step.

## What this is
A tiny server so Dumpling gets a real (free, local) AI brain + memory, and so the two phones' Dumplings can pass messages.
- Code is already in the repo: `server/server.mjs` (no npm packages), `server/persona.md`, `server/start-dumpling.bat`.
- AI = **Ollama on this PC**. Nothing goes to any AI company.
- Phones reach it through **Tailscale Funnel** (free, gives this PC a stable https address; nothing to install on her phone).
- Each phone has its own key and its own memory file (`server/data/memory-user.json`, `memory-dev.json`). Phones never share memory.

## Steps
1. **Repo.** Find the existing `pink-garden` clone on this PC, or clone `https://github.com/omgbrasco/pink-garden` to `%USERPROFILE%\pink-garden`. `git pull` master.
2. **Node 20+.** `node -v`. If missing or old: `winget install -e --id OpenJS.NodeJS.LTS`.
3. **Ollama.** `ollama -v`. If missing: `winget install -e --id Ollama.Ollama`. Then `ollama pull llama3.1:8b` (≈5GB). Check it answers: `ollama run llama3.1:8b "say hi in 5 words"`.
4. **Config.** In `server\`, copy `.env.example` to `.env`. Fill `KEY_USER` and `KEY_DEV` with two different random 32-char keys:
   `node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"` (run twice).
   Set `NAME_USER` to her first name if Braedon has said it; otherwise leave `her`. **Never commit `.env` or `server\data\`** (both are git-ignored).
5. **Run + test locally.** `node server\server.mjs` in the background. Then:
   - `curl http://127.0.0.1:8787/health` → `{"ok":true,...}`
   - `curl -X POST http://127.0.0.1:8787/chat -H "content-type: application/json" -d "{\"phone\":\"dev\",\"key\":\"<KEY_DEV>\",\"text\":\"hi dumpling, my favorite color is green\"}"` → a short cute reply.
   - Send a second message asking "what's my favorite color?" with the first exchange in `history`. Confirm it remembers. Check `server\data\memory-dev.json` got the fact.
   - First reply can take ~10–20s while the model loads; after that a few seconds.
6. **Public https address.** `tailscale status` (Tailscale should already be installed/logged in; if not, `winget install -e --id tailscale.tailscale` and give Braedon the one login step). Then `tailscale funnel --bg 8787`.
   - If it prints a link to enable Funnel, that's Braedon's ONE step: send him the link.
   - Note the `https://<pc>.<tailnet>.ts.net` URL. Test `<URL>/health` from outside (e.g. `curl` it).
7. **Auto-start on login** (PC restarts shouldn't kill Dumpling):
   `schtasks /Create /TN "Dumpling Brain" /TR "\"%USERPROFILE%\pink-garden\server\start-dumpling.bat\"" /SC ONLOGON /RL LIMITED /F`
   (adjust the path to the real clone). Ollama already starts itself at login. Funnel `--bg` persists.
   Check the PC doesn't sleep on AC power: `powercfg /query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE`. If it sleeps, tell Braedon (don't change power settings without asking).
8. **Link codes for Braedon.** Make one link code per phone (app v41+ understands them):
   `node -e "const u=process.argv[1];for(const [p,k] of [['user',process.argv[2]],['dev',process.argv[3]]])console.log(p, Buffer.from(JSON.stringify({u,k,p})).toString('base64url'))" <FUNNEL_URL> <KEY_USER> <KEY_DEV>`
   Write `%USERPROFILE%\Desktop\dumpling-keys.txt` with the Funnel URL and, for each phone, the exact line to type into that phone's Dumpling chat: `link dumpling <code>` (her phone gets the `user` code, his gets the `dev` code). Do **not** paste keys or codes into chat or commits.
9. **Report** (short, to Braedon's phone): Funnel URL, model, test reply text, memory test passed y/n, auto-start set y/n, PC sleep status. Then append one line to `docs/CHANGELOG.md` under a "Server" heading (URL is fine to write; keys are not), commit, push master.

## Not this job
- The app side is already shipped (v41): each phone links by typing `link dumpling <code>` in its Dumpling chat. Small talk goes to the brain; commands (moon, list, countdowns) stay instant on the phone; "tell Braedon …" / "tell her …" passes a note; incoming notes show as "💌 Braedon says: …". PC off = old built-in replies.
- Don't change `persona.md` unless Braedon asks. He edits it to change Dumpling's personality (takes effect next message, no restart).

## If something breaks later
- Dumpling on the phones falls back to his old built-in replies when the server is off. Nothing on her phone breaks.
- Logs: run `start-dumpling.bat` in a window to see errors. Ollama busy (games/video renders) = slow replies, not broken.
