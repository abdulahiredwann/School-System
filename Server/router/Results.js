const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Student, validate, validateUpdate } = require("../model/Student");
const { Grade } = require("../model/Grade");
const _ = require("lodash");

router.get("/:gradeId/:subjectId", async (req, res) => {
  try {
    const { gradeId, subjectId } = req.params;

    // Fetch all students based on the gradeId
    const students = await Student.find({ grade: gradeId });

    if (!students || students.length === 0) {
      return res.status(404).send({ message: "No students found" });
    }

    // Filter and map students' results based on the subjectId
    const results = students
      .map((student) => {
        if (!student.results) return null;

        const subjectResult = student.results.find(
          (result) =>
            result && result.subject && result.subject.toString() === subjectId
        );

        if (subjectResult) {
          return {
            studentId: student._id,
            studentName: student.studentName,
            subjectResult,
          };
        }

        return null;
      })
      .filter((result) => result !== null);

    if (results.length === 0) {
      return res
        .status(404)
        .send({ message: "No results found for this subject in this grade" });
    }

    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

// Backend route to handle updating student results
router.put("/", async (req, res) => {
  const { studentId, subjectId, midExam1, midExam2, finalExam } = req.body;

  try {
    // Check if studentId and subjectId are valid ObjectIDs
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).send("Invalid student ID");
    }
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).send("Invalid Subject ID");
    }

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send("Student not found");
    }

    // Find or create the result object for the specified subject
    let resultToUpdate = student.results.find(
      (result) => result.subject.toString() === subjectId
    );

    if (!resultToUpdate) {
      // Create a new result object if it doesn't exist
      resultToUpdate = {
        subject: subjectId,
        exams: {
          midExam1: null,
          midExam2: null,
          finalExam: null,
        },
      };
      student.results.push(resultToUpdate);
    }

    // Update the exam scores
    resultToUpdate.exams.midExam1 = midExam1;
    resultToUpdate.exams.midExam2 = midExam2;
    resultToUpdate.exams.finalExam = finalExam;

    // Save the updated student document
    await student.save();
    const studentResponse = student.toObject();
    delete studentResponse.password;

    // Respond with the updated student data
    res.send(studentResponse);
    // Respond with the updated student data
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
