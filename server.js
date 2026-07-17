const express = require("express");

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("Server running");
});

app.get("/", (req, res) => {
    res.json({
        "name": "Adithyan M"
});
});

const tasks = [
    {
        id:1,
        title:"Study",
    },
    {
        id:2,
        title:"Game",
    },
    {
        id:3,
        title:"Sleep",
    }
];

app.get("/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
});


app.post("/tasks", (req, res) => {

    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const task = {
        id: nextId++,
        title
    };

    tasks.push(task);

    res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    task.title = title;

    res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.sendStatus(204);
});