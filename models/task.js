const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    taskDate: { type: String, required: true },
    completeTime: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model("Task", taskSchema);
