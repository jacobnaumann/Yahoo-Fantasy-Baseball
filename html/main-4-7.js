const my_scoreboardTable = document.querySelector("#my-scoreboard table");
const league_scoreboardTable = document.querySelector("#league-scoreboard table");
const rostersTable = document.querySelector("#rosters table");
const standingsTable = document.querySelector("#standings table");
const leagueNameHeading = document.querySelector("#league-name");
// const teamNameHeading = document.querySelector("#team-name");
const refreshButton = document.querySelector("#refresh-scoreboards");

const league_ = "league/";
const team_ = "team/";
const league_id_ = "422.l.74790";
const team_id_ = ".t.3";
const standings_ = "/standings"
const scoreboard_ = "/scoreboard";
const roster_ = "/roster";
const players_ = "/players";

function xmlToJson(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "application/xml");

  function convertNode(node) {
    let obj = {};

    if (node.nodeType === 1) {
      if (node.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < node.attributes.length; j++) {
          const attribute = node.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (node.nodeType === 3) {
      obj = node.nodeValue;
    }

    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes.item(i);
        const nodeName = child.nodeName;

        if (typeof obj[nodeName] === "undefined") {
          obj[nodeName] = convertNode(child);
        } else {
          if (typeof obj[nodeName].push === "undefined") {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(convertNode(child));
        }
      }
    }

    return obj;
  }

  return convertNode(xmlDoc);
}

async function fetchData(endpoint) {
  try {
    const response = await fetch(`/api/yahoo?endpoint=${endpoint}`);
    const text = await response.text();

    if (text.startsWith("<?xml")) {
      const data = xmlToJson(text);
      return data;
    } else if (response.headers.get("Content-Type").includes("application/json")) {
      const data = JSON.parse(text); 
      return data;
    } else {
      console.log("Unexpected response:", text);
      throw new Error("Unsupported response format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function displayScoreboards() {
  // Fetch the required data using the fetchData function
  const data = await fetchData(league_ + league_id_ + scoreboard_);
  // Display 'my scoreboard'
  displayMyScoreboard(data);
  // Display League Scoreboard
  displayLeagueScoreboard(data);
}

async function displayLeagueScoreboard(data) {
  const matchups = data.fantasy_content.league.scoreboard.matchups.matchup;
  // Clear the table
  league_scoreboardTable.innerHTML = "";

  // Add table headers
  const headerRow = document.createElement("tr");
  ["Team 1", "Score", "Score", "Team 2"].forEach(header => {
    const headerCell = document.createElement("th");
    headerCell.textContent = header;
    headerRow.appendChild(headerCell);
  });
  league_scoreboardTable.appendChild(headerRow);

  // Parse and display the data
  if (data) {
    for (let i = 0; i < matchups.length; i++) {

      const tableRow = document.createElement("tr");

      // Get team names and total points
      const team_one_name = matchups[i].teams.team[0].name['#text'];
      const team_two_name = matchups[i].teams.team[1].name['#text'];
      const team_one_total = matchups[i].teams.team[0].team_points.total['#text'];
      const team_two_total = matchups[i].teams.team[1].team_points.total['#text'];

      // Add the data to the row
      [team_one_name, team_one_total, team_two_total, team_two_name].forEach(cell => {
        const tableCell = document.createElement("td");
        tableCell.textContent = cell;
        tableRow.appendChild(tableCell);
      });
      league_scoreboardTable.appendChild(tableRow);
    };
  }
}

async function displayRosters() {
    // Fetch the required data using the fetchData function
    // Replace "rosters_endpoint" with the appropriate Yahoo Fantasy Baseball API endpoint
    const data = await fetchData(team_ + league_id_ + team_id_ + roster_ + players_);
    const roster  = data.fantasy_content.team.roster.players;
    // console.log("Roster data", roster);
    // Clear the table
    rostersTable.innerHTML = "";
  
    // Add Table headers
    const headerRow = document.createElement("tr");
    ["Player", "Team", "Position"].forEach(header => {
    const headerCell = document.createElement("th");
    headerCell.textContent = header;
    headerRow.appendChild(headerCell);
     });
    rostersTable.appendChild(headerRow);

  // Parse and display the data
  if (data) {
    for (let i = 0; i < roster.player.length; i++) {

      const tableRow = document.createElement("tr");

      // Get team names and total points
      const player_name = roster.player[i].name.full['#text'];
      const player_team = roster.player[i].editorial_team_abbr['#text'];
      const player_position = roster.player[i].selected_position.position['#text'];
      // console.log(player_name + player_team + player_position);
      // Add the data to the row
      [player_name, player_team, player_position].forEach(cell => {
        const tableCell = document.createElement("td");
        tableCell.textContent = cell;
        tableRow.appendChild(tableCell);
      });

      rostersTable.appendChild(tableRow);
    };
  }
 }
  
  async function displayStandings() {
    // Fetch the required data using the fetchData function
    // Replace "standings_endpoint" with the appropriate Yahoo Fantasy Baseball API endpoint
    const data = await fetchData(league_ + league_id_ + standings_);
    const standings  = data.fantasy_content.league.standings.teams; 
    // console.log(standings);

    // Clear the table
    standingsTable.innerHTML = "";

    // Add Table headers
    const headerRow = document.createElement("tr");
    ["Rank", "Team Name", "Wins", "GB"].forEach(header => {
    const headerCell = document.createElement("th");
    headerCell.textContent = header;
    headerRow.appendChild(headerCell);
     });
    standingsTable.appendChild(headerRow);

  // Parse and display the data
  if (data) {
    for (let i = 0; i < standings.team.length; i++) {

      const tableRow = document.createElement("tr");

      // Get team names and total points
      const team_rank = standings.team[i].team_standings.rank['#text'];
      const team_name = standings.team[i].name['#text'];
      const team_points = standings.team[i].team_points.total['#text'];
      const team_games_back = standings.team[i].team_standings.games_back['#text'];
      // console.log(team_rank + team_name + team_points + team_games_back);
      // Add the data to the row
      [team_rank, team_name, team_points, team_games_back].forEach(cell => {
        const tableCell = document.createElement("td");
        tableCell.textContent = cell;
        tableRow.appendChild(tableCell);
      });

      standingsTable.appendChild(tableRow);
    };
  }
}

async function displayMyScoreboard(data) {
  // Fetch the required data using the fetchData function
  //const data = await fetchData(league_ + league_id_ + scoreboard_);
  const matchups = data.fantasy_content.league.scoreboard.matchups.matchup;
  console.log("matchups.length: ", matchups.length);
  // Clear the table
  my_scoreboardTable.innerHTML = "";

  for (let i = 0; i < matchups.length; i++) {
    console.log("Checking matchup ", i);
    const team_one_id = matchups[i].teams.team[0].team_id['#text'];
    const team_two_id = matchups[i].teams.team[1].team_id['#text'];
    console.log("team_one_id: ", team_one_id, "team_two_id: ", team_two_id);
    if (team_one_id === '3' || team_two_id === '3') {
      console.log("Found team 3 matchup");
      // Add table headers only once
      const headerRow = document.createElement("tr");
      const team_one_name = matchups[i].teams.team[0].name['#text'];
      const team_two_name = matchups[i].teams.team[1].name['#text'];
      [team_one_name, " ", team_two_name].forEach(header => {
        const headerCell = document.createElement("th");
        headerCell.textContent = header;
        headerRow.appendChild(headerCell);
      });
      my_scoreboardTable.appendChild(headerRow);
      // Move this loop inside the first loop
      console.log("Number of stats:", matchups[i].teams.team[0].team_stats.stats.stat.length);

      for (let j = 0; j < matchups[i].teams.team[0].team_stats.stats.stat.length; j++) {
        console.log("Checking stat ", j);
        let stat_name, team_one_stat, team_two_stat;

        if (j === 14) {
          stat_name = getCategory('900');
          team_one_stat = matchups[i].teams.team[0].team_points.total['#text'];
          team_two_stat = matchups[i].teams.team[1].team_points.total['#text'];
        } else {
          const stat_id = matchups[i].teams.team[0].team_stats.stats.stat[j].stat_id['#text'];
          stat_name = getCategory(stat_id);
          team_one_stat = matchups[i].teams.team[0].team_stats.stats.stat[j].value['#text'];
          team_two_stat = matchups[i].teams.team[1].team_stats.stats.stat[j].value['#text'];
        }
        console.log("stat_name:", stat_name, "team_one_stat:", team_one_stat, "team_two_stat:", team_two_stat);

        // Add the row
        const tableRow1 = document.createElement("tr");
        [team_one_stat, stat_name, team_two_stat].forEach(cell => {
          const tableCell = document.createElement("td");
          tableCell.textContent = cell;
          tableRow1.appendChild(tableCell);
        });
        my_scoreboardTable.appendChild(tableRow1);
      }
    }
  }
  highlightMyScoreboardLeaders();
}
 

(async function initializePage() {
  // Set the league and team names
  leagueNameHeading.textContent = "KGB's Champion League";
  // teamNameHeading.textContent = "Luckbox Jake";

  // Call the display functions to fetch and display data
  //await myScoreboard2();  
  await displayScoreboards();
  await displayRosters();
  await displayStandings();
})();

refreshButton.addEventListener("click", async () => {
  //await myScoreboard2();
  await displayScoreboards();
  await displayRosters();
  await displayStandings();
});