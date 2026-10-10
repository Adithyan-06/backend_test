
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("tasks.db");

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0
    )
`);

const count = db.prepare("SELECT COUNT(*) AS count FROM tasks").get().count;

if (count === 0) {
    const insert = db.prepare(
        "INSERT INTO tasks (title, done) VALUES (?, ?)"
    );

    const seed = db.transaction(() => {
        insert.run("Study", 0);
        insert.run("Game", 0);
        insert.run("Sleep", 0);
    });

    seed();
}

app.get("/", (req, res) => {
    res.json({ name: "Adithyan M" });
});

app.get("/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks").all();
    res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
});

app.post("/tasks", (req, res) => {
    const { title } = req.body || {};

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }

    const result = db.prepare(
        "INSERT INTO tasks (title, done) VALUES (?, ?)"
    ).run(title, 0);

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, done } = req.body || {};

    if (
        typeof title !== "string" ||
        title.trim() === "" ||
        (done !== undefined && typeof done !== "boolean")
    ) {
        return res.status(400).json({ error: "Invalid task data" });
    }

    const existing = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!existing) {
        return res.status(404).json({ error: "Task not found" });
    }

    const updatedDone = done === undefined ? existing.done : Number(done);

    db.prepare(
        "UPDATE tasks SET title = ?, done = ? WHERE id = ?"
    ).run(title, updatedDone, id);

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const result = db.prepare(
        "DELETE FROM tasks WHERE id = ?"
    ).run(Number(req.params.id));

    if (result.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.sendStatus(204);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
