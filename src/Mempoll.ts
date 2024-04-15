import fs from "fs";
import path from "path";
import { Tx } from "./Tx";
import { TxIn } from "./TxIn";
import { Script } from "./Script";
import { TxOut } from "./TxOut";

export class Mempoll {
  public txs: Tx[];
  private folderPath = "./mempool";
  public feesArrayVector: bigint[];
  public txWeightVector: number[];

  constructor() {
    this.txs = [];
    this.feesArrayVector = [];
    this.txWeightVector = [];

    this.processDataSync();
  }

  private createTxFromJson = (data: any): Tx => {
    return new Tx(
      BigInt(data.version),
      data.vin.map((vin) => {
        let witness = [];

        if (TxIn.usesSegwit(vin)) {
          witness = Script.parseWitnessIntoCommand(vin.witness);
        }

        return new TxIn(
          vin.txid,
          BigInt(vin.vout),
          new Script([], vin.scriptsig),
          BigInt(vin.sequence),
          new Script([], vin.prevout.scriptpubkey),
          BigInt(vin.prevout.value),
          witness,
          vin.prevout.scriptpubkey_type
        );
      }),

      data.vout.map(
        (vout) =>
          new TxOut(BigInt(vout.value), new Script([], vout.scriptpubkey))
      ),

      BigInt(data.locktime),

      Tx.isSegwit(data.vin)
    );
  };

  private processDataSync() {
    try {
      const files = fs.readdirSync(this.folderPath);

      const jsonFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".json"
      );

      for (const jsonFile of jsonFiles) {
        const filePath = path.join(this.folderPath, jsonFile);
        const data = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(data);

        const newTx = this.createTxFromJson(jsonData);

        this.txs.push(newTx);

        try {
          this.txWeightVector.push(newTx.calculateWeight());
        } catch {
          // need to handle this bug ?? one reason could be missing OPCODES implementation
          this.txWeightVector.push(10000);
        }

        this.feesArrayVector.push(newTx.fees());
      }
    } catch (err) {
      console.error("Error processing mempool:", err);
    }
  }

  public fetchNextBest(): [Tx, bigint, number] {
    const index = 0;

    return [
      this.txs[index],
      this.feesArrayVector[index],
      this.txWeightVector[index],
    ];
  }
}
