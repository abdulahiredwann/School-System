const jwt = require("jsonwebtoken");
const { Teacher } = require("../model/Teacher");
const { Student } = require("../model/Student");

function auth_teacher(req, res, next) {
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
function authorized_teacher(req, res, next) {
  if (!req.user || req.user.teacherName.length === 0) {
    return res.status(403).send("Access denied");
  }
  next();
}

module.exports = { auth_teacher, authorized_teacher };
