const collection = require("../models/User");

// ======================
// PROFILE PAGES
// ======================

async function getStudentProfile(req, res) {
    try {
        const user = await collection.findById(req.session.user.id);

        if (!user) {
            return res.redirect("/login");
        }

        res.render("profile-student", { user });
    } catch (error) {
        console.error("PROFILE STUDENT ERROR:", error);
        res.status(500).send("Error loading student profile.");
    }
}

async function getOrgProfile(req, res) {
    try {
        const user = await collection.findById(req.session.user.id);

        if (!user) {
            return res.redirect("/login");
        }

        res.render("profile-organization", { user });
    } catch (error) {
        console.error("PROFILE ORGANIZATION ERROR:", error);
        res.status(500).send("Error loading organization profile.");
    }
}

async function getAdminProfile(req, res) {
    try {
        const user = await collection.findById(req.session.user.id);

        if (!user) {
            return res.redirect("/login");
        }

        res.render("profile-admin", { user });
    } catch (error) {
        console.error("PROFILE ADMIN ERROR:", error);
        res.status(500).send("Error loading admin profile.");
    }
}

// ======================
// EDIT PROFILE
// ======================

async function editStudentProfile(req, res) {
    try {
        const { firstName, lastName, email, college } = req.body;

        if (!firstName || !lastName || !email || !college) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const updatedUser = await collection.findByIdAndUpdate(
            req.session.user.id,
            { firstName, lastName, email, college },
            { returnDocument: "after" }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        req.session.user.email = updatedUser.email;
        req.session.user.firstName = updatedUser.firstName || "";
        req.session.user.lastName = updatedUser.lastName || "";

        res.json({ success: true, message: "Profile updated successfully." });
    } catch (error) {
        console.error("EDIT PROFILE STUDENT ERROR:", error);
        res.status(500).json({ success: false, message: "Server error while updating profile." });
    }
}

async function editOrgProfile(req, res) {
    try {
        const { orgName, description, tagline, president, email, orgType } = req.body;

        if (!orgName || !description || !president || !email) {
            return res.status(400).json({ success: false, message: "All required fields are required." });
        }

        const updatedUser = await collection.findByIdAndUpdate(
            req.session.user.id,
            { orgName, description, tagline, president, email, orgType },
            { returnDocument: "after" }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "Organization account not found." });
        }

        req.session.user.email = updatedUser.email;
        req.session.user.orgName = updatedUser.orgName || "";

        res.json({ success: true, message: "Organization profile updated successfully." });
    } catch (error) {
        console.error("EDIT PROFILE ORGANIZATION ERROR:", error);
        res.status(500).json({ success: false, message: "Server error while updating organization profile." });
    }
}

module.exports = { getStudentProfile, getOrgProfile, getAdminProfile, editStudentProfile, editOrgProfile };