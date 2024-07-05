const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Student, validate, validateUpdate } = require("../model/Student");
const { Grade } = require("../model/Grade");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { admin, auth } = require("../Middleware/AuthAdmin");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Register New Student only for admin
router.post("/", [auth, admin], async (req, res) => {
  try {
    let { studentName, username, password, grade } = req.body;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    if (!isValidObjectId(grade)) {
      return res.status(400).send("Invalid Teacher Id");
    }

    let existingStudent = await Student.findOne({
      username: username,
    });
    if (existingStudent) {
      return res.status(400).send("Username alredy taken");
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let newstudent = new Student({
      studentName: studentName,
      username: username,
      password: password,
      grade: grade,
    });

    let grades = await Grade.findById(grade);
    if (!grades) {
      return res.status(404).send("Grade Not found !");
    }
    grades.students.push(newstudent._id);

    await grades.save();

    await newstudent.save();
    res.status(201).send(_.omit(newstudent.toObject(), ["password"]));
  } catch (err) {
    console.log(err);
    res.status(400).send("server Error");
  }
});

module.exports = router;
