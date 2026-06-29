const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["team-member", "project-manager", "admin"],
      required: true,
      default: "team-member",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function savePassword() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function generatePasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpires = Date.now() + 1000 * 60 * 15;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
