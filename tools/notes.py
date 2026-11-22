"""Rebuild NOTES_PACK in app.js from tools/notes.txt (one note per line; notes.txt is git-ignored).
Usage: python3 tools/notes.py   (then bump the cache version)"""
import base64, json, re, pathlib
here = pathlib.Path(__file__).resolve().parent
notes = [l.strip() for l in (here / "notes.txt").read_text(encoding="utf-8").splitlines() if l.strip()]
enc = base64.b64encode(json.dumps(notes, ensure_ascii=False)[::-1].encode("utf-8")).decode()
app = here.parent / "app.js"
s = app.read_text(encoding="utf-8")
s = re.sub(r'const NOTES_PACK = "[^"]*";', 'const NOTES_PACK = "' + enc + '";', s, count=1)
app.write_text(s, encoding="utf-8")
print(len(notes), "notes packed")
