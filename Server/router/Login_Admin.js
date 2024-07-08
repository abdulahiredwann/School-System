const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { Admin } = require("../model/Admin");

function validateLogin(data) {
  const schema = Joi.object({
    username: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9_]{3,30}$"))
      .required(),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()_+=-]{8,128}$"))
      .required(),
  });
  return schema.validate(data);
}
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      return res.status(400).send("Invalid username or Password");
    }
    const validatePassword = await bcrypt.compare(password, admin.password);
    if (!validatePassword) {
      return res.status(400).send("Invalid username or Password!");
    }
    const token = admin.generateAuthToken();
    res.status(200).send({ token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
