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
  
  await page.goto(url);
  
  // category i-phone (3)
  await page.select('#symquote_productcategory_id', '3');

  //product ids
  const ids = await page.$eval('#symquote_product_id', (el) => {
    const val = Array.from(el.children).map((child) => child.value);
    val.shift();
    return val;
  });
  await page.select('#symquote_product_id', '151');

  await page.waitFor(1000);
  
  // hardware
  const hardware = await page.$eval('#component_2', (el) => {
    const val = Array.from(el.children).map((child) => child.value);
    val.shift();
    return val;
  });

  await page.select('#component_2', hardware[0]);

  // carrier, GSM Factory Unlocked (249)
  const carrier = await page.$eval('#component_7', (el) => {
    const val = Array.from(el.children).map((child) => child.value);
    val.shift();
    return val;
  });
  await page.select('#component_7', '249');

  // click device config button for more options
  await page.click('button.device-configuration');

  // poor battery
  let  button = await page.$$eval('button[data-value="Poor"]', (el) => {
    for (let i=0; i<el.length; i++) {
      if (el[i].innerText.indexOf('BATTERY DRAINS QUICKLY') >= -1) return el[i];
    }
  });
  console.log('MY BUTTON', button);  
  await page.screenshot({ path: 'screenshots/test.jpg', fullPage: true });
  await button.click();
  await page.screenshot({ path: 'screenshots/test.jpg', fullPage: true });
  // cosmetic
  await page.click('button.cosmetic-condition[data-value="Poor"]');

  await page.click('#functionalOptions');

  await page.click('.functional-continue');

  button = page.$$eval('span.uk-text-danger', (el) => {
    for (let i=0; i<el.length; i++) {
      if (el[i].innerHTML === 'Charger Not Included') return el[i];
    }
  })
  await button.click();

  // screen issues
  await page.click('#question_7');

  await page.screenshot({path: 'sym.png', fullPage: true});

  await page.click('button[type=submit]');


  await browser.close();
})();
