const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "db.json"), (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    })
});

app.post("/api/notes", function(req, res) {
    const newNote = req.body;
    newNote.id = uuidv4();
    fs.readFile(path.join(__dirname, "db.json"), (err, data) => {
        if (err) throw err;
        const noteDB = JSON.parse(data);
        noteDB.push(newNote);
        fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(noteDB), (err, data) => {
            if (err) throw err;
            res.json(newNote);
        })
    })
});

app.delete("/api/notes/:id", function(req, res) {
    fs.readFile(path.join(__dirname, "db.json"), (err, data) => {
        if (err) throw err;
        const noteDB = JSON.parse(data);
        for (let i = 0; i < noteDB.length; i++) {
            if (noteDB[i].id === req.params.id) {
                noteDB.splice(i, 1);
                fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(noteDB), (err, data) => {
                    if (err) throw err;
                    res.send("200");
                    return;
                })
            }
        }
    })
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
  