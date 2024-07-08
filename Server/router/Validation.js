const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

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

module.exports = router;
