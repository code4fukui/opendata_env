import { CSV } from "https://js.sabae.cc/CSV.js";

const res2 = await queryGomiAmountSabae();
await Deno.writeTextFile("../gomi-amount-sabae.csv", CSV.stringify(res2));
