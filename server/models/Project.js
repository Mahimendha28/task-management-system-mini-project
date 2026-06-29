const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed"],
      default: "planning",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deadline: {
      type: Date,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
