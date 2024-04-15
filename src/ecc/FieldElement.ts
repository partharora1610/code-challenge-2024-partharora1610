import { IOperable } from "./Operable";
import { mod, pow } from "../util/BigIntMath";

export class FieldElement implements IOperable {
  constructor(readonly num: bigint, readonly prime: bigint) {
    if (num >= prime || num < 0n) {
      throw new Error(`Num ${num} not in field range 0 ${prime - 1n}`);
    }
    this.num = num;
    this.prime = prime;
  }

  public toString() {
    return `FieldElement_${this.prime}(${this.num})`;
  }

  public eq(other: FieldElement): boolean {
    if (!other) return false;
    return this.prime === other.prime && this.num === other.num;
  }

  public neq(other: FieldElement): boolean {
    return !this.eq(other);
  }

  public add(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw new Error(`Cannot addd two numbers in different Fields`);
    }
    const num = mod(this.num + other.num, this.prime);
    return new FieldElement(num, this.prime);
  }

  public sub(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw new Error(`Cannot add two numbers in different Fields`);
    }
    const num = mod(this.num - other.num, this.prime);
    return new FieldElement(num, this.prime);
  }

  public mul(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw new Error(`Cannot multiply two numbers in different Fields`);
    }
    const num = mod(this.num * other.num, this.prime);
    return new FieldElement(num, this.prime);
  }

  public div(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw new Error(`Cannot divide two numbers in different Fields`);
    }
    const num = mod(
      this.num * pow(other.num, this.prime - 2n, this.prime),
      this.prime
    );
    return new FieldElement(num, this.prime);
  }

  public pow(exponent: bigint): FieldElement {
    exponent = mod(exponent, this.prime - 1n);
    const num = pow(this.num, exponent, this.prime);
    return new FieldElement(num, this.prime);
  }

  public smul(scalar: bigint): FieldElement {
    const num = mod(this.num * scalar, this.prime);
    return new FieldElement(num, this.prime);
  }
}
