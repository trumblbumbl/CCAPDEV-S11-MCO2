const express = require("express");
const path = require("path");
const session = require("express-session");

require("./config/db"); // connect to MongoDB

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "orgspace-secret-key",
    resave: false,
    saveUninitialized: false
}));

// Make session user available in all views
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Session debug route
app.get("/session", (req, res) => {
    res.json({
        isLoggedIn: !!req.session.user,
        userType: req.session.user?.userType || null,
        user: req.session.user || null
    });
});

// ======================
// ROUTES
// ======================

app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/profileRoutes"));
app.use("/", require("./routes/orgRoutes"));
app.use("/", require("./routes/commentRoutes"));
app.use("/", require("./routes/adminRoutes"));
app.use("/", require("./routes/reviewRoutes"));
app.use("/", require("./routes/postRoutes"));

// Static pages
app.get("/contact",  (req, res) => res.render("contact"));
app.get("/reviews1", (req, res) => res.render("reviews1"));
app.get("/reviews2", (req, res) => res.render("reviews2"));
app.get("/reviews3", (req, res) => res.render("reviews3"));
app.get("/reviews4", (req, res) => res.render("reviews4"));
app.get("/reviews5", (req, res) => res.render("reviews5"));

// ======================
// SERVER
// ======================

const port = 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});