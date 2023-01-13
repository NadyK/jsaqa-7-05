module.exports = {
  generateName: function (length) {
    let name = ""; //здесь будем хранить результат
    let chars = "abcdefgABCDEFG1234567890"; //возможные символы
    let charLength = chars.length; //определяем длину
    for (let i = 0; i < length; i++) {
      //запускаем цикл для формирования строки
      name += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return name;
  },
};

const { clickElement, getText } = require("./commands.js");

module.exports = {
  selectDateTime: async function (page, day, time) {
    await clickElement(page, day);
    await clickElement(page, time);
  },
  orderTickets: async function (page, row, ...seats) {
    await page.waitForSelector(".buying-scheme__wrapper");
    try {
      for (let i = 0; i < seats.length; i++) {
        await clickElement(
          page,
          `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seats[i]})`
        );
        await page.waitForSelector(
          `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seats[i]}).buying-scheme__chair_selected`
        );
      }
    } catch (error) {
      throw new Error(`Seat(s) is taken`);
    }
    await clickElement(page, ".acceptin-button");
    await page.waitForSelector(".ticket__check-title");
    await clickElement(page, ".acceptin-button");
  },
  checkSeatIsTaken: async function (page, row, ...seats) {
    await page.waitForSelector(".buying-scheme__wrapper");
    try {
      for (let i = 0; i < seats.length; i++) {
        await page.waitForSelector(
          `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seats[i]}).buying-scheme__chair_taken`
        );
      }
    } catch (error) {
      throw new Error("Seat(s) is free");
    }
  },
};
