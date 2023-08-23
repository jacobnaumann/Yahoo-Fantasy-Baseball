async function displayMyScoreboard(data, my_team_id) {
  const matchups = data.fantasy_content.league.scoreboard.matchups.matchup;

  // Clear the table
  my_scoreboardTable.innerHTML = "";
  my_scoreboardTable_total.innerHTML = "";

  for (let i = 0; i < matchups.length; i++) {
    const team_one_id = matchups[i].teams.team[0].team_id['#text'];
    const team_two_id = matchups[i].teams.team[1].team_id['#text'];
    if (team_one_id == my_team_id || team_two_id == my_team_id) {
      // Change team_id's in main scope
      if (team_one_id == my_team_id) {
        my_team_id = team_one_id;
        opp_team_id = team_two_id;
      } else {
        opp_team_id = team_one_id;
        my_team_id = team_two_id;
      }
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

      for (let j = 0; j < matchups[i].teams.team[0].team_stats.stats.stat.length + 2; j++) {
        let stat_name, team_one_stat, team_two_stat;
        if (j === 16) {
          stat_name = getCategory('900');
          team_one_stat = matchups[i].teams.team[0].team_points.total['#text'];
          team_two_stat = matchups[i].teams.team[1].team_points.total['#text'];
                  // Add the row    
          const tableRow1 = document.createElement("tr");
          [team_one_stat, stat_name, team_two_stat].forEach(cell => {
            const tableCell = document.createElement("td");
            tableCell.textContent = cell;
            tableRow1.appendChild(tableCell);
          });
          my_scoreboardTable_total.appendChild(tableRow1);
        } else {
          if (j === 0) {
            stat_name = "Remaining";
            team_one_stat = matchups[i].teams.team[0].team_remaining_games.total.remaining_games['#text'];
            team_two_stat = matchups[i].teams.team[1].team_remaining_games.total.remaining_games['#text'];
          } else {
            const stat_id = matchups[i].teams.team[0].team_stats.stats.stat[j-1].stat_id['#text'];
            stat_name = getCategory(stat_id);
            team_one_stat = matchups[i].teams.team[0].team_stats.stats.stat[j-1].value['#text'];
            team_two_stat = matchups[i].teams.team[1].team_stats.stats.stat[j-1].value['#text'];
          }
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
  }
  
}

async function displayLeagueScoreboard(data) {
  const matchups = data.fantasy_content.league.scoreboard.matchups.matchup;

  // Select the container
  const league_scoreboardContainer = document.getElementById("league-scoreboard-container");

  // Clear the container
  league_scoreboardContainer.innerHTML = "";

  // Parse and display the data
  if (data) {
    for (let i = 0; i < matchups.length; i++) {
      // Get team names and total points
      const team_one_name = matchups[i].teams.team[0].name['#text'];
      const team_two_name = matchups[i].teams.team[1].name['#text'];
      const team_one_id = matchups[i].teams.team[0].team_id['#text'];
      const team_two_id = matchups[i].teams.team[1].team_id['#text'];
      
      const team_one_total = matchups[i].teams.team[0].team_points.total['#text'];
      const team_two_total = matchups[i].teams.team[1].team_points.total['#text'];

      // Create a new table for each matchup
      const matchupTable = document.createElement("table");
      matchupTable.classList.add("league-scoreboard-table");

      // Add a click event listener to the table
      matchupTable.addEventListener("click", () => {
        my_team_id = team_one_id;
        opp_team_id = team_two_id;
        displayScoreboards(data, my_team_id);
        displayRosters();
      });

      // Add team one name and total to the table
      const teamOneRow = document.createElement("tr");
      const teamOneNameCell = document.createElement("td");
      teamOneNameCell.textContent = team_one_name;
      const teamOneTotalCell = document.createElement("td");
      teamOneTotalCell.textContent = team_one_total;
      teamOneRow.appendChild(teamOneNameCell);
      teamOneRow.appendChild(teamOneTotalCell);
      matchupTable.appendChild(teamOneRow);

      // Add team two name and total to the table
      const teamTwoRow = document.createElement("tr");
      const teamTwoNameCell = document.createElement("td");
      teamTwoNameCell.textContent = team_two_name;
      const teamTwoTotalCell = document.createElement("td");
      teamTwoTotalCell.textContent = team_two_total;
      teamTwoRow.appendChild(teamTwoNameCell);
      teamTwoRow.appendChild(teamTwoTotalCell);
      matchupTable.appendChild(teamTwoRow);

      // Append the table to the container
      league_scoreboardContainer.appendChild(matchupTable);
    };
  }
  highlightScoreboards();
}


