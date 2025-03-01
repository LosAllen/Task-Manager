const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: "Unauthorized" });
};

// Get all tasks for the authenticated user
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new task
router.post("/", isAuthenticated, async (req, res) => {
    const { name, date, priority, timeRequired } = req.body;
    if (!name || !date || !priority || !timeRequired) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const task = new Task({ name, date, priority, timeRequired, userId: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a task
router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;