const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function go() {
  // launch the browser
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 400,
  });

  const page = await browser.newPage();

  // access website
  await page.goto(
    "https://guide.wisc.edu/undergraduate/business/operations-information-management/business-information-systems-bba/"
  );

  // take screenshot
  await page.screenshot({
    path: "IS_homepage.jpg",
    fullPage: true,
  });

  const mydata = await page.$eval("#right-col > div.sidebar-box", (data) => {
    return data.innerText;
  });

  await fs.writeFile("contactinfo.txt", mydata);

  const photos = await page.$$eval("img", (images) => {
    return images.map((x) => x.src);
  });

  for (const photo of photos) {
    const photopage = await page.goto(photo);

    await fs.writeFile(photo.split("/").pop());
  }

  // close
  browser.close();
}

go();
