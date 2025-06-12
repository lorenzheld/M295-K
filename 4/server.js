import express from 'express';
import fs from 'node:fs';

const app = express();
const port = 3000;
app.use(express.json());



app.get('/now', (req, res) => {
    let timezone = 0;
    const oneH = 60 * 60 * 1000

    if (req.query.tz) {
        const parsedTz = parseInt(req.query.tz, 10);
        timezone = parsedTz;
    }

    const now = new Date();

    const newTimestamp = now.getTime() + (timezone * oneH);

    res.send(`Aktuelle Zeit: ${new Date(newTimestamp).toLocaleString()}`);
});

let names =["Max", "Moritz", "Anna", "Lena", "Paul", "Laura", "Tim", "Sophie", "Ben", "Lisa",
    "Jonas", "Emma", "Leon", "Mia", "Lukas", "Nina", "Felix", "Sarah", "Tom", "Julia"];

app.get('/name', (req, res) => {
    const randomName = names[Math.floor(Math.random() * names.length - 1)];
    res.send(`Zufälliger Name: ${randomName}`);
})
app.get("/names", (req, res) => {
    res.send(names);
})

app.post("/names", (req, res) => {
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name ist erforderlich.' });
    }
    names.push(name);
    res.status(201).json({ // 201 Created ist ein guter Status für erfolgreiche Erstellung
        message: `Name '${name}' erfolgreich hinzugefügt!`,
        addedName: name,
        currentNames: names // Optional: Sende das aktualisierte Array zurück
    });
});

app.delete("/names", (req, res) => {
    if(req.query.name){
        const name = req.query.name;
        if (names.includes(name)){
            names = names.filter(name => name !== name);
        } else {
            return res.status(400);
        }
    } else {
        return res.status(400);
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

