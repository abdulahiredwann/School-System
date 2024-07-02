const express = require("express");
const { Teacher, validate } = require("../model/Teacher");
const _ = require("lodash");
const router = express.Router();
const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.get("/", async (req, res) => {
  const teachers = await Teacher.find().sort("name");
  res.status(201).send(teachers);
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body); // Validate the request body
    if (error) return res.status(400).send(error.details[0].message);
    let username = await Teacher.findOne({ username: req.body.username });
    if (username) {
      return res.status(400).send("Username alredt refisterd");
    }
    if (!isValidObjectId(req.body.subject)) {
      return res.status(400).send("Invalid Subject ID");
    }

    // Create a new Teacher instance
    let newTeacher = new Teacher({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      subject: req.body.subject, // Assign the subject directly
    });

    // Save the new teacher to the database
    await newTeacher.save();

    res.status(201).send(newTeacher); // Respond with the saved teacher object
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error, please try again later");
  }
});

module.exports = router;
