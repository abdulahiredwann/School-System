const jwt = require("jsonwebtoken");
const { Teacher } = require("../model/Teacher");
const { Student } = require("../model/Student");

function auth_student(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Access Denied. No token provided!");

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
}

// Middleware
async function authorized_student(req, res, next) {
  try {
    const student = await Student.findOne({ username: req.params.username });
    if (!student) {
      return res.status(404).send("Student with given username not found!");
    }

    // Assuming req.user.username is the token username
    if (student.username !== req.user.username) {
      return res.status(403).send("Access denied. You are not the owner.");
    }

    next();
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
}

module.exports = { auth_student, authorized_student };
