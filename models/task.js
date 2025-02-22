const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    timeRequired: { type: Number, required: true },
    userId: { type: String, required: true }
});

module.exports = mongoose.model("Task", taskSchema);
