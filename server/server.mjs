// Dumpling brain server. Runs on Braedon's Windows PC. Zero npm packages: Node 20+ only.
// Talks to Ollama (local AI) on this PC. Nothing goes to any AI company.
//
//   POST /chat   { phone, key, text, history:[{who,text}] }  -> { reply }
//   POST /send   { phone, key, text }                        -> { ok }   (Dumpling-to-Dumpling message)
//   GET  /inbox?phone=..&key=..                              -> { messages:[{from,text,ts}] } (and clears them)
//   GET  /memory?phone=..&key=..                             -> { memory:[...] }  (what Dumpling remembers about this phone's person)
//   POST /forget { phone, key }                              -> { ok }   (wipes it)
//   GET  /health                                             -> { ok, model }
//
// Phones: "user" (her) and "dev" (Braedon). Each has its own key and its own memory file.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.join(HERE, ".env"));

const PORT = +(process.env.PORT || 8787);
const OLLAMA = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const MODEL = process.env.MODEL || "llama3.1:8b";
const KEYS = { user: process.env.KEY_USER || "", dev: process.env.KEY_DEV || "" };
const NAMES = { user: process.env.NAME_USER || "her", dev: process.env.NAME_DEV || "Braedon" };
const ORIGINS = (process.env.ALLOW_ORIGINS || "https://omgbrasco.github.io").split(",").map(s => s.trim());
const DATA = path.join(HERE, "data");
const MEMORY_MAX = 60;
fs.mkdirSync(DATA, { recursive: true });

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return d; } };
const writeJson = (f, v) => { fs.writeFileSync(f + ".tmp", JSON.stringify(v, null, 1)); fs.renameSync(f + ".tmp", f); };
const memFile = phone => path.join(DATA, `memory-${phone}.json`);
const inboxFile = phone => path.join(DATA, `inbox-${phone}.json`);
const other = phone => (phone === "user" ? "dev" : "user");
const persona = () => { try { return fs.readFileSync(path.join(HERE, "persona.md"), "utf8"); } catch { return "You are Dumpling, a tiny cute dumpling buddy."; } };

function authed(phone, key) {
  return (phone === "user" || phone === "dev") && KEYS[phone] && key === KEYS[phone];
}

async function think(phone, text, history) {
  const memory = readJson(memFile(phone), []);
  const sys = [
    persona(),
    `You are talking with ${NAMES[phone]}.`,
    memory.length ? "Things you remember about them:\n- " + memory.join("\n- ") : "You don't know much about them yet.",
    'Answer ONLY as JSON: {"reply": "<your short reply>", "remember": ["<new lasting fact about them, if any>"]}.',
    'Only put real, lasting facts in "remember" (names, likes, plans, dates). Usually it is an empty list.'
  ].join("\n\n");
  const msgs = [{ role: "system", content: sys }];
  for (const h of (history || []).slice(-12)) {
    if (h && typeof h.text === "string") msgs.push({ role: h.who === "me" ? "user" : "assistant", content: h.text.slice(0, 500) });
  }
  msgs.push({ role: "user", content: text.slice(0, 800) });

  const r = await fetch(OLLAMA + "/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages: msgs, stream: false, format: "json", think: false,
      options: { temperature: 0.8, num_predict: 200 }, keep_alive: "30m" }),
    signal: AbortSignal.timeout(45000)
  });
  if (!r.ok) throw new Error("ollama " + r.status);
  const out = await r.json();
  let parsed = {};
  try { parsed = JSON.parse(out.message?.content || "{}"); } catch { parsed = { reply: out.message?.content || "" }; }
  const reply = String(parsed.reply || "").trim().slice(0, 600);
  const learn = (Array.isArray(parsed.remember) ? parsed.remember : [])
    .map(x => String(x).trim()).filter(x => x.length > 2 && x.length < 160);
  if (learn.length) {
    const have = new Set(memory.map(m => m.toLowerCase()));
    for (const f of learn) if (!have.has(f.toLowerCase())) memory.push(f);
    writeJson(memFile(phone), memory.slice(-MEMORY_MAX));
  }
  return reply;
}

function send(res, code, obj, origin) {
  const h = { "content-type": "application/json", "cache-control": "no-store" };
  if (origin && ORIGINS.includes(origin)) {
    h["access-control-allow-origin"] = origin;
    h["vary"] = "origin";
  }
  res.writeHead(code, h);
  res.end(JSON.stringify(obj));
}

async function body(req) {
  let s = "";
  for await (const c of req) { s += c; if (s.length > 20000) throw new Error("too big"); }
  return s ? JSON.parse(s) : {};
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  if (req.method === "OPTIONS") {
    res.writeHead(204, ORIGINS.includes(origin) ? {
      "access-control-allow-origin": origin, "access-control-allow-methods": "GET,POST",
      "access-control-allow-headers": "content-type", "access-control-max-age": "86400", vary: "origin"
    } : {});
    return res.end();
  }
  const url = new URL(req.url, "http://x");
  try {
    if (url.pathname === "/health") return send(res, 200, { ok: true, model: MODEL }, origin);

    if (url.pathname === "/chat" && req.method === "POST") {
      const b = await body(req);
      if (!authed(b.phone, b.key)) return send(res, 401, { error: "nope" }, origin);
      const text = String(b.text || "").trim();
      if (!text) return send(res, 400, { error: "empty" }, origin);
      const reply = await think(b.phone, text, b.history);
      return send(res, 200, { reply }, origin);
    }

    if (url.pathname === "/send" && req.method === "POST") {
      const b = await body(req);
      if (!authed(b.phone, b.key)) return send(res, 401, { error: "nope" }, origin);
      const text = String(b.text || "").trim().slice(0, 500);
      if (!text) return send(res, 400, { error: "empty" }, origin);
      const box = readJson(inboxFile(other(b.phone)), []);
      box.push({ from: NAMES[b.phone], text, ts: Date.now() });
      writeJson(inboxFile(other(b.phone)), box.slice(-50));
      return send(res, 200, { ok: true }, origin);
    }

    // She can always see and wipe what Dumpling remembers about her (from her own phone).
    if (url.pathname === "/memory" && req.method === "GET") {
      const phone = url.searchParams.get("phone"), key = url.searchParams.get("key");
      if (!authed(phone, key)) return send(res, 401, { error: "nope" }, origin);
      return send(res, 200, { memory: readJson(memFile(phone), []) }, origin);
    }
    if (url.pathname === "/forget" && req.method === "POST") {
      const b = await body(req);
      if (!authed(b.phone, b.key)) return send(res, 401, { error: "nope" }, origin);
      writeJson(memFile(b.phone), []);
      return send(res, 200, { ok: true }, origin);
    }

    if (url.pathname === "/inbox" && req.method === "GET") {
      const phone = url.searchParams.get("phone"), key = url.searchParams.get("key");
      if (!authed(phone, key)) return send(res, 401, { error: "nope" }, origin);
      const box = readJson(inboxFile(phone), []);
      if (box.length) writeJson(inboxFile(phone), []);
      return send(res, 200, { messages: box }, origin);
    }

    send(res, 404, { error: "not here" }, origin);
  } catch (e) {
    console.error(new Date().toISOString(), e.message);
    send(res, 503, { error: "brain busy" }, origin);
  }
});

server.listen(PORT, "127.0.0.1", () => console.log(`Dumpling brain on http://127.0.0.1:${PORT}  model=${MODEL}`));
