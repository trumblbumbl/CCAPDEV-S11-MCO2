const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireLogin, requireRole } = require("../middleware/authMiddleware");

router.get("/admin/users",              requireLogin, requireRole("admin"), adminController.getUsers);
router.get("/admin/stats",              requireLogin, requireRole("admin"), adminController.getStats);
router.get("/admin/activities",         requireLogin, requireRole("admin"), adminController.getActivities);
router.delete("/admin/delete-user/:id", requireLogin, requireRole("admin"), adminController.deleteUser);

module.exports = router;
