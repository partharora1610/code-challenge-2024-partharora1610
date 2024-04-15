import { IOperable } from "./Operable";

export class IntElement implements IOperable {
  constructor(readonly value: bigint) {}

  public toString() {
    return `Real_${this.value.toString()}`;
  }

  public eq(other: IntElement): boolean {
    if (!other) return false;
    return this.value === other.value;
  }

  public neq(other: IntElement): boolean {
    return !this.eq(other);
  }

  public add(other: IntElement): IntElement {
    return new IntElement(this.value + other.value);
  }

  public sub(other: IntElement): IntElement {
    return new IntElement(this.value - other.value);
  }

  public mul(other: IntElement): IntElement {
    return new IntElement(this.value * other.value);
  }

  public div(other: IntElement): IntElement {
    return new IntElement(this.value / other.value);
  }

  public pow(exponent: bigint): IntElement {
    return new IntElement(this.value ** exponent);
  }

  public smul(scalar: bigint): IntElement {
    return new IntElement(this.value * scalar);
  }
}
