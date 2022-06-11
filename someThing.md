const puppeteer = require("puppeteer");
const { parse } = require("node-html-parser");
(async () => {
const browser = await puppeteer.launch({
args: ["--no-sandbox"],
headless: false,
});
const page = await browser.newPage();
await page.goto(
"https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35414924",
{ waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"] }
);
await page.waitForTimeout(5000);

await page.waitForSelector("table.items");
const Table = await page.evaluate(async () => {
const Table2 = await Array.from(
document.querySelectorAll("table.items tr.even")
);
const Table3 = await Array.from(
document.querySelectorAll("table.items tr.odd")
);
const Tablerows = [...Table2, ...Table3];
const FinalList = [];
for (var i = 0; i < Tablerows.length; ++i) {
const Row = Tablerows[i];
const Name =
Row.querySelectorAll("td")[1].querySelectorAll("td")[1].innerText;
const Position =
Row.querySelectorAll("td")[1].querySelectorAll("td")[2].innerHTML;
const Picture = Row.querySelectorAll("td")[1]
.querySelectorAll("td")[0]
.querySelector("img").src;
const Dot = Row.querySelectorAll("td.zentriert")[1].innerText;
const Nationality = {
Nat: Row.querySelectorAll("td.zentriert")[2].querySelector("img").alt,
Pic: Row.querySelectorAll("td.zentriert")[2].querySelector("img").src,
};
const CLub = {
Name: Row.querySelectorAll("td.zentriert")[3].querySelector("img").alt,
Pic: Row.querySelectorAll("td.zentriert")[3].querySelector("img").src,
};
const Height = Row.querySelectorAll("td.zentriert")[4].innerText;
const NationNalPlayer = Row.querySelectorAll("td")[10].innerText;
const InterNationalMatches =
Row.querySelectorAll("td.zentriert")[5].innerText;
const MarketValue = Row.querySelectorAll("td.rechts")[0].innerText;
const Player = {
Name,
Picture,
Position,
Dot,
Nationality,
CLub,
Height,
NationNalPlayer,
InterNationalMatches,
MarketValue,
};
FinalList.push(Player);
}
return FinalList;
});

console.log(Table);
console.log(Table.length);
})();
