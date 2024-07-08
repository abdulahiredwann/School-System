const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Student, validate, validateUpdate } = require("../model/Student");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

function validateLogin(data) {
  const schema = Joi.object({
    username: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9_]{3,30}$")) // Allows only alphanumeric characters and underscores, length between 3 to 30
      .required(),
    password: Joi.string()
      .min(8) // Minimum length of 8 characters
      .max(128) // Maximum length of 128 characters
      .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+=-]{8,128}$")) // Allows specific special characters
      .required(),
  });

  return schema.validate(data);
}
// Login for Student
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let student = await Student.findOne({ username: username });
    if (!student) {
      return res.status(400).send("Invalid email or password");
    }

    const validatePassword = await bcrypt.compare(password, student.password);
    if (!validatePassword) {
      return res.status(400).send("Invalid email or password");
    }

    const token = student.generateAuthToken();
    res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
