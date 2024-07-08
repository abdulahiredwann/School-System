const express = require("express");
const { Teacher } = require("../model/Teacher");
const _ = require("lodash");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

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
// Login for Teachers
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const teacher = await Teacher.findOne({ username: username });
    if (!teacher) {
      return res.status(400).send("Invalid username or password!");
    }
    const validatePassword = await bcrypt.compare(password, teacher.password);
    if (!validatePassword) {
      return res.status(400).send("Invalid username or password");
    }

    const token = teacher.generateAuthToken();
    res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
