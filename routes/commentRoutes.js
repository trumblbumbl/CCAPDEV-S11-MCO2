const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.post("/add-comment",        commentController.addComment);
router.post("/edit-comment/:id",   commentController.editComment);
router.post("/delete-comment/:id", commentController.deleteComment);

module.exports = router;