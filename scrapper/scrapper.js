const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const createPhone = require('./Phone.js');
const { addPhoneData } = require('../db');

const pullPrice = async function(page, links) {
  let deviceLinks = links;
  const phones = [];
  const unlockedBudget = {}

  if (!deviceLinks) {
    deviceLinks = [];
    let links = await fsPromises.readFile('./results/devices.csv', { encoding: 'utf8' });
    links = links.split('\n');
    links.forEach((link, idx) => {
      if (link.length) {
        deviceLinks.push(link);
        const phone = createPhone(link);
        phones.push(phone);
        const phoneName = phone.phone;
        const carrier = phone.carrier;
        const size = phone.size;
        if (carrier === 'unlocked') {
          if (!unlockedBudget[phoneName]) {
            unlockedBudget[phoneName] = {
              size,
              device: link,
            };
          } else if (size < unlockedBudget[phoneName].size) {
            unlockedBudget[phoneName] = {
              size,
              device: link,
            };
          }
        }
      }
    });
  }

  const results = [];
  const errorWriter = new fs.WriteStream('./results/errors.csv');

  for (let i=0; i<deviceLinks.length; i++) {
    if (i % 10 === 0) console.log('status', i / deviceLinks.length)
    await page.goto(deviceLinks[i]);

    for (let j=1; j<=3; j++) {
      if (j === 1) {
        await page.click(`div[name="QuestionWithoutResponseScroll"]:nth-of-type(${j}) > div > div > div.option:nth-child(1) > button`);
      } else {
        await page.click(`div[name="QuestionWithoutResponseScroll"]:nth-of-type(${j}) > div > div > div.option:nth-child(2) > button`);
      }
    };

    await page.waitFor(1000);
    const { phone, carrier, size } = phones[i];

    let yesVal;
    try {
      yesVal = await page.$eval('span[aria-labelledby="amount"]', (el) => el.innerText);
    } catch (error) {
      console.log('error', deviceLinks[i], error);
      errorWriter.write(deviceLinks[i] + '\n');
    }
    if (unlockedBudget[phone].device === deviceLinks[i]) {
      await page.screenshot({ path: `../images/${phone}-${carrier}-${size}-yes.jpg` });
    }

    let noVal;
    try {
      await page.click(`div[name="QuestionWithoutResponseScroll"]:nth-of-type(1) > div > div > div.option:nth-child(2) > button`);
      await page.waitFor(1000);
      noVal = await page.$eval('span[aria-labelledby="amount"]', (el) => el.innerText);
    } catch (error) {
      console.log('error', deviceLinks[i], error);
      errorWriter.write(deviceLinks[i] + '\n');
    }
    if (unlockedBudget[phone].device === deviceLinks[i]) {
      await page.screenshot({ path: `../images/${phone}-${carrier}-${size}-no.jpg` });
    }

    results[i] = [deviceLinks[i], yesVal, noVal];
  }

  errorWriter.end();
  const res = [];
  writer = new fs.WriteStream('./results/results.csv');
  results.forEach(([link, yesVal, noVal], i) => {
    const row = phones[i].stringifyCSV() + ',' + yesVal + ',' + noVal  + '\n';
    res.push(row);
    writer.write(row);
  });
  writer.end();

  addPhoneData(row.join(''));
}

const getDeviceLinks = async function (page) {
  const url = 'https://www.gazelle.com/iphone/';
  await page.goto(url);
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

  let writer = new fs.WriteStream('./results/devices.csv');
  deviceLinks.forEach((device) => writer.write(device + '\n'));
  writer.end();
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1040,
    height: 780,
  });
  // get list of devices
  // await getDeviceLinks(page);

  // pull phone market price
  await pullPrice(page);

  await browser.close();
})();
