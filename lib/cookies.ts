import { compactDecrypt, CompactEncrypt } from 'jose';

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  return new Uint8Array([...binary].map(c => c.charCodeAt(0)));
}

const getKey = async () => {
  const rawKey = base64ToUint8Array(process.env.APP_KEY!);
  return crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptCookie(data: object) {
  const enc = new TextEncoder();
  const keyPromise = getKey();
  const payload = enc.encode(JSON.stringify(data));
  const jwe = await new CompactEncrypt(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(await keyPromise);
  return jwe;
}

export async function decryptCookie(jwe: string) {
  const keyPromise = getKey();
  const { plaintext } = await compactDecrypt(jwe, await keyPromise);
  return JSON.parse(new TextDecoder().decode(plaintext));
}
