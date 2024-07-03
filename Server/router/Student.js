const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Student, validate } = require("../model/Student");
const { Grade } = require("../model/Grade");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let existingStudent = await Student.findOne({
      username: req.body.username,
    });
    if (existingStudent) {
      return res.status(400).send("Username alredy taken");
    }
    let newstudent = new Student({
      studentName: req.body.studentName,
      username: req.body.username,
      password: req.body.password,
      grade: req.body.grade,
      results: req.body.results,
    });

    let grade = await Grade.findById(req.body.grade);
    if (!grade) {
      return res.status(400).send("Invalid Grade");
    }
    grade.students.push(newstudent._id);

    await grade.save();

    await newstudent.save();
    res.status(201).send(newstudent);
  } catch (err) {
    console.log(err);
    res.status(400).send("server Error");
  }
});

module.exports = router;
