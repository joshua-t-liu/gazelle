const puppeteer = require('puppeteer');

const url = 'https://www.gazelle.com/iphone';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();
