const express = require("express");

const { Subject, validate } = require("../model/Subject");
const router = express.Router();
const _ = require("lodash");

router.get("/", async (req, res) => {
  const subject = await Subject.find().sort("subject");
  res.send(subject);
});

router.post("/", async (req, res) => {
  try {
    const { subject } = req.body;

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let existingSubject = await Subject.findOne({ subject });

    if (existingSubject) {
      return res.status(400).send("Subject already registered");
    }

    let newSubject = new Subject(_.pick(req.body, ["subject"]));

    await newSubject.save();
    res.status(201).send(newSubject);
  } catch (err) {
    res.status(500).send("Server error, please try again later");
  }
});

module.exports = router;
