import crypto from "crypto";

export function hash256(buf: Buffer): Buffer {
  return crypto
    .createHash("sha256")
    .update(crypto.createHash("sha256").update(buf).digest())
    .digest();
}
