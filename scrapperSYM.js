const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const createPhone = require('./Phone.js');

const url = 'https://www.sellyourmac.com/sell.html';

const IGNORE_PROD_IDS = new Set([93, 103, 104, 151,]);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1040,
    height: 780,
  });

  // category i-phone (3)
  await page.select('#symquote_productcategory_id', '3');

  //product ids
  const ids = await page.$eval('#symquote_product_id', (el) => {
    const val = el.children.map((child) => child.value);
    val.shift();
    return val;
  });
  await page.select('#symquote_product_id', '151');

  // hardware
  const hardware = await page.$eval('#component_2', (el) => {
    const val = el.children.map((child) => child.value);
    val.shift();
    return val;
  });
  await page.select('#component_2', hardware[0]);

  // carrier, GSM Factory Unlocked (249)
  const carrier = await page.$eval('#component_7', (el) => {
    const val = el.children.map((child) => child.value);
    val.shift();
    return val;
  });
  await page.select('#component_7', '249');

  // click device config button for more options
  await page.click('button.device-configuration');

  // poor battery
  const button = await page.$$eval('button[data-value="Poor"]', (el) => {
    for (let i=0; i<el.length; i++) {
      if (el.innerText.indexOf('Battery Drains Quickly')) return el;
    }
  });
  await button.click();

  // cosmetic
  await page.click('button.cosmetic-condition[data-value="Poor"]');

  await page.click('#functionalOptions');

  await page.click('.functional-continue');

  const button = page.$$eval('span.uk-text-danger', (el) => {
    for (let i=0; i<el.length; i++) {
      if (el.innerHTML === 'Charger Not Included') return el;
    }
  })
  await button.click();

  // screen issues
  await page.click('#question_7');

  await page.screenshot({path: 'sym.png', fullPage: true});

  await page.click('button[type=submit]');


  await browser.close();
})();
