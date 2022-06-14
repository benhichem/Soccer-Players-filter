const puppeteer = require("puppeteer");

const LinkOne =
  "https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35459274";
const LinkTwo =
  "https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35456537";
const LinkThre =
  "https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35493749";

const Main = async () => {
  const AllPlayers = [];
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(LinkOne, {
    waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
  });
  await page.waitForTimeout(5000);
  console.log(`[+] Looking For the Player Table Table`);
  await page.waitForSelector("table.items");
  const Links = await page.evaluate(async () => {
    console.log(`[+] Looking if its multiple pages `);
    const HTML = Array.from(document.querySelectorAll("a.tm-pagination__link"));
    const list = HTML.map((item) => {
      return item.href;
    }).slice(0, -2);
    return list;
  });
  if (Links.length === 0) {
    console.log(`[+] only one link Getting players`);
    const TestOne = await PlayerScraping(
      page,
      "https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35441755"
    );
    AllPlayers.push(TestOne);
  } else {
    console.log(`[+] Multiple Pages ${Links.length} Starting the Loop `);
    for (var i = 0; i < Links.length; ++i) {
      const TestTwo = await PlayerScraping(page, Links[i]);
      console.log(`PageLink ${Links[i]}`);
      console.log(`Page ${i} Has being scrapped`);
      AllPlayers.push(TestTwo);
    }
    console.log(AllPlayers);
    console.log(AllPlayers[0][0]);
    return AllPlayers;
  }
  browser.close();
};

console.log("Starting The Script");
Main();

const PlayerScraping = async (page, link) => {
  console.log(`[+] Going to ${link}`);
  await page.goto(link, {
    waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
  });

  await page.waitForTimeout(5000);
  await page.waitForSelector("table.items");
  await page.waitForSelector("table.items tr.even");
  await page.waitForSelector("table.items tr.odd");
  const Table = await page.evaluate(async () => {
    function GetCellIndex(item) {
      if (item.classList.value === "hauptlink") {
        return item.closest("table").parentElement.cellIndex;
      }
      if (item.classList.value === "zentriert") {
        return item.cellIndex;
      }
      if (item.classList.value === "lightgreytext") {
        return item.closest("table").parentElement.cellIndex;
      }
      if (item.classList.value === "greentext") {
        return item.closest("table").parentElement.cellIndex;
      }
      if (item.classList.value === "rechts hauptlink") {
        return item.cellIndex;
      }
      if (item.classList.length === 3) {
        return item.cellIndex;
      }
      if (item.classList.value === "") {
        if (item.children[0] === undefined) {
          return item.cellIndex;
        }
        if (item.children[0].nodeName === "TABLE") {
          return item.cellIndex;
        } else {
          return item.closest("table").parentElement.cellIndex;
        }
      }
    }
    function GetCellContent(item) {
      if (item.classList.length === 3) {
        return item.textContent;
      }
      if (item.classList.value === "") {
        if (item.textContent === "") {
          return {
            src: item.querySelector("img").src,
            value: item.querySelector("img").alt,
          };
        } else {
          return item.textContent;
        }
      }
      if (item.classList.value === "zentriert") {
        if (item.querySelector("img")) {
          return {
            src: item.querySelector("img").src,
            value: item.querySelector("img").alt,
          };
        } else {
          return item.textContent;
        }
      }
      if (item.classList.value === "hauptlink") {
        return item.querySelector("a").href;
      } else {
        return item.textContent;
      }
    }
    const Table2 = await Array.from(
      document.querySelectorAll("table.items tr.even")
    );
    const Table3 = await Array.from(
      document.querySelectorAll("table.items tr.odd")
    );
    const Tablerows = [...Table2, ...Table3];
    const FinalList = [];
    for (var i = 0; i < Tablerows.length; ++i) {
      const list = Array.from(Tablerows[i].querySelectorAll("td"));
      const T = list.map((item) => {
        return {
          value: GetCellContent(item),
          index: GetCellIndex(item),
        };
      });
      FinalList.push(T);
    }
    return FinalList;
  });

  return Table;
};
