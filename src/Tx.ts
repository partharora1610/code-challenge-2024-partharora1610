import { Script, ScriptCmd } from "./Script";
import { TxIn } from "./TxIn";
import { TxOut } from "./TxOut";
import { p2pkhLock } from "./factory/script";
import { OpCode } from "./operations/opcode";
import { bigToBufLE } from "./util/BigIntUtil";
import { combine } from "./util/BufferUtil";
import { hash256 } from "./util/Hash256";
import { sha256 } from "./util/Sha256";
import { encodeVarint } from "./util/Varint";

export class Tx {
  public version: bigint;
  public readonly txIns: TxIn[];
  public readonly txOuts: TxOut[];
  public locktime: bigint;
  public segwit: boolean;

  private _hashPrevouts: Buffer;
  private _hashSequence: Buffer;
  private _hashOutputs: Buffer;

  // need to update this function
  // need to updated this to include wTxid commitnent as a 2 output to the transaction
  public static createCoinbaseTransaction(
    rewardAddress: string,
    rewardAmount: bigint,
    height: bigint
  ): Tx {
    const coinbaseTx = new Tx();

    coinbaseTx.version = 1n;

    const coinbaseInput = new TxIn(
      "0000000000000000000000000000000000000000000000000000000000000000",
      0xffffffffn,
      new Script(), // only need to figure out what will be this
      0xffffffffn
    );

    coinbaseTx.txIns.push(coinbaseInput);

    const coinbaseOutput = new TxOut(
      rewardAmount,
      new Script([], rewardAddress)
    );
    coinbaseTx.txOuts.push(coinbaseOutput);

    coinbaseTx.locktime = height;

    return coinbaseTx;
  }

  constructor(
    version: bigint = 1n,
    txIns: TxIn[] = [],
    txOuts: TxOut[] = [],
    locktime: bigint = 0n,
    segwit: boolean = false
  ) {
    this.version = version;
    this.txIns = txIns;
    this.txOuts = txOuts;
    this.locktime = locktime;
    this.segwit = segwit;
  }

  public toString() {
    const ins = this.txIns.map((p) => p.toString()).join("\n");
    const outs = this.txOuts.map((p) => p.toString()).join("\n");
    return [
      `version: ${this.version}`,
      `ins: ${ins}`,
      `outs: ${outs}`,
      `locktime: ${this.locktime}`,
      `segwit: ${this.segwit}`,
    ].join("\n");
  }

  public static isSegwit(data) {
    for (let i = 0; i < data.length; i++) {
      const input = data[i];
      const type = input.prevout.scriptpubkey_type;

      if (type == "v0_p2wpkh" || type == "v0_p2wsh") {
        return true;
      }
    }

    return false;
  }

  public fees(): bigint {
    let inAmt = 0n;
    for (const txIn of this.txIns) {
      inAmt += txIn.value();
    }
    let outAmt = 0n;
    for (const txOut of this.txOuts) {
      outAmt += txOut.amount;
    }
    return inAmt - outAmt;
  }

  public async verifyInput(idx: number): Promise<boolean> {
    const txIn = this.txIns[idx];

    // For p2tr scripts => Out of the scope of assignments so just validating inputs using p2tr scripts
    // if (txIn.scriptType == "v1_p2tr") {
    //   return true;
    // }

    const scriptPubKey = txIn.scriptPubKey();

    let z: Buffer;
    let witness: ScriptCmd[];

    // P2SH scripts
    if (scriptPubKey.isP2SHLock()) {
      const redeemBytes = txIn.scriptSig.cmds[
        txIn.scriptSig.cmds.length - 1
      ] as Buffer;

      const redeemScript = new Script([], redeemBytes.toString("hex"));

      // p2sh-p2wpkh
      // if (redeemScript.isP2WPKHLock()) {
      //   z = await this.sigHashSegwit(idx, redeemScript);
      //   witness = txIn.witness;
      // }

      // // p2sh-p2wsh
      // else if (redeemScript.isP2WSHLock()) {
      //   const witnessScriptBuf = txIn.witness[
      //     txIn.witness.length - 1
      //   ] as Buffer;

      //   const witnessScript = new Script([], witnessScriptBuf.toString("hex"));

      //   z = await this.sigHashSegwit(idx, undefined, witnessScript);
      //   witness = txIn.witness;
      // }

      // // only p2sh
      // else {
      // }
      z = await this.sigHashLegacy(idx, redeemScript);
      witness = undefined;
    }

    // P2PWKH scripts
    else if (scriptPubKey.isP2WPKHLock()) {
      z = await this.sigHashSegwit(idx);
      witness = txIn.witness;
    }

    // P2WSH scripts
    else if (scriptPubKey.isP2WSHLock()) {
      const witnessScriptBuf = txIn.witness[txIn.witness.length - 1] as Buffer;

      const witnessScript = new Script([], witnessScriptBuf.toString("hex"));

      z = await this.sigHashSegwit(idx, undefined, witnessScript);

      witness = txIn.witness;
    }

    // Legacy Scripts (P2PKH or P2Pk)
    else {
      try {
        z = await this.sigHashLegacy(idx);
      } catch (error) {
        throw new Error("Error in sigHashLegacy");
      }
      witness = undefined;
    }

    const combined = txIn.scriptSig.add(scriptPubKey);
    return combined.evaluate(z, witness);
  }

  public async verify(): Promise<boolean> {
    for (const txIn of this.txIns) {
      if (txIn.scriptType == "v1_p2tr") {
        return true;
      }
    }

    if ((await this.fees()) < 0) {
      return false;
    }

    for (let i = 0; i < this.txIns.length; i++) {
      if (!(await this.verifyInput(i))) {
        return false;
      }
    }

    return true;
  }

  public getTxID() {
    if (!this.segwit) {
      return sha256(sha256(this.serializeLegacy()));
    } else {
      return sha256(sha256(this.serializeSegwitTxID()));
    }
  }

  public serialize(): Buffer {
    if (this.segwit) {
      return this.serializeSegwit();
    } else {
      return this.serializeLegacy();
    }
  }

  public serializeLegacy(): Buffer {
    return combine(
      bigToBufLE(this.version, 4),

      encodeVarint(BigInt(this.txIns.length)),

      ...this.txIns.map((p) => p.serialize()),

      encodeVarint(BigInt(this.txOuts.length)),

      ...this.txOuts.map((p) => p.serialize()),

      bigToBufLE(this.locktime, 4)
    );
  }

  public serializeSegwit(): Buffer {
    return combine(
      bigToBufLE(this.version, 4),
      Buffer.from([0x00, 0x01]),
      encodeVarint(BigInt(this.txIns.length)),
      ...this.txIns.map((p) => p.serialize()),
      encodeVarint(BigInt(this.txOuts.length)),
      ...this.txOuts.map((p) => p.serialize()),
      this.serializeWitness(),
      bigToBufLE(this.locktime, 4)
    );
  }

  public serializeSegwitTxID(): Buffer {
    return combine(
      bigToBufLE(this.version, 4),
      encodeVarint(BigInt(this.txIns.length)),
      ...this.txIns.map((p) => p.serialize()),
      encodeVarint(BigInt(this.txOuts.length)),
      ...this.txOuts.map((p) => p.serialize()),
      bigToBufLE(this.locktime, 4)
    );
  }

  public serializeWitness(): Buffer {
    const bufs = [];

    for (const vin of this.txIns) {
      bufs.push(encodeVarint(vin.witness.length));

      for (const item of vin.witness) {
        if (Buffer.isBuffer(item)) {
          bufs.push(encodeVarint(item.length));
          bufs.push(item);
        } else {
          bufs.push(encodeVarint(1));
          bufs.push(encodeVarint(item as number));
        }
      }
    }

    return combine(...bufs);
  }

  public async sigHashSegwit(
    input: number,
    redeemScript?: Script,
    witnessScript?: Script
  ): Promise<Buffer> {
    const vin = this.txIns[input];
    const version = bigToBufLE(this.version, 4);

    const hashPrevouts = this.hashPrevouts();
    const hashSequence = this.hashSequence();

    const prevOut = Buffer.from(vin.prevTx, "hex").reverse();
    const prevIndex = bigToBufLE(vin.prevIndex, 4);

    let scriptCode: Buffer;

    if (witnessScript) {
      scriptCode = witnessScript.serialize();
    }

    // p2sh-p2wpkh
    else if (redeemScript) {
      scriptCode = p2pkhLock(redeemScript.cmds[1] as Buffer).serialize();
    }

    // p2wpkh - 0x1976a914{20-byte-pubkey-hash}88ac
    else {
      const prevScriptPubKey = await vin.scriptPubKey();

      const pkh160 = prevScriptPubKey.cmds[1] as Buffer;

      scriptCode = p2pkhLock(pkh160).serialize();
    }

    const value = bigToBufLE(await vin.value(), 8);
    const sequence = bigToBufLE(vin.sequence, 4);
    const hashOutputs = this.hashOutputs();
    const locktime = bigToBufLE(this.locktime, 4);
    const sigHashType = bigToBufLE(1n, 4);

    const preimage = combine(
      version,
      hashPrevouts,
      hashSequence,
      prevOut,
      prevIndex,
      scriptCode,
      value,
      sequence,
      hashOutputs,
      locktime,
      sigHashType
    );

    return hash256(preimage);
  }

  public hashOutputs() {
    if (this._hashOutputs) return this._hashOutputs;
    const buffers = [];

    for (const vout of this.txOuts) {
      buffers.push(vout.serialize());
    }

    this._hashOutputs = hash256(combine(...buffers));

    return this._hashOutputs;
  }

  public hashPrevouts() {
    if (this._hashPrevouts) return this._hashPrevouts;
    const buffers = [];
    for (const vin of this.txIns) {
      buffers.push(Buffer.from(vin.prevTx, "hex").reverse());
      buffers.push(bigToBufLE(vin.prevIndex, 4));
    }
    this._hashPrevouts = hash256(combine(...buffers));
    return this._hashPrevouts;
  }

  public hashSequence() {
    if (this._hashSequence) return this._hashSequence;
    const buffers = [];
    for (const vin of this.txIns) {
      buffers.push(bigToBufLE(vin.sequence, 4));
    }
    this._hashSequence = hash256(combine(...buffers));
    return this._hashSequence;
  }

  public async sigHashLegacy(
    input: number,
    redeemScript?: Script
  ): Promise<Buffer> {
    const version = bigToBufLE(this.version, 4);

    const txInLen = encodeVarint(BigInt(this.txIns.length));
    const txIns = [];

    for (let i = 0; i < this.txIns.length; i++) {
      const txIn = this.txIns[i];

      let script: Script;
      if (i !== input) {
        script = new Script();
      } else {
        if (redeemScript) {
          script = redeemScript;
        } else {
          script = this.txIns[i].prevTxScriptPubKey;
        }
      }

      const newTxIn = new TxIn(
        txIn.prevTx,
        txIn.prevIndex,
        script,
        txIn.sequence
      );

      const serialized = newTxIn.serialize();
      txIns.push(serialized);
    }

    const txOutLen = encodeVarint(BigInt(this.txOuts.length));

    const txOuts = this.txOuts.map((txOut) => txOut.serialize());

    const locktime = bigToBufLE(this.locktime, 4);
    const sigHashType = bigToBufLE(1n, 4);

    const z = hash256(
      combine(
        version,
        txInLen,
        ...txIns,
        txOutLen,
        ...txOuts,
        locktime,
        sigHashType
      )
    );

    return z;
  }

  public calculateWeight() {
    if (this.segwit) {
      return (
        this.serialize().length * 4 -
        this.serializeWitness().length * 3 -
        Buffer.from([0x00, 0x01]).length * 3
      );
    } else {
      return this.serialize().length * 4;
    }
  }
}
