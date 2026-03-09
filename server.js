const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const { hash } = require("crypto");

const app = express();
app.set("views", path.join(__dirname, "CCAPDEV-S11-MCO-main", "views"));

app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "CCAPDEV-S11-MCO-main", "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/org1", (req, res) => {
  res.render("org1");
});

app.get("/org2", (req, res) => {
  res.render("org2");
});

app.get("/org3", (req, res) => {
  res.render("org3");
});

app.get("/org4", (req, res) => {
  res.render("org4");
});

app.get("/org5", (req, res) => {
  res.render("org5");
});

app.get("/reviews1", (req, res) => {
  res.render("reviews1");
});

app.get("/reviews2", (req, res) => {
  res.render("reviews2");
});

app.get("/reviews3", (req, res) => {
  res.render("reviews3");
});

app.get("/reviews4", (req, res) => {
  res.render("reviews4");
});

app.get("/reviews5", (req, res) => {
  res.render("reviews5");
});

app.get("/profile-student", (req, res) => {
  res.render("profile-student");
});

app.get("/profile-organization", (req, res) => {
  res.render("profile-organization");
});

app.get("/profile-admin", (req, res) => {
  res.render("profile-admin");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      userType,
      firstName,
      lastName,
      studentId,
      college,
      orgName,
      description
    } = req.body;

    if (!email.endsWith("@dlsu.edu.ph")) {
      return res.send("Please use a valid DLSU email address.");
    }

    if (password !== confirmPassword) {
      return res.send("Passwords do not match.");
    }

    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return res.send("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let data;

    if (userType === "student") {
      data = {
        email,
        password: hashedPassword,
        userType,
        firstName,
        lastName,
        studentId,
        college
      };
    } else if (userType === "organization") {
      data = {
        email,
        password: hashedPassword,
        userType,
        orgName,
        description
      };
    } else {
      return res.send("Invalid user type.");
    }

    await collection.create(data);

    res.redirect("/login");
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).send("Error registering user.");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await collection.findOne({ email });

    if (!user) {
      return res.render("login", { error: "User not found." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.render("login", { error: "Incorrect password." });
    }

    if (user.userType !== userType) {
      return res.render("login", { error: "User type does not match this account." });
    }

    if (user.userType === "student") {
      return res.redirect("/profile-student");
    } else if (user.userType === "organization") {
      return res.redirect("/profile-organization");
    } else if (user.userType === "admin") {
      return res.redirect("/profile-admin");
    } else {
      return res.render("login", { error: "Invalid user type." });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.render("login", { error: "Error logging in." });
  }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});