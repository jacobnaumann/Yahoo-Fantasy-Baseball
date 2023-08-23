
const STAT_CATEGORIES = { 
    60: "H/AB", 
    7: "R", 
    12: "HR", 
    13: "RBI", 
    16: "SB", 
    23: "TB", 
    3: "AVG", 
    55: "OPS", 
    50: "IP", 
    28: "W", 
    42: "K", 
    26: "ERA", 
    27: "WHIP", 
    83: "QS", 
    89: "SV+H",
    900: "TOTAL"
};

// async function fetchData(filename) {
  // try {
  //   const response = await fetch(`/api/yahoo?endpoint=${endpoint}`);
  //   const text = await response.text();

  //   if (text.startsWith("<?xml")) {
  //     const data = xmlToJson(text);
  //     return data;
  //   } else if (response.headers.get("Content-Type").includes("application/json")) {
  //     const data = JSON.parse(text); 
  //     return data;
  //   } else {
  //     console.log("Unexpected response:", text);
  //     throw new Error("Unsupported response format");
  //   }
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  // }
// }

// This is the 'fetchData' method for use on local machine
async function fetchData(filename) {
  try {
    const response = await fetch(filename);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch data with status ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType.includes("application/xml") && !contentType.includes("text/xml")) {
      throw new Error(`Unsupported content type: ${contentType}`);
    }  
    const xmlText = await response.text();
    return xmlToJson(xmlText);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
  
}

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

function getCategory(stat_id) {
return STAT_CATEGORIES[stat_id];
}

function highlightScoreboards() {
    const myScoreboardTable_main = document.querySelector(".my-scoreboard-table");
    const myScoreboardTable_total = document.querySelector(".my-scoreboard-table-total");
    const numRows = myScoreboardTable_main.rows.length;

    if (numRows <= 1) return; // No data in the table or only headers.

    // Highlight My Scoreboard Main table
    for (let row = 2; row < numRows; row++) {
      const cellVal1 = parseFloat(myScoreboardTable_main.rows[row].cells[0].textContent);
      const cellVal3 = parseFloat(myScoreboardTable_main.rows[row].cells[2].textContent);
      // If the scores aren't equal, highlight one of them
      if (cellVal1 !== cellVal3) {
        if (row === 13 || row === 14) {
          const greatestValCell = cellVal1 > cellVal3 ? 2 : 0;
          myScoreboardTable_main.rows[row].cells[greatestValCell].style.fontWeight = 'bold';
          myScoreboardTable_main.rows[row].cells[greatestValCell].style.fontSize = 'medium';
        } else {
        const greatestValCell = cellVal1 > cellVal3 ? 0 : 2;
        myScoreboardTable_main.rows[row].cells[greatestValCell].style.fontWeight = 'bold';
        myScoreboardTable_main.rows[row].cells[greatestValCell].style.fontSize = 'medium';
        }
      }
    }

    // Highlight My Scoreboard Main table totals
    const total1 = parseFloat(myScoreboardTable_total.rows[0].cells[0].textContent);
    const total2 = parseFloat(myScoreboardTable_total.rows[0].cells[2].textContent);    
    if (total1 !== total2) {
      const greatestTotal = total1 > total2 ? 0 : 2;
      myScoreboardTable_total.rows[0].cells[greatestTotal].style.fontWeight = 'bold';  
      myScoreboardTable_total.rows[0].cells[greatestTotal].style.fontSize= 'medium';
      //myScoreboardTable_total.rows[0].cells[greatestTotal].style.backgroundColor= 'white';  
    }

    // Highlight the League Scoreboard leaders
    const leagueScoreboardTables = document.querySelectorAll("#league-scoreboard-container table");

    leagueScoreboardTables.forEach(table => {
        const row1Score = parseFloat(table.rows[0].cells[1].textContent);
        const row2Score = parseFloat(table.rows[1].cells[1].textContent);

        if (row1Score !== row2Score) {
            const highestScoreRowIndex = row1Score > row2Score ? 0 : 1;
            table.rows[highestScoreRowIndex].style.fontWeight = 'bold';
        }
    });
}

function displayLastRefreshed() {
  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleString();
  const lastRefreshedElement = document.getElementById('last-refreshed-1');
  lastRefreshedElement.innerHTML = `Last refresh: ${formattedTime}`;
}

function isItShohei(name) {
  if (name.startsWith('Shohei')) {
    return "Shohei Ohtani";
  }
  return name;
}
