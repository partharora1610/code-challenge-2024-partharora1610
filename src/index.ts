import { Blockchain } from "./Blockchain";
import { Miner } from "./Miner";
import { Tx } from "./Tx";

// // const txs = [txData6];

// // const createTxObj = (data: any) => {
// //   return new Tx(
// //     BigInt(data.version),
// //     data.vin.map((vin) => {
// //       let witness = [];

// //       if (TxIn.usesSegwit(vin)) {
// //         witness = Script.parseWitnessIntoCommand(vin.witness);
// //       }

// //       return new TxIn(
// //         vin.txid,
// //         BigInt(vin.vout),
// //         new Script([], vin.scriptsig),
// //         BigInt(vin.sequence),
// //         new Script([], vin.prevout.scriptpubkey),
// //         BigInt(vin.prevout.value),
// //         witness,
// //         vin.prevout.scriptpubkey_type
// //       );
// //     }),
// //     data.vout.map(
// //       (vout) => new TxOut(BigInt(vout.value), new Script([], vout.scriptpubkey))
// //     ),
// //     BigInt(data.locktime),
// //     Tx.isSegwit(data.vin)
// //   );
// // };

// // const validate = async (newTx: Tx) => {
// //   const verified = await newTx.verify();

// //   if (verified) {
// //     console.log("TX is valid");
// //   } else {
// //     console.log("Tx is invalid");
// //   }
// // };
// // const txids = [];

// // for (const tx of txs) {
// //   const newTx = createTxObj(tx);
// //   const txid = sha256(sha256(newTx.serialize()));
// // }

// // const fs = require("fs");
// // const path = require("path");
// // const folderPath = "./mempool";

// // let total = 0;
// // let valid = 0;
// // let invalid = 0;

// // fs.readdir(folderPath, async (err, files) => {
// //   if (err) {
// //     console.error("Error reading folder:", err);
// //     return;
// //   }

// //   const jsonFiles = files.filter(
// //     (file) => path.extname(file).toLowerCase() === ".json"
// //   );

// //   for (const jsonFile of jsonFiles) {
// //     const filePath = path.join(folderPath, jsonFile);

// //     try {
// //       const data = await fs.promises.readFile(filePath, "utf8");
// //       const jsonData = JSON.parse(data);

// //       if (jsonData.vin[0].prevout.scriptpubkey_type === "p2pkh") {
// //         total++;

// //         const newTx = createTxObj(jsonData);

// //         const verified = await newTx.verify();

// //         if (verified) {
// //           valid++;
// //         } else {
// //           invalid++;
// //         }
// //       }
// //     } catch (err) {
// //       console.error("Error reading file:", filePath, err);
// //     }
// //   }
// //   console.log("Final Result");
// //   console.log(
// //     "Total Transactions:",
// //     total,
// //     "Valid Transactions:",
// //     valid,
// //     "Invalid Transactions:",
// //     invalid
// //   );
// // });

// function extractBits(targetHex: string): {
//   exponent: number;
//   coefficient: number;
// } {
//   const target: number = parseInt(targetHex, 16);

//   const exponent: number = Math.ceil(Math.log2(target) / 8) + 3;

//   const coefficient: number = target / Math.pow(2, 8 * (exponent - 3));

//   return { exponent, coefficient };
// }

// // Example usage:
// const targetHex: string =
//   "0000ffff00000000000000000000000000000000000000000000000000000000";
// const { exponent, coefficient } = extractBits(targetHex);

// console.log("Exponent:", exponent);
// console.log("Coefficient:", coefficient.toString(16));

// // =========================================================
// // function calculateTarget(exponent: number, coefficient: number): string {
// //   const target: number = coefficient * Math.pow(2, 8 * (exponent - 3));

// //   // Convert target to hexadecimal string
// //   const targetHex: string = target.toString(16);

// //   return targetHex;
// // }

// // // Example usage:
// // const exponent: number = 0x17;
// // const coefficient: number = 0x05dd01;

// // const target: string = calculateTarget(exponent, coefficient);
// // console.log(targetHex);

// import crypto from "crypto";

// function calculateHashWithNonce(
//   nonce: number,
//   data: string,
//   timestamp: number
// ): string {
//   const nonceBuffer = Buffer.alloc(4);
//   nonceBuffer.writeUInt32BE(nonce, 0);

//   const timestampBuffer = Buffer.alloc(8);
//   timestampBuffer.writeBigInt64BE(BigInt(timestamp), 0);

//   const dataBuffer = Buffer.from(data, "utf8");

//   const buffer = Buffer.concat([nonceBuffer, timestampBuffer, dataBuffer]);
//   const hash = crypto.createHash("sha256").update(buffer).digest("hex");
//   return hash;
// }

// function proofOfWork(
//   data: string,
//   difficulty: number
// ): { nonce: number; hash: string } {
//   let nonce = 0;
//   let hash = "";

//   while (true) {
//     const timestamp = Date.now();
//     hash = calculateHashWithNonce(nonce, data, timestamp);
//     console.log(hash, "hash");

//     if (hash.startsWith("0".repeat(difficulty))) {
//       break;
//     }
//     nonce++;
//   }

//   return { nonce, hash };
// }

// // Example usage:
// const data = "hello world";
// const difficulty = 4; // Example difficulty level
// const { nonce, hash } = proofOfWork(data, difficulty);

// console.log("Nonce:", nonce);
// console.log("Hash:", hash);

const bc = new Blockchain();

const miner = new Miner(bc);
miner.mineBlock();

// const coinbase = Tx.createCoinbaseTransaction(
//   "1Jv8UWbXfJQ7f8f4e3FZ6QpU7fZcY8eZ2",
//   50n,
//   1n
// );

// console.log(coinbase);
