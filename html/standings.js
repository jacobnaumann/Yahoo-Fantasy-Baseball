async function displayStandings() {
  // Fetch the required data using the fetchData function
  //const data = await fetchData(league_ + league_id_ + standings_);
  const data = await fetchData("standings.xml");
  const standings  = data.fantasy_content.league.standings.teams; 

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
      const team_wins = standings.team[i].team_standings.outcome_totals.wins['#text'];
      const team_losses = standings.team[i].team_standings.outcome_totals.losses['#text'];
      const team_ties = standings.team[i].team_standings.outcome_totals.ties['#text'];
      const team_games_back = standings.team[i].team_standings.games_back['#text'];

      // Add the data to the row
      [team_rank, team_name, team_wins + "-" + team_losses + "-" + team_ties, team_games_back].forEach(cell => {
        const tableCell = document.createElement("td");
        tableCell.textContent = cell;
        tableRow.appendChild(tableCell);
      });

      standingsTable.appendChild(tableRow);
    };
  }
}
