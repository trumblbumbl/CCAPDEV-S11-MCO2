const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const session = require("express-session");

const collection = require("./config"); // user schema

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: "orgspace-secret-key",
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.get("/session", (req, res) => {
  res.json({
    isLoggedIn: !!req.session.user,
    userType: req.session.user?.userType || null,
    user: req.session.user || null
  });
});

app.use(express.static(path.join(__dirname, "public")));

// ======================
// COMMENT SCHEMA
// ======================

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  page: {
    type: String
  },
  
  post: {
    type:String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model("comments", commentSchema);


// ======================
// ROUTES
// ======================

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});


// ======================
// ORG PAGES (LOAD COMMENTS)
// ======================

app.get("/org1", async (req, res) => {
  const comments = await Comment.find({ page: "org1" }).populate("user");
  res.render("org1", { comments });
});

app.get("/org2", async (req, res) => {
  const comments = await Comment.find({ page: "org2" }).populate("user");
  res.render("org2", { comments });
});

app.get("/org3", async (req, res) => {
  const comments = await Comment.find({ page: "org3" }).populate("user");
  res.render("org3", { comments });
});

app.get("/org4", async (req, res) => {
  const comments = await Comment.find({ page: "org4" }).populate("user");
  res.render("org4", { comments });
});

app.get("/org5", async (req, res) => {
  const comments = await Comment.find({ page: "org5" }).populate("user");
  res.render("org5", { comments });
});


// ======================
// REVIEW PAGES
// ======================

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


// ======================
// PROFILE PAGES
// ======================

app.get("/profile-student", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.userType !== "student") {
      return res.send("Access denied.");
    }

    const user = await collection.findById(req.session.user.id);

    if (!user) {
      return res.redirect("/login");
    }

    res.render("profile-student", { user });
  } catch (error) {
    console.error("PROFILE STUDENT ERROR:", error);
    res.status(500).send("Error loading student profile.");
  }
});

app.get("/profile-organization", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.userType !== "organization") {
      return res.send("Access denied.");
    }

    const user = await collection.findById(req.session.user.id);

    if (!user) {
      return res.redirect("/login");
    }

    res.render("profile-organization", { user });
  } catch (error) {
    console.error("PROFILE ORGANIZATION ERROR:", error);
    res.status(500).send("Error loading organization profile.");
  }
});

app.get("/profile-admin", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (req.session.user.userType !== "admin") {
      return res.send("Access denied.");
    }

    const user = await collection.findById(req.session.user.id);

    if (!user) {
      return res.redirect("/login");
    }

    res.render("profile-admin", { user });
  } catch (error) {
    console.error("PROFILE ADMIN ERROR:", error);
    res.status(500).send("Error loading admin profile.");
  }
});


// ======================
// REGISTER PAGE
// ======================

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


// ======================
// LOGIN
// ======================
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

    req.session.user = {
      id: user._id,
      userType: user.userType
    };

    req.session.save(() => {

      if (user.userType === "student") {
        return res.redirect("/profile-student");
      }

      if (user.userType === "organization") {
        return res.redirect("/profile-organization");
      }

      if (user.userType === "admin") {
        return res.redirect("/profile-admin");
      }

    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.render("login", { error: "Error logging in." });
  }
});

// EDIT PROFILE

app.post("/edit-profile/student", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in."
      });
    }

    if (req.session.user.userType !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied."
      });
    }

    const { firstName, lastName, email, college } = req.body;

    if (!firstName || !lastName || !email || !college) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const updatedUser = await collection.findByIdAndUpdate(
      req.session.user.id,
      {
        firstName,
        lastName,
        email,
        college
      },
      { returnDocument: "after" } 
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully."
    });

  } catch (error) {
    console.error("EDIT PROFILE STUDENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile."
    });
  }
});

app.post("/edit-profile/organization", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in."
      });
    }

    if (req.session.user.userType !== "organization") {
      return res.status(403).json({
        success: false,
        message: "Access denied."
      });
    }

    const { orgName, description, tagline, president, email, orgType } = req.body;

    if (!orgName || !description || !president || !email) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required."
      });
    }

    const updatedUser = await collection.findByIdAndUpdate(
      req.session.user.id,
      {
        orgName,
        description,
        tagline,
        president,
        email,
        orgType
      },
      { returnDocument: "after" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Organization account not found."
      });
    }

    res.json({
      success: true,
      message: "Organization profile updated successfully."
    });
  } catch (error) {
    console.error("EDIT PROFILE ORGANIZATION ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating organization profile."
    });
  }
});

// ======================
// ADD COMMENT
// ======================

app.post("/add-comment", async (req, res) => {

  try {

    const { text, page, postId } = req.body;

    const newComment = new Comment({
      text,
      user: req.session.user.id,
      page,
      post: postId
    });

    await newComment.save();

    res.redirect(req.get("referer") || "/");

  } catch (error) {

    console.error(error);
    res.send("Error saving comment");

  }

});


app.post("/edit-comment/:id", async (req, res) => {
  try {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.send("Comment not found");
    }

    const user = req.session.user;

    if (!user) {
      return res.redirect("/login");
    }

    // Only owner OR admin
    if (
      comment.user.toString() !== user.id &&
      user.userType !== "admin"
    ) {
      return res.send("Unauthorized");
    }

    comment.text = req.body.text;
    await comment.save();

    res.redirect(req.get("referer") || "/");

  } catch (error) {
    console.error(error);
    res.send("Error editing comment");
  }
});

app.post("/delete-comment/:id", async (req, res) => {
  try {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.send("Comment not found");
    }

    const user = req.session.user;

    if (!user) {
      return res.redirect("/login");
    }

    // Only owner OR admin
    if (
      comment.user.toString() !== user.id &&
      user.userType !== "admin"
    ) {
      return res.send("Unauthorized");
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.redirect(req.get("referer") || "/");

  } catch (error) {
    console.error(error);
    res.send("Error deleting comment");
  }
});

// ======================
// LOGOUT
// ======================

app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("LOGOUT ERROR:", error);
      return res.redirect("/");
    }

    res.redirect("/login");
  });
});

// ======================
// SERVER
// ======================

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

