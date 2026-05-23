import { useState } from "react";
import { goTo } from "../lib/app-config";
import {
  emptyProjectForm,
  emptyTaskForm,
  PROJECT_STATUS,
  ROLE_META,
  ROLE_OPTIONS,
  TASK_PRIORITY,
  TASK_STATUS,
} from "../lib/app-config";
import {
  Card,
  EmptyState,
  Field,
  MiniButton,
  MultiSelect,
  SelectField,
  StatusPill,
  TextArea,
} from "./ui";

const RECORDS_PER_PAGE = 5;
const EMPTY_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
const PROJECT_TABLE_GRID = "xl:grid-cols-[minmax(0,1.55fr)_minmax(9rem,1fr)_minmax(7.5rem,0.85fr)_minmax(7.5rem,0.9fr)_minmax(10rem,1fr)]";
const TASK_TABLE_GRID = "xl:grid-cols-[minmax(0,1.45fr)_minmax(9rem,1fr)_minmax(8rem,0.9fr)_minmax(7.5rem,0.8fr)_minmax(11rem,1fr)]";
const USER_TABLE_GRID = "xl:grid-cols-[minmax(0,1.3fr)_minmax(10rem,1.1fr)_minmax(8.5rem,0.9fr)_minmax(7rem,0.75fr)_minmax(10rem,0.95fr)]";

const normalizeQuery = (value) => String(value || "").trim().toLowerCase();

const matchesSearchQuery = (searchQuery, values) => {
  const normalizedSearch = normalizeQuery(searchQuery);
  if (!normalizedSearch) return true;

  return values.some((value) => normalizeQuery(value).includes(normalizedSearch));
};

export function DashboardView(props) {
  const {
    auth,
    route,
    setRoute,
    loading,
    panel,
    setPanel,
    theme,
    setTheme,
    users,
    projects,
    tasks,
    reports,
    projectForm,
    setProjectForm,
    taskForm,
    setTaskForm,
    editingProjectId,
    setEditingProjectId,
    editingTaskId,
    setEditingTaskId,
    editingUserId,
    setEditingUserId,
    projectDrafts,
    setProjectDrafts,
    taskDrafts,
    setTaskDrafts,
    userDrafts,
    setUserDrafts,
    onLogout,
    onRefresh,
    setNotice,
    setProjects,
    setTasks,
    setUsers,
    setReports,
    helpers,
    api,
  } = props;

  const teamMembers = users.filter((user) => user.role === "team-member");
  const managerUsers = users.filter((user) => user.role === "project-manager");
  const navItems = ROLE_META[auth.role].nav;
  const basePath = ROLE_META[auth.role].path;
  const projectCreateRoute = `${basePath}/projects/create`;
  const taskCreateRoute = `${basePath}/tasks/create`;
  const [passwordForm, setPasswordForm] = useState({ ...EMPTY_PASSWORD_FORM });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const refreshReports = async () => {
    const reportData = await api.apiRequest("/reports", { token: api.token });
    setReports(reportData);
  };

  const navigatePanel = (nextPanel) => {
    const panelPath = nextPanel === "overview" ? basePath : `${basePath}/${nextPanel}`;
    setPanel(nextPanel);
    goTo(panelPath, setRoute);
  };

  const createProject = async (event) => {
    event.preventDefault();
    try {
      if (auth.role === "admin" && !projectForm.manager) {
        setNotice({ type: "error", message: "Please select a project manager before creating the project." });
        return false;
      }

      const project = await api.apiRequest("/projects", {
        method: "POST",
        token: api.token,
        body: { ...projectForm, deadline: projectForm.deadline || undefined },
      });
      setProjects((current) => [project, ...current]);
      await refreshReports();
      setProjectForm({
        ...emptyProjectForm(),
        manager: auth.role === "admin" ? managerUsers[0]?._id || "" : "",
      });
      setNotice({ type: "success", message: "Project created successfully." });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: error.message });
      return false;
    }
  };

  const createTask = async (event) => {
    event.preventDefault();
    try {
      const task = await api.apiRequest("/tasks", {
        method: "POST",
        token: api.token,
        body: { ...taskForm, dueDate: taskForm.dueDate || undefined },
      });
      setTasks((current) => [task, ...current]);
      await refreshReports();
      setTaskForm((current) => ({ ...emptyTaskForm(), project: current.project }));
      setNotice({ type: "success", message: "Task created successfully." });
      return true;
    } catch (error) {
      setNotice({ type: "error", message: error.message });
      return false;
    }
  };

  const saveProject = async (id) => {
    try {
      if (auth.role === "admin" && !projectDrafts[id]?.manager) {
        setNotice({ type: "error", message: "Please select a project manager before saving the project." });
        return;
      }

      const updated = await api.apiRequest(`/projects/${id}`, {
        method: "PUT",
        token: api.token,
        body: projectDrafts[id],
      });
      setProjects((current) => current.map((project) => (project._id === id ? updated : project)));
      await refreshReports();
      setEditingProjectId(null);
      setNotice({ type: "success", message: "Project updated." });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.apiRequest(`/projects/${id}`, { method: "DELETE", token: api.token });
      setProjects((current) => current.filter((project) => project._id !== id));
      setTasks((current) => current.filter((task) => task.project?._id !== id));
      await refreshReports();
      setNotice({ type: "success", message: "Project deleted." });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  };

  const saveTask = async (id) => {
    try {
      const updated = await api.apiRequest(`/tasks/${id}`, {
        method: "PUT",
        token: api.token,
        body: taskDrafts[id],
      });
      setTasks((current) => current.map((task) => (task._id === id ? updated : task)));
      await refreshReports();
      setEditingTaskId(null);
      setNotice({ type: "success", message: "Task updated." });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.apiRequest(`/tasks/${id}`, { method: "DELETE", token: api.token });
      setTasks((current) => current.filter((task) => task._id !== id));
      await refreshReports();
      setNotice({ type: "success", message: "Task deleted." });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  };

  const saveUser = async (id) => {
    try {
      const updated = await api.apiRequest(`/users/${id}`, {
        method: "PUT",
        token: api.token,
        body: userDrafts[id],
      });
      setUsers((current) => current.map((user) => (user._id === id ? updated : user)));
      await refreshReports();
      setEditingUserId(null);
      setNotice({ type: "success", message: "User updated." });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.apiRequest(`/users/${id}`, { method: "DELETE", token: api.token });
      setUsers((current) => current.filter((user) => user._id !== id));
      await refreshReports();
      setNotice({ type: "success", message: "User deleted." });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  };

  const uploadFiles = async (taskId, files) => {
    const task = tasks.find((item) => item._id === taskId);
    if (!task || files.length === 0) return;
    try {
      const attachments = await Promise.all(files.map(helpers.toAttachment));
      const updated = await api.apiRequest(`/tasks/${taskId}`, {
        method: "PUT",
        token: api.token,
        body: { attachments: [...(task.attachments || []), ...attachments] },
      });
      setTasks((current) => current.map((item) => (item._id === taskId ? updated : item)));
      setNotice({ type: "success", message: "Task files uploaded." });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    try {
      setPasswordLoading(true);
      const data = await api.apiRequest("/auth/change-password", {
        method: "POST",
        token: api.token,
        body: passwordForm,
      });

      setNotice({ type: "success", message: data.message || "Password changed successfully." });
      setPasswordForm({ ...EMPTY_PASSWORD_FORM });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-5 px-3 py-4 sm:px-5 lg:px-6">
        <div className="fixed left-4 top-1/2 z-40 hidden w-[220px] -translate-y-1/2 md:block lg:hidden">
          <div className="rounded-[1.75rem] border border-[#dbc38f]/20 bg-[linear-gradient(180deg,#0d0b0a_0%,#15110d_100%)] p-3 text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur">
            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                {auth.role}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{ROLE_META[auth.role].title}</p>
            </div>
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => navigatePanel(item)}
                  className={`w-full rounded-2xl px-3 py-2 text-sm font-semibold capitalize ${panel === item ? "bg-white text-slate-900" : "bg-white/8 text-slate-200"
                    }`}
                >
                  {item.replace("-", " ")}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="mt-3 w-full rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="mt-2 w-full rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        <aside className="hidden w-[250px] shrink-0 overflow-hidden rounded-[2rem] border border-[#d8b66b]/14 bg-[linear-gradient(180deg,#0c0b09_0%,#15110e_52%,#1c150f_100%)] text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:flex lg:flex-col">
          <div className="border-b border-white/8 px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#e8d6b2_0%,#b48a3c_100%)] text-lg font-black text-[#18120f]">
                T
              </div>
              <div>
                <p className="text-base font-semibold text-white">Taskboard</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.32em] text-[#b99b65]">Analytics Plugin</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-6">
            <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
              Menu
            </p>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => navigatePanel(item)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${panel === item
                    ? "bg-[linear-gradient(90deg,#e8d6b2_0%,#c89f4b_100%)] text-[#141414] shadow-[0_12px_30px_rgba(200,159,75,0.24)]"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                >
                  <NavIcon active={panel === item} name={item} />
                  <span className="capitalize">{item.replace("-", " ")}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/8 px-4 py-5">
            <div className="flex items-center gap-3 rounded-[1.6rem] bg-white/[0.03] px-4 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8d6b2] text-lg font-bold text-[#141414]">
                {auth.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{auth.name}</p>
                <p className="truncate text-xs text-slate-500">{auth.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                {theme === 'dark' ? (
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                ) : (
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                )}
              </svg>
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 space-y-5">
          <section className="rounded-[1.6rem] border border-[#d8c39c]/14 bg-[linear-gradient(180deg,#0d0b0a_0%,#17120e_100%)] p-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)] lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a8054]">
                  {ROLE_META[auth.role].title}
                </p>
                <p className="mt-1 text-sm text-[#d7c8af] capitalize">{panel.replace("-", " ")}</p>
              </div>
              <MiniButton text="Refresh" onClick={onRefresh} tone="light" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => navigatePanel(item)}
                  className={`rounded-2xl px-3 py-2 text-xs font-semibold capitalize ${panel === item ? "bg-[#f1ddb4] text-[#1b140d]" : "bg-white/[0.04] text-[#d7c8af]"
                    }`}
                >
                  {item.replace("-", " ")}
                </button>
              ))}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 md:hidden">
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full rounded-2xl bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#d7c8af]"
              >
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-2xl bg-[#111111] px-4 py-3 text-sm font-semibold text-[#e8d6b2]"
              >
                Sign out
              </button>
            </div>
          </section>

          <section className="hidden rounded-[1.8rem] border border-[#d8c39c]/14 bg-[linear-gradient(180deg,#0d0b0a_0%,#17120e_100%)] p-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)] lg:block">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a8054]">{ROLE_META[auth.role].title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <p className="text-2xl font-semibold text-white capitalize">{panel.replace("-", " ")}</p>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c8af]">
                    {auth.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* <button type="button" onClick={onRefresh} className="rounded-full bg-[#111111] px-4 py-2 text-sm font-semibold text-[#e8d6b2]">
                  Refresh
                </button> */}
              </div>
            </div>
          </section>

          {panel === "overview" ? <OverviewPanel auth={auth} reports={reports} projects={projects} tasks={tasks} users={users} /> : null}
          {panel === "projects" && auth.role !== "team-member" ? <ProjectsPanel {...{ auth, route, setRoute, basePath, projectCreateRoute, projectForm, setProjectForm, teamMembers, managerUsers, loading, createProject, projects, editingProjectId, setEditingProjectId, projectDrafts, setProjectDrafts, saveProject, deleteProject, helpers }} /> : null}
          {(panel === "tasks" || panel === "my-tasks") ? <TasksPanel {...{ route, setRoute, basePath, taskCreateRoute, auth, taskForm, setTaskForm, projects, teamMembers, loading, createTask, tasks, editingTaskId, setEditingTaskId, taskDrafts, setTaskDrafts, saveTask, deleteTask, uploadFiles, helpers }} /> : null}
          {panel === "users" && auth.role === "admin" ? <UsersPanel {...{ users, editingUserId, setEditingUserId, userDrafts, setUserDrafts, saveUser, deleteUser }} /> : null}
          {panel === "reports" ? <ReportsPanel auth={auth} reports={reports} projects={projects} tasks={tasks} users={users} /> : null}
          {panel === "change-password" ? <ChangePasswordPanel form={passwordForm} setForm={setPasswordForm} loading={passwordLoading} onSubmit={handlePasswordChange} /> : null}
        </div>
      </div>
    </>
  );
}

function OverviewPanel({ auth, reports, projects, tasks, users }) {
  const welcomeMessage = {
    admin: "You are signed in as the system admin. Monitor users, projects, permissions, and overall platform performance from one place.",
    "project-manager":
      "You are signed in as a project manager. Create projects, assign tasks, track deadlines, and keep delivery on schedule.",
    "team-member":
      "You are signed in as a team member. Stay focused on assigned tasks, update progress, upload files, and meet deadlines confidently.",
  };
  const totalProjects = reports?.projects?.total ?? projects.length;
  const activeProjects = reports?.projects?.active ?? projects.filter((project) => project.status === "active").length;
  const todoTasks = reports?.tasks?.todo ?? tasks.filter((task) => task.status === "todo").length;
  const doneTasks = reports?.tasks?.done ?? tasks.filter((task) => task.status === "done").length;
  const teamSize = auth.role === "admin" ? users.length : users.filter((user) => user.role === "team-member").length;
  const priorityStats = [
    { label: "High", value: tasks.filter((task) => task.priority === "high").length, color: "#f59e0b" },
    { label: "Medium", value: tasks.filter((task) => task.priority === "medium").length, color: "#d8b66b" },
    { label: "Low", value: tasks.filter((task) => task.priority === "low").length, color: "#2fb981" },
  ];
  const priorityTotal = priorityStats.reduce((sum, item) => sum + item.value, 0) || 1;
  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-[#d8b66b]/14 bg-[linear-gradient(135deg,#0c0b09_0%,#15110e_44%,#3d2b13_100%)] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e8d6b2]">Analytics Overview</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold">Welcome back, {auth.name}!</h2>
            <p className="mt-4 text-sm leading-7 text-[#f0e7d7]">{welcomeMessage[auth.role]}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px] lg:grid-cols-4">
            <DarkStatCard label="Projects" value={totalProjects} tone="gold" compact analytics />
            <DarkStatCard label="Active" value={activeProjects} compact analytics />
            <DarkStatCard label="To Do" value={todoTasks} compact analytics />
            <DarkStatCard label="Done" value={doneTasks} compact analytics />
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr_1fr]">
        <section className="rounded-[1.8rem] border border-[#d8c39c]/14 bg-[linear-gradient(180deg,#0d0b0a_0%,#17120e_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9a8054]">Task Distribution</p>
              <p className="mt-1 text-sm text-[#d7c8af]">Priority split across visible tasks</p>
            </div>
            <span className="rounded-full bg-[#b99b65]/20 px-3 py-1 text-xs font-semibold text-[#f0e7d7]">+15%</span>
          </div>
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(${priorityStats[0].color} 0 ${priorityStats[0].value / priorityTotal * 360}deg, ${priorityStats[1].color} ${priorityStats[0].value / priorityTotal * 360}deg ${(priorityStats[0].value + priorityStats[1].value) / priorityTotal * 360}deg, ${priorityStats[2].color} ${(priorityStats[0].value + priorityStats[1].value) / priorityTotal * 360}deg 360deg)` }}>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#17120e] text-center">
                <div>
                  <p className="text-2xl font-semibold text-white">{tasks.length}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a7555]">Tasks</p>
                </div>
              </div>
            </div>
            <div className="w-full flex-1 space-y-3">
              {priorityStats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/[0.04] px-4 py-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-white">
                    <span>{item.label} Priority</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full" style={{ width: `${(item.value / priorityTotal) * 100}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-[#d8c39c]/14 bg-[linear-gradient(180deg,#0d0b0a_0%,#17120e_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9a8054]">Completed Over Time</p>
              <p className="mt-1 text-sm text-[#d7c8af]">Last 30 days snapshot</p>
            </div>
            <span className="rounded-full bg-[#b99b65]/20 px-3 py-1 text-xs font-semibold text-[#f0e7d7]">+15%</span>
          </div>
          <div className="mt-6">
            <div className="relative h-40 rounded-[1.4rem] bg-[linear-gradient(180deg,#16110d_0%,#211811_100%)] p-4">
              <div className="absolute inset-x-4 top-6 bottom-8 grid grid-rows-4">
                {[0, 1, 2, 3].map((line) => <div key={line} className="border-b border-dashed border-[#5a4724]" />)}
              </div>
              <svg viewBox="0 0 240 120" className="relative h-full w-full">
                <polyline fill="none" stroke="#d8b66b" strokeWidth="3" points="8,92 52,64 96,74 140,38 184,50 228,18" />
                <circle cx="8" cy="92" r="4" fill="#e8d6b2" />
                <circle cx="52" cy="64" r="4" fill="#e8d6b2" />
                <circle cx="96" cy="74" r="4" fill="#e8d6b2" />
                <circle cx="140" cy="38" r="4" fill="#e8d6b2" />
                <circle cx="184" cy="50" r="4" fill="#e8d6b2" />
                <circle cx="228" cy="18" r="4" fill="#e8d6b2" />
              </svg>
            </div>
            <div className="mt-3 flex justify-between px-1 text-xs font-medium text-[#bfae90]">
              <span>1</span><span>7</span><span>14</span><span>21</span><span>30</span>
            </div>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-[#d8c39c]/14 bg-[linear-gradient(180deg,#0d0b0a_0%,#17120e_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9a8054]">Team Performance</p>
              <p className="mt-1 text-sm text-[#d7c8af]">Active delivery by visible team</p>
            </div>
            <span className="rounded-full bg-[#b99b65]/20 px-3 py-1 text-xs font-semibold text-[#f0e7d7]">+15%</span>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { label: "Projects", value: Math.max(activeProjects, 1), width: "88%" },
              { label: "Tasks", value: Math.max(todoTasks, 1), width: "74%" },
              { label: "Completed", value: Math.max(doneTasks, 1), width: "81%" },
              { label: auth.role === "admin" ? "Users" : "Members", value: Math.max(teamSize, 1), width: "67%" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#eadcc1]">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#8c6b2f_0%,#f59e0b_100%)]" style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[1.8rem] border border-[#d8c39c]/14 bg-[linear-gradient(180deg,#0d0b0a_0%,#17120e_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9a8054]">Recent Work Items</p>
              <p className="mt-1 text-sm text-[#d7c8af]">Latest task activity from your workspace</p>
            </div>
            <span className="rounded-full bg-[#f5ead3] px-3 py-1 text-xs font-semibold text-[#7a5c1f]">{recentTasks.length} visible</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {recentTasks.map((task) => (
              <div key={task._id} className="rounded-[1.5rem] border border-[#dcc8a0]/12 bg-white/[0.04] px-4 py-4 shadow-[0_8px_20px_rgba(0,0,0,0.18)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="mt-1 text-sm text-[#bfae90]">{task.project?.name || "No project linked"}</p>
                  </div>
                  <StatusPill text={task.status} />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-[#bfae90]">
                  <span>{task.priority || "medium"} priority</span>
                  <span>{task.assignedTo?.name || "Unassigned"}</span>
                </div>
              </div>
            ))}
            {!recentTasks.length ? <EmptyState title="No tasks yet" description="Tasks will appear here when created or assigned." /> : null}
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-[#d8c39c]/14 bg-[linear-gradient(180deg,#0d0b0a_0%,#17120e_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#9a8054]">Project Timeline</p>
              <p className="mt-1 text-sm text-[#d7c8af]">Upcoming deadlines and delivery status</p>
            </div>
            <span className="rounded-full bg-[#f5ead3] px-3 py-1 text-xs font-semibold text-[#7a5c1f]">{projects.length} projects</span>
          </div>
          <div className="mt-5 space-y-3">
            {projects.slice(0, 5).map((project) => <div key={project._id} className="rounded-[1.5rem] border border-[#dcc8a0]/12 bg-white/[0.04] px-4 py-4 shadow-[0_8px_20px_rgba(0,0,0,0.18)]"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-white">{project.name}</p><p className="mt-1 text-sm text-[#bfae90]">Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}</p></div><StatusPill text={project.status} /></div></div>)}
            {!projects.length ? <EmptyState title="No projects yet" description="Create projects to populate this panel." /> : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function ProjectsPanel({ auth, route, setRoute, basePath, projectCreateRoute, projectForm, setProjectForm, teamMembers, managerUsers, loading, createProject, projects, editingProjectId, setEditingProjectId, projectDrafts, setProjectDrafts, saveProject, deleteProject, helpers }) {
  const isCreateRoute = route === projectCreateRoute;
  const [statusFilter, setStatusFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  const [projectPage, setProjectPage] = useState(1);
  const handleProjectStatusFilter = (value) => {
    setStatusFilter(value);
    setProjectPage(1);
  };
  const handleManagerFilter = (value) => {
    setManagerFilter(value);
    setProjectPage(1);
  };
  const activeProjects = projects.filter((project) => project.status === "active").length;
  const planningProjects = projects.filter((project) => project.status === "planning").length;
  const completedProjects = projects.filter((project) => project.status === "completed").length;
  const managers = Array.from(
    new Map(projects.map((project) => [project.manager?._id, project.manager]).filter(([id]) => id)).values()
  );
  const filteredProjects = projects.filter((project) => {
    const statusMatch = statusFilter === "all" ? true : project.status === statusFilter;
    const managerMatch = managerFilter === "all" ? true : project.manager?._id === managerFilter;
    return statusMatch && managerMatch;
  });
  const projectPageCount = Math.max(1, Math.ceil(filteredProjects.length / RECORDS_PER_PAGE));
  const safeProjectPage = Math.min(projectPage, projectPageCount);
  const paginatedProjects = filteredProjects.slice(
    (safeProjectPage - 1) * RECORDS_PER_PAGE,
    safeProjectPage * RECORDS_PER_PAGE
  );

  if (isCreateRoute) {
    return (
      <Card title="Create Project" subtitle="Manager and admin project creation form.">
        <div className="mb-4 flex justify-end">
          <MiniButton text="Back to Projects" onClick={() => goTo(`${basePath}/projects`, setRoute)} tone="light" />
        </div>
        <form className="space-y-4" onSubmit={async (event) => { const created = await createProject(event); if (created) goTo(`${basePath}/projects`, setRoute); }}>
          <Field label="Project name" value={projectForm.name} onChange={(event) => setProjectForm((current) => ({ ...current, name: event.target.value }))} />
          <TextArea label="Description" value={projectForm.description} onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Status" value={projectForm.status} onChange={(event) => setProjectForm((current) => ({ ...current, status: event.target.value }))} options={PROJECT_STATUS} />
            <Field label="Deadline" type="date" value={projectForm.deadline} onChange={(event) => setProjectForm((current) => ({ ...current, deadline: event.target.value }))} />
          </div>
          {auth.role === "admin" ? (
            <SelectField
              label="Project manager"
              value={projectForm.manager}
              onChange={(event) => setProjectForm((current) => ({ ...current, manager: event.target.value }))}
              options={managerUsers.map((user) => ({ value: user._id, label: user.name }))}
              placeholder="Select a project manager"
            />
          ) : null}
          <MultiSelect label="Select members" options={teamMembers.map((user) => ({ value: user._id, label: user.name }))} selectedValues={projectForm.members} onToggle={(value) => setProjectForm((current) => ({ ...current, members: current.members.includes(value) ? current.members.filter((item) => item !== value) : [...current.members, value] }))} />
          <button type="submit" disabled={loading.project} className="w-full rounded-2xl bg-[#111111] px-4 py-3 font-semibold text-[#e8d6b2]">{loading.project ? "Creating..." : "Create project"}</button>
        </form>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#2a241c] bg-[#171412] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b99b65]">
              Project Overview
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Manage project records, deadlines, and member allocation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTo(projectCreateRoute, setRoute)}
            className="rounded-2xl bg-[#e8d6b2] px-5 py-3 text-sm font-semibold text-[#171411]"
          >
            Create Project
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DarkStatCard label="Total Projects" value={projects.length} tone="gold" />
          <DarkStatCard label="Active Projects" value={activeProjects} />
          <DarkStatCard label="Planning" value={planningProjects} />
          <DarkStatCard label="Completed" value={completedProjects} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#2a241c] bg-[#171412] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={statusFilter === "all"} onClick={() => handleProjectStatusFilter("all")}>Project Records</FilterChip>
            <FilterChip active={statusFilter === "active"} onClick={() => handleProjectStatusFilter("active")}>Active</FilterChip>
            <FilterChip active={statusFilter === "planning"} onClick={() => handleProjectStatusFilter("planning")}>Planning</FilterChip>
            <FilterChip active={statusFilter === "completed"} onClick={() => handleProjectStatusFilter("completed")}>Completed</FilterChip>
          </div>
          <div className="flex flex-wrap gap-3">
            <HeaderSelect
              value={managerFilter}
              onChange={handleManagerFilter}
              options={[
                { value: "all", label: "All Managers" },
                ...managers.map((manager) => ({ value: manager._id, label: manager.name })),
              ]}
            />
            <HeaderSelect
              value={statusFilter}
              onChange={handleProjectStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "planning", label: "Planning" },
                { value: "completed", label: "Completed" },
              ]}
            />
            {/* <HeaderPill label="Latest" /> */}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#111111]">
          <div>
              <div className={`hidden gap-4 border-b border-white/10 px-5 py-4 text-sm font-semibold text-[#e8d6b2] xl:grid ${PROJECT_TABLE_GRID}`}>
                <div>Project</div>
                <div>Manager</div>
                <div>Members</div>
                <div>Deadline</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="divide-y divide-white/8">
                {paginatedProjects.map((project) => {
                  const isEditing = editingProjectId === project._id;
                  const draft = projectDrafts[project._id];
                  return (
                    <div key={project._id} className="px-5 py-5">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Field label="Project name" value={draft.name} onChange={(event) => setProjectDrafts((current) => ({ ...current, [project._id]: { ...current[project._id], name: event.target.value } }))} />
                      <TextArea label="Description" value={draft.description} onChange={(event) => setProjectDrafts((current) => ({ ...current, [project._id]: { ...current[project._id], description: event.target.value } }))} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <SelectField label="Status" value={draft.status} onChange={(event) => setProjectDrafts((current) => ({ ...current, [project._id]: { ...current[project._id], status: event.target.value } }))} options={PROJECT_STATUS} />
                        <Field label="Deadline" type="date" value={draft.deadline} onChange={(event) => setProjectDrafts((current) => ({ ...current, [project._id]: { ...current[project._id], deadline: event.target.value } }))} />
                      </div>
                      {auth.role === "admin" ? (
                        <SelectField
                          label="Project manager"
                          value={draft.manager}
                          onChange={(event) => setProjectDrafts((current) => ({ ...current, [project._id]: { ...current[project._id], manager: event.target.value } }))}
                          options={managerUsers.map((user) => ({ value: user._id, label: user.name }))}
                          placeholder="Select a project manager"
                        />
                      ) : null}
                      <MultiSelect label="Project members" options={teamMembers.map((user) => ({ value: user._id, label: user.name }))} selectedValues={draft.members} onToggle={(value) => setProjectDrafts((current) => ({ ...current, [project._id]: { ...current[project._id], members: current[project._id].members.includes(value) ? current[project._id].members.filter((item) => item !== value) : [...current[project._id].members, value] } }))} />
                      <div className="flex gap-3">
                        <MiniButton text="Save" onClick={() => saveProject(project._id)} tone="dark" />
                        <MiniButton text="Cancel" onClick={() => setEditingProjectId(null)} tone="light" />
                      </div>
                    </div>
                  ) : (
                    <div className={`grid gap-4 xl:items-center ${PROJECT_TABLE_GRID}`}>
                      <div className="flex min-w-0 flex-col gap-4 xl:gap-0">
                        <p className="text-lg font-semibold text-white">{project.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{project.description || "No description provided."}</p>
                        <div className="flex flex-wrap items-center gap-2 xl:hidden">
                          <InlineMeta label="Manager" value={project.manager?.name || "Not set"} />
                          <TableBadge tone="gold">{project.members.length} members</TableBadge>
                          <TableBadge tone="warm">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}</TableBadge>
                        </div>
                      </div>
                      <div className="hidden min-w-0 text-sm text-slate-300 xl:block">{project.manager?.name || "Not set"}</div>
                      <div className="hidden xl:block"><TableBadge tone="gold">{project.members.length} members</TableBadge></div>
                      <div className="hidden xl:block"><TableBadge tone="warm">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}</TableBadge></div>
                      <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
                        <MiniButton text="Edit" onClick={() => { setEditingProjectId(project._id); setProjectDrafts((current) => ({ ...current, [project._id]: { name: project.name, description: project.description, status: project.status, deadline: helpers.formatDate(project.deadline), manager: project.manager?._id || "", members: project.members.map((member) => member._id) } })); }} tone="light" />
                        <MiniButton text="Delete" onClick={() => deleteProject(project._id)} tone="danger" />
                      </div>
                    </div>
                  )}
                    </div>
                  );
                })}
                {!filteredProjects.length ? <div className="p-5"><EmptyState title="No matching projects" description="Adjust filters or create a new project." /></div> : null}
              </div>
          </div>
        </div>

        {filteredProjects.length ? (
          <PaginationControls
            currentPage={safeProjectPage}
            totalPages={projectPageCount}
            totalItems={filteredProjects.length}
            itemsLabel="projects"
            onPageChange={setProjectPage}
          />
        ) : null}
      </section>
    </div>
  );
}

function TasksPanel({ route, setRoute, basePath, taskCreateRoute, auth, taskForm, setTaskForm, projects, teamMembers, loading, createTask, tasks, editingTaskId, setEditingTaskId, taskDrafts, setTaskDrafts, saveTask, deleteTask, uploadFiles, helpers }) {
  const isCreateRoute = route === taskCreateRoute;
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [taskPage, setTaskPage] = useState(1);
  const handleTaskStatusFilter = (value) => {
    setStatusFilter(value);
    setTaskPage(1);
  };
  const handleTaskProjectFilter = (value) => {
    setProjectFilter(value);
    setTaskPage(1);
  };
  const getAssignableMembers = (projectId) => {
    const project = projects.find((item) => item._id === projectId);
    if (!project) return [];

    return teamMembers.filter(
      (user) =>
        user.isActive !== false &&
        project.members.some((member) => member._id === user._id)
    );
  };
  const taskAssignableMembers = getAssignableMembers(taskForm.project);
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const progressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "all" ? true : task.status === statusFilter;
    const projectMatch = projectFilter === "all" ? true : task.project?._id === projectFilter;
    return statusMatch && projectMatch;
  });
  const taskPageCount = Math.max(1, Math.ceil(filteredTasks.length / RECORDS_PER_PAGE));
  const safeTaskPage = Math.min(taskPage, taskPageCount);
  const paginatedTasks = filteredTasks.slice(
    (safeTaskPage - 1) * RECORDS_PER_PAGE,
    safeTaskPage * RECORDS_PER_PAGE
  );

  if (isCreateRoute && auth.role !== "team-member") {
    return (
      <Card title="Create Task" subtitle="Assign tasks and set deadlines.">
        <div className="mb-4 flex justify-end">
          <MiniButton text="Back to Tasks" onClick={() => goTo(`${basePath}/tasks`, setRoute)} tone="light" />
        </div>
        <form className="space-y-4" onSubmit={async (event) => { const created = await createTask(event); if (created) goTo(`${basePath}/tasks`, setRoute); }}>
          <Field label="Task title" value={taskForm.title} onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))} />
          <TextArea label="Description" value={taskForm.description} onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Project" value={taskForm.project} onChange={(event) => setTaskForm((current) => {
              const nextProjectId = event.target.value;
              const nextAssignableMembers = getAssignableMembers(nextProjectId);
              const currentAssigneeIsValid = nextAssignableMembers.some((user) => user._id === current.assignedTo);

              return {
                ...current,
                project: nextProjectId,
                assignedTo: currentAssigneeIsValid ? current.assignedTo : nextAssignableMembers[0]?._id || "",
              };
            })} options={projects.map((project) => ({ value: project._id, label: project.name }))} placeholder="Select project" />
            <SelectField label="Assign to" value={taskForm.assignedTo} onChange={(event) => setTaskForm((current) => ({ ...current, assignedTo: event.target.value }))} options={taskAssignableMembers.map((user) => ({ value: user._id, label: user.name }))} placeholder="Select team member" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <SelectField label="Status" value={taskForm.status} onChange={(event) => setTaskForm((current) => ({ ...current, status: event.target.value }))} options={TASK_STATUS} />
            <SelectField label="Priority" value={taskForm.priority} onChange={(event) => setTaskForm((current) => ({ ...current, priority: event.target.value }))} options={TASK_PRIORITY} />
            <Field label="Due date" type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm((current) => ({ ...current, dueDate: event.target.value }))} />
          </div>
          <button type="submit" disabled={loading.task} className="w-full rounded-2xl bg-[#111111] px-4 py-3 font-semibold text-[#e8d6b2]">{loading.task ? "Creating..." : "Create task"}</button>
        </form>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#2a241c] bg-[#171412] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b99b65]">
              Task Overview
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {auth.role === "team-member"
                ? "Review assigned work, update status, and upload files."
                : "Track assignments, deadlines, and progress across the team."}
            </p>
          </div>
          {auth.role !== "team-member" ? (
            <button
              type="button"
              onClick={() => goTo(taskCreateRoute, setRoute)}
              className="rounded-2xl bg-[#e8d6b2] px-5 py-3 text-sm font-semibold text-[#171411]"
            >
              Create Task
            </button>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DarkStatCard label="Total Tasks" value={tasks.length} tone="gold" />
          <DarkStatCard label="To Do" value={todoTasks} />
          <DarkStatCard label="In Progress" value={progressTasks} />
          <DarkStatCard label="Done" value={doneTasks} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#2a241c] bg-[#171412] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={statusFilter === "all"} onClick={() => handleTaskStatusFilter("all")}>{auth.role === "team-member" ? "Assigned Tasks" : "Task Records"}</FilterChip>
            <FilterChip active={statusFilter === "todo"} onClick={() => handleTaskStatusFilter("todo")}>To Do</FilterChip>
            <FilterChip active={statusFilter === "in-progress"} onClick={() => handleTaskStatusFilter("in-progress")}>In Progress</FilterChip>
            <FilterChip active={statusFilter === "done"} onClick={() => handleTaskStatusFilter("done")}>Done</FilterChip>
          </div>
          <div className="flex flex-wrap gap-3">
            <HeaderSelect
              value={projectFilter}
              onChange={handleTaskProjectFilter}
              options={[
                { value: "all", label: "All Projects" },
                ...projects.map((project) => ({ value: project._id, label: project.name })),
              ]}
            />
            <HeaderSelect
              value={statusFilter}
              onChange={handleTaskStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "todo", label: "To Do" },
                { value: "in-progress", label: "In Progress" },
                { value: "done", label: "Done" },
              ]}
            />
            {/* <HeaderPill label="Latest" /> */}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#111111]">
          <div>
              <div className={`hidden gap-4 border-b border-white/10 px-5 py-4 text-sm font-semibold text-[#e8d6b2] xl:grid ${TASK_TABLE_GRID}`}>
                <div>Task</div>
                <div>Project</div>
                <div>Assigned To</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="divide-y divide-white/8">
                {paginatedTasks.map((task) => {
                  const isEditing = editingTaskId === task._id;
                  const draft = taskDrafts[task._id];
                  const draftAssignableMembers = getAssignableMembers(task.project?._id);
                  return (
                    <div key={task._id} className="px-5 py-5">
                  {isEditing ? (
                    <div className="space-y-4">
                      {auth.role !== "team-member" ? (
                        <>
                          <Field label="Task title" value={draft.title} onChange={(event) => setTaskDrafts((current) => ({ ...current, [task._id]: { ...current[task._id], title: event.target.value } }))} />
                          <TextArea label="Description" value={draft.description} onChange={(event) => setTaskDrafts((current) => ({ ...current, [task._id]: { ...current[task._id], description: event.target.value } }))} />
                        </>
                      ) : null}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <SelectField label="Status" value={draft.status} onChange={(event) => setTaskDrafts((current) => ({ ...current, [task._id]: { ...current[task._id], status: event.target.value } }))} options={TASK_STATUS} />
                        {auth.role !== "team-member" ? <SelectField label="Priority" value={draft.priority} onChange={(event) => setTaskDrafts((current) => ({ ...current, [task._id]: { ...current[task._id], priority: event.target.value } }))} options={TASK_PRIORITY} /> : null}
                      </div>
                      {auth.role !== "team-member" ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Due date" type="date" value={draft.dueDate} onChange={(event) => setTaskDrafts((current) => ({ ...current, [task._id]: { ...current[task._id], dueDate: event.target.value } }))} />
                          <SelectField label="Assign to" value={draft.assignedTo} onChange={(event) => setTaskDrafts((current) => ({ ...current, [task._id]: { ...current[task._id], assignedTo: event.target.value } }))} options={draftAssignableMembers.map((user) => ({ value: user._id, label: user.name }))} placeholder="Select team member" />
                        </div>
                      ) : null}
                      <div className="flex gap-3">
                        <MiniButton text="Save" onClick={() => saveTask(task._id)} tone="dark" />
                        <MiniButton text="Cancel" onClick={() => setEditingTaskId(null)} tone="light" />
                      </div>
                    </div>
                  ) : (
                    <div className={`grid gap-4 xl:items-center ${TASK_TABLE_GRID}`}>
                      <div className="flex min-w-0 flex-col gap-4 xl:gap-0">
                        <p className="text-lg font-semibold text-white">{task.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{task.description || "No description yet."}</p>
                        <div className="flex flex-wrap items-center gap-2 xl:hidden">
                          <InlineMeta label="Project" value={task.project?.name || "No project"} />
                          <InlineMeta label="Assigned" value={task.assignedTo?.name || "Unassigned"} />
                          <TableBadge tone={task.status === "done" ? "gold" : task.status === "in-progress" ? "cyan" : "warm"}>{task.status.replace("-", " ")}</TableBadge>
                        </div>
                      </div>
                      <div className="hidden min-w-0 text-sm text-slate-300 xl:block">{task.project?.name || "No project"}</div>
                      <div className="hidden min-w-0 text-sm text-slate-300 xl:block">{task.assignedTo?.name || "Unassigned"}</div>
                      <div className="hidden xl:block"><TableBadge tone={task.status === "done" ? "gold" : task.status === "in-progress" ? "cyan" : "warm"}>{task.status.replace("-", " ")}</TableBadge></div>
                      <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
                        <MiniButton text="Edit" onClick={() => { setEditingTaskId(task._id); setTaskDrafts((current) => ({ ...current, [task._id]: { title: task.title, description: task.description, status: task.status, priority: task.priority, dueDate: helpers.formatDate(task.dueDate), assignedTo: task.assignedTo?._id || "" } })); }} tone="light" />
                        {auth.role !== "team-member" ? <MiniButton text="Delete" onClick={() => deleteTask(task._id)} tone="danger" /> : null}
                        <label className="inline-flex cursor-pointer items-center rounded-2xl border border-[#d7c39c] bg-[#f5ead3] px-4 py-2 text-sm font-semibold text-[#433521]">Files<input type="file" multiple className="hidden" onChange={(event) => uploadFiles(task._id, Array.from(event.target.files || []))} /></label>
                      </div>
                    </div>
                  )}
                    </div>
                  );
                })}
                {!filteredTasks.length ? <div className="p-5"><EmptyState title="No matching tasks" description="Adjust filters or create a new task." /></div> : null}
              </div>
          </div>
        </div>

        {filteredTasks.length ? (
          <PaginationControls
            currentPage={safeTaskPage}
            totalPages={taskPageCount}
            totalItems={filteredTasks.length}
            itemsLabel="tasks"
            onPageChange={setTaskPage}
          />
        ) : null}
      </section>
    </div>
  );
}

function UsersPanel({ users, editingUserId, setEditingUserId, userDrafts, setUserDrafts, saveUser, deleteUser }) {
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userPage, setUserPage] = useState(1);
  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    setUserPage(1);
  };
  const handleUserStatusFilter = (value) => {
    setStatusFilter(value);
    setUserPage(1);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(searchDraft.trim());
    setUserPage(1);
  };
  const clearSearch = () => {
    setSearchDraft("");
    setSearchQuery("");
    setUserPage(1);
  };
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const managerUsers = users.filter((user) => user.role === "project-manager").length;
  const memberUsers = users.filter((user) => user.role === "team-member").length;
  const filteredUsers = users.filter((user) => {
    const roleMatch = roleFilter === "all" ? true : user.role === roleFilter;
    const statusMatch =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? user.isActive
          : !user.isActive;
    const searchMatch = matchesSearchQuery(searchQuery, [
      user.name,
      user.email,
      user.role,
      user.isActive ? "active" : "inactive",
    ]);
    return roleMatch && statusMatch && searchMatch;
  });
  const userPageCount = Math.max(1, Math.ceil(filteredUsers.length / RECORDS_PER_PAGE));
  const safeUserPage = Math.min(userPage, userPageCount);
  const paginatedUsers = filteredUsers.slice(
    (safeUserPage - 1) * RECORDS_PER_PAGE,
    safeUserPage * RECORDS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#2a241c] bg-[#171412] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b99b65]">
              User Overview
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Admin-only user monitoring, role management, and account control.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
            All Users
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <DarkStatCard label="Total Users" value={totalUsers} tone="gold" />
          <DarkStatCard label="Active Users" value={activeUsers} />
          <DarkStatCard label="Admins" value={adminUsers} />
          <DarkStatCard label="Managers" value={managerUsers} />
          <DarkStatCard label="Team Members" value={memberUsers} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#2a241c] bg-[#171412] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={roleFilter === "all"} onClick={() => handleRoleFilter("all")}>User Records</FilterChip>
            <FilterChip active={roleFilter === "admin"} onClick={() => handleRoleFilter("admin")}>Admins</FilterChip>
            <FilterChip active={roleFilter === "project-manager"} onClick={() => handleRoleFilter("project-manager")}>Managers</FilterChip>
            <FilterChip active={roleFilter === "team-member"} onClick={() => handleRoleFilter("team-member")}>Team Members</FilterChip>
          </div>
          <div className="flex flex-wrap gap-3">
            <HeaderSelect
              value={roleFilter}
              onChange={handleRoleFilter}
              options={[
                { value: "all", label: "All Roles" },
                { value: "admin", label: "Admin" },
                { value: "project-manager", label: "Project Manager" },
                { value: "team-member", label: "Team Member" },
              ]}
            />
            <HeaderSelect
              value={statusFilter}
              onChange={handleUserStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>
        </div>

        <div className="mb-4">
          <DashboardSearchForm
            title="User Search"
            placeholder="Search users by name, email, role, or status"
            draft={searchDraft}
            activeQuery={searchQuery}
            onDraftChange={setSearchDraft}
            onSubmit={handleSearchSubmit}
            onClear={clearSearch}
          />
        </div>

        <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#111111]">
          <div>
              <div className={`hidden gap-4 border-b border-white/10 px-5 py-4 text-sm font-semibold text-[#e8d6b2] xl:grid ${USER_TABLE_GRID}`}>
                <div>User</div>
                <div>Email</div>
                <div>Role</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="divide-y divide-white/8">
                {paginatedUsers.map((user) => {
                  const isEditing = editingUserId === user._id;
                  const draft = userDrafts[user._id];
                  const initials = user.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() || "")
                    .join("")
                    .slice(0, 2);

                  return (
                    <div key={user._id} className="px-5 py-5">
                  {isEditing ? (
                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field
                          label="Name"
                          value={draft.name}
                          onChange={(event) =>
                            setUserDrafts((current) => ({
                              ...current,
                              [user._id]: { ...current[user._id], name: event.target.value },
                            }))
                          }
                        />
                        <Field
                          label="Email"
                          value={draft.email}
                          onChange={(event) =>
                            setUserDrafts((current) => ({
                              ...current,
                              [user._id]: { ...current[user._id], email: event.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <SelectField
                          label="Role"
                          value={draft.role}
                          onChange={(event) =>
                            setUserDrafts((current) => ({
                              ...current,
                              [user._id]: { ...current[user._id], role: event.target.value },
                            }))
                          }
                          options={ROLE_OPTIONS}
                        />
                        <SelectField
                          label="Status"
                          value={String(draft.isActive)}
                          onChange={(event) =>
                            setUserDrafts((current) => ({
                              ...current,
                              [user._id]: {
                                ...current[user._id],
                                isActive: event.target.value === "true",
                              },
                            }))
                          }
                          options={[
                            { value: "true", label: "Active" },
                            { value: "false", label: "Inactive" },
                          ]}
                        />
                      </div>
                      <div className="flex gap-3">
                        <MiniButton text="Save" onClick={() => saveUser(user._id)} tone="dark" />
                        <MiniButton text="Cancel" onClick={() => setEditingUserId(null)} tone="light" />
                      </div>
                    </div>
                  ) : (
                    <div className={`grid gap-4 xl:items-center ${USER_TABLE_GRID}`}>
                      <div className="flex min-w-0 flex-col gap-4 xl:gap-0">
                        <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5dfb2] text-base font-bold text-[#171411]">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 xl:hidden">
                          <div className="min-w-0 break-all text-sm text-slate-300">{user.email}</div>
                          <TableBadge tone="gold">{formatRole(user.role)}</TableBadge>
                          <TableBadge tone={user.isActive ? "cyan" : "warm"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </TableBadge>
                        </div>
                      </div>

                      <div className="hidden min-w-0 break-all text-sm text-slate-300 xl:block">{user.email}</div>

                      <div className="hidden xl:block">
                        <TableBadge tone="gold">{formatRole(user.role)}</TableBadge>
                      </div>

                      <div className="hidden xl:block">
                        <TableBadge tone={user.isActive ? "cyan" : "warm"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </TableBadge>
                      </div>

                      <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
                        <MiniButton
                          text="Edit"
                          onClick={() => {
                            setEditingUserId(user._id);
                            setUserDrafts((current) => ({
                              ...current,
                              [user._id]: {
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                isActive: user.isActive,
                              },
                            }));
                          }}
                          tone="light"
                        />
                        <MiniButton text="Delete" onClick={() => deleteUser(user._id)} tone="danger" />
                      </div>
                    </div>
                  )}
                    </div>
                  );
                })}
                {!filteredUsers.length ? <div className="p-5"><EmptyState title="No matching users" description="Adjust filters to see user records." /></div> : null}
              </div>
          </div>
        </div>

        {filteredUsers.length ? (
          <PaginationControls
            currentPage={safeUserPage}
            totalPages={userPageCount}
            totalItems={filteredUsers.length}
            itemsLabel="users"
            onPageChange={setUserPage}
          />
        ) : null}
      </section>
    </div>
  );
}

function ReportsPanel({ auth, reports, projects, tasks, users }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[2rem] border border-[#2a241c] bg-[#171412] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b99b65]">
            Performance Reports
          </p>
          <p className="mt-2 text-sm text-slate-400">High-level monitoring and analytics.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DarkStatCard label="Project Count" value={reports?.projects?.total ?? 0} tone="gold" />
          <DarkStatCard label="High Priority Tasks" value={reports?.tasks?.highPriority ?? 0} />
          <DarkStatCard label="In Progress" value={reports?.tasks?.inProgress ?? 0} />
          <DarkStatCard label="Done" value={reports?.tasks?.done ?? 0} />
          {auth.role === "admin" ? <DarkStatCard label="Managers" value={reports?.users?.managers ?? 0} /> : null}
          {auth.role === "admin" ? <DarkStatCard label="Team Members" value={reports?.users?.teamMembers ?? 0} /> : null}
        </div>
      </section>
      <Card title="Record Summary" subtitle="Maintained project and task records.">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#dcc8a0]/12 bg-white/[0.04] px-4 py-4 text-sm text-[#d7c8af]">{projects.length} projects visible in this role dashboard.</div>
          <div className="rounded-2xl border border-[#dcc8a0]/12 bg-white/[0.04] px-4 py-4 text-sm text-[#d7c8af]">{tasks.length} task records available for monitoring.</div>
          {auth.role === "admin" ? <div className="rounded-2xl border border-[#dcc8a0]/12 bg-white/[0.04] px-4 py-4 text-sm text-[#d7c8af]">{users.length} managed users under system permissions.</div> : null}
        </div>
      </Card>
    </div>
  );
}

function DashboardSearchForm({
  title,
  placeholder,
  draft,
  activeQuery,
  onDraftChange,
  onSubmit,
  onClear,
  className = "",
}) {
  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className}`}>
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{title}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bfae90]"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-[#d8c39c]/16 bg-white/[0.04] px-11 py-3 text-sm text-white outline-none transition placeholder:text-[#8f7a58] focus:border-[#b99b65] focus:bg-white/[0.06]"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        <button
          type="submit"
          className="min-w-[7rem] rounded-full bg-[#e8d6b2] px-4 py-3 text-sm font-semibold text-[#171411]"
        >
          Search
        </button>
        {activeQuery ? (
          <button
            type="button"
            onClick={onClear}
            className="min-w-[6rem] rounded-full border border-[#d8c39c]/16 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#e8d6b2]"
          >
            Clear
          </button>
        ) : null}
      </div>
    </form>
  );
}

function ChangePasswordPanel({ form, setForm, loading, onSubmit }) {
  return (
    <Card title="Change Password" subtitle="Update your sign-in password from inside the dashboard without changing the rest of the UI.">
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field
          label="Current password"
          type="password"
          value={form.currentPassword}
          onChange={(event) =>
            setForm((current) => ({ ...current, currentPassword: event.target.value }))
          }
          placeholder="Enter your current password"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="New password"
            type="password"
            value={form.newPassword}
            onChange={(event) =>
              setForm((current) => ({ ...current, newPassword: event.target.value }))
            }
            placeholder="Minimum 6 characters"
          />
          <Field
            label="Confirm new password"
            type="password"
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((current) => ({ ...current, confirmPassword: event.target.value }))
            }
            placeholder="Repeat your new password"
          />
        </div>
        <div className="rounded-[1.5rem] border border-[#d8c39c]/12 bg-white/[0.04] px-4 py-4 text-sm leading-6 text-[#d7c8af]">
          Keep your current password, then enter a new password with at least 6 characters and confirm it once.
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-[linear-gradient(135deg,#f1ddb4_0%,#b99b65_100%)] px-5 py-3 text-sm font-semibold text-[#1b140d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </Card>
  );
}

function DarkStatCard({ label, value, tone = "dark", compact = false, analytics = false }) {
  return (
    <div
      className={`rounded-[1.5rem] border ${compact ? "p-4" : "p-5"} ${tone === "gold"
        ? "border-[#e2cfa5] bg-[#f1ddb4] text-[#171411]"
        : analytics
          ? "border-[#dcc8a0]/12 bg-white/[0.05] text-white"
          : "border-[#d8b66b]/14 bg-[#171412] text-white"
        }`}
    >
      <p
        className={`text-sm font-medium ${tone === "gold" ? "text-[#5a4724]" : analytics ? "text-[#d8c9af]" : "text-[#bfae90]"
          }`}
      >
        {label}
      </p>
      <p className={`${compact ? "mt-4 text-3xl" : "mt-5 text-4xl"} font-semibold`}>{value}</p>
      <p className={`mt-3 text-sm ${tone === "gold" ? "text-[#6d592f]" : analytics ? "text-[#f1ddb4]" : "text-[#8c6b2f]"}`}>
        {analytics ? "Live dashboard" : "0% all time"}
      </p>
    </div>
  );
}

function FilterChip({ children, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-medium ${active ? "bg-[#e8d6b2] text-[#141414]" : "bg-white/[0.04] text-slate-400"
        }`}
    >
      {children}
    </button>
  );
}

function HeaderPill({ label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
      {label}
    </div>
  );
}

function HeaderSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-w-[10rem] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-[#171412] text-slate-200">
          {option.label}
        </option>
      ))}
    </select>
  );
}

function PaginationControls({ currentPage, totalPages, totalItems, itemsLabel, onPageChange }) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * RECORDS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * RECORDS_PER_PAGE, totalItems);

  return (
    <div className="mt-4 flex flex-col gap-3 px-1 text-sm text-[#bfae90] sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {startItem}-{endItem} of {totalItems} {itemsLabel}
      </p>
      <div className="flex items-center gap-2">
        <MiniButton
          text="Previous"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          tone="light"
          disabled={currentPage === 1}
        />
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-[#e8d6b2]">
          Page {currentPage} of {totalPages}
        </div>
        <MiniButton
          text="Next"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          tone="light"
          disabled={currentPage === totalPages}
        />
      </div>
    </div>
  );
}

function TableBadge({ children, tone = "gold" }) {
  const tones = {
    gold: "bg-[#f6e4b8] text-[#7a5c1f]",
    cyan: "bg-[#9ae7f2] text-[#16697a]",
    warm: "bg-[#4c3418] text-[#f0a24b]",
  };

  return <span className={`inline-flex min-h-[44px] max-w-full items-center justify-center rounded-full px-4 py-2 text-center text-sm font-semibold leading-5 ${tones[tone]}`}>{children}</span>;
}

function InlineMeta({ label, value }) {
  return (
    <span className="text-sm text-slate-400">
      <span className="text-[#bfae90]">{label}:</span> {value}
    </span>
  );
}

function formatRole(role) {
  if (role === "project-manager") return "Project Manager";
  if (role === "team-member") return "Team Member";
  return "Admin";
}

function NavIcon({ name, active }) {
  const stroke = active ? "#141414" : "#8f95a3";
  const icons = {
    overview: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={stroke} strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={stroke} strokeWidth="1.8">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c0-3 3-5 6-5s6 2 6 5" />
        <path d="M17 11a3 3 0 1 0 0-6" />
        <path d="M21 19c0-2-1.2-3.7-3-4.5" />
      </svg>
    ),
    projects: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M3 7h7l2 2h9v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2" />
      </svg>
    ),
    tasks: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M9 6h11" />
        <path d="M9 12h11" />
        <path d="M9 18h11" />
        <path d="m3 6 1.5 1.5L7 5" />
        <path d="m3 12 1.5 1.5L7 11" />
        <path d="m3 18 1.5 1.5L7 17" />
      </svg>
    ),
    "my-tasks": (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={stroke} strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    ),
    reports: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M4 19h16" />
        <path d="M7 16V9" />
        <path d="M12 16V5" />
        <path d="M17 16v-3" />
      </svg>
    ),
    "change-password": (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={stroke} strokeWidth="1.8">
        <path d="M12 15v2" />
        <path d="M6 10V8a6 6 0 1 1 12 0v2" />
        <rect x="4" y="10" width="16" height="10" rx="2" />
      </svg>
    ),
  };

  return <span className="flex h-5 w-5 items-center justify-center">{icons[name] || icons.overview}</span>;
}
