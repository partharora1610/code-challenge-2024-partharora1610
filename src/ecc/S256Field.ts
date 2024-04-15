import { FieldElement } from "./FieldElement";

export class S256Field extends FieldElement {
  public static P = 2n ** 256n - 2n ** 32n - 977n;

  constructor(num: bigint) {
    super(num, S256Field.P);
  }

  public sqrt(): S256Field {
    const r = this.pow((S256Field.P + 1n) / 4n);
    return new S256Field(r.num);
  }
}
