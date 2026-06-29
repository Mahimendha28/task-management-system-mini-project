const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const getReportFilter = (user) => {
  if (user.role === "admin") {
    return {};
  }

  return {
    $or: [{ owner: user._id }, { manager: user._id }, { members: user._id }],
  };
};

const getOverviewReport = async (req, res) => {
  try {
    const projectFilter = getReportFilter(req.user);
    const projects = await Project.find(projectFilter).select("_id status deadline");
    const projectIds = projects.map((project) => project._id);
    const taskFilter =
      req.user.role === "team-member"
        ? { assignedTo: req.user._id }
        : { project: { $in: projectIds } };

    const [tasks, users] = await Promise.all([
      Task.find(taskFilter).select("status priority dueDate"),
      req.user.role === "admin" ? User.find().select("role isActive") : [],
    ]);

    return res.json({
      projects: {
        total: projects.length,
        active: projects.filter((project) => project.status === "active").length,
        completed: projects.filter((project) => project.status === "completed").length,
      },
      tasks: {
        total: tasks.length,
        todo: tasks.filter((task) => task.status === "todo").length,
        inProgress: tasks.filter((task) => task.status === "in-progress").length,
        done: tasks.filter((task) => task.status === "done").length,
        highPriority: tasks.filter((task) => task.priority === "high").length,
      },
      users:
        req.user.role === "admin"
          ? {
              total: users.length,
              active: users.filter((user) => user.isActive).length,
              admins: users.filter((user) => user.role === "admin").length,
              managers: users.filter((user) => user.role === "project-manager").length,
              teamMembers: users.filter((user) => user.role === "team-member").length,
            }
          : null,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Unable to generate reports." });
  }
};

module.exports = {
  getOverviewReport,
};
