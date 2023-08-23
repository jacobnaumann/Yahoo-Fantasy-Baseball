const puppeteer = require('puppeteer');

async function scrapePitchers() {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // Get today's date and format it as YYYY-MM-DD
    const today = new Date();
    const todaysDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Add the date to the URL
    const url = `https://www.mlb.com/probable-pitchers/${todaysDate}`;
    console.log(url);
    await page.goto(url, { waitUntil: 'networkidle2' });

    const games = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.probable-pitchers__matchup')).map(gameElement => {

            const teamNames = Array.from(gameElement.querySelectorAll('.probable-pitchers__team-name')).map(el => el.innerText);
            const gameTime = gameElement.querySelector('.probable-pitchers__game-date-time').innerText;
            
            const pitchers = Array.from(gameElement.querySelectorAll('.probable-pitchers__pitcher-summary')).map(pitcherElement => {
                const pitcherName = pitcherElement.querySelector('.probable-pitchers__pitcher-name-link').innerText;
                const pitcherHand = pitcherElement.querySelector('.probable-pitchers__pitcher-pitch-hand').innerText;
                const pitcherStats = pitcherElement.querySelector('.probable-pitchers__pitcher-stats-summary').innerText;
                return {
                    name: pitcherName,
                    hand: pitcherHand,
                    stats: pitcherStats
                }
            });

            return {
                teams: teamNames,
                time: gameTime,
                pitchers: pitchers
            };
        });
    });

    await browser.close();
    return games;
}

scrapePitchers().then(data => console.log("SCRAPER DATA", data)).catch(err => console.error(err));

module.exports = scrapePitchers;
