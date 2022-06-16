const puppeteer = require("puppeteer");
const renameKeys = require("rename-keys");

/* const LinkOne =
  "https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35459274";
const LinkTwo =
  "https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35456537";
const LinkThre =
  "https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35493749";
const NoResult =
  "https://www.transfermarkt.com/detailsuche/spielerdetail/suche/35512400"; */

const GetTable = async (link) => {
  const AllPlayers = [];
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(link, {
    waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
  });
  await page.waitForTimeout(5000);
  // Removes the cookies popup

  const popup_frame = await page.waitForSelector("#sp_message_iframe_575843");
  const frame = await popup_frame.contentFrame();
  const buttons = await frame.$x("/html/body/div/div[2]/div[3]/div[2]/button");
  await buttons[0].click();

  console.log("[+] Looking if there is Results");
  const AllerNoResults = await page.$("div .alert-box.alert");

  if (AllerNoResults) {
    browser.close();
    console.log("[-] Advanced search generated no result.");
    return "Advanced search generated no result.";
  } else {
    console.log(`[+] Looking For the Player Table Table`);
    await page.waitForSelector("table.items");
    const Links = await page.evaluate(async () => {
      console.log(`[+] Looking if its multiple pages `);
      const HTML = Array.from(
        document.querySelectorAll("a.tm-pagination__link")
      );
      const list = HTML.map((item) => {
        return item.href;
      }).slice(0, -2);
      return list;
    });
    let Headers = await page.evaluate(async () => {
      const HeadersItems = Array.from(document.querySelectorAll("th"));
      const HeadersInnerText = HeadersItems.map((item) => {
        return item.textContent.replace(/ /g, "_").trimEnd();
      });
      HeadersInnerText[0] = "Player_Number_and_Positions";
      let newARray = HeadersInnerText.map((item) => {
        if (item.includes("/")) {
          return item.replace("/", "and");
        }
        if (item.includes(".")) {
          return item.slice(0, -1);
        } else {
          return item;
        }
      });
      return newARray;
    });

    if (Links.length === 0) {
      console.log(`[+] only one link Getting players`);
      const TestOne = await PlayerScraping(page, link, Headers);
      browser.close();
      console.log(TestOne[0]);
      return TestOne;
    } else {
      console.log(`[+] ${Links.length} Pages Starting the Loop `);
      for (var i = 0; i < Links.length; ++i) {
        const TestTwo = await PlayerScraping(page, Links[i], Headers);
        console.log(`PageLink ${Links[i]}`);
        console.log(`Page ${i} Has being scrapped`);
        AllPlayers.push(TestTwo);
      }

      browser.close();
      return AllPlayers;
    }
  }
};

const PlayerScraping = async (page, link, Headers) => {
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
          item: GetCellContent(item),
          id: GetCellIndex(item),
        };
      });
      FinalList.push(T);
    }
    const GroupingObjectByID = FinalList.map((item) => {
      const results = item.reduce(function (results, item) {
        (results[item.id] = results[item.id] || []).push(item.item);
        return results;
      }, {});
      return results;
    });
    return GroupingObjectByID;
  });

  const RenameCunts = Table.map((item) => {
    return renameKeys(item, function (key, val) {
      return Headers[key];
    });
  });
  return RenameCunts;
};

console.log("Starting The Script");

module.exports = GetTable;
