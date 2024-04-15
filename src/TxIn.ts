import { combine } from "./util/BufferUtil";
import { bigToBufLE } from "./util/BigIntUtil";

import { Script, ScriptCmd } from "./Script";

export class TxIn {
  public prevTx: string;
  public prevIndex: bigint;
  public scriptSig: Script;
  public sequence: bigint;
  public witness: ScriptCmd[];

  public prevTxValue: bigint;
  public prevTxScriptPubKey: Script;
  public scriptType: string;

  constructor(
    prevTx: string,
    prevIndex: bigint,
    scriptSig: Script,
    sequence: bigint = BigInt(0xffffffff),
    prevTxScriptPubKey?: Script,
    prevTxValue?: bigint,
    witness: ScriptCmd[] = [],
    type?: string
  ) {
    this.prevTx = prevTx;
    this.prevIndex = prevIndex;
    this.scriptSig = scriptSig;
    this.sequence = sequence;
    this.prevTxScriptPubKey = prevTxScriptPubKey;
    this.prevTxValue = prevTxValue;
    this.witness = witness;
    this.scriptType = type;
  }

  public toString() {
    return `${this.prevTx}:${this.prevIndex}`;
  }

  public static usesSegwit(input) {
    const type = input.prevout.scriptpubkey_type;

    if (type == "v0_p2wpkh" || type == "v0_p2wsh") {
      return true;
    }

    return false;
  }

  public serialize(): Buffer {
    return combine(
      Buffer.from(this.prevTx, "hex").reverse(),
      bigToBufLE(this.prevIndex, 4),
      this.scriptSig.serialize(),
      bigToBufLE(this.sequence, 4)
    );
  }

  public value(): bigint {
    return this.prevTxValue;
  }

  public scriptPubKey(): Script {
    return this.prevTxScriptPubKey;
  }
}
