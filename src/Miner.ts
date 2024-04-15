import { Block } from "./Block";
import { Blockchain } from "./Blockchain";
import { Mempoll } from "./Mempoll";
import { Tx } from "./Tx";
import { merkleRoot } from "./util/MerkleUtil";
import {
  BLOCK_HEADER_SIZE,
  COINBASE_REWARD,
  COINBASE_TX_SIZE,
} from "./constants";
import fs from "fs";

export class Miner {
  public mempoll: Mempoll;
  public dp;
  public filled = 4000000;
  public feesCollected = 0;

  constructor(private blockchain: Blockchain) {
    this.mempoll = new Mempoll();
    this.dp = new Map();
    this.blockchain = blockchain;
  }

  public async mineBlock() {
    let maxBlockSize = 4000000;
    const tx = this.mempoll.txs;
    const fees = this.mempoll.feesArrayVector;
    const weights = this.mempoll.txWeightVector;

    const res = await this.fillBlock(
      maxBlockSize - BLOCK_HEADER_SIZE - COINBASE_TX_SIZE,
      tx,
      fees,
      weights
    );

    const coinbaseTx = Tx.createCoinbaseTransaction(
      "76a914df1855a61bb61e4476fdca867064ef62ecc4f8cc88ac", // random address from learnmeabitcoin
      BigInt(this.feesCollected + 625000000),
      1n
    );

    console.log("Coinbase Transaction: ");
    console.log(coinbaseTx);

    console.log("===================================================");

    console.log("Coinbase Transaction Added to the list of transaction ");
    res.unshift(coinbaseTx);

    const txid = res.map((tx) => tx.getTxID());

    // Data for mining the block
    const hashBuf = txid.map((tx) => Buffer.from(tx));
    const mr = merkleRoot(hashBuf);
    const version = Buffer.from("00000004", "hex");
    const hexString: string =
      "0000ffff00000000000000000000000000000000000000000000000000000000";
    const bigintValue: bigint = BigInt("0x" + hexString);
    const prevBlock = this.blockchain.getLatestBlock().hash();
    // The fuction is giving the wrong output so I am hardcoding the bits value
    const bits = Buffer.from("1f00ffff", "hex");

    /**
     * version
     * prevBlock
     * merkleRoot
     * timestamp
     * bits
     * nonce
     */
    const block = Block.mineBlock(version, prevBlock, mr, bits);
    // Adding block to the blockchain
    this.blockchain.addBlock(block.block);

    console.log("Block mined successfully!");
    console.log(block);

    console.log("Final Result of the block mining: ");
    console.log(this.filled);
    console.log(this.feesCollected);

    /**
     * WRITE TO THE OUTPUT.TXT FILE'
     * -------------------------------------------------
     * Format of the output.txt file:
     * Block: <block hash>
     * Coinbase Tx: <tx hash>
     * Tx: <tx hash>
     * Tx: <tx hash>
     * ...
     */
    writeToOutputFile(
      block.block.serialize().toString("hex"),
      coinbaseTx.serialize().toString("hex"),
      txid.map((tx) => tx.toString("hex"))
    );
  }

  public async fillBlock(
    maxBlockSize: number,
    tx: Tx[],
    fees: bigint[],
    weights: number[]
  ): Promise<Tx[]> {
    const feePerWeight = [];

    for (let i = 0; i < tx.length; i++) {
      feePerWeight.push(Number(fees[i]) / weights[i]);
    }

    let currentBlockSize = 0;

    const selectedTxs = [];
    const sortedIndices = feePerWeight
      .map((_, i) => i)
      .sort((a, b) => feePerWeight[b] - feePerWeight[a]);

    for (const index of sortedIndices) {
      const txSize = weights[index];

      if (currentBlockSize + txSize > maxBlockSize) {
        break;
      }

      const valid = await tx[index].verify();

      if (!valid) {
        continue;
      }

      // console.log(tx[index]);

      selectedTxs.push(tx[index]);
      currentBlockSize += txSize;

      this.feesCollected += Number(fees[index]);
      this.filled -= txSize;
    }

    return selectedTxs;
  }
}

// function difficultyToBits(difficulty: bigint): Buffer {
//   const difficultyHex: string = difficulty.toString(16);

//   const leadingZeros: number =
//     difficultyHex.length - difficultyHex.replace(/^0*/, "").length;
//   const exponent: number = (difficultyHex.length - leadingZeros + 1) * 2;

//   const paddedHex: string = difficultyHex.padStart(
//     Math.ceil(difficultyHex.length / 2) * 2,
//     "0"
//   );

//   const coefficient: string = paddedHex.substr(leadingZeros, 6).padEnd(6, "0");

//   const bitsBuffer: Buffer = Buffer.alloc(4);
//   bitsBuffer.writeUInt8(exponent, 0);
//   bitsBuffer.writeUIntBE(parseInt(coefficient, 16), 1, 3);

//   return bitsBuffer;
// }

function writeToOutputFile(blockHeader, coinbaseTxSerialized, transactionIds) {
  const outputData = `$${coinbaseTxSerialized}\n${transactionIds.join("\n")}`;

  fs.writeFile("output.txt", outputData, (err) => {
    if (err) {
      console.error("Error writing to output.txt:", err);
    } else {
      console.log("Output file generated successfully!");
    }
  });
}

export const constructBlockHeader = (
  version,
  timestamp,
  merkleRoot,
  bits,
  nonce
) => {};

/**
 * Result to the first run 
 * {
  block: Block {
    version: 67108864n,
    prevBlock: <Buffer dd 10 89 0b 9d ec 47 3f dc 8d c3 07 36 51 26 16 a8 25 6c 32 28 c7 16 fb c2 aa a4 be e8 52 a1 c3>,
    merkleRoot: <Buffer b4 58 8c 07 8b 08 32 6d 09 0f 9d 09 ca 1e 44 99 f5 a7 b6 7b 92 cb 36 85 b4 e6 fe ef e6 29 d9 13>,
    timestamp: 1713182777n,
    bits: <Buffer 1f 00 ff ff>,
    nonce: <Buffer a2 a2 a2 a2>
  },
  hash: '0000dde452f515d77a48a151caeea490a65c0b1abcd8ea4797d01f4c1c795365'
}
Final Result of the block mining: 
533 => block space left
31831992 => satoshis collected
Output file generated successfully!
 */

// 31831992 + 625000000 (coinbase reward) = 656831992

// exmple merkle root =>
// 0f245e80e40780318b266454212e136e7859320d2dc8d6c588a7823bb6b5ba2c
// b4588c078b08326d090f9d09ca1e4499f5a7b67b92cb3685b4e6feefe629d913
// rempv white spce from above line
