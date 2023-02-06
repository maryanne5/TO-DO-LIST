const Task = require("../Models/taskModel");

exports.getTasks = async (req, res) => {
  await Task.find({ user: req.user._id }).exec((err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ errorMessage: "No Tasks found", err });
    }
  });
};

exports.getTaskById = async (req, res) => {
  await Task.find({ _id: req.params.id })
    .populate("user")
    .exec((error, result) => {
      if (error) {
        res.status(404).json({ errorMessage: "No Tasks found" });
      } else {
        res.status(200).json(result);
      }
    });
};

exports.getTaskByUserId = async (req, res) => {
  await Task.find({ user: req.params.id })
    .populate("user")
    .exec((error, result) => {
      if (error) {
        res.status(404).json({ errorMessage: "No Tasks found" });
      } else {
        res.status(200).json(result);
      }
    });
};

exports.addTask = async (req, res) => {
  const task = new Task({
    taskName: req.body.taskName,
    time: req.body.time,
    priority: req.body.priority,
    comment: req.body.comment,
    user: req.user._id,
  });

  const saveTask = await task.save();
  if (saveTask) {
    res.status(200).json({
      successMessage: "Task saved successfully!",
    });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Task could not be saved. Please try again" });
  }
};

exports.updateTask = async (req, res) => {
  const findTask = await Task.findOne({ _id: req.params.id });
  if (findTask) {
    findTask.taskName = req.body.taskName;
    findTask.comment = req.body.comment;
    findTask.priority = req.body.priority;
    findTask.time = req.body.time;

    const saveTask = await findTask.save();
    if (saveTask) {
      res.status(200).json({ successMessage: "Task Updated Successfully" });
    } else res.status(400).json({ errorMessage: "Task could not be Updated." });
  } else {
    res.status(404).json({ errorMessage: "Task not found." });
  }
};

exports.deleteTask = async (req, res) => {
  const findTask = await Task.findOne({ _id: req.params.id });
  if (findTask) {
    const del = findTask.remove();
    if (del) {
      res.status(200).json({ successMessage: "Task Deleted Successfully" });
    } else {
      res
        .status(400)
        .json({ errorMessage: "Task could not be deleted. Please Try Again" });
    }
  } else {
    res.status(404).json({ errorMessage: "Task Not Found." });
  }
};
