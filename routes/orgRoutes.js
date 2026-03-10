const express = require("express");
const router = express.Router();
const orgController = require("../controllers/orgController");

router.get("/",                      orgController.getHomepage);
router.get("/org1",                  orgController.getOrg1);
router.get("/org2",                  orgController.getOrg2);
router.get("/org3",                  orgController.getOrg3);
router.get("/org4",                  orgController.getOrg4);
router.get("/org5",                  orgController.getOrg5);
router.get("/org/posts-count/:page", orgController.getPostsCount);
router.get("/org/:orgName",          orgController.getOrgByName);

module.exports = router;
