const collection = require("../models/User");
const Comment = require("../models/Comment");

// ======================
// HOMEPAGE
// ======================

async function getHomepage(req, res) {
    const orgs = await collection.find({ userType: "organization" });
    res.render("index", { user: req.session.user, orgs: orgs });
}

// ======================
// ORG PAGES (LOAD COMMENTS)
// ======================

async function getOrg1(req, res) {
    const comments = await Comment.find({ page: "org1" }).populate("user");
    res.render("org1", { comments });
}

async function getOrg2(req, res) {
    const comments = await Comment.find({ page: "org2" }).populate("user");
    res.render("org2", { comments });
}

async function getOrg3(req, res) {
    const comments = await Comment.find({ page: "org3" }).populate("user");
    res.render("org3", { comments });
}

async function getOrg4(req, res) {
    const comments = await Comment.find({ page: "org4" }).populate("user");
    res.render("org4", { comments });
}

async function getOrg5(req, res) {
    const comments = await Comment.find({ page: "org5" }).populate("user");
    res.render("org5", { comments });
}

// ======================
// DYNAMIC ORG PAGE
// ======================

async function getOrgByName(req, res) {
    try {
        const orgName = req.params.orgName;

        const org = await collection.findOne({ orgName: orgName });

        if (!org) {
            return res.send("Organization not found");
        }

        const comments = await Comment.find({ page: orgName }).populate("user");
        const postsCount = await Comment.countDocuments({ page: orgName });

        res.render("org", { org, comments, postsCount });

    } catch (error) {
        console.error(error);
        res.send("Error loading organization");
    }
}

// ======================
// POSTS COUNT
// ======================

async function getPostsCount(req, res) {
    try {
        const page = req.params.page;
        const count = await Comment.countDocuments({ page: page });
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.json({ count: 0 });
    }
}

module.exports = { getHomepage, getOrg1, getOrg2, getOrg3, getOrg4, getOrg5, getOrgByName, getPostsCount };