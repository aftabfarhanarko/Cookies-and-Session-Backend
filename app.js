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

// Middleware: Bearer Token (হেডার) অথবা Cookie থেকে টোকেন নেওয়া

function verifyToken(req, res, next) {
  let token = null;

  // ১. Authorization হেডার থেকে Bearer টোকেন বের করা
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // "Bearer <token>" থেকে শুধু টোকেন আলাদা করা
  } else if (req.cookies.token) {
    // ২. হেডার না থাকলে কুকি চেক করা
    token = req.cookies.token;
  }

  // টোকেন না থাকলে এরর পাঠানো
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied: No Bearer Token or Cookie found!",
    });
  }

  // টোকেন ভেরিফাই করা
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token!",
      });
    }

    req.user = decoded; // ডিকোড করা ইউজার ইনফো রিকোয়েস্টে যুক্ত করা
    next();
  });
}

// POST /signin Route: Issue JWT to client
app.post("/signin", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  // ১. Payload
  const userPayload = { username };

  // ২. JWT তৈরি করা
  const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: "1h" });

  // ৩. কুকিতে সেট করা
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });

  // ৪. রেসপন্সে Bearer ফরম্যাট সহ পাঠানো
  return res.json({
    message: "Signin successful!",
    tokenType: "Bearer",
    token: token,
  });
});

// Protected Route: Bearer Token দিয়ে অ্যাক্সেস
app.get("/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: `Welcome, ${req.user.username}!`,
    user: req.user,
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
