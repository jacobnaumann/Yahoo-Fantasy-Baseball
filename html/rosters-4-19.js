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
	13: "SP",
	14: "SP",
	15: "SP",
	16: "SP",
	17: "RP",
	18: "RP",
	19: "P",
	20: "P",
	21: "P",
	22: "P"
};

async function displayRosters() {
    //const player1stats = await fetchData(league_ + league_id_ + players_ + ";player_keys=422.p.10642,422.p.10480/stats;type=week;week=1");
    const player1stats = await fetchData(league_ + league_id_ + players_ + player_keys + player_id_prefix + "10642" + comma_ + player_id_prefix + "10480" + stats_);
    //const player2stats = await fetchData(league_ + league_id_ + players_ + player_keys + player_id_prefix + "10642,422.p.10480/stats");
    console.log (player1stats);
   
    // Fetch the required data using the fetchData function
    const data = await fetchData(team_ + league_id_ + team_id_ + my_team_id + roster_ + players_);
    const data2 = await fetchData(team_ + league_id_ + team_id_ + opp_team_id + roster_ + players_);
    // const data = await fetchData("players.xml");
    const roster  = data.fantasy_content.team.roster.players;
    const roster2 = data2.fantasy_content.team.roster.players;
    const team_one_name = data.fantasy_content.team.name['#text'];
    const team_two_name = data2.fantasy_content.team.name['#text']; 
    // Clear the table
    hittersTable.innerHTML = "";
    pitchersTable.innerHTML = "";
  
    // Add Table headers
    const hittersHeaderRow = document.createElement("tr");
    const pitchersHeaderRow = document.createElement("tr");

    ["Pos.", "Name", "Team"].forEach(header => {
      const hittersHeaderCell = document.createElement("th");
      hittersHeaderCell.textContent = header;
      hittersHeaderRow.appendChild(hittersHeaderCell);
    });    
    ["Pos.", "Name", "Team"].forEach(header => {
      const pitchersHeaderCell = document.createElement("th");
      pitchersHeaderCell.textContent = header;
      pitchersHeaderRow.appendChild(pitchersHeaderCell);
    });

    hittersTable.appendChild(hittersHeaderRow);
    pitchersTable.appendChild(pitchersHeaderRow);
  
    // Parse and display the data
    if (data) {
      for (let i = 0; i < roster.player.length; i++) {
        const tableRow = document.createElement("tr");
  
        // Get team names and total points
        const player_name = roster.player[i].name.full['#text'];
        const player_team = roster.player[i].editorial_team_abbr['#text'];
        const player_position_type = roster.player[i].position_type['#text'];
        const player_position = roster.player[i].selected_position.position['#text'];
        
        if (player_position_type === 'B') {
          [player_position, player_name, player_team].forEach(cell => {
            const tableCell = document.createElement("td");
            tableCell.textContent = cell;
            tableRow.appendChild(tableCell);
          });    
          hittersTable.appendChild(tableRow);
        } else if (player_position_type === 'P') {
          [player_position, player_name, player_team].forEach(cell => {
            const tableCell = document.createElement("td");
            tableCell.textContent = cell;
            tableRow.appendChild(tableCell);
          });
    
          pitchersTable.appendChild(tableRow);
        }
        // Add the data to the row

      };
    }
   }
