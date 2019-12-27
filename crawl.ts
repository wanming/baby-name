import * as _ from "lodash";
import axios from "axios";
import * as fs from "fs";

const url = "http://xuezhouyi.com/index/api/quming";
const postData = {
  xing: "万",
  sex: "男",
  birthday: "公历+2019年12月19日11时",
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
    .filter(ii => {
      return ii && ii.score >= 90;
    });

  while (true) {
    try {
      const result = await axios.post(url, postData);
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
