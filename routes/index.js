const express = require('express');
const router = express.Router();

router.use('/api-docs', require('./swagger')); // Register Swagger first
router.use('/tasks', require('./tasks'));   // Register task routes

router.get('/', (req, res) => {
    res.json({ message: "Welcome to the Task Manager API!" });
});

module.exports = router;
