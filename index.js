const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://www.gazelle.com/iphone/';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  // get list of phones
  const phones = await page.$$eval('div.transition-container', (divs) => {
    return Array.from(divs[0].children).map((child) => child.children[0].href)
  });
  
  console.log('phones', phones.length);

  let carrierLinks = [];
  // get list of carriers
  for (let i=0; i<phones.length; i++) {
    await page.goto(phones[i]);
    const carriers = await page.$$eval('ul.level_2', (el) => {
      return Array.from(el[0].children).map((child) => child.children[0].href);
    });
    carrierLinks.push(carriers);
  };
  
  carrierLinks = carrierLinks.flat();
  console.log('carriers', carrierLinks.length);
  
  // get device links
  let deviceLinks = [];
  for (let i=0; i<carrierLinks.length; i++) {
    await page.goto(carrierLinks[i]);
    const devices = await page.$$eval('ul.products', (el) => {
      return Array.from(el[0].children).map((child) => child.children[0].href);
    });
    deviceLinks.push(devices); 
  }

  deviceLinks = deviceLinks.flat();
  console.log('devices', deviceLinks.length);

  let writer = new fs.WriteStream('./devices.csv');
  deviceLinks.forEach((device) => writer.write(device + '\n'));
  writer.end();
  
  const results = [];
  for (let i=0; i<deviceLinks.length; i++) {
    await page.goto(deviceLinks[i]);
    for (let i=1; i<=3; i++) {
      if (i === 1) {
        await page.click(`div[name="QuestionWithoutResponseScroll"]:nth-of-type(${i}) > div > div > div.option:nth-child(1) > button`);
      } else {
        await page.click(`div[name="QuestionWithoutResponseScroll"]:nth-of-type(${i}) > div > div > div.option:nth-child(2) > button`);
      }
    };
    await page.waitFor(500);
    let val;
    try {
      val = await page.$eval('span[aria-labelledby="amount"]', (el) => el.innerText);
    } catch (error) {
      console.log('error', deviceLinks[i],error);
    }
    results[i] = [deviceLinks[i], val];
  }
  
  console.log(results);

  writer = new fs.WriteStream('./results.csv');
  results.forEach(([link, val]) => writer.write(link + ',' + val  + '\n'));
  writer.end();

  await browser.close();
})();
