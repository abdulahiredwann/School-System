const express = require("express");
const { Teacher, validate } = require("../model/Teacher");
const _ = require("lodash");
const router = express.Router();
const mongoose = require("mongoose");
const { Subject } = require("../model/Subject");
const { admin, auth } = require("../Middleware/AuthAdmin");
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get All Teacher, only for admin
router.get("/", [auth, admin], async (req, res) => {
  try {
    const teachers = await Teacher.find().sort("teacherName");
    const pickedTeachers = teachers.map((teacher) =>
      _.pick(teacher, ["teacherName", "grades", "subject"])
    );
    res.status(200).send(pickedTeachers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Get Teacher by username only if they login
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    let isvalid = await Teacher.findOne({ username: username });
    if (!isvalid) {
      return res.status(400).send("Invalid username");
    }

    let teacher = await Teacher.findOne({ username: username })
      .populate("grades", "gradeName")
      .populate("subject", "subjectName");

    if (!teacher) {
      return res.status(404).send("Teacher not found");
    }

    const pickedTeachers = _.pick(teacher, [
      "teacherName",
      "grades",
      "subject",
    ]);

    res.status(200).send(pickedTeachers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Add Teacher only allow for Head office of Admin
router.post("/", [auth, admin], async (req, res) => {
  try {
    const { error } = validate(req.body); // Validate the request body
    if (error) return res.status(400).send(error.details[0].message);
    let username = await Teacher.findOne({ username: req.body.username });
    if (username) {
      return res.status(400).send("Username alredt Registerd");
    }
    if (!isValidObjectId(req.body.subject)) {
      return res.status(400).send("Invalid Subject ID");
    }
    // Create a new Teacher instance
    let newTeacher = new Teacher({
      teacherName: req.body.teacherName,
      username: req.body.username,
      password: req.body.password,
      grades: req.body.grade,
      subject: req.body.subject, // Assign the subject directly
    });

    const subject = await Subject.findById(req.body.subject);
    if (!subject) {
      return res.status(404).send("Subject not found");
    }

    // Save the new teacher to the database
    await newTeacher.save();

    subject.teachers.push(newTeacher._id);
    await subject.save();
    res.status(201).send(newTeacher); // Respond with the saved teacher object
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error, please try again later");
  }
});

// Update Teacher information only   Admin
router.put("/:username", [auth, admin], async (req, res) => {
  try {
    const { username } = req.params;

    const teacher = await Teacher.findOne({ username: username });

    if (!teacher) {
      return res.status(404).send("Invald uername");
    }
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!isValidObjectId(req.body.subject)) {
      return res.status(400).send("Invalid Subject ID");
    }
    // if (!isValidObjectId(req.body.grades)) {
    //   return res.status(400).send("Invalid Subject ID");
    // }

    teacher.set({
      teacherName: req.body.teacherName,
      username: req.body.username,
      password: req.body.password,
      grades: req.body.grades,
      subject: req.body.subject,
    });

    await teacher.save();
    res.status(200).send(teacher);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// Delete Teacher only for admin
router.delete("/:username", [auth, admin], async (req, res) => {
  const { username } = req.params;
  const teacher = await Teacher.findOne({ username: username });

  if (!teacher) {
    return res.status(404).send("Username Not Found");
  }

  // Find all subjects that reference this teacher
  const subjects = await Subject.find({ teachers: teacher._id });

  // Update each subject to remove the teacher
  const updatePromises = subjects.map(async (subject) => {
    subject.teachers.pull(teacher._id);
    await subject.save();
  });

  // Wait for all subject updates to complete
  await Promise.all(updatePromises);
  const deleteTeacher = await Teacher.findOneAndDelete({ username: username });

  res.status(200).send(`Deleted Teacher with name :${deleteTeacher}`);
});

module.exports = router;
