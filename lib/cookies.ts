const encoder = new TextEncoder();
const decoder = new TextDecoder();

let _keyPromise: Promise<CryptoKey> | null = null;
function getKey(): Promise<CryptoKey> {
  if (!_keyPromise) {
    const rawKey = Uint8Array.from(atob(process.env.APP_KEY!), c => c.charCodeAt(0));
    _keyPromise = crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  }
  return _keyPromise;
}

function base64urlEncode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

export async function signCookie(data: object): Promise<string> {
  const key = await getKey();
  const payload = encoder.encode(JSON.stringify(data));
  const sig = await crypto.subtle.sign("HMAC", key, payload);
  return base64urlEncode(payload.buffer) + "." + base64urlEncode(sig);
}

export async function verifyCookie(cookie: string): Promise<any | null> {
  const key = await getKey();
  const [payloadB64, sigB64] = cookie.split(".");
  const payload = base64urlDecode(payloadB64);
  const sig = base64urlDecode(sigB64);

  const ok = await crypto.subtle.verify("HMAC", key, sig as BufferSource, payload as BufferSource);
  if (!ok) return null;
  return JSON.parse(decoder.decode(payload));
}
