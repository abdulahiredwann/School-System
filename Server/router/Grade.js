const express = require("express");
const { validate, Grade } = require("../model/Grade");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

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

module.exports = router;
