import crypto from "crypto";
import { hash160 } from "../util/Hash160";
import { hash256 } from "../util/Hash256";
import { bigFromBuf } from "../util/BigIntUtil";
import { S256Point } from "../ecc/S256Point";
import { Signature } from "../ecc/Signature";
import { OpCode } from "./opcode";

export function opRipemd160(stack: Buffer[]): boolean {
  if (!stack.length) {
    return false;
  }

  const input = stack.pop();
  const output = crypto.createHash("ripemd160").update(input).digest();
  stack.push(output);

  return true;
}

export function opSha1(stack: Buffer[]): boolean {
  if (!stack.length) {
    return false;
  }

  const input = stack.pop();
  const output = crypto.createHash("sha1").update(input).digest();
  stack.push(output);

  return true;
}

export function opSha256(stack: Buffer[]): boolean {
  if (!stack.length) {
    return false;
  }

  const input = stack.pop();
  const output = crypto.createHash("sha256").update(input).digest();
  stack.push(output);

  return true;
}

export function opHash160(stack: Buffer[]): boolean {
  if (!stack.length) {
    return false;
  }

  const element = stack.pop() as Buffer;

  if (!Buffer.isBuffer(element)) {
    return false;
  }

  stack.push(hash160(element));

  return true;
}

export function opHash256(stack: Buffer[]): boolean {
  if (!stack.length) {
    return false;
  }

  const element: Buffer = stack.pop() as Buffer;

  if (!Buffer.isBuffer(element)) {
    return false;
  }

  stack.push(hash256(element));

  return true;
}

export function opCheckSig(stack: Buffer[], z: Buffer): boolean {
  if (stack.length < 2) {
    return false;
  }

  stack.pop();

  const pkBuf = stack.pop();
  const sigBuf = stack.pop();

  let pk: S256Point;
  let sig: Signature;

  try {
    pk = S256Point.parse(pkBuf);
    sig = Signature.parse(sigBuf.slice(0, sigBuf.length - 1));
  } catch (ex) {
    return op0(stack);
  }

  if (pk.verify(bigFromBuf(z), sig)) {
    op1(stack);
  } else {
    op0(stack);
  }

  return true;
}

export function op0(stack: Buffer[]): boolean {
  stack.push(encodeNum(0n));
  return true;
}

export function op1(stack: Buffer[]): boolean {
  stack.push(encodeNum(1n));
  return true;
}

export function op2(stack: Buffer[]): boolean {
  stack.push(encodeNum(2n));
  return true;
}

export function op3(stack: Buffer[]): boolean {
  stack.push(encodeNum(3n));
  return true;
}

export function opCheckSigVerify(stack: Buffer[], z: Buffer): boolean {
  return opCheckSig(stack, z) && opVerify(stack);
}

export function opVerify(stack: Buffer[]): boolean {
  if (!stack.length) {
    return false;
  }

  const top = stack[stack.length - 1];

  if (top.length === 0) {
    return false;
  }

  return true;
}

export function opEqual(stack: Buffer[]): boolean {
  if (stack.length < 2) {
    return false;
  }

  const a = stack.pop();
  const b = stack.pop();

  const result = a.equals(b);

  if (!result) {
    op0(stack);
  } else {
    op1(stack);
  }

  return true;
}

export function opEqualVerify(stack: Buffer[]): boolean {
  if (!opEqual(stack)) {
    return false;
  }

  if (!opVerify(stack)) {
    return false;
  }

  return true;
}

export function opDup(stack: Buffer[]): boolean {
  if (!stack.length) {
    return false;
  }

  stack.push(stack[stack.length - 1]);

  return true;
}

export function opCheckMultiSig(stack: Buffer[], z: Buffer): boolean {
  if (stack.length < 1) {
    return false;
  }

  const n = decodeNum(stack.pop());

  if (stack.length < n) {
    return false;
  }

  const secPubKeys: Buffer[] = [];
  for (let i = 0; i < n; i++) {
    secPubKeys.push(stack.pop());
  }

  const m = decodeNum(stack.pop());

  if (stack.length < m) {
    return false;
  }

  const derSigs: Buffer[] = [];
  for (let i = 0; i < m; i++) {
    derSigs.push(stack.pop());
  }

  if (!stack.length) {
    return false;
  }
  stack.pop();

  try {
    const pubkeys = secPubKeys.map((p) => S256Point.parse(p));
    const sigs = derSigs.map((p) => Signature.parse(p.slice(0, p.length - 1)));

    for (const sig of sigs) {
      if (pubkeys.length === 0) {
        op0(stack);
        break;
      }

      while (pubkeys.length) {
        const pubkey = pubkeys.shift();
        if (pubkey.verify(bigFromBuf(z), sig)) {
          break;
        }
      }
    }
    op1(stack);
  } catch (ex) {
    return op0(stack);
  }

  return true;
}

export const Operations = {
  [OpCode.OP_EQUAL]: opEqual,
  [OpCode.OP_EQUALVERIFY]: opEqualVerify,
  [OpCode.OP_0]: op0,
  [OpCode.OP_1]: op1,
  [OpCode.OP_2]: op2,
  [OpCode.OP_3]: op3,

  // Stack
  [OpCode.OP_DUP]: opDup,

  // Crypto
  [OpCode.OP_RIPEMD160]: opRipemd160,
  [OpCode.OP_SHA1]: opSha1,
  [OpCode.OP_SHA256]: opSha256,
  [OpCode.OP_HASH160]: opHash160,
  [OpCode.OP_HASH256]: opHash256,
  [OpCode.OP_CHECKSIG]: opCheckSig,
  [OpCode.OP_CHECKSIGVERIFY]: opCheckSigVerify,
  [OpCode.OP_CHECKMULTISIG]: opCheckMultiSig,
};

// Create new file for these functions
export function encodeNum(num: bigint): Buffer {
  if (num === 0n) {
    return Buffer.alloc(0);
  }

  const bytes = [];
  const neg = num < 0;
  let abs = num > 0 ? num : -num;

  while (abs > 0) {
    bytes.push(Number(abs & BigInt(0xff)));
    abs >>= 8n;
  }

  if (bytes[bytes.length - 1] & 0x80) {
    if (neg) {
      bytes.push(0x80);
    } else {
      bytes.push(0x00);
    }
  } else {
    if (neg) {
      bytes[bytes.length - 1] |= 0x80;
    }
  }

  return Buffer.from(bytes);
}

export function decodeNum(buf: Buffer): bigint {
  if (buf.length === 0) {
    return 0n;
  }

  const be = Buffer.from(buf).reverse();

  let neg = false;
  let result = 0n;

  if (be[0] & 0x80) {
    neg = true;
    be[0] = be[0] & 0x7f;
  }

  result = BigInt(be[0]);

  for (let i = 1; i < be.length; i++) {
    result <<= 8n;
    result += BigInt(be[i]);
  }

  if (neg) {
    return -result;
  } else {
    return result;
  }
}
