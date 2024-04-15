import { Readable } from "stream";
import { combine } from "./util/BufferUtil";
import { bigFromBufLE, bigToBufLE } from "./util/BigIntUtil";
import { Script } from "./Script";

export class TxOut {
  public amount: bigint;
  public scriptPubKey: Script;

  constructor(amount: bigint, scriptPubKey: Script) {
    this.amount = amount;
    this.scriptPubKey = scriptPubKey;
  }

  public toString() {
    return `${this.amount}:${this.scriptPubKey}`;
  }

  public serialize(): Buffer {
    return combine(bigToBufLE(this.amount, 8), this.scriptPubKey.serialize());
  }
}
