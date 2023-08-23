const my_scoreboardTable = document.querySelector("#my-scoreboard table");
const my_scoreboardTable_total = document.querySelector("#my-scoreboard table:nth-of-type(2)");
const league_scoreboard_container = document.querySelector("#league-scoreboard-container");
//const rostersTable = document.querySelector("#rosters table");
const hittersTable = document.querySelector('.hitters-table');
const pitchersTable = document.querySelector('.pitchers-table');
const standingsTable = document.querySelector("#standings table");
const leagueNameHeading = document.querySelector("#league-name");
// const teamNameHeading = document.querySelector("#team-name");
const refreshButton = document.querySelector("#refresh-scoreboards");
const playerStatsAccordion = document.querySelector("#player-stats-accordion");
const accordionContent = document.querySelector(".accordion-content");

const comma_ = ",";
const league_ = "league/";
const team_ = "team/";
const league_id_ = "422.l.74790";
const team_id_ = ".t.";
let my_team_id = 3;
let opp_team_id = 0;
const standings_ = "/standings"
const scoreboard_ = "/scoreboard";
const roster_ = "/roster";
const players_ = "/players";
const player_keys = ";player_keys=";
const player_id_prefix = "422.p.";
const stats_ = "/stats";

async function displayScoreboards() {
  // Fetch the required data using the fetchData function
  //const data = await fetchData(league_ + league_id_ + scoreboard_);
  const data = await fetchData("scoreboard.xml");
  // Display 'my scoreboard'
  displayMyScoreboard(data, my_team_id);
  // Display League Scoreboard
  displayLeagueScoreboard(data);
}

//Event listeners
playerStatsAccordion.addEventListener("click", () => {
  const maxHeight = accordionContent.style.maxHeight;

  if (maxHeight === "0px" || !maxHeight) {
    accordionContent.style.maxHeight = "1000px"; // You can adjust this value to fit the content
  } else {
    accordionContent.style.maxHeight = "0px";
  }
});
document.getElementById('refresh-scoreboards').addEventListener('click', () => {
  displayScoreboards();
  displayRosters();
  //displayLeagueScoreboard();
  displayStandings();
  displayLastRefreshed();
});


(async function initializePage() {
  // Set the league and team names
  leagueNameHeading.textContent = "KGB's Champion League";
  // teamNameHeading.textContent = "Luckbox Jake";

  // Call the display functions to fetch and display data
  await displayScoreboards();
  await displayRosters();
  await displayStandings();
  await displayLastRefreshed();
})();

refreshButton.addEventListener("click", async () => {
  await displayScoreboards();
  await displayRosters();
  await displayStandings();
  await displayLastRefreshed();
});
