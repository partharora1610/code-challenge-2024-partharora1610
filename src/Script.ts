import { S256Point } from "./ecc/S256Point";
import { Operations } from "./operations/Operations";
import { OpCode } from "./operations/opcode";
import { bigToBufLE } from "./util/BigIntUtil";
import { combine } from "./util/BufferUtil";
import { hash160 } from "./util/Hash160";
import { sha256 } from "./util/Sha256";
import { encodeVarint } from "./util/Varint";

type ScriptOperation = number;

/**
 * Data will be stored in the form of Buffer
 */
type ScriptElement = Buffer;

/**
 * This represents a command in the Script
 */
export type ScriptCmd = ScriptOperation | ScriptElement;

export class Script {
  public cmds: ScriptCmd[];
  public scriptHex: string;
  private scriptBytes: Buffer;
  private scriptLength: number;
  private position: number;
  public asmScript: string;

  constructor(stack?: ScriptCmd[], scriptHex?: string, script_asm?: string) {
    this.cmds = stack || [];
    this.scriptHex = scriptHex || "";
    this.asmScript = script_asm;

    if (scriptHex) {
      this.scriptBytes = Buffer.from(scriptHex, "hex");
    } else {
      this.scriptBytes = Buffer.alloc(0);
    }

    this.scriptLength = this.scriptBytes.length;
    this.position = 0;

    this.parseScript();
  }

  /**
   * This is used to parse the script from the hex
   */
  public parseScript() {
    while (this.position < this.scriptLength) {
      const opcode = this.readOpcode();

      if (opcode === null) {
        throw new Error("Invalid opcode");
      }

      if (opcode.opcode === "PUSHDATA") {
        this.cmds.push(Buffer.from(opcode.data, "hex"));
      } else if (opcode.opcode === "OP_PUSHDATA1") {
        this.cmds.push(Buffer.from(opcode.data, "hex"));
      } else if (opcode.opcode === "OP_PUSHDATA2") {
        // console.log("Not supported yet");
      } else {
        this.cmds.push(OpCode[opcode.opcode]);
      }
    }
  }

  /**
   * This is used to read the opcode from the script
   * @returns
   */
  private readOpcode(): {
    opcode: string;
    data?: string;
    code?: string;
  } {
    if (this.position >= this.scriptLength) {
      return null;
    }
    const opcode = this.scriptBytes.readUInt8(this.position);
    this.position++;
    if (opcode === 0x00) {
      return { opcode: "OP_0" };
    } else if (opcode >= 0x01 && opcode <= 0x4b) {
      const data = this.scriptBytes.slice(
        this.position,
        this.position + opcode
      );
      this.position += opcode;
      return { opcode: "PUSHDATA", data: data.toString("hex") };
    } else if (opcode === 0x4c) {
      const dataLength = this.scriptBytes.readUInt8(this.position);
      this.position++;
      const data = this.scriptBytes.slice(
        this.position,
        this.position + dataLength
      );
      this.position += dataLength;
      return { opcode: "OP_PUSHDATA1", data: data.toString("hex") };
    } else if (opcode in OpCode) {
      return { opcode: OpCode[opcode] };
    } else {
      return { opcode: opcode.toString(16) };
    }
  }

  /**
   * This is used to intialize the TxObject from the json data
   * @param array
   * @returns ScriptCmd[]
   */
  public static parseWitnessIntoCommand(array): ScriptCmd[] {
    const asm_commands = [];
    for (const item of array) {
      asm_commands.push(Buffer.from(item, "hex"));
    }
    return asm_commands;
  }

  /**
   * This is used to serialize the ScriptCmd[] into Buffers
   * @returns Buffer
   */
  public serialize(): Buffer {
    const scriptData = this.serializeCmds();
    const scriptDataLen = encodeVarint(BigInt(scriptData.length));

    return combine(scriptDataLen, scriptData);
  }

  public serializeCmds(): Buffer {
    const results: Buffer[] = [];

    for (const op of this.cmds) {
      if (typeof op === "number") {
        const opBuf = Buffer.from([op]);
        results.push(opBuf);
      } else if (op instanceof Buffer) {
        if (op.length >= 1 && op.length <= 75) {
          results.push(Buffer.from([op.length]));
          results.push(op);
        } else if (op.length >= 76 && op.length <= 255) {
          results.push(Buffer.from([OpCode.OP_PUSHDATA1]));
          results.push(Buffer.from([op.length]));
          results.push(op);
        } else if (op.length >= 256 && op.length <= 520) {
          results.push(Buffer.from([OpCode.OP_PUSHDATA2]));
          results.push(bigToBufLE(BigInt(op.length), 2));
          results.push(op);
        } else {
          throw new Error("Data too long");
        }
      } else {
        // throw new Error("Unknown data");
      }
    }

    return Buffer.concat(results);
  }

  /**
   * This is a prestep while evaluating the legacy script
   * where we place scriptSig and scriptPubKey together and evaluate
   *
   * @param script
   * @returns
   */
  public add(script: Script): Script {
    const cmds = [];
    cmds.push(...this.cmds);
    cmds.push(...script.cmds);
    return new Script(cmds);
  }

  /**
   * Checks whether a script follows the P2PKH locking script
   *
   * @returns boolean
   */
  public isP2PKHLock(): boolean {
    if (this.cmds.length !== 5) {
      return false;
    }

    if (this.cmds[0] !== OpCode.OP_DUP) {
      return false;
    }

    if (this.cmds[1] !== OpCode.OP_HASH160) {
      return false;
    }

    const publicKeyHash = this.cmds[2];
    if (!(publicKeyHash instanceof Buffer) || publicKeyHash.length !== 20) {
      return false;
    }

    if (this.cmds[3] !== OpCode.OP_EQUALVERIFY) {
      return false;
    }

    if (this.cmds[4] !== OpCode.OP_CHECKSIG) {
      return false;
    }

    return true;
  }

  /**
   * Checks whether a script follows the P2WPKH locking script
   *
   * @returns boolean
   */
  public isP2WPKHLock(): boolean {
    if (this.cmds.length !== 2) {
      return false;
    }

    if (this.cmds[0] !== OpCode.OP_0) {
      return false;
    }

    const publicKeyHash = this.cmds[1];
    if (!(publicKeyHash instanceof Buffer) || publicKeyHash.length !== 20) {
      return false;
    }

    return true;
  }

  /**
   * Checks whether a script follows the P2WSH locking script
   *
   * @returns boolean
   */
  public isP2SHLock(): boolean {
    return (
      this.cmds.length === 3 &&
      this.cmds[0] === OpCode.OP_HASH160 &&
      (this.cmds[1] as Buffer).length === 20 &&
      this.cmds[2] === OpCode.OP_EQUAL
    );
  }

  /**
   * Checks whether a script follows the P2WSH locking script
   *
   * @returns boolean
   */
  public isP2WSHLock(): boolean {
    return (
      this.cmds.length === 2 &&
      this.cmds[0] === OpCode.OP_0 &&
      (this.cmds[1] as Buffer).length === 32
    );
  }

  // I dont need this will remove this from here
  public isP2TRLock(): boolean {
    return true;
  }

  /**
   * Evaluate the script
   *
   * z is the preimage for the signature against which the signature is verified
   *
   * Witness script to evaluate segwit scripts, that is why it is optional we only while
   * evaluating the segwit scripts for example P2WPKH and P2WSH
   *
   * @param z: Buffer
   * @param witness: ScriptCmd[]
   * @returns boolean
   */
  public evaluate(z?: Buffer, witness?: ScriptCmd[]): boolean {
    const cmds = this.cmds.slice();
    const stack = [];

    while (cmds.length > 0) {
      const cmd = cmds.shift();

      if (typeof cmd === "number") {
        const operation = Operations[cmd];

        if (!operation) {
          return false;
        }

        if (cmd === OpCode.OP_IF || cmd === OpCode.OP_NOTIF) {
          if (!operation(stack, cmds)) {
            return false;
          }
        } else if (
          cmd === OpCode.OP_CHECKSIG ||
          cmd === OpCode.OP_CHECKSIGVERIFY ||
          cmd === OpCode.OP_CHECKMULTISIG ||
          cmd === OpCode.OP_CHECKMULTISIGVERIFY
        ) {
          if (!operation(stack, z)) {
            return false;
          }
        } else {
          if (!operation(stack)) {
            return false;
          }
        }
      } else {
        stack.push(cmd);

        if (
          stack.length === 2 &&
          (stack[0] as Buffer).length === 0 &&
          (stack[1] as Buffer).length === 20
        ) {
          const h160 = stack.pop();

          cmds.push(...witness);
          cmds.push(...p2pkhLock(h160).cmds);
        } else if (
          stack.length === 2 &&
          (stack[0] as Buffer).length === 0 &&
          (stack[1] as Buffer).length === 32
        ) {
          const s256 = stack.pop() as Buffer;

          stack.pop();

          // // need to change this
          // const witness = [
          //   Buffer.from(""),
          //   Buffer.from(
          //     "30440220632b9288099fb49f97231fa6fd1a5827feafbdec078371286a055fc2ac2db70b0220112661faf2b4a3a6155a85f58356550b050adaee0dc541e9c9dfab253f3b3b7101",
          //     "hex"
          //   ),
          //   Buffer.from(
          //     "304402203af48390599f6b78edd35c2761ad18019f09ae1df29e608b537be25021e5f547022013065326f5a87815f8e8de1cdef210ff41e7d4a76c399b9ea681f76dcab6377201",
          //     "hex"
          //   ),
          //   Buffer.from(
          //     "5221020d2922f329933405a8ba18ee7cdc7b0819f02a113b9e55fb19a44b4cf1549dd42103d26b127f1dd700779f1d579233d99317e6e16075c9e5b6e3c9e069173ddcc3382102b144f7316d67b66aeb3b76095996e974899886c715d431ebb78c22e09a0e7ee353ae",
          //     "hex"
          //   ),
          // ];

          const redeemScriptBuf = witness.pop() as Buffer;

          if (!redeemScriptBuf || !s256.equals(sha256(redeemScriptBuf))) {
            return false;
          }

          cmds.push(...witness);

          const redeemScript = new Script([], redeemScriptBuf.toString("hex"));

          cmds.push(...redeemScript.cmds);
        }
      }
    }

    if (stack.length === 0) {
      return false;
    }

    if (Buffer.alloc(0).equals(stack.pop())) {
      return false;
    }

    return true;
  }
}

// Move this to a separate file maybe factories ??
// This is creating a P2PKH Locking Script from the given hash160
function p2pkhLock(h160: Buffer): Script {
  return new Script([
    OpCode.OP_DUP,
    OpCode.OP_HASH160,
    h160,
    OpCode.OP_EQUALVERIFY,
    OpCode.OP_CHECKSIG,
  ]);
}
