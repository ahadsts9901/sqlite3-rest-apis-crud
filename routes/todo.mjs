import express from "express";
import { db } from "../server.mjs";

const router = express.Router();

router.get("/todos", (req, res) => {

    db.all('SELECT * FROM todos', [], (err, todos) => {

        if (err) {
            console.error(err);
            return res.status(500).send({
                message: "Internal server error",
                error: err.message
            });
        }

        res.send({
            message: "Todos fetched",
            todos: todos
        });

    });

});

router.get("/todos/:id", (req, res) => {

    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).send({
            message: "Invalid ID format"
        });
    }

    db.get('SELECT * FROM todos WHERE id = ?', [id], (err, todo) => {

        if (err) {
            console.error(err);
            return res.status(500).send({
                message: "Internal server error",
                error: err.message
            });
        }

        if (!todo) {
            return res.status(404).send({
                message: "Todo not found"
            });
        }

        res.send({
            message: "Todo fetched",
            todo: todo

        });

    });
});

router.post("/todos", (req, res) => {

    const { todo } = req.body;

    if (!todo || todo.trim() === "") {
        return res.status(400).send({
            message: "Todo is required"
        });
    }

    db.run('INSERT INTO todos (todo) VALUES (?)', [todo], function (err) {

        if (err) {
            console.error(err);
            return res.status(500).send({
                message: "Internal server error",
                error: err.message
            });
        }

        res.send({
            message: "Todo added successfully",
            id: this.lastID
        });

    });

});

router.put("/todos/:id", (req, res) => {

    const { id } = req.params;
    const { todo } = req.body;

    if (isNaN(id)) {
        return res.status(400).send({
            message: "Invalid ID format"
        });
    }

    if (!todo || todo.trim() === "") {
        return res.status(400).send({
            message: "Todo is required"
        });
    }

    db.run('UPDATE todos SET todo = ? WHERE id = ?', [todo, id], function (err) {

        if (err) {
            console.error(err);
            return res.status(500).send({
                message: "Internal server error",
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).send({
                message: "Todo not found"
            });
        }

        res.send({
            message: "Todo updated successfully"
        });

    });
});

router.delete("/todos/:id", (req, res) => {

    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).send({
            message: "Invalid ID format"
        });
    }

    db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {

        if (err) {
            console.error(err);
            return res.status(500).send({
                message: "Internal server error",
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).send({
                message: "Todo not found"
            });
        }

        res.send({
            message: "Todo deleted successfully"
        });
        
    });
});

export default router;