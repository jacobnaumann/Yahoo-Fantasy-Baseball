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
  const player1stats = await fetchData("player_stats.xml");
  //const player2stats = await fetchData(league_ + league_id_ + players_ + player_keys + player_id_prefix + "10642,422.p.10480/stats");
  // Fetch the required data using the fetchData function
  //const data = await fetchData(team_ + league_id_ + team_id_ + roster_ + players_);

  const roster = await fetchData("team_one_roster.xml");
  const roster2 = await fetchData("team_two_roster.xml");
  const team_one_name = roster.fantasy_content.team.name['#text'];
  const team_two_name = roster2.fantasy_content.team.name['#text'];
  const team_one_players  = roster.fantasy_content.team.roster.players;
  const team_two_players  = roster2.fantasy_content.team.roster.players;

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
    let team_one_roster = [];
    let team_two_roster = [];
    //Add team one to arrays
    for (let i = 0; i < team_one_players.player.length; i++) {
        let player_team_one = {
          "name": team_one_players.player[i].name.full['#text'],
          "team": team_one_players.player[i].editorial_team_abbr['#text'],
          "position_type": team_one_players.player[i].position_type['#text'],
          "selected_position": team_one_players.player[i].selected_position.position['#text'],
          "player_id": team_one_players.player[i].player_id['#text'],
          "url": team_one_players.player[i].url['#text'],
          "starting": team_one_players.player[i].batting_order && team_one_players.player[i].batting_order.order_num ? team_one_players.player[i].batting_order.order_num['#text'] : '0'
        }
        team_one_roster.push(player_team_one);
    }
    //Add team two to arrays
    for (let i = 0; i < team_two_players.player.length; i++) {
      let player_team_two = {
        "name": team_two_players.player[i].name.full['#text'],
        "team": team_two_players.player[i].editorial_team_abbr['#text'],
        "position_type": team_two_players.player[i].position_type['#text'],
        "selected_position": team_two_players.player[i].selected_position.position['#text'],
        "player_id": team_two_players.player[i].player_id['#text'],
        "url": team_two_players.player[i].url['#text'],
        "starting": team_two_players.player[i].batting_order && team_two_players.player[i].batting_order.order_num ? team_two_players.player[i].batting_order.order_num['#text'] : '0'

      }
      team_two_roster.push(player_team_two);
  }

    //Place all starting hitters into separate arrays
    let team_one_hitters = [];
    let team_two_hitters = [];
    for (let i = 0; i < team_one_roster.length; i++) {
      if (team_one_roster[i].position_type === "B" && team_one_roster[i].selected_position !== "BN") { //check to see if the hitter is a batter and isn't benched
        team_one_hitters.push(team_one_roster[i]);
      }
    }
    for (let i = 0; i < team_two_roster.length; i++) {
      if (team_two_roster[i].position_type === "B" && team_two_roster[i].selected_position !== "BN") { //check to see if the hitter is a batter and isnt
        team_two_hitters.push(team_two_roster[i]);
      }
    }
    console.log("Team one hitters roster length is: ", team_one_hitters.length);
    //Populate hitters table
    for (let i = 0; i < 13; i++) {      
      const tableRow = document.createElement("tr");      
      // Team One Hitters Cell
      const teamOneCell = document.createElement("td");
      teamOneCell.classList.add("hitter-cell");
      if (team_one_hitters[i].starting !== '0') { //check to see if player is in starting lineup
        const spanElemOne = document.createElement("span");
        spanElemOne.classList.add("batting-order");
        spanElemOne.textContent = team_one_hitters[i].starting;
        teamOneCell.appendChild(spanElemOne);
      } else {
        const spanElemOne = document.createElement("span");
        spanElemOne.classList.add("not-starting");
        spanElemOne.textContent = 'X';
        teamOneCell.appendChild(spanElemOne);
      }      
      tableRow.appendChild(teamOneCell);

      teamOneCell.innerHTML += team_one_hitters[i].name;
      
  
      // HITTER_POSITIONS Cell
      const positionCell = document.createElement("td");
      positionCell.textContent = HITTER_POSITIONS[i];
      tableRow.appendChild(positionCell);
  
      // Team Two Hitters Cell
      const teamTwoCell = document.createElement("td");
      teamTwoCell.classList.add("hitter-cell");
      if (team_two_hitters[i].starting !== '0') { //check to see if player is in starting lineup
        const spanElemTwo = document.createElement("span");
        spanElemTwo.classList.add("batting-order");
        spanElemTwo.textContent = team_two_hitters[i].starting;
        teamTwoCell.appendChild(spanElemTwo);
      } else {
        const spanElemTwo = document.createElement("span");
        spanElemTwo.classList.add("not-starting");
        spanElemTwo.textContent = 'X';
        teamTwoCell.appendChild(spanElemTwo);
      }      
      tableRow.appendChild(teamTwoCell);

      teamTwoCell.innerHTML += team_two_hitters[i].name;
      
  
      hittersTable.appendChild(tableRow);
    } 
  
    // for (let i = 0; i < 13; i++) {
    //   const tableRow = document.createElement("tr");  
     
    //   [team_one_hitters[i].name, HITTER_POSITIONS[i], team_two_hitters[i].name].forEach(cell => {
    //     const tableCell = document.createElement("td");
    //     tableCell.innerHTML = cell;
    //     tableRow.appendChild(tableCell);
    //   });    
    //   hittersTable.appendChild(tableRow);
    // }
    //Place all starting pitchers into separate arrays
    let team_one_pitchers = [];
    let team_two_pitchers = [];
    for (let i = 0; i < team_one_roster.length; i++) {
      if (team_one_roster[i].position_type === "P" && !team_one_roster[i].selected_position !== "BN") {
        team_one_pitchers.push(team_one_roster[i]);
      }
    }
    for (let i = 0; i < team_two_roster.length; i++) {
      if (team_two_roster[i].position_type === "P" && !team_two_roster[i].selected_position !== "BN") {
        team_two_pitchers.push(team_two_roster[i]);
      }
    }
    //Populate pitchers table
    for (let i = 0; i < 10; i++) {
      const tableRow = document.createElement("tr");  
      [team_one_pitchers[i].name, PITCHER_POSITIONS[i], team_two_pitchers[i].name].forEach(cell => {
        const tableCell = document.createElement("td");
        tableCell.innerHTML = cell;
        tableRow.appendChild(tableCell);
      });    
      pitchersTable.appendChild(tableRow);
    }
  };
}
   
