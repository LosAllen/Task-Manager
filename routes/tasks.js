const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const jwt = require("jsonwebtoken");

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
};

// Get all tasks for the authenticated user
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new task
router.post("/", isAuthenticated, async (req, res) => {
    const { taskId, taskName, taskDate, completeTime, priority, startTime, endTime } = req.body;

    if (!taskId || !taskName || !taskDate || !completeTime || !priority || !startTime || !endTime) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const task = new Task({ taskId, taskName, taskDate, completeTime, priority, startTime, endTime });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a task
router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ taskId: req.params.id });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
