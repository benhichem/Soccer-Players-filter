const fs = require("fs");
const puppeteer = require("puppeteer");

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
  const Links = await page.evaluate(async () => {
    const HTML = Array.from(document.querySelectorAll("a.tm-pagination__link"));
    const list = HTML.map((item) => {
      return item.href;
    }).slice(0, -2);
    return list;
  });
  if (Links.length === 0) {
    const TestOne = await PlayerScraping(
      page,
      "https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35414924"
    );
    console.log(TestOne);
  } else {
    const AllPlayers = [];
    for (var i = 0; i < Links.length; ++i) {
      const TestTwo = await PlayerScraping(page, Links[i]);
      console.log(`PageLink ${Links[i]}`);
      console.log(`Page ${i} Has being scrapped Here is the DATA :`, TestTwo);
    }
  }
  page.close();
})();
const ClubQuery = (Row) => {
  console.log("FromClub ");
};

const PlayerScraping = async (page, link) => {
  await page.goto(link, {
    waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
  });
  await page.waitForTimeout(5000);
  await page.waitForSelector("table.items");
  await page.waitForSelector("table.items tr.even");
  await page.waitForSelector("table.items tr.odd");
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
      /*  const Nationality = {
        Nat: Row.querySelectorAll("td.zentriert")[2].querySelector("img").alt,
        Pic: Row.querySelectorAll("td.zentriert")[2].querySelector("img").src,
      }; */
      const Club = {
        Nat: Row.querySelectorAll("td.zentriert")[2].querySelector("img").alt
          ? ""
          : "",
        Pic: Row.querySelectorAll("td.zentriert")[2].querySelector("img").src,
      };
      ClubQuery(Row);
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
        /*     Nationality,*/
        Club,
        Height,
        NationNalPlayer,
        InterNationalMatches,
        MarketValue,
      };
      console.log(Player);
      FinalList.push(Player);
    }
    return FinalList;
  });

  return Table;
};
