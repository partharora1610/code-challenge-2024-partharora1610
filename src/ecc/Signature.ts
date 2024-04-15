import { bigToBuf, bigFromBuf } from "../util/BigIntUtil";
import * as bufutil from "../util/BufferUtil";

export class Signature {
  constructor(readonly r: bigint, readonly s: bigint) {}

  public static parse(buffer: Buffer) {
    let pos = 0;

    const prefix = buffer.readUInt8(pos);
    if (prefix !== 0x30) {
      throw new Error("Bad signature");
    }
    pos += 1;

    const len = buffer.readUInt8(pos);
    if (len + 2 !== buffer.length) {
      throw new Error("Bad signature length");
    }
    pos += 1;

    // verify marker byte
    let marker = buffer.readUInt8(pos);
    if (marker !== 0x02) {
      throw new Error("Bad signature");
    }
    pos += 1;

    // read r-length
    const rlen = buffer.readUInt8(pos);
    pos += 1;

    const r = bigFromBuf(buffer.slice(pos, pos + rlen));
    pos += rlen;

    marker = buffer.readUInt8(pos);
    if (marker !== 0x02) {
      throw new Error("Bad signature");
    }
    pos += 1;

    const slen = buffer.readUInt8(pos);
    pos += 1;

    const s = bigFromBuf(buffer.slice(pos, pos + slen));
    pos += slen;

    return new Signature(r, s);
  }

  public toString() {
    return `Signature_${this.r}_${this.s}`;
  }

  public der() {
    const encodePart = (v: bigint) => {
      let bytes = bigToBuf(v);

      bytes = bufutil.lstrip(bytes, 0x00);

      if (bytes[0] & 0x80) {
        bytes = Buffer.concat([Buffer.from([0x00]), bytes]);
      }

      return Buffer.concat([Buffer.from([2, bytes.length]), bytes]);
    };

    const r = encodePart(this.r);
    const s = encodePart(this.s);

    return Buffer.concat([Buffer.from([0x30, r.length + s.length]), r, s]);
  }
}
