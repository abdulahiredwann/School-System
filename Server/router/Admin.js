const express = require("express");
const { Admin, validate } = require("../model/Admin");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Add Admin only me When i create website After that i delete this function
router.post("/", async (req, res) => {
  try {
    let { username, name, password } = req.body;

    const admin = await Admin.findOne({ username: username });
    if (admin) {
      return res.status(400).send("username alredy registerd");
    }
    const salt = await bcrypt.genSalt(10);

    password = await bcrypt.hash(password, salt);

    let newAdmin = new Admin({
      username: username,
      password: password,
      name: name,
    });

    await newAdmin.save();
    res.status(200).send(_.omit(newAdmin.toObject(), ["password"]));
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
