const puppeteer = require('puppeteer');

async function scrapeProbablePitchers() {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new'
    });
    const page = await browser.newPage();
    await page.goto('https://www.mlb.com/probable-pitchers');

    const probablePitchers = await page.evaluate(() => {
      const pitcherElements = document.querySelectorAll('.probable-pitchers__pitcher-name');
      const pitchers = [];

      for (const pitcherElement of pitcherElements) {
        pitchers.push(pitcherElement.textContent.trim());
      }

      return pitchers;
    });
    await browser.close();
    console.log("SUCCES FROM scrape_pro*.js", probablePitchers);
    return probablePitchers;
  } catch (error) {
    console.error("Error in scrapeProbablePitchers function:", error);
    throw error;
  }
}

const scraped = scrapeProbablePitchers();
module.exports = scrapeProbablePitchers;
