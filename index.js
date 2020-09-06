const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs').promises;

const PHONE = 4;
const CARRIER = 5;
const DEVICE = 6;
const ID = 7;

const Phone = function(phone, carrier, device, id) {
  this.phone = phone;
  this.carrier = carrier;
  this.device = device;
  this.id = id;
  this.size = this.getSize();
};

Phone.prototype.getSize = function() {
  return parseInt(this.device.substring(this.phone.length + 1, this.device.length - this.carrier.length - 1));
}

Phone.prototype.stringifyCSV = function() {
  return (
    this.phone + ',' +
    this.carrier + ',' +
    this.device + ',' +
    this.id
  );
}

const createPhone = function(link) {
  if (typeof link !== 'string') return null;
  let split = link.split('/');
  if (split.length !== 8) return null;
  return new Phone(split[PHONE], split[CARRIER], split[DEVICE], split[ID]);
};

const pullPrice = async function(page, links) {
  let deviceLinks = links;
  const phones = [];
  const unlockedBudget = {}

  if (!deviceLinks) {
    deviceLinks = [];
    let devices = await fsPromises.readFile('devices.csv', { encoding: 'utf8' });
    devices = devices.split('\n');
    devices.forEach((device, idx) => {
      if (device.length) {
        deviceLinks.push(device);
        const phone = createPhone(device);
        phones.push(phone);
        const phoneName = phone.phone;
        const carrier = phone.carrier;
        const size = phone.size;
        if (carrier === 'unlocked') {
          if (!unlockedBudget[phoneName]) {
            unlockedBudget[phoneName] = {
              size,
              device,
            };
          } else if (size < unlockedBudget[phoneName].size) {
            unlockedBudget[phoneName] = {
              size,
              device,
            };
          }
        }
      }
    });
  }

  const results = [];
  const errorWriter = new fs.WriteStream('./errors.csv');

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
    await page.waitFor(750);
    let val;
    const { phone, carrier, size } = phones[i];
    try {
      val = await page.$eval('span[aria-labelledby="amount"]', (el) => el.innerText);
    } catch (error) {
      console.log('error', deviceLinks[i], error);
      errorWriter.write(deviceLinks[i] + '\n');
    }
    if (unlockedBudget[phone].device === deviceLinks[i]) {
      await page.screenshot({ path: `${phone}-${carrier}-${size}.jpg` });
    }
    results[i] = [deviceLinks[i], val];
  }

  errorWriter.end();
  writer = new fs.WriteStream('./results.csv');
  results.forEach(([link, val], i) => writer.write(phones[i].stringifyCSV() + ',' + val  + '\n'));
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
