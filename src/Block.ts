import { writeBytesReverse, bufToStream } from "./util/BufferUtil";
import { hash256 } from "./util/Hash256";
import { bigFromBufLE } from "./util/BigIntUtil";
import { Readable } from "stream";

export class Block {
  public static parse(stream: Readable): Block {
    const version = bigFromBufLE(stream.read(4));

    const prevBlock = stream.read(32).reverse(); // convert to RPC byte order
    const merkleRoot = stream.read(32).reverse(); // convert to RPC byte order
    const timestamp = bigFromBufLE(stream.read(4));
    const bits = stream.read(4).reverse(); // convert LE to BE
    const nonce = stream.read(4).reverse(); // convert LE to BE
    return new Block(version, prevBlock, merkleRoot, timestamp, bits, nonce);
  }

  public version: bigint;
  public prevBlock: Buffer;
  public merkleRoot: Buffer;
  public timestamp: bigint;
  public bits: Buffer;
  public nonce: Buffer;
  // public txHashes: string[];

  /**
   * Represents a Block
   * @param version
   * @param prevBlock
   * @param merkleRoot
   * @param timestamp
   * @param bits
   * @param nonce
   */
  constructor(
    version: bigint,
    prevBlock: Buffer,
    merkleRoot: Buffer,
    timestamp: bigint,
    bits: Buffer,
    nonce: Buffer
  ) {
    this.version = version;
    this.prevBlock = prevBlock;
    this.merkleRoot = merkleRoot;
    this.timestamp = timestamp;
    this.bits = bits;
    this.nonce = nonce;
  }

  toString() {
    return `Block:this.version=${this.version},this.prevBlock=${this.prevBlock},this.merkleRoot=${this.merkleRoot},this.timestamp=${this.timestamp},this.bits=${this.bits},this.nonce=${this.nonce}`;
  }

  public serialize(): Buffer {
    const result = Buffer.alloc(4 + 32 + 32 + 4 + 4 + 4);
    let offset = 0;

    result.writeUInt32LE(Number(this.version), offset);
    offset += 4;

    writeBytesReverse(this.prevBlock, result, offset);
    offset += 32;

    writeBytesReverse(this.merkleRoot, result, offset);
    offset += 32;

    result.writeUInt32LE(Number(this.timestamp), offset);
    offset += 4;

    writeBytesReverse(this.bits, result, offset);
    offset += 4;

    writeBytesReverse(this.nonce, result, offset);
    offset += 4;

    return result;
  }

  public hash(): Buffer {
    return hash256(this.serialize());
  }

  public static mineBlock(
    version: Buffer,
    prevBlockHash: Buffer,
    merkleRoot: Buffer,
    bits: Buffer
  ) {
    let nonce = 0;
    let hash = "";

    while (true) {
      const timestamp = BigInt(Math.floor(Date.now() / 1000));

      const block = new Block(
        bigFromBufLE(version),
        prevBlockHash,
        merkleRoot,
        timestamp,
        bits,
        Buffer.alloc(4, nonce)
      );

      hash = block.hash().toString("hex");
      console.log(hash, "hash");

      if (hash.startsWith("0".repeat(4))) {
        return { block, hash };
      }

      nonce++;
    }
  }
}
