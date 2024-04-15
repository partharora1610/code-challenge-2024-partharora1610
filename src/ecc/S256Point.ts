import { Point } from "./Point";
import { S256Field } from "./S256Field";
import { mod, pow } from "../util/BigIntMath";
import { Signature } from "./Signature";
import { bigToBuf, bigFromBuf } from "../util/BigIntUtil";
import { hash160 } from "../util/Hash160";

export class S256Point extends Point<S256Field> {
  public static a = 0n;

  public static b = 7n;

  public static N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"); // prettier-ignore

  public static G = new S256Point(
    BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
    BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"),
  ); // prettier-ignore

  public static Infinity = new S256Point(undefined, undefined);

  public static parse(buf: Buffer): S256Point {
    if (buf[0] === 0x04) {
      const x = bigFromBuf(buf.slice(1, 33));
      const y = bigFromBuf(buf.slice(33, 65));
      return new S256Point(x, y);
    } else {
      const x = new S256Field(bigFromBuf(buf.slice(1)));

      const right = x.pow(3n).add(new S256Field(S256Point.b));

      const beta = new S256Field(right.num).sqrt();

      let evenBeta: S256Field;
      let oddBeta: S256Field;

      if (beta.num % 2n === 0n) {
        evenBeta = beta;
        oddBeta = new S256Field(S256Field.P - beta.num);
      } else {
        evenBeta = new S256Field(S256Field.P - beta.num);
        oddBeta = beta;
      }

      const isEven = buf[0] === 0x02;
      if (isEven) {
        return new S256Point(x.num, evenBeta.num);
      } else {
        return new S256Point(x.num, oddBeta.num);
      }
    }
  }

  constructor(x: bigint, y: bigint) {
    super(
      x ? new S256Field(x) : undefined,
      y ? new S256Field(y) : undefined,
      new S256Field(S256Point.a),
      new S256Field(S256Point.b)
    );
  }

  public smul(scalar: bigint) {
    scalar = mod(scalar, S256Point.N);
    const point = super.smul(scalar);
    return new S256Point(
      point.x ? point.x.num : undefined,
      point.y ? point.y.num : undefined
    );
  }

  public verify(z: bigint, sig: Signature): boolean {
    const sinv = pow(sig.s, S256Point.N - 2n, S256Point.N);
    const u = mod(z * sinv, S256Point.N);
    const v = mod(sig.r * sinv, S256Point.N);
    const total = S256Point.G.smul(u).add(this.smul(v));
    return sig.r === total.x.num;
  }

  public sec(compressed: boolean = false): Buffer {
    if (compressed) {
      const prefix = this.y.num % 2n === 0n ? 2 : 3;
      return Buffer.concat([Buffer.from([prefix]), bigToBuf(this.x.num)]);
    } else {
      return Buffer.concat([
        Buffer.from([0x04]),
        bigToBuf(this.x.num),
        bigToBuf(this.y.num),
      ]);
    }
  }

  public hash160(compressed: boolean = true): Buffer {
    return hash160(this.sec(compressed));
  }
}
