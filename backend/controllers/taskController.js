const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const matchesUserId = (value, userId) => value && value.toString() === userId.toString();
const assignmentValidationMessages = new Set([
  "Selected assignee was not found or is inactive.",
  "Selected assignee must be a member of the selected project.",
]);

const validateAssignedUser = async (project, assignedTo) => {
  const normalizedAssignedTo = assignedTo === "" ? null : assignedTo;

  if (normalizedAssignedTo === undefined) {
    return { assignedTo: undefined };
  }

  if (normalizedAssignedTo === null) {
    return { assignedTo: null };
  }

  const assignedUser = await User.findById(normalizedAssignedTo).select("_id role isActive");
  if (!assignedUser || !assignedUser.isActive || assignedUser.role !== "team-member") {
    throw new Error("Selected assignee was not found or is inactive.");
  }

  const isProjectMember = project.members.some(
    (memberId) => memberId.toString() === assignedUser._id.toString()
  );

  if (!isProjectMember) {
    throw new Error("Selected assignee must be a member of the selected project.");
  }

  return { assignedTo: assignedUser._id };
};

const getAccessibleProjects = async (user) => {
  if (user.role === "admin") {
    return Project.find().select("_id");
  }

  if (user.role === "project-manager") {
    return Project.find({
      $or: [{ owner: user._id }, { manager: user._id }, { members: user._id }],
    }).select("_id");
  }

  return Project.find({ members: user._id }).select("_id");
};

const canManageTask = (user, project, task = null) => {
  if (user.role === "admin") {
    return true;
  }

  if (matchesUserId(project.owner, user._id) || matchesUserId(project.manager, user._id)) {
    return true;
  }

  if (task && matchesUserId(task.assignedTo, user._id)) {
    return "limited";
  }

  return false;
};

const enrichTasks = (query) =>
  query
    .populate("project", "name deadline status")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role");

const getTasks = async (req, res) => {
  try {
    const accessibleProjects = await getAccessibleProjects(req.user);
    const projectIds = accessibleProjects.map((project) => project._id);
    const filters = {};

    if (req.user.role === "team-member") {
      filters.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    if (req.query.projectId) {
      const hasAccessToProject = projectIds.some(
        (projectId) => projectId.toString() === req.query.projectId
      );

      if (!hasAccessToProject) {
        return res.status(403).json({ message: "You do not have access to this project." });
      }

      filters.project = req.query.projectId;
    } else if (req.user.role !== "team-member") {
      filters.project = { $in: projectIds };
    }

    const tasks = await enrichTasks(Task.find(filters).sort({ createdAt: -1 }));
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to fetch tasks." });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo, attachments } =
      req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Task title and project are required." });
    }

    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    const access = canManageTask(req.user, existingProject);
    if (access !== true) {
      return res.status(403).json({ message: "Only admins or project managers can create tasks." });
    }

    const { assignedTo: validatedAssignedTo } = await validateAssignedUser(existingProject, assignedTo);

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo: validatedAssignedTo ?? null,
      attachments: attachments || [],
      createdBy: req.user._id,
    });

    const populatedTask = await enrichTasks(Task.findById(task._id));
    return res.status(201).json(populatedTask);
  } catch (error) {
    if (assignmentValidationMessages.has(error.message)) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message || "Unable to create task." });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const access = canManageTask(req.user, project, task);
    if (!access) {
      return res.status(403).json({ message: "You do not have permission to update this task." });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      attachments,
      project: nextProject,
    } = req.body;

    let targetProject = project;
    if (nextProject !== undefined && nextProject !== task.project.toString()) {
      const nextProjectDoc = await Project.findById(nextProject);
      if (!nextProjectDoc) {
        return res.status(404).json({ message: "Selected project not found." });
      }

      if (canManageTask(req.user, nextProjectDoc) !== true) {
        return res.status(403).json({ message: "You do not have permission to move this task to that project." });
      }

      targetProject = nextProjectDoc;
    }

    const { assignedTo: validatedAssignedTo } = await validateAssignedUser(
      targetProject,
      assignedTo
    );

    if (access === "limited") {
      if (status !== undefined) task.status = status;
      if (attachments !== undefined) task.attachments = attachments;
    } else {
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) task.status = status;
      if (priority !== undefined) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (validatedAssignedTo !== undefined) task.assignedTo = validatedAssignedTo;
      if (attachments !== undefined) task.attachments = attachments;
      if (nextProject !== undefined) task.project = nextProject;
    }

    await task.save();

    const updatedTask = await enrichTasks(Task.findById(task._id));
    return res.json(updatedTask);
  } catch (error) {
    if (assignmentValidationMessages.has(error.message)) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: error.message || "Unable to update task." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const access = canManageTask(req.user, project, task);
    if (access !== true) {
      return res.status(403).json({ message: "Only admins or project managers can delete tasks." });
    }

    await task.deleteOne();
    return res.json({ message: "Task deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to delete task." });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
