const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Teacher } = require("../model/Teacher");

router.post("/", async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    res.send({ valid: true });
  } catch (err) {
    res.status(401).send("Invalid token");
  }
});

router.get("/teacher/:username", async (req, res) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(400).send("Token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);

    const tokenUsername = decoded.username;

    // Check if the token's username matches the requested username
    if (tokenUsername !== req.params.username) {
      return res.status(403).send("Access denied. Invalid token.");
    }

    // Fetch the teacher's information using the username
    const teacher = await Teacher.findOne({ username: req.params.username });
    if (!teacher) {
      return res.status(404).send("Teacher not found");
    }

    res.status(200).send({ validTeacher: true });
  } catch (error) {
    console.error("Error verifying token or fetching teacher:", error.message); // Improved error message
    res.status(500).send("Server error");
  }
});

module.exports = router;
