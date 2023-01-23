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
    app.listen(3000, () => {
      console.log("Server Running At http://localhost:3000/");
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
app.get("/players/", async (request, response) => {
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

app.post("/players/", async (request, response) => {
  const Details = request.body;
  const { playerName, jerseyNumber, role } = Details;
  const addPlayerQuary = ` 
  INSERT INTO 
  cricket_team(player_id,player_name,jersey_number,role)
  VALUES(
      12, ${playerName},${jerseyNumber},${role}
  );
  `;
  const result = await db.run(addPlayerQuary);
  console.log("Player Added to Team");
});
// GET Player Details
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuary = `
  SELECT 
  *
  FROM 
  cricket_team 
  WHERE player_id= 1;
  `;
  const result = await db.all(getPlayerQuary);
  response.send(result);
});

module.exports = app;
