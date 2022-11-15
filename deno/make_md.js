import { CSV } from "https://js.sabae.cc/CSV.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";

const data = await CSV.fetchJSON("../データ一覧.csv");
console.log(data);

const types = ArrayUtil.toUnique(data.map(d => d.種別));

const md = [];
md.push("# 鯖江市環境ハッカソン参考オープンデータ");
md.push("福井県主催、鯖江市協力のハッカソン [『守る環境ハッカソンin鯖江』～次世代に残そう美味しい越前ガニ～ | Peatix](https://peatix.com/event/3412028)");
md.push("");

md.push("## 参考オープンデータ");
md.push("");
for (const type of types) {
  md.push("### " + type);
  const data2 = data.filter(d => d.種別 == type);
  for (const d of data2) {
    md.push(`- [${d.内容}](${d.データ})`);
  }
  md.push("");
}
md.push("## ライセンス");
md.push("[オープンデータライセンス](https://github.com/code4fukui/opendata-license/) by 鯖江市");

await Deno.writeTextFile("../README.md", md.join("\n"));
