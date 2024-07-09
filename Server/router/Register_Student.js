const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  Student,
  validateRegisterStudent,
  validateUpdate,
} = require("../model/Student");
const { Grade } = require("../model/Grade");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { admin, auth } = require("../Middleware/AuthAdmin");
const initializeResults = require("./resinit");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Register New Student only for admin
router.post("/", [auth, admin], async (req, res) => {
  try {
    let { studentName, username, grade, gender } = req.body;
    const defaultPassword = "12345678"; // Default password
    const { error } = validateRegisterStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // if (!isValidObjectId(grade)) {
    //   return res.status(400).send("Invalid Teacher Id");
    // }

    let existingStudent = await Student.findOne({ username: username });
    if (existingStudent) {
      console.error("Username already taken:", username);
      return res.status(400).send("Username already taken");
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(defaultPassword, salt);
    const results = await initializeResults();

    let newstudent = new Student({
      studentName: studentName,
      username: username,
      password: password,
      grade: grade,
      gender: gender,
      results: results,
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
