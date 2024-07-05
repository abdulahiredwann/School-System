const jwt = require("jsonwebtoken");

function auth(req, res, next) {
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
function admin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send("Access denied");
  }
  next();
}

module.exports = { auth, admin };
