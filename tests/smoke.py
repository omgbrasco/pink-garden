"""Dumpling smoke test. Runs before every merge (GitHub Actions) and locally:
   python3 -m http.server 8765 &   then   python3 tests/smoke.py
Fails if the app crashes on any kind of first open, or if a core command stops answering.
Needs: pip install playwright && python -m playwright install chromium"""
import asyncio, json, os, re, sys
from playwright.async_api import async_playwright

URL = os.environ.get("DUMPLING_URL", "http://localhost:8765/index.html")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fails = []

def check(ok, what):
    print(("PASS " if ok else "FAIL ") + what)
    if not ok: fails.append(what)

def static_checks():
    app = open(os.path.join(ROOT, "app.js"), encoding="utf-8").read()
    sw = open(os.path.join(ROOT, "sw.js"), encoding="utf-8").read()
    idx = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    css = open(os.path.join(ROOT, "styles.css"), encoding="utf-8").read()
    build = re.search(r"const BUILD = (\d+);", app).group(1)
    check(f"dumpling-v{build}" in sw, f"service worker cache matches BUILD {build}")
    vs = set(re.findall(r"\?v=(\d+)", idx))
    check(vs == {build}, f"index.html ?v= all equal BUILD ({sorted(vs)})")
    check("backdrop-filter" not in css, "no blur (backdrop-filter) in styles.css")

async def phone(p, init, steps, label):
    b = await p.chromium.launch()
    c = await b.new_context(**p.devices["iPhone 13"])
    await c.add_init_script(init)
    pg = await c.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto(URL)
    await pg.wait_for_timeout(1500)
    # Clear any card (what's-new or daily note) the way she would.
    for _ in range(4):
        if await pg.evaluate("!document.getElementById('news').hidden"):
            await pg.click("#news-go"); await pg.wait_for_timeout(250)
    for say, expect in steps:
        await pg.fill("#box", say); await pg.press("#box", "Enter"); await pg.wait_for_timeout(1400)
        got = await pg.evaluate("[...document.querySelectorAll('#log .bot')].pop()?.textContent || document.getElementById('speech')?.textContent || ''")
        check(re.search(expect, got or "", re.I) is not None, f"[{label}] '{say}' -> {got[:60]!r}")
    check(not errs, f"[{label}] no page errors {errs[:2]}")
    await b.close()

async def main():
    static_checks()
    today = "new Date().toISOString().slice(0,10)"
    async with async_playwright() as p:
        await phone(p, "", [("hi", r".")], "brand new phone")
        await phone(p, "localStorage.setItem('dumpling-seen-v1','999')", [("add milk, eggs and bread to my list", r"milk.*eggs.*bread")], "note due today")
        await phone(p, "localStorage.setItem('dumpling-seen-v1','30')", [("what's on my list", r".")], "old version phone")
        await phone(p, "localStorage.setItem('dumpling-seen-v1','999');localStorage.setItem('dumpling-play-v1',JSON.stringify({skin:'blue',homePink36:true}))",
                    [("pink garden", r"pink")], "night garden phone")
        await phone(p, f"localStorage.setItem('dumpling-seen-v1','999');localStorage.setItem('dumpling-note-day',{today})", [
            ("how many days until christmas", r"days|today|tomorrow"),
            ("countdown to date night on friday", r"counting down|today"),
            ("make the moon green", r"green"),
            ("add oat milk to my list", r"oat milk"),
            ("what's on my list", r"oat milk"),
            ("remember my locker is 42", r"got it|saved|kept"),
            ("tell her hi", r"once braedon links|sent"),
            ("help", r"moon"),
        ], "core commands")
        await phone(p, "localStorage.setItem('dumpling-seen-v1','999');localStorage.setItem('dumpling-brain-v1',JSON.stringify({u:'http://127.0.0.1:9',k:'x',p:'user'}))",
                    [("how are you", r".")], "linked but PC off (falls back)")
    print(f"\n{'ALL GOOD' if not fails else str(len(fails)) + ' FAILED'}")
    sys.exit(1 if fails else 0)

asyncio.run(main())
