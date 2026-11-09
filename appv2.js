const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const port = 3000;

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "sessionId",
    secret: "eugfuygffugf87gu",
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// LOgin

app.post("/login", (req, res) => {
  const { userName } = req.body;
  if (!userName) return res.status(404).send("Unvalied User Name");
  req.session.userName = userName;
  req.session.loggedIn = true;

  res.send("Logged in Successfully");
});

app.get("/protectd", (req, res) => {
  if (req.session.loggedIn) {
    res.send("OK  You Are Successfully Logind");
  } else {
    res.status(404).send("You are  Unothorize");
  }
});


app.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send("Unable to log out");
    }

    res.clearCookie("sessionId");
    return res.send("Logout Successfully");
  });
});

// Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
