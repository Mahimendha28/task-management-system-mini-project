export const ROLE_OPTIONS = [
  { value: "team-member", label: "Team Member" },
  { value: "project-manager", label: "Project Manager" },
];

export const TASK_STATUS = [
  { value: "todo", label: "To do" },
  { value: "in-progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export const TASK_PRIORITY = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const PROJECT_STATUS = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export const ROLE_META = {
  admin: {
    path: "/dashboard/admin",
    title: "Admin Command Center",
    subtitle: "Manage users, monitor projects, maintain records, and control permissions.",
    nav: ["overview", "users", "projects", "tasks", "reports", "change-password"],
  },
  "project-manager": {
    path: "/dashboard/manager",
    title: "Project Manager Workspace",
    subtitle: "Create projects, assign tasks, set deadlines, and generate reports.",
    nav: ["overview", "projects", "tasks", "reports", "change-password"],
  },
  "team-member": {
    path: "/dashboard/team",
    title: "Team Member Desk",
    subtitle: "View assigned tasks, update progress, upload files, and track deadlines.",
    nav: ["overview", "my-tasks", "reports", "change-password"],
  },
};

export const emptyProjectForm = () => ({
  name: "",
  description: "",
  status: "planning",
  deadline: "",
  manager: "",
  members: [],
});

export const emptyTaskForm = () => ({
  title: "",
  description: "",
  project: "",
  assignedTo: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
});

export const goTo = (path, setRoute) => {
  window.history.pushState({}, "", path);
  if (setRoute) {
    setRoute(path);
    return;
  }

  window.dispatchEvent(new PopStateEvent("popstate"));
};

export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export const toAttachment = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ name: file.name, size: file.size, type: file.type, content: reader.result });
    reader.onerror = () => reject(new Error("Unable to read selected file."));
    reader.readAsDataURL(file);
  });
