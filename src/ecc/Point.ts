import { IOperable } from "./Operable";

export class Point<T extends IOperable> {
  public static infinity<T extends IOperable>(a: T, b: T) {
    return new Point(undefined, undefined, a, b);
  }

  constructor(readonly x: T, readonly y: T, readonly a: T, readonly b: T) {
    if (x === undefined && y === undefined) {
      return;
    }
    // y ** 2 !== x ** 3 + a * x + b
    if (y.pow(2n).neq(x.pow(3n).add(a.mul(x)).add(b))) {
      throw new Error(`(${x}, ${y}) is not on the curve`);
    }
  }

  public toString() {
    if (this.x === undefined) {
      return "Point(infinity)";
    } else {
      return `Point(${this.x},${this.y})_${this.a}_${this.b}`;
    }
  }

  public eq(other: Point<T>): boolean {
    if (!other) return false;
    return (
      ((this.x && this.x.eq(other.x)) || (!this.x && !other.x)) &&
      ((this.y && this.y.eq(other.y)) || (!this.y && !other.y)) &&
      this.a.eq(other.a) &&
      this.b.eq(other.b)
    );
  }

  public neq(other: Point<T>): boolean {
    return !this.eq(other);
  }

  public onCurve(x: IOperable, y: IOperable): boolean {
    // y ** 2n === x ** 3n + this.a * x + this.b
    return y.pow(2n).eq(x.pow(3n).add(this.a.mul(x).add(this.b)));
  }

  public add(other: Point<T>): Point<T> {
    if (this.a.neq(other.a) || this.b.neq(other.b)) {
      throw new Error(`Points ${this} and ${other} are not on same curve`);
    }

    if (this.x === undefined) return other;

    if (other.x === undefined) return this;

    if (this.x.eq(other.x) && this.y.neq(other.y)) {
      return Point.infinity(this.a, this.b);
    }

    if (this.x.neq(other.x)) {
      const s = other.y.sub(this.y).div(other.x.sub(this.x));
      const x = s.pow(2n).sub(this.x).sub(other.x) as T;
      const y = s.mul(this.x.sub(x)).sub(this.y) as T;
      return new Point<T>(x, y, this.a, this.b);
    }

    if (this.eq(other) && this.y.eq(this.x.smul(0n))) {
      return Point.infinity(this.a, this.b);
    }

    if (this.eq(other)) {
      const s = this.x.pow(2n).smul(3n).add(this.a).div(this.y.smul(2n));
      const x = s.pow(2n).sub(this.x.smul(2n)) as T;
      const y = s.mul(this.x.sub(x)).sub(this.y) as T;
      return new Point<T>(x, y, this.a, this.b);
    }
  }

  public smul(scalar: bigint): Point<T> {
    let current: Point<T> = this;
    let result = new Point<T>(undefined, undefined, this.a, this.b);
    while (scalar) {
      if (scalar & 1n) {
        result = result.add(current);
      }
      current = current.add(current);
      scalar = scalar >> 1n;
    }
    return result;
  }
}
