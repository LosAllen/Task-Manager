const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");
const swaggerDocument = require("./swagger.json");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Session setup for authentication
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
mongoose.set('strictQuery', true);
const mongoUri = process.env.MONGODB_URI;// Ensure the MongoDB URI is loaded
if (!mongoUri) {
    console.error("MONGODB_URI is missing or not loaded from .env file!");
    process.exit(1); // Exit if MONGO_URI is not set
}
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/auth", authRoutes);

// Root endpoint
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Task Manager API!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));