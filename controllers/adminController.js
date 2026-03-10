const collection = require("../models/User");
const Comment = require("../models/Comment");

// ======================
// ADMIN - GET ALL USERS
// ======================

async function getUsers(req, res) {
    const users = await collection.find();
    res.json(users);
}

// ======================
// ADMIN - STATS
// ======================

async function getStats(req, res) {
    try {
        const totalUsers = await collection.countDocuments();
        const totalOrgs  = await collection.countDocuments({ userType: "organization" });
        const totalPosts = await Comment.countDocuments();

        res.json({ totalUsers, totalOrgs, totalPosts });

    } catch (error) {
        console.error(error);
        res.status(500).json({});
    }
}

// ======================
// ADMIN - RECENT ACTIVITIES
// ======================

async function getActivities(req, res) {
    const recentUsers = await collection
        .find()
        .sort({ _id: -1 })
        .limit(3);

    const recentComments = await Comment
        .find()
        .populate("user")
        .sort({ createdAt: -1 })
        .limit(3);

    const activities = [];

    recentUsers.forEach(u => {
        activities.push({ user: u.email, activity: "Registered", time: "Recently" });
    });

    recentComments.forEach(c => {
        activities.push({ user: c.user?.email || "User", activity: "Posted a comment", time: "Recently" });
    });

    res.json(activities.slice(0, 5));
}

// ======================
// ADMIN - DELETE USER
// ======================

async function deleteUser(req, res) {
    try {
        await collection.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
}

module.exports = { getUsers, getStats, getActivities, deleteUser };