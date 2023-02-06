const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    time: {
      type: String,
      required: true,
    },
    isReminded: {
      type: Boolean,
    },
    priority: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const taskModel = new mongoose.model("task", taskSchema);
module.exports = taskModel;
