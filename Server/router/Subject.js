const express = require("express");
const { Subject, validate } = require("../model/Subject");
const router = express.Router();
const mongoose = require("mongoose");
const { Teacher } = require("../model/Teacher");
const { admin, auth } = require("../Middleware/AuthAdmin");

const _ = require("lodash");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
// Get All subject
router.get("/", [auth], async (req, res) => {
  try {
    const subjects = await Subject.find().sort("subjectName");
    res.send(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).send("Server error, please try again later");
  }
});

// Get List of subject

router.get("/listsubject", async (req, res) => {
  try {
    const subject = await Subject.find().sort("subjectName");
    res.send(subject);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get Subject by name
router.get("/:subjectName", [auth], async (req, res) => {
  const { subjectName } = req.params;
  const subject = await Subject.findOne({ subjectName: subjectName });
  if (!subject) {
    return res.status(404).send("Subject name NOT FOUND!");
  }
  const pickedSubject = _.pick(subject, ["subjectName", "teachers"]);
  res.status(200).send(pickedSubject);
});

// Add Subject
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { subjectName } = req.body;
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let existingSubject = await Subject.findOne({ subjectName });

    if (existingSubject) {
      return res.status(400).send("Subject already registered");
    }

    let newSubject = new Subject({
      subjectName: subjectName,
    });

    await newSubject.save();

    res.status(201).send(newSubject);
  } catch (err) {
    console.error("Error creating subject:", err); // Log the error
    res.status(500).send("Server error, please try again later");
  }
});

// Update Subject
router.put("/:subjectName", [auth, admin], async (req, res) => {
  try {
    const { subjectName } = req.params;
    const decodedSubjectName = decodeURIComponent(subjectName);

    const { teachers } = req.body;
    const { error } = validate(req.body);

    let subject = await Subject.findOne({ subjectName: decodedSubjectName });

    if (!subject) {
      return res.status(404).send("Subject Not FOUND!");
    }
    if (error) return res.status(400).send(error.details[0].message);
    // Validate teachers array

    subject.set({
      subjectName: req.body.subjectName,
    });

    await subject.save();
    res.send(subject);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Delete Subject
router.delete("/:subjectName", [auth, admin], async (req, res) => {
  const { subjectName } = req.params;
  const decodedSubjectName = decodeURIComponent(subjectName);

  let subject = await Subject.findOne({ subjectName: decodedSubjectName });
  if (!subject) {
    return res.status(404).send("Subject NOT FOUND!");
  }

  let deleteSubject = await Subject.findOneAndDelete({
    subjectName: subjectName,
  });
  res.status(201).send("Delete:" + deleteSubject);
});

module.exports = router;
