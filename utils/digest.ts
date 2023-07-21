export function sha256(i: string | Uint8Array | ArrayBuffer): string {
  // return crypto.createHash('sha256').update(str).digest('hex');
  const hashr = new Bun.CryptoHasher("sha256")
  hashr.update(i)
  return hashr.digest("hex");
}
