import { Block } from "./Block";
import { Tx } from "./Tx";

export class Blockchain {
  chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(): Block {
    return new Block(
      BigInt(1),
      Buffer.from(
        "0000000000000000000000000000000000000000000000000000000000000000",
        "hex"
      ),
      Buffer.from(
        "0000000000000000000000000000000000000000000000000000000000000000",
        "hex"
      ),
      BigInt(Math.floor(Date.now() / 1000)),
      Buffer.from("ffff001d", "hex"),
      Buffer.from("00000000", "hex")
    );
  }

  toString(): string {
    return this.chain.map((block) => block.toString()).join("\n");
  }

  addBlock(block: Block): void {
    this.chain.push(block);
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
}
