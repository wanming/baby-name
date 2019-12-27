import * as fs from "fs";
import * as Bluebird from "bluebird";
import * as _ from "lodash";
const pinyin = require("pinyin");

// 两个字的音调
const TUNES = [1, 4];

async function main() {
  let list: any[] = [];
  while (true) {
    const newList = fs
      .readFileSync("./names.txt")
      .toString()
      .split("\n")
      .map(i => {
        if (i.length > 0) {
          return JSON.parse(i);
        }
        return null;
      })
      .filter(item => Boolean(item))
      .filter((ii, index, arr) => {
        if (arr.findIndex(iii => iii.name === ii.name) !== index) {
          return false;
        }

        if (ii.score < 90) {
          return false;
        }

        const py = pinyin(ii.name, { style: pinyin.STYLE_TONE2 });

        if (py.length < 3) {
          return false;
        }

        if (py[1].length > 1 || py[2].length > 1) {
          return false;
        }

        if (
          !(
            Number(py[1][0].slice(-1)) === TUNES[0] &&
            Number(py[2][0].slice(-1)) === TUNES[1]
          )
        ) {
          return false;
        }

        return true;
      });

    if (newList.length > list.length) {
      newList
        .slice(list.length)
        .forEach((i, idx) => console.log(list.length + idx, i));
      list = newList;
    }

    await Bluebird.delay(1000);
  }
}

main().catch(console.error);
