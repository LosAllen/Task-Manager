
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

// Get a single task by ID
router.get("/:id", isAuthenticated, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Invalid task ID" });
    }
});

// Create a new task (Fix: Use correct field names)
router.post("/", isAuthenticated, async (req, res) => {
    const { taskName, taskDate, completeTime, priority, endTime, startTime } = req.body;
    if (!taskName || !taskDate || !completeTime || !priority || !endTime || !startTime) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const task = new Task({ taskName, taskDate, completeTime, priority, endTime, startTime, userId: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a task by ID
router.put("/:id", isAuthenticated, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Invalid task ID or update data" });
    }
});

// Delete a task by ID
router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Invalid task ID" });
    }
});

module.exports = router;
