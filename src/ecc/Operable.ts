export interface IOperable {
  eq(other: IOperable): boolean;
  neq(other: IOperable): boolean;
  add(other: IOperable): IOperable;
  sub(other: IOperable): IOperable;
  mul(other: IOperable): IOperable;
  div(other: IOperable): IOperable;
  pow(exponent: bigint): IOperable;
  smul(scalar: bigint): IOperable;
}
