const puppeteer = require('puppeteer');

const url = 'https://www.gazelle.com/iphone';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({path: 'example.png'});

  const phones = await page.$$eval('div', (divs) => divs);
  console.log(phones);

  
  //await page.goto('https://news.ycombinator.com/news')

  // execute standard javascript in the context of the page.
  // const stories = await page.$$eval('a.storylink', anchors => { return anchors.map(anchor => anchor.textContent).slice(0, 10) })
  // console.log(stories)

  await browser.close();
})();
