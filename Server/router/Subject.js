const express = require("express");
const { Subject, validate } = require("../model/Subject");
const router = express.Router();
const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().sort("subjectName");
    res.send(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).send("Server error, please try again later");
  }
});

router.post("/", async (req, res) => {
  try {
    const { subjectName, teachers, grades } = req.body;
    const { error } = validate(req.body);

    if (
      teachers.some((id) => !isValidObjectId(id)) ||
      grades.some((id) => !isValidObjectId(id))
    ) {
      return res.status(400).send("Invalid Teacher Id or Grade Id");
    }
    if (error) return res.status(400).send(error.details[0].message);

    let existingSubject = await Subject.findOne({ subjectName });

    if (existingSubject) {
      return res.status(400).send("Subject already registered");
    }

    let newSubject = new Subject({
      teachers: teachers,
      subjectName: subjectName,
      grades: grades,
    });
    await newSubject.save();
    res.status(201).send(newSubject);
  } catch (err) {
    console.error("Error creating subject:", err); // Log the error
    res.status(500).send("Server error, please try again later");
  }
});

module.exports = router;
