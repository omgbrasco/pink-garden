// Web Push for iPhone home-screen apps, with zero npm packages (RFC 8291 encryption + RFC 8292 VAPID).
import crypto from "node:crypto";
import fs from "node:fs";

const b64u = buf => Buffer.from(buf).toString("base64url");
const unb64u = s => Buffer.from(String(s), "base64url");
const hmac = (key, data) => crypto.createHmac("sha256", key).update(data).digest();

export function loadOrMakeVapid(file) {
  try { const v = JSON.parse(fs.readFileSync(file, "utf8")); if (v.publicKey && v.privateJwk) return v; } catch {}
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const jwk = publicKey.export({ format: "jwk" });
  const raw = Buffer.concat([Buffer.from([4]), unb64u(jwk.x), unb64u(jwk.y)]);
  const v = { publicKey: b64u(raw), privateJwk: privateKey.export({ format: "jwk" }) };
  fs.writeFileSync(file, JSON.stringify(v));
  return v;
}

function vapidHeader(endpoint, vapid, subject) {
  const aud = new URL(endpoint).origin;
  const head = b64u(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const body = b64u(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: subject }));
  const key = crypto.createPrivateKey({ key: vapid.privateJwk, format: "jwk" });
  const sig = crypto.sign("sha256", Buffer.from(head + "." + body), { key, dsaEncoding: "ieee-p1363" });
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${vapid.publicKey}`;
}

export function encrypt(sub, payload, _salt, _ecdh) {
  const uaPublic = unb64u(sub.keys.p256dh);
  const authSecret = unb64u(sub.keys.auth);
  const ecdh = _ecdh || crypto.createECDH("prime256v1");
  if (!_ecdh) ecdh.generateKeys();
  const asPublic = ecdh.getPublicKey();
  const shared = ecdh.computeSecret(uaPublic);
  const salt = _salt || crypto.randomBytes(16);
  const prkKey = hmac(authSecret, shared);
  const keyInfo = Buffer.concat([Buffer.from("WebPush: info\0"), uaPublic, asPublic]);
  const ikm = hmac(prkKey, Buffer.concat([keyInfo, Buffer.from([1])]));
  const prk = hmac(salt, ikm);
  const cek = hmac(prk, Buffer.from("Content-Encoding: aes128gcm\0\x01", "latin1")).subarray(0, 16);
  const nonce = hmac(prk, Buffer.from("Content-Encoding: nonce\0\x01", "latin1")).subarray(0, 12);
  const c = crypto.createCipheriv("aes-128-gcm", cek, nonce);
  const ct = Buffer.concat([c.update(Buffer.concat([Buffer.from(payload), Buffer.from([2])])), c.final(), c.getAuthTag()]);
  const rs = Buffer.alloc(4); rs.writeUInt32BE(4096);
  return Buffer.concat([salt, rs, Buffer.from([asPublic.length]), asPublic, ct]);
}

// Returns the HTTP status. 404/410 = subscription is dead, caller should drop it.
export async function sendPush(sub, data, vapid, subject) {
  const body = encrypt(sub, JSON.stringify(data));
  const r = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      "content-encoding": "aes128gcm", "content-type": "application/octet-stream",
      ttl: "86400", urgency: "high", authorization: vapidHeader(sub.endpoint, vapid, subject)
    },
    body, signal: AbortSignal.timeout(15000)
  });
  return r.status;
}
