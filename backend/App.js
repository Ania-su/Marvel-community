const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const path = require("path");
let data = JSON.parse(fs.readFileSync(path.join(__dirname, "docs", "characters.json"), "utf8"));

let characters = data.characters;

// GET /characters ==> Get all characters
app.get("/characters", (req, res) => {
  res.json(characters);
});

// POST /characters ==> Create a new character
app.post("/characters", (req, res) => {

  const existing = characters.find(c => c.id === req.body.id);
  if (existing) {
    return res.status(400).json({ message: "ID already exists" });
  }

  const newCharacter = {
    id: req.body.id,         
    name: req.body.name,
    realName: req.body.realName,
    universe: req.body.universe
  };

  if (!newCharacter.id || !newCharacter.name || !newCharacter.realName || !newCharacter.universe) {
    return res.status(400).json({ message: "Missing fields in request body" });
  }

  console.log("Requête reçue body:", req.body);

  characters.push(newCharacter);
  saveData();
  res.status(201).json(newCharacter);
});

// GET /characters/:id ==> Get a character by ID
app.get("/characters/:id", (req, res) => {
  const character = characters.find(c => c.id === parseInt(req.params.id));
  if (!character) return res.status(404).json({ message: "Character not found" });
  res.json(character);
});

// PUT /characters/:id ==> Update a character by ID
app.put("/characters/:id", (req, res) => {
  const character = characters.find(c => c.id === parseInt(req.params.id));
  if (!character) return res.status(404).json({ message: "Character not found" });

  character.name = req.body.name || character.name;
  character.realName = req.body.realName || character.realName;
  character.universe = req.body.universe || character.universe;

  saveData();
  res.json(character);

});

// DELETE /characters/:id ==> Delete a character by ID
app.delete("/characters/:id", (req, res) => {
  const index = characters.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Character not found" });

  const deleted = characters.splice(index, 1);
  saveData();
  res.json(deleted[0]);

});


function saveData() {

  fs.writeFileSync("characters.json", JSON.stringify({ characters }, null, 2));
}

app.listen(PORT, () => {
  console.log(`Server : http://localhost:${PORT}`);
});
