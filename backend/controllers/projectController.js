const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const canManageProjects = (role) => role === "project-manager" || role === "admin";
const matchesUserId = (value, userId) => value && value.toString() === userId.toString();

const getProjectFilter = (user) => {
  if (user.role === "admin") {
    return {};
  }

  if (user.role === "project-manager") {
    return {
      $or: [{ owner: user._id }, { manager: user._id }, { members: user._id }],
    };
  }

  return { members: user._id };
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find(getProjectFilter(req.user))
      .populate("owner", "name email role")
      .populate("manager", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to fetch projects." });
  }
};

const createProject = async (req, res) => {
  try {
    if (!canManageProjects(req.user.role)) {
      return res.status(403).json({ message: "Only project managers or admins can create projects." });
    }

    const { name, description, status, members = [], deadline, manager } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    if (req.user.role === "admin" && !manager) {
      return res.status(400).json({ message: "Project manager is required for admin-created projects." });
    }

    const managerId = req.user.role === "admin" ? manager : req.user._id;
    const managerUser = await User.findById(managerId);

    if (!managerUser || !managerUser.isActive) {
      return res.status(400).json({ message: "Selected project manager was not found or is inactive." });
    }

    const uniqueMembers = [...new Set([...members, managerId.toString ? managerId.toString() : managerId])];

    const project = await Project.create({
      name,
      description,
      status,
      deadline,
      owner: req.user._id,
      manager: managerId,
      members: uniqueMembers,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email role")
      .populate("manager", "name email role")
      .populate("members", "name email role");

    return res.status(201).json(populatedProject);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to create project." });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const canEdit =
      req.user.role === "admin" ||
      matchesUserId(project.owner, req.user._id) ||
      matchesUserId(project.manager, req.user._id);

    if (!canEdit) {
      return res.status(403).json({ message: "You do not have permission to update this project." });
    }

    const { name, description, status, members, deadline, manager } = req.body;

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (deadline !== undefined) project.deadline = deadline;
    if (manager !== undefined && req.user.role === "admin") {
      const managerUser = await User.findById(manager);

      if (!managerUser || !managerUser.isActive) {
        return res.status(400).json({ message: "Selected project manager was not found or is inactive." });
      }

      project.manager = manager;
    }

    if (members !== undefined) {
      const managerValue =
        manager !== undefined && req.user.role === "admin"
          ? manager
          : project.manager?.toString?.();
      project.members = [...new Set([...members, managerValue].filter(Boolean))];
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("owner", "name email role")
      .populate("manager", "name email role")
      .populate("members", "name email role");

    return res.json(updatedProject);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to update project." });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const canDelete =
      req.user.role === "admin" ||
      matchesUserId(project.owner, req.user._id) ||
      matchesUserId(project.manager, req.user._id);

    if (!canDelete) {
      return res.status(403).json({ message: "You do not have permission to delete this project." });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    return res.json({ message: "Project deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to delete project." });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
