const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

// Secret key for signing the JWT
const SECRET_KEY = "my_jwt_secret_key";

// Middlewares
app.use(express.json());
app.use(cookieParser());

// ==========================================
// POST /signin Route: Issue JWT to client
// ==========================================
app.post("/signin", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  // 1. Data to store inside token (Payload)
  const userPayload = {
    username: username,
  };

  // 2. Create the JWT
  const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: "1h" });

  // 3. Issue the token to client (both via Cookie and JSON response)
  res.cookie("token", token, {
    httpOnly: true, // prevents client-side JS from reading it
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  return res.json({
    message: "Signin successful!",
    token: token,
  });
});

// ==========================================
// Simple Protected Route to test the token
// ==========================================
app.get("/profile", (req, res) => {
  // Read token from cookie or header
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token found" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    res.json({
      message: `Welcome, ${decoded.username}!`,
      user: decoded,
    });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
