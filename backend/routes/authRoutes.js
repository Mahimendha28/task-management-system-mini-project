const express = require("express");
const {
  changePassword,
  forgotPassword,
  getMe,
  loginUser,
  registerUser,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.get("/me", protect, getMe);

module.exports = router;
