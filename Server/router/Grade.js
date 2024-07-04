const express = require("express");
const { validate, Grade, validateUpdate } = require("../model/Grade");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
// Get All Grades
router.get("/", async (req, res) => {
  try {
    const grades = await Grade.find().sort("gradeName");
    res.status(200).send(grades);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }

  res.s;
});

// Get Grade by Name
router.get("/:gradeName", async (req, res) => {
  const { gradeName } = req.params;
  const decodedGradeName = decodeURIComponent(gradeName);

  const grade = await Grade.findOne({ gradeName: decodedGradeName });
  if (!grade) {
    return res.status(404).send("Grade Not Found");
  }
  res.status(200).send(grade);
});

// Get Student by given Grade Name
router.get("/:gradeName/students", async (req, res) => {
  try {
    const { gradeName } = req.params;
    const decodedGradeName = decodeURIComponent(gradeName);

    const g = await Grade.findOne({ gradeName: decodedGradeName });
    if (!g) {
      return res.status(404).send("Grade Not found");
    }
    const grade = await Grade.findOne({ gradeName: decodedGradeName }).populate(
      "students"
    );

    res.status(200).send(grade.students);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error!");
  }
});

// Add Grade
router.post("/", async (req, res) => {
  try {
    const { error } = req.body;
    if (error) return res.status(400).send(error.details[0].message);

    let newGrade = new Grade({
      gradeName: req.body.gradeName,
      teachers: req.body.teachers,
      students: req.body.students,
    });

    await newGrade.save();
    res.status(201).send(newGrade);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server error .Plase try again");
  }
});

// Update Grade by Grade Name
router.put("/:gradeName", async (req, res) => {
  try {
    const { gradeName } = req.params;

    const grade = await Grade.findOne({ gradeName: gradeName });

    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!grade) {
      return res.status(404).send("Grade Not FOUND!");
    }

    grade.set({
      gradeName: req.body.gradeName,
    });

    await grade.save();
    res.status(200).send(_.omit(grade.toObject(), ["teachers", "students"]));
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Delete Grade only for Admin
router.delete("/:gradeName", async (req, res) => {
  try {
    const { gradeName } = req.params;

    const decodedGradeName = decodeURIComponent(gradeName);
    const grade = await Grade.findOne({ gradeName: decodedGradeName });
    if (!grade) {
      return res.status(404).send("Grade Not Found");
    }
    const deletedGrade = await Grade.findOneAndDelete({
      gradeName: decodedGradeName,
    });

    res.status(200).send(deletedGrade);
  } catch (err) {
    console.log(err);
    res.status(400).send("Server Error");
  }
});

module.exports = router;
