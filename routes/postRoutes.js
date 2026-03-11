const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { requireLogin, requireRole } = require("../middleware/authMiddleware");

// Post CRUD operations
router.post("/posts/create", requireLogin, requireRole("organization"), postController.createPost);
router.post("/posts/edit/:postId", requireLogin, postController.editPost);
router.post("/posts/delete/:postId", requireLogin, postController.deletePost);

// Like functionality
router.post("/posts/like/:postId", requireLogin, postController.toggleLike);

module.exports = router;