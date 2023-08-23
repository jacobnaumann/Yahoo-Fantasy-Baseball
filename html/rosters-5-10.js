
const HITTER_POSITIONS = {
  0: "C",
  1: "1B",
  2: "2B", 
  3: "3B",
  4: "SS",
  5: "CI", 
  6: "MI",
  7: "OF",
  8: "OF",
  9: "OF",
  10: "Util",
  11: "Util",
  12: "Util" 
};
const PITCHER_POSITIONS = {
  0: "SP",
  1: "SP",
  2: "SP",
  3: "SP",
  4: "RP",
  5: "RP",
  6: "P",
  7: "P",
  8: "P",
  9: "P"
};

async function displayRosters() {
  //const player1stats = await fetchData(league_ + league_id_ + players_ + ";player_keys=422.p.10642,422.p.10480/stats;type=week;week=1");
  //const player1stats = await fetchData(league_ + league_id_ + players_ + player_keys + player_id_prefix + "10642" + comma_ + player_id_prefix + "10480" + stats_);
  //const player1stats = await fetchData("player_stats.xml");
  //const player2stats = await fetchData(league_ + league_id_ + players_ + player_keys + player_id_prefix + "10642,422.p.10480/stats");
  // Fetch the required data using the fetchData function
  //const data = await fetchData(team_ + league_id_ + team_id_ + roster_ + players_);
  const data = await fetchData(team_ + league_id_ + team_id_ + my_team_id + roster_ + players_);
  const data2 = await fetchData(team_ + league_id_ + team_id_ + opp_team_id + roster_ + players_);
  // const data = await fetchData("players.xml");
  const roster  = data.fantasy_content.team.roster.players;
  const roster2 = data2.fantasy_content.team.roster.players;
  const team_one_name = data.fantasy_content.team.name['#text'];
  const team_two_name = data2.fantasy_content.team.name['#text']; 
  const team_one_players  = data.fantasy_content.team.roster.players;
  const team_two_players  = data2.fantasy_content.team.roster.players;
  const probablePitchers = JSON.parse(localStorage.getItem('probablePitchers'));

  // Clear the table
  hittersTable.innerHTML = "";
  pitchersTable.innerHTML = "";

  // Add hittersTable headers
  const hittersHeaderRow = document.createElement("tr");
  [team_one_name, "Pos.", team_two_name].forEach(header => {
    const hittersHeaderCell = document.createElement("th");
    hittersHeaderCell.textContent = header;
    hittersHeaderRow.appendChild(hittersHeaderCell);
  });    
  // Add pitchersTable headers
  const pitchersHeaderRow = document.createElement("tr");
  [team_one_name, "Pos.", team_two_name].forEach(header => {
    const pitchersHeaderCell = document.createElement("th");
    pitchersHeaderCell.textContent = header;
    pitchersHeaderRow.appendChild(pitchersHeaderCell);
  });    

  hittersTable.appendChild(hittersHeaderRow);
  pitchersTable.appendChild(pitchersHeaderRow);

  // Parse and display the data
  if (team_one_players && team_two_players) {
    //Create arrays for hitter/pitchers
    let team_one_hitters = [];
    let team_one_pitchers = [];
    let team_two_hitters = [];
    let team_two_pitchers = [];
    //Add team one to arrays
    for (let i = 0; i < team_one_players.player.length; i++) {
      if (team_one_players.player[i].position_type['#text'] === "B") {
        team_one_hitters.push(team_one_players.player[i].name.full['#text']);
      } else if (team_one_players.player[i].position_type['#text'] === "P") {
        team_one_pitchers.push(team_one_players.player[i].name.full['#text']);
      }
    }
    //Add team two to arrays
    for (let i = 0; i < team_two_players.player.length; i++) {
      if (team_two_players.player[i].position_type['#text'] === "B") {
        team_two_hitters.push(team_two_players.player[i].name.full['#text']);
      } else if (team_two_players.player[i].position_type['#text'] === "P") {
        team_two_pitchers.push(team_two_players.player[i].name.full['#text']);
      }
    }
    //Populate hitters table
    for (let i = 0; i < 13; i++) {
      const tableRow = document.createElement("tr");  
      const player_name = isItShohei(team_one_hitters[i]);
      const player_name2 = isItShohei(team_two_hitters[i]);
      [player_name, HITTER_POSITIONS[i], player_name2].forEach(cell => {
        const tableCell = document.createElement("td");
        tableCell.textContent = cell;
        tableRow.appendChild(tableCell);
      });    
      hittersTable.appendChild(tableRow);
    }
    
    //Populate pitchers table
    for (let i = 0; i < 10; i++) {
      const tableRow = document.createElement("tr");
      let player_name = isItShohei(team_one_pitchers[i]);
      let player_name2 = isItShohei(team_two_pitchers[i]);

      // Check if players are probable pitchers and append the star if they are
      if (isProbablePitcher(player_name, probablePitchers)) {
        player_name += " ";
        const starImg = document.createElement("img");
        starImg.src = "blue-star.png"; // Path to your star image file
        starImg.style.width = "16px"; // Adjust the size as needed
        starImg.style.height = "16px";
        starImg.style.verticalAlign = "bottom";
        player_name += starImg.outerHTML;
      }
      if (isProbablePitcher(player_name2, probablePitchers)) {
        player_name2 += " ";
        const starImg = document.createElement("img");
        starImg.src = "blue-star.png"; // Path to your star image file
        starImg.style.width = "16px"; // Adjust the size as needed
        starImg.style.height = "16px";
        starImg.style.verticalAlign = "bottom";
        player_name2 += starImg.outerHTML;
      }

      [player_name, PITCHER_POSITIONS[i], player_name2].forEach(cell => {
        const tableCell = document.createElement("td");
        tableCell.innerHTML = cell; // Changed from textContent to innerHTML
        tableRow.appendChild(tableCell);
      });
      pitchersTable.appendChild(tableRow);
    }
  };
}
   
