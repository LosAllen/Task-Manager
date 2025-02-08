const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const port = process.env.PORT || 8080;
const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());
app.use(express.json());

// CORS setup
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// API Routes
app.use('/api', require('./routes'));

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Task Manager API!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Connect to MongoDB and start server
mongodb.initDb((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        app.listen(port, () => console.log(`Connected to DB and listening on port ${port}`));
    }
});
