const express = require("express");
const router = express.Router();
const { Student } = require("../model/Student");

// Route to initialize results for all students
router.post("/", async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find({});

    // Iterate through each student and update their results
    for (const student of students) {
      // Check if results already exist (optional, depending on your schema initialization)
      if (!student.results || student.results.length === 0) {
        // Initialize or update results for each subject (example)
        student.results = [
          {
            subject: "668bc59e5bc2ebde35af0ad6",
            exams: {
              midExam1: null,
              midExam2: null,
              finalExam: null,
            },
          },
          {
            subject: "668bc5a45bc2ebde35af0ad9",
            exams: {
              midExam1: null,
              midExam2: null,
              finalExam: null,
            },
          },
          // Add more subjects as needed
        ];

        // Save the updated student document
        await student.save();
      }
    }

    res.send("Results initialized for all students successfully");
  } catch (error) {
    console.error("Error initializing results:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
