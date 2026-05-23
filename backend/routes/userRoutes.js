const express = require("express");
const { deleteUser, getUsers, updateUser } = require("../controllers/userController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, authorize("admin", "project-manager"), getUsers);
router.route("/:id").put(protect, authorize("admin"), updateUser).delete(protect, authorize("admin"), deleteUser);

module.exports = router;
