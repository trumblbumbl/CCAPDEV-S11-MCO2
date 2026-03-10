const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { requireLogin, requireRole } = require("../middleware/authMiddleware");

router.get("/profile-student",            requireLogin, requireRole("student"),       profileController.getStudentProfile);
router.get("/profile-organization",       requireLogin, requireRole("organization"),  profileController.getOrgProfile);
router.get("/profile-admin",              requireLogin, requireRole("admin"),         profileController.getAdminProfile);
router.post("/edit-profile/student",      requireLogin, requireRole("student"),       profileController.editStudentProfile);
router.post("/edit-profile/organization", requireLogin, requireRole("organization"),  profileController.editOrgProfile);

module.exports = router;
