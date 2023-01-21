const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
let db = null;
const initilizeServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running At http://localhost:3001/");
    });
  } catch (e) {
    console.log(`Db Error is ${e.message}`);
    process.exit(1);
  }
};

initilizeServer();
const ConvertInCamel = (input) => {
  return {
    playerId: input.player_id,
    playerName: input.player_name,
    jerseyNumber: input.jersey_number,
    role: input.role,
  };
};
//GET NAMES API
app.get("/players", async (request, response) => {
  const quary = ` 
     SELECT * 
     FROM 
     cricket_team;
     `;
  const namesArray = await db.all(quary);
  const final_Result = [];
  for (let eachPlayer of namesArray) {
    let oneResult = ConvertInCamel(eachPlayer);
    final_Result.push(oneResult);
  }
  response.send(final_Result);
  //const oneresult = ConvertInCamel(namesArray[0]);
});

//ADD Player API

app.post("/players/", (request, response) => {
  const playerDetails = request.body;
  console.log(playerDetails);
});

module.exports = app;
