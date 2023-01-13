const {
  selectDateTime,
  orderTickets,
  checkSeatIsTaken,
} = require("./lib/util.js");
const { getText } = require("./lib/commands");

let page;
let chosenDay = "nav.page-nav > a:nth-child(2)"; 
let lastDayToBook = "nav.page-nav > a:nth-child(7)"; 
let movieTime = "[data-seance-id='129']"; // 

describe("Movie tickets order", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await page.setDefaultNavigationTimeout(0);
  });

  afterEach(() => {
    page.close();
  });

  test("Should order one ticket for Movie tomorrow", async () => {
    await selectDateTime(page, chosenDay, movieTime);
    await orderTickets(page, 1, 2);
    const actual = await getText(page, "p.ticket__hint");
    expect(actual).toContain("Покажите QR-код нашему контроллеру для подтверждения бронирования.");
  });

  test("Should order three tickets for Movie in the last day to book", async () => {
    await selectDateTime(page, lastDayToBook, movieTime);
    await orderTickets(page, 2, 8, 9, 10);
    const actual = await getText(page, "p.ticket__hint");
    expect(actual).toContain("Покажите QR-код нашему контроллеру для подтверждения бронирования.");
  });

  test("Should try to order ticket for Movie if seat is taken already", async () => {
    await expect(async () => {
      await selectDateTime(page, chosenDay, movieTime);
      await orderTickets(page, 1, 2);
    }).rejects.toThrowError("Seat(s) is taken");
  });

  test("Check if the place is taken after ordering ", async () => {
    let row = 4;
    let seat = 10;
    await selectDateTime(page, lastDayToBook, movieTime);
    await orderTickets(page, row, seat);
    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await selectDateTime(page, lastDayToBook, movieTime);
    await checkSeatIsTaken(page, row, seat);
    const classExist = await page.$eval(
      `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seat})`,
      (el) => el.classList.contains("buying-scheme__chair_taken")
    );
    expect(classExist).toEqual(true);
  });
});
