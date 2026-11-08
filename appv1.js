const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionstore = {};
// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to Cookie Authentication");
});

// Login Route
app.post("/login", (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password required",
    });
  }

  sessionstore[userName] = { loggedIn: true };
  // Demo authentication only

  res.cookie("user", userName, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Login Successful",
  });
});

// Check Cookie
app.get("/check-cookie", (req, res) => {
  const { user } = req.cookies;

  if (!user) {
    return res.status(401).send("Cookie Not Found");
  }

  res.send(`Cookie Found: ${user}`);
});

// Protected Route
app.get("/protected", (req, res) => {
  const { user } = req.cookies;

  if (!sessionstore[user]?.loggedIn) {
    return res.status(401).send("Not Authorized");
  }

  res.send("Welcome ARKO! You can access this route.");
});

// Logout Route
app.post("/logout", (req, res) => {
  const { user } = req.cookies;
  if (user) {
    delete sessionstore[user];
  }

  res.clearCookie("user", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.send("Logout Successful");
});

// Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
