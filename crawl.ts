import * as _ from "lodash";
import axios from "axios";
import * as fs from "fs";

const URL = "http://xuezhouyi.com/index/api/quming";
const POST_DATA = {
  xing: "酷",
  sex: "男",
  birthday: "公历+2011年11月11日11时",
  nametype: "双字名",
  limit: 10
};

async function main() {
  const list = fs
    .readFileSync("./names.txt")
    .toString()
    .split("\n")
    .map(si => {
      if (si.length > 0) {
        return JSON.parse(si);
      }
      return null;
    })
    .filter(ii => Boolean(ii));

  while (true) {
    try {
      const result = await axios.post(URL, POST_DATA);
      _.get(result, "data.data.data")
        .map((ii: any) => {
          return {
            name: ii.name,
            score: ii.wuxing.fen,
            pinyin: ii.pinyin
          };
        })
        .forEach((ia: any) => {
          if (list.findIndex(fi => fi.name === ia.name) === -1) {
            console.log("Got", ia.name);
            list.push(ia);
            fs.appendFileSync("./names.txt", "\n" + JSON.stringify(ia));
          }
        });
    } catch (e) {
      console.error("Error", e.message);
    }
  }
}

main().catch(console.error);
