const express = require("express");
const {
  Teacher,
  validate,
  validateRegisterTeacher,
} = require("../model/Teacher");
const _ = require("lodash");
const router = express.Router();
const mongoose = require("mongoose");
const { Subject } = require("../model/Subject");
const bcrypt = require("bcrypt");
const { admin, auth } = require("../Middleware/AuthAdmin");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
// Register New Teacher only for admin
router.post("/", [auth, admin], async (req, res) => {
  try {
    let { teacherName, username, grades, subject } = req.body;
    const defaultPassword = "12345678";

    const { error } = validateRegisterTeacher(req.body); // Validate the request body
    if (error) return res.status(400).send(error.details[0].message);
    let newusername = await Teacher.findOne({ username: username });

    if (newusername) {
      return res.status(400).send("Username alredt registerd");
    }

    if (!isValidObjectId(subject)) {
      return res.status(400).send("Invalid Subject ID");
    }
    if (!isValidObjectId(grades)) {
      return res.status(400).send("Invalid Subject ID");
    }
    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(defaultPassword, salt);

    // Create a new Teacher instance
    let newTeacher = new Teacher({
      teacherName: teacherName,
      username: username,
      password: password,
      grades: grades,
      subject: subject,
    });

    const addsubject = await Subject.findById(subject);
    if (!addsubject) {
      return res.status(404).send("Subject not found");
    }

    // Save the new teacher to the database
    await newTeacher.save();

    addsubject.teachers.push(newTeacher._id);
    await addsubject.save();
    res.status(201).send(_.omit(newTeacher.toObject(), ["password"]));
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error, please try again later");
  }
});

module.exports = router;
