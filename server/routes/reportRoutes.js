const express = require("express");
const { getOverviewReport } = require("../controllers/reportController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin", "project-manager", "team-member"), getOverviewReport);

module.exports = router;
