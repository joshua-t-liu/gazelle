const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs').promises;

const PHONE = 4;
const CARRIER = 5;
const DEVICE = 6;
const ID = 7;

const getPhoneDetails = function(link) {
  if (typeof link !== 'string') return null;
  let split = link.split('/');
  if (split.length !== 8) return null;
  return (
    split[PHONE] + ',' +
    split[CARRIER] + ',' +
    split[DEVICE] + ',' +
    split[ID]
  );
};

const pullPrice = async function(page, links) {
  let deviceLinks = links;

  if (!deviceLinks) {
    let devices = await fsPromises.readFile('devices.csv', { encoding: 'utf8' });
    devices = devices.split('\n');
    devices.forEach((device, idx) => {
      if (device.length) deviceLinks.push(device);
    });
  }

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
    await page.waitFor(750);
    let val;
    try {
      val = await page.$eval('span[aria-labelledby="amount"]', (el) => el.innerText);
    } catch (error) {
      console.log('error', deviceLinks[i], error);
    }
    results[i] = [deviceLinks[i], val];
  }

  writer = new fs.WriteStream('./results.csv');
  results.forEach(([link, val]) => writer.write(getPhoneDetails(link) + ',' + val  + '\n'));
  writer.end();
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

  let writer = new fs.WriteStream('./devices.csv');
  deviceLinks.forEach((device) => writer.write(device + '\n'));
  writer.end();
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // get list of devices
  // await getDeviceLinks(page);

  // pull phone market price
  await pullPrice(page, deviceLinks);

  await browser.close();
})();
