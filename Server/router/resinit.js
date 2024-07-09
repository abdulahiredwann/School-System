const { Subject } = require("../model/Subject");

async function initializeResults() {
  // Fetch all subjects from the database
  const subjects = await Subject.find({});

  // Initialize results with all subjects
  const results = subjects.map((subject) => ({
    subject: subject._id,
    exams: {
      midExam1: null,
      midExam2: null,
      finalExam: null,
    },
  }));

  return results;
}

module.exports = initializeResults;
