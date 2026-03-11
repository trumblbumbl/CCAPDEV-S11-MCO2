const bcrypt = require("bcrypt");
const collection = require("../models/User");

// ======================
// LOGIN
// ======================

async function getLogin(req, res) {
    res.render("login", { error: null });
}

async function postLogin(req, res) {
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
            userType: user.userType,
            email: user.email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            orgName: user.orgName || ""
        };

        req.session.save(() => {
            if (user.userType === "student") return res.redirect("/profile-student");
            if (user.userType === "organization") return res.redirect("/profile-organization");
            if (user.userType === "admin") return res.redirect("/profile-admin");
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.render("login", { error: "Error logging in." });
    }
}

// ======================
// REGISTER
// ======================

function getRegister(req, res) {
    res.render("register");
}

async function postRegister(req, res) {
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
            data = { email, password: hashedPassword, userType, firstName, lastName, studentId, college };
        } else if (userType === "organization") {
            data = { email, password: hashedPassword, userType, orgName, description };
        } else {
            return res.send("Invalid user type.");
        }

        await collection.create(data);
        res.redirect("/login");

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).send("Error registering user.");
    }
}

// ======================
// LOGOUT
// ======================

function logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            console.error("LOGOUT ERROR:", error);
            return res.redirect("/");
        }
        res.redirect("/login");
    });
}

// ======================
// CHANGE PASSWORD
// ======================

async function changePassword(req, res) {
    try {
        if (!req.session.user) {
            return res.status(401).json({ success: false });
        }

        const { currentPassword, newPassword } = req.body;

        const user = await collection.findById(req.session.user.id);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const match = await bcrypt.compare(currentPassword, user.password);

        if (!match) {
            return res.json({ success: false, message: "Current password incorrect" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
}

module.exports = { getLogin, postLogin, getRegister, postRegister, logout, changePassword };