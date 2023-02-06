const express = require("express");
const nodemailer = require("nodemailer");
const { AuthenticatorJWT } = require("../middlewares/authenticator");
const {
  getTasks,
  getTaskById,
  getTaskByUserId,
  updateTask,
  deleteTask,
  addTask,
} = require("../controllers/taskController");
const taskModel = require("../Models/taskModel");
const userModel = require("../Models/userModel");
const router = express.Router();

var transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "webshopclientserver@hotmail.com",
    pass: "webshop123",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

setInterval(() => {
  taskModel.find({}, (err, reminderList) => {
    if (err) {
      console.log(err);
    }
    if (reminderList) {
      reminderList.forEach((reminder) => {
        if (!reminder.isReminded) {
          const now = new Date();
          if (new Date(reminder.time) - now < 0) {
            taskModel.findByIdAndUpdate(
              reminder._id,
              { isReminded: true },
              (err, remindObj) => {
                if (err) {
                  console.log(err);
                }
                userModel.findById(reminder.user, (err, userObj) => {
                  if (err) {
                    console.log(err);
                  }
                  var mailOptions = {
                    from:
                      '"notify about a task" <webshopclientserver@hotmail.com>',
                    to: userObj.email,
                    subject: "you have a task that must be completed",
                    html: `
                    <h2>hello ${userObj.fullName}</h2>
                    <h4>Please make sure you completed the following task:</h4>
                    <h5>Title: ${reminder.taskName}</h5>
                    <p>Set until ${reminder.time}</p>`,
                  };

                  transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                      console.log("sendmailfail " + error);
                    } else {
                      res.json({});
                    }
                  });
                });
              }
            );
          }
        }
      });
    }
  });
}, 1000);

router.get("/get", AuthenticatorJWT, getTasks);
router.post("/get/:id", AuthenticatorJWT, getTaskById);
router.get("/get/user/:id", AuthenticatorJWT, getTaskByUserId);
router.post("/add", AuthenticatorJWT, addTask);
router.put("/update/:id", AuthenticatorJWT, updateTask);
router.delete("/delete/:id", AuthenticatorJWT, deleteTask);

module.exports = router;
