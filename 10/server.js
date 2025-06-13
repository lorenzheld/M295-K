import express from "express";
import {randomUUID} from "node:crypto";

const app = express();
const port = 3000;
app.use(express.json());

let tasks = [
    {
        id: randomUUID(),
        task: "Hausaufgaben machen"
    },
    {
        id: randomUUID(),
        task: "englisch lernen"
    }
]

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.post("/tasks", (req, res) => {
    let task = req.body.task;

    if (!task) {
        return res.sendStatus(400)
    }

    task = {id: randomUUID(), task};

    tasks = [...tasks, task]
    res.status(201).send(task);
});

app.get("/tasks/:id", (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.sendStatus(400);
    }

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.sendStatus(404);
    }

    res.status(200).send(task);

});

app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id;

    if(!id){
        res.sendStatus(400);
    }

    const task = tasks.find(t => t.id === id);

    if (!task){
        res.sendStatus(404);
    }

    tasks = tasks.filter(t => t.id !== id);
    res.sendStatus(200);

});


console.log(`Server running at http://localhost:${port}`);
app.listen(port, () => {
});
