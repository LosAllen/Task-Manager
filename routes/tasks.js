const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

// GET all tasks
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const tasks = await db.db().collection('tasks').find().toArray();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve tasks", details: error.message });
    }
});

// GET a task by ID
router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        const task = await db.db().collection('tasks').findOne({ _id: new ObjectId(req.params.id) });
        task ? res.json(task) : res.status(404).json({ error: "Task not found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve task", details: error.message });
    }
});

// POST (Create a new task)
router.post('/', async (req, res) => {
    try {
        const db = getDb();

        if (!req.body.taskName || !req.body.taskDate || !req.body.completeTime || !req.body.priority) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const task = {
            taskName: req.body.taskName,
            taskDate: req.body.taskDate,
            completeTime: req.body.completeTime,
            priority: req.body.priority
        };

        const result = await db.db().collection('tasks').insertOne(task);
        const newTask = await db.db().collection('tasks').findOne({ _id: result.insertedId });

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: "Failed to create task", details: error.message });
    }
});

// PUT (Update a task)
router.put('/:id', async (req, res) => {
    try {
        const db = getDb();
        const taskId = new ObjectId(req.params.id);

        if (!req.body.taskName || !req.body.taskDate || !req.body.completeTime || !req.body.priority) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const updateResult = await db.db().collection('tasks').updateOne(
            { _id: taskId },
            { $set: req.body }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ error: "Task not found or no changes made" });
        }

        const updatedTask = await db.db().collection('tasks').findOne({ _id: taskId });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Failed to update task", details: error.message });
    }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
    try {
        const db = getDb();
        const result = await db.db().collection('tasks').deleteOne({ _id: new ObjectId(req.params.id) });

        result.deletedCount > 0
            ? res.json({ message: "Task deleted successfully" })
            : res.status(404).json({ error: "Task not found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task", details: error.message });
    }
});

module.exports = router;
