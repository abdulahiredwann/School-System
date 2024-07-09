const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Student, validate, validateUpdate } = require("../model/Student");
const { Grade } = require("../model/Grade");
const _ = require("lodash");
const {
  auth_student,
  authorized_student,
} = require("../Middleware/Student_Auth");
const { auth, admin } = require("../Middleware/AuthAdmin");
const {
  auth_teacher,
  authorized_teacher,
} = require("../Middleware/Teacher_Auth");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get All Students only for Admin
router.get("/admin", [auth, admin], async (req, res) => {
  try {
    const students = await Student.find().sort("studentName");

    const pickedStudents = students.map((Student) =>
      _.pick(Student, ["studentName", "username", "grade", "results"])
    );
    res.status(200).send(pickedStudents);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get All Students only teachers
router.get("/teacher", [auth_teacher, authorized_teacher], async (req, res) => {
  try {
    const students = await Student.find().sort("studentName");

    const pickedStudents = students.map((Student) =>
      _.pick(Student, ["studentName", "username", "grade", "results"])
    );
    res.status(200).send(pickedStudents);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get Student by given username ;only student access there own they can't see other
//
router.get(
  "/:username",
  [auth_student, authorized_student],
  async (req, res) => {
    try {
      const { username } = req.params;

      const student = await Student.findOne({ username: username }).populate(
        "grade"
      );
      if (!student) {
        return res.status(404).send("Student Not Found");
      }

      const pickedStudent = _.pick(student, [
        "studentName",
        "username",
        "grade",
        "results",
      ]);

      res.status(200).send(pickedStudent);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);
// Get Student Result by Given username:for only student can see there result they can't see for other ,admin and teacher can see
// ,
router.get(
  "/:username/results",

  async (req, res) => {
    try {
      const { username } = req.params;

      const decodedusername = decodeURIComponent(username);
      const student = await Student.findOne({ username: decodedusername });
      if (!student) {
        return res.status(404).send("Student not Found!");
      }

      // Populate results and subjects within the results
      const studentResult = await Student.findOne({
        username: decodedusername,
      }).populate({
        path: "results",
        populate: {
          path: "subject",
          model: "Subject",
        },
      });

      res.status(200).send(studentResult.results);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);
// Add Student :only for admin
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (!isValidObjectId(req.body.grade)) {
      return res.status(400).send("Invalid Teacher Id");
    }
    if (error) return res.status(400).send(error.details[0].message);

    let existingStudent = await Student.findOne({
      username: req.body.username,
    });
    if (existingStudent) {
      return res.status(400).send("Username alredy taken");
    }
    let newstudent = new Student({
      studentName: req.body.studentName,
      username: req.body.username,
      password: req.body.password,
      grade: req.body.grade,
      gender: req.body.gender,
      results: req.body.results,
    });

    let grade = await Grade.findById(req.body.grade);
    if (!grade) {
      return res.status(400).send("Invalid Grade");
    }
    grade.students.push(newstudent._id);

    await grade.save();

    await newstudent.save();
    res.status(201).send(newstudent);
  } catch (err) {
    console.log(err);
    res.status(400).send("server Error");
  }
});

// Update Student There information except RESULT:they can there own but they can't change other ,admin can
router.put(
  "/:username",
  [auth_student, authorized_student],
  async (req, res) => {
    try {
      const { username } = req.params;

      const student = await Student.findOne({ username: username });
      if (!student) {
        return res.status(404).send("Student Not Found!");
      }
      const { error } = validateUpdate(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      student.set({
        studentName: req.body.studentName,
        username: req.body.username,
        password: req.body.password,
      });

      await student.save();
      res.status(200).send(_.omit(student.toObject(), ["password"]));
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error!");
    }
  }
);

// Delete Student it allow for Only Admin
router.delete("/:username", [auth, admin], async (req, res) => {
  try {
    const { username } = req.params;

    const student = await Student.findOne({ username: username });
    if (!student) {
      return res.status(404).send("Student Not FOUND!");
    }
    const deletedStudent = await Student.findOneAndDelete({
      username: username,
    });

    res.status(200).send(deletedStudent);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
