import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "./lib/api";
import {
  ROLE_META,
  emptyProjectForm,
  emptyTaskForm,
  formatDate,
  goTo,
  toAttachment,
} from "./lib/app-config";
import { DashboardView } from "./components/DashboardView";
import { AuthScreen, ForgotPasswordScreen, LandingScreen, ResetPasswordScreen } from "./components/PublicScreens";
import { Notice } from "./components/ui";

const getView = (path, auth) => {
  if (path === "/") return "landing";
  if (path === "/login") return "login";
  if (path === "/register") return "register";
  if (path === "/forgot-password") return "forgot-password";
  if (path === "/reset-password") return "reset-password";
  if (path.startsWith("/dashboard") && auth?.token) return "dashboard";
  if (path.startsWith("/dashboard")) {
    goTo("/login");
    return "login";
  }
  goTo("/");
  return "landing";
};

function App() {
  const [route, setRoute] = useState(window.location.pathname || "/");
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("task-manager-auth");
    return saved ? JSON.parse(saved) : null;
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "team-member",
  });
  const [forgotPasswordForm, setForgotPasswordForm] = useState({ email: "" });
  const [resetPasswordForm, setResetPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [resetPasswordMeta, setResetPasswordMeta] = useState({ resetUrl: "", token: "" });
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState(null);
  const [panel, setPanel] = useState("overview");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [projectDrafts, setProjectDrafts] = useState({});
  const [taskDrafts, setTaskDrafts] = useState({});
  const [userDrafts, setUserDrafts] = useState({});
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState({
    auth: false,
    dashboard: false,
    project: false,
    task: false,
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("task-manager-theme") || "dark");

  useEffect(() => {
    localStorage.setItem("task-manager-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname || "/");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (auth) localStorage.setItem("task-manager-auth", JSON.stringify(auth));
    else localStorage.removeItem("task-manager-auth");
  }, [auth]);

  useEffect(() => {
    if (!auth?.token) return;

    const run = async () => {
      try {
        setLoading((current) => ({ ...current, dashboard: true }));
        setNotice({ type: "", message: "" });
        const requests = [
          apiRequest("/auth/me", { token: auth.token }),
          apiRequest("/projects", { token: auth.token }),
          apiRequest("/tasks", { token: auth.token }),
          apiRequest("/reports", { token: auth.token }),
        ];
        if (auth.role !== "team-member") requests.push(apiRequest("/users", { token: auth.token }));
        const [me, projectList, taskList, reportData, userList = []] = await Promise.all(requests);
        setAuth((current) => ({ ...current, ...me, token: current.token }));
        setProjects(projectList);
        setTasks(taskList);
        setReports(reportData);
        setUsers(userList);
        if (auth.role === "admin") {
          setProjectForm((current) => ({
            ...current,
            manager:
              current.manager ||
              userList.find((user) => user.role === "project-manager")?._id ||
              "",
          }));
        }
        setTaskForm((current) => ({
          ...current,
          project: current.project || projectList[0]?._id || "",
          assignedTo:
            current.assignedTo ||
            userList.find((user) => user.role === "team-member")?._id ||
            "",
        }));
      } catch (error) {
        setNotice({ type: "error", message: error.message });
        if (error.message.toLowerCase().includes("not authorized")) logout();
      } finally {
        setLoading((current) => ({ ...current, dashboard: false }));
      }
    };

    run();
  }, [auth?.token, auth?.role]);

  useEffect(() => {
    if (!auth?.role) return;
    const basePath = ROLE_META[auth.role].path;
    if (route.startsWith("/dashboard") && !route.startsWith(basePath)) {
      goTo(ROLE_META[auth.role].path, setRoute);
    }
  }, [auth, route]);

  useEffect(() => {
    if (!auth?.role || !route.startsWith("/dashboard")) return;

    const basePath = ROLE_META[auth.role].path;
    let nextPanel = "overview";

    if (route === `${basePath}/users`) nextPanel = "users";
    else if (route === `${basePath}/projects` || route === `${basePath}/projects/create`) nextPanel = "projects";
    else if (route === `${basePath}/tasks` || route === `${basePath}/tasks/create`) nextPanel = auth.role === "team-member" ? "my-tasks" : "tasks";
    else if (route === `${basePath}/reports`) nextPanel = "reports";
    else if (route === `${basePath}/change-password`) nextPanel = "change-password";
    else if (route === `${basePath}/my-tasks`) nextPanel = "my-tasks";

    setPanel(nextPanel);
  }, [auth?.role, route]);

  useEffect(() => {
    if (!notice.message) return;

    const timeoutId = window.setTimeout(() => {
      setNotice({ type: "", message: "" });
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const visibleProjects = useMemo(() => {
    if (auth?.role === "team-member") {
      return projects.filter((project) => project.members.some((member) => member._id === auth._id));
    }
    return projects;
  }, [auth, projects]);

  const visibleTasks = useMemo(() => {
    if (auth?.role === "team-member") {
      return tasks.filter((task) => task.assignedTo?._id === auth._id);
    }
    return tasks;
  }, [auth, tasks]);

  const authRequest = async (path, form, reset, redirect) => {
    try {
      if (path === "/auth/register") {
        if (!form.password || !form.confirmPassword) {
          setNotice({ type: "error", message: "Password and confirm password are required." });
          return;
        }

        if (form.password !== form.confirmPassword) {
          setNotice({ type: "error", message: "Passwords do not match." });
          return;
        }
      }

      setLoading((current) => ({ ...current, auth: true }));
      const data = await apiRequest(path, { method: "POST", body: form });
      setAuth(data);
      reset();
      goTo(redirect || ROLE_META[data.role].path, setRoute);
      setNotice({ type: "success", message: data.message || (path.includes("login") ? "Login successful." : "Registration successful.") });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setLoading((current) => ({ ...current, auth: false }));
    }
  };

  const forgotPasswordRequest = async (event) => {
    event.preventDefault();
    try {
      setLoading((current) => ({ ...current, auth: true }));
      const data = await apiRequest("/auth/forgot-password", { method: "POST", body: forgotPasswordForm });
      setResetPasswordMeta({ resetUrl: "", token: "" });
      setForgotPasswordForm({ email: "" });
      setNotice({ type: "success", message: data.message || "Password reset link generated." });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setLoading((current) => ({ ...current, auth: false }));
    }
  };

  const resetPasswordRequest = async (event) => {
    event.preventDefault();
    try {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        setNotice({ type: "error", message: "Reset token is missing from the URL." });
        return;
      }

      if (!resetPasswordForm.password || resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
        setNotice({ type: "error", message: "Passwords do not match." });
        return;
      }

      setLoading((current) => ({ ...current, auth: true }));
      const data = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: { token, password: resetPasswordForm.password },
      });
      setResetPasswordForm({ password: "", confirmPassword: "" });
      setNotice({ type: "success", message: data.message || "Password reset successful." });
      goTo("/login", setRoute);
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setLoading((current) => ({ ...current, auth: false }));
    }
  };

  const logout = () => {
    setAuth(null);
    setProjects([]);
    setTasks([]);
    setUsers([]);
    setReports(null);
    setPanel("overview");
    goTo("/", setRoute);
  };

  const view = getView(route, auth);
  const mainClassName =
    view === "dashboard"
      ? theme === "light"
        ? "min-h-screen light-dashboard transition-colors duration-500 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.15),transparent_28%),linear-gradient(180deg,#f8f2e8_0%,#f4eee4_100%)] text-slate-900"
        : "min-h-screen transition-colors duration-500 bg-[radial-gradient(circle_at_top_left,rgba(140,107,47,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(232,214,178,0.08),transparent_28%),linear-gradient(180deg,#050505_0%,#0b0907_42%,#15100d_100%)] text-white"
      : "min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(140,107,47,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(232,214,178,0.08),transparent_28%),linear-gradient(180deg,#050505_0%,#0b0907_42%,#15100d_100%)] text-white";

  return (
    <main className={mainClassName}>
      <Notice notice={notice} />
      {view === "landing" ? <LandingScreen /> : null}
      {view === "login" ? <AuthScreen mode="login" form={loginForm} setForm={setLoginForm} loading={loading.auth} onSubmit={(event) => { event.preventDefault(); authRequest("/auth/login", loginForm, () => setLoginForm({ email: "", password: "" })); }} /> : null}
      {view === "register" ? <AuthScreen mode="register" form={registerForm} setForm={setRegisterForm} loading={loading.auth} onSubmit={(event) => { event.preventDefault(); authRequest("/auth/register", registerForm, () => setRegisterForm({ name: "", email: "", password: "", confirmPassword: "", role: "team-member" })); }} /> : null}
      {view === "forgot-password" ? <ForgotPasswordScreen form={forgotPasswordForm} setForm={setForgotPasswordForm} loading={loading.auth} onSubmit={forgotPasswordRequest} resetPasswordMeta={resetPasswordMeta} /> : null}
      {view === "reset-password" ? <ResetPasswordScreen form={resetPasswordForm} setForm={setResetPasswordForm} loading={loading.auth} onSubmit={resetPasswordRequest} /> : null}
      {view === "dashboard" && auth ? (
        <DashboardView
          auth={auth}
          route={route}
          setRoute={setRoute}
          notice={notice}
          loading={loading}
          panel={panel}
          setPanel={setPanel}
          theme={theme}
          setTheme={setTheme}
          users={users}
          projects={visibleProjects}
          tasks={visibleTasks}
          reports={reports}
          projectForm={projectForm}
          setProjectForm={setProjectForm}
          taskForm={taskForm}
          setTaskForm={setTaskForm}
          editingProjectId={editingProjectId}
          setEditingProjectId={setEditingProjectId}
          editingTaskId={editingTaskId}
          setEditingTaskId={setEditingTaskId}
          editingUserId={editingUserId}
          setEditingUserId={setEditingUserId}
          projectDrafts={projectDrafts}
          setProjectDrafts={setProjectDrafts}
          taskDrafts={taskDrafts}
          setTaskDrafts={setTaskDrafts}
          userDrafts={userDrafts}
          setUserDrafts={setUserDrafts}
          onLogout={logout}
          onRefresh={() => window.location.reload()}
          setNotice={setNotice}
          setProjects={setProjects}
          setTasks={setTasks}
          setUsers={setUsers}
          setReports={setReports}
          helpers={{ emptyProjectForm, emptyTaskForm, formatDate, toAttachment }}
          api={{ apiRequest, token: auth.token }}
        />
      ) : null}
    </main>
  );
}

export default App;
