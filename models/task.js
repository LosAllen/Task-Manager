const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskId: { type: String, required: true, unique: true },
    taskName: { type: String, required: true },
    taskDate: { type: Date, required: true },
    completeTime: { type: Number, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
});

module.exports = mongoose.model("Task", taskSchema);
