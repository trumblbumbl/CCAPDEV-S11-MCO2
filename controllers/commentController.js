const Comment = require("../models/Comment");

// ======================
// ADD COMMENT
// ======================

async function addComment(req, res) {
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
}

// ======================
// EDIT COMMENT
// ======================

async function editComment(req, res) {
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
        if (comment.user.toString() !== user.id && user.userType !== "admin") {
            return res.send("Unauthorized");
        }

        comment.text = req.body.text;
        await comment.save();

        res.redirect(req.get("referer") || "/");

    } catch (error) {
        console.error(error);
        res.send("Error editing comment");
    }
}

// ======================
// DELETE COMMENT
// ======================

async function deleteComment(req, res) {
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
        if (comment.user.toString() !== user.id && user.userType !== "admin") {
            return res.send("Unauthorized");
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.redirect(req.get("referer") || "/");

    } catch (error) {
        console.error(error);
        res.send("Error deleting comment");
    }
}

module.exports = { addComment, editComment, deleteComment };