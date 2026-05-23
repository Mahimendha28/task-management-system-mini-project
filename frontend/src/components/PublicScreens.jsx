import heroImage from "../assets/hero.png";
import { ROLE_OPTIONS, goTo } from "../lib/app-config";
import { FeatureTag, Field, PublicNavButtons, SelectField } from "./ui-export";

const sliderImages = [
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    title: "Sprint Planning",
    badge: "Planning",
    text: "Organize milestones, owners, and next steps before work begins.",
  },
  {
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
    title: "Team Alignment",
    badge: "Collab",
    text: "Keep communication and project direction visible across the whole team.",
  },
  {
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    title: "Task Execution",
    badge: "Active",
    text: "Move tasks from planning to delivery with clearer status tracking.",
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    title: "Reporting View",
    badge: "Reports",
    text: "Translate daily work into readable progress summaries and outcomes.",
  },
];
const projectShowcase = [
  { title: "Website Redesign", status: "Active", accent: "bg-emerald-500", detail: "UI revamp, content cleanup, launch prep" },
  { title: "Mobile App Sprint", status: "Planning", accent: "bg-amber-400", detail: "Wireframes, flows, and sprint backlog" },
  { title: "CRM Migration", status: "Review", accent: "bg-sky-500", detail: "Data sync, QA validation, stakeholder signoff" },
  { title: "Marketing Campaign", status: "Live", accent: "bg-rose-500", detail: "Ads, landing pages, and reporting setup" },
  { title: "Client Onboarding", status: "On Track", accent: "bg-violet-500", detail: "Docs, kickoff tasks, and approvals" },
  { title: "Analytics Upgrade", status: "Completed", accent: "bg-[#d8b66b]", detail: "Dashboards, event tracking, insights" },
];
const taskTypes = [
  {
    title: "To Do Tasks",
    text: "Create fresh work items for planning, backlog, and next actions.",
    badge: "Todo",
  },
  {
    title: "In Progress Tasks",
    text: "Track active execution across development, design, and review.",
    badge: "Active",
  },
  {
    title: "Completed Tasks",
    text: "Mark finished work and keep delivery history visible for teams.",
    badge: "Done",
  },
  {
    title: "High Priority Tasks",
    text: "Highlight urgent work that needs quick action or tighter focus.",
    badge: "Priority",
  },
  {
    title: "File Upload Tasks",
    text: "Support attachments for proofs, documents, and task handoffs.",
    badge: "Files",
  },
  {
    title: "Deadline Tasks",
    text: "Set due dates so every task stays visible against delivery goals.",
    badge: "Deadline",
  },
];
const authProjectVideoUrl = "https://www.pexels.com/download/video/7947454/";
const landingTeamVideoUrl = "https://www.pexels.com/download/video/7686671/";

export function LandingScreen() {
  return (
    <div>
      <section className="relative min-h-screen overflow-hidden">
        <img
          src={heroImage}
          alt="Task management workspace"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />
        <div className="absolute inset-0 hidden overflow-hidden md:block">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroImage}
          >
            <source src={landingTeamVideoUrl} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.38)_0%,rgba(10,10,10,0.48)_32%,rgba(10,10,10,0.70)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.68)_0%,rgba(36,28,18,0.42)_50%,rgba(140,107,47,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(232,214,178,0.10),transparent_32%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(12,10,9,0.55)_0%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent_0%,rgba(15,12,10,0.72)_100%)]" />

        <div className="fixed inset-x-0 top-0 z-40 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-full border border-[#e8d6b2]/25 bg-[linear-gradient(90deg,rgba(255,250,241,0.12),rgba(232,214,178,0.08))] px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.25)] backdrop-blur-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#f1ddb4]">TaskFlow Nexus</p>
              </div>
              <div className="flex flex-wrap items-center gap-6">

                <PublicNavButtons />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pt-28 pb-6 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
          <div className="flex flex-1 items-center py-12 sm:py-16 lg:py-20">
            <div className="w-full">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="max-w-3xl">
                    <p className="inline-flex rounded-full border border-[#e8d6b2]/35 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#f1ddb4]">
                      Smart Team Workflow
                    </p>
                    <h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl xl:text-7xl">
                      Keep projects,tasks, and teams moving in one modern workspace.
                    </h2>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                      Plan work, assign owners, track delivery, and review progress with a task management system designed for real teams, real meetings, and real deadlines.
                    </p>
                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={() => goTo("/register")}
                        className="rounded-full bg-[#f59e0b] px-8 py-4 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(245,158,11,0.34)] transition hover:bg-[#fbbf24]"
                      >
                        Get Started
                      </button>
                    </div>
                    <div id="roles" className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
                      <FeatureTag title="Admin" text="Users, access, reports" />
                      <FeatureTag title="Manager" text="Projects, planning, tasks" />
                      <FeatureTag title="Member" text="Status updates and files" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="workflow" className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2.4rem] border border-[#d8c39c]/16 bg-[linear-gradient(180deg,#090807_0%,#120e0b_52%,#1d150f_100%)] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9a8054]">Auto Slider</p>
              <h3 className="mt-3 font-serif text-3xl font-semibold text-white">Moving visuals that keep the landing page alive.</h3>
            </div>
            {/* <p className="max-w-xl text-sm leading-6 text-[#d7c8af]">A continuous image strip with darker premium cards, smoother motion, and hover effects that stay inside your black-and-gold theme.</p> */}
          </div>

          <div className="landing-slider-track mt-8 flex w-max gap-5">
            {[...sliderImages, ...sliderImages].map((item, index) => (
              <div key={`${item.title}-${index}`} className="group w-[280px] shrink-0 overflow-hidden rounded-[1.8rem] border border-[#d8c39c]/14 bg-[linear-gradient(180deg,#111111_0%,#1d1712_100%)] shadow-[0_16px_36px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-2 hover:border-[#d8c39c]/28 hover:bg-[linear-gradient(180deg,#18130f_0%,#2c1f10_100%)] hover:shadow-[0_22px_48px_rgba(0,0,0,0.34)]">
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold text-white transition duration-300 group-hover:text-[#f1ddb4]">{item.title}</p>
                    <span className="rounded-full border border-[#d8c39c]/18 bg-[#e8d6b2] px-3 py-1 text-xs font-semibold text-[#3b2a11]">{item.badge}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#d7c8af] transition duration-300 group-hover:text-[#f3e7d0]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="rounded-[2.4rem] border border-[#dcc8a0]/14 bg-[linear-gradient(180deg,#0a0908_0%,#14100d_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f1ddb4]">Project Showcase</p>
            <h3 className="mt-3 font-serif text-3xl font-semibold text-white">Different project records can live together inside one clean workspace.</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d7c8af]">
              Use separate projects for product work, client work, internal operations, campaigns, and reporting. This section shows how different project cards can look inside your system.
            </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: "6", label: "Project cards" },
                { value: "3", label: "Status layers" },
                { value: "1", label: "Unified workspace" },
              ].map((item) => (
                <div key={item.label} className="group rounded-[1.4rem] border border-[#dcc8a0]/12 bg-white/[0.03] px-4 py-4 transition duration-300 hover:-translate-y-1 hover:border-[#dcc8a0]/26 hover:bg-[rgba(232,214,178,0.08)]">
                  <p className="text-2xl font-semibold text-white transition duration-300 group-hover:text-[#f1ddb4]">{item.value}</p>
                  <p className="mt-1 text-sm text-[#d7c8af] transition duration-300 group-hover:text-[#f3e7d0]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projectShowcase.map((project, index) => (
                <div
                  key={project.title}
                  className="group rounded-[1.7rem] border border-[#dcc8a0]/12 bg-[linear-gradient(180deg,#12100e_0%,#1d1712_100%)] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-2 hover:border-[#dcc8a0]/24 hover:bg-[linear-gradient(180deg,#18130f_0%,#2d1f10_100%)] hover:shadow-[0_20px_44px_rgba(0,0,0,0.36)]"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`h-3 w-3 rounded-full ${project.accent}`} />
                    <span className="rounded-full border border-[#dcc8a0]/14 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f1ddb4]">
                      {project.status}
                    </span>
                  </div>
                  <h4 className="mt-5 text-xl font-semibold text-white transition duration-300 group-hover:text-[#f1ddb4]">{project.title}</h4>
                  <p className="mt-3 text-sm leading-6 text-[#d7c8af] transition duration-300 group-hover:text-[#f3e7d0]">{project.detail}</p>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b66b_0%,#f59e0b_100%)]" style={{ width: `${62 + index * 5}%` }} />
                  </div>
                </div>
              ))}
            </div>
        </section>

        <section id="tasks" className="rounded-[2.4rem] border border-[#dcc8a0]/14 bg-[linear-gradient(180deg,#090807_0%,#15100d_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f1ddb4]">Task Types</p>
              <h3 className="mt-3 font-serif text-3xl font-semibold text-white">Create different types of tasks with one consistent workflow system.</h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#d7c8af]">From todo to completed, priority to file-based work, your task section can represent many different actions clearly.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {taskTypes.map((task, index) => (
              <div
                key={task.title}
                className="group relative overflow-hidden rounded-[1.8rem] border border-[#dcc8a0]/14 bg-[linear-gradient(180deg,#12100e_0%,#1e1712_100%)] p-5 shadow-[0_14px_32px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-2 hover:border-[#dcc8a0]/26 hover:bg-[linear-gradient(180deg,#18130f_0%,#2d1f10_100%)] hover:shadow-[0_22px_44px_rgba(0,0,0,0.34)]"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.18)_0%,transparent_70%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xl font-semibold text-white transition duration-300 group-hover:text-[#f1ddb4]">{task.title}</p>
                    <span className="rounded-full border border-[#dcc8a0]/18 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f1ddb4]">
                      {task.badge}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#d7c8af] transition duration-300 group-hover:text-[#f3e7d0]">{task.text}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#111111_0%,#8c6b2f_100%)] text-sm font-semibold text-[#f1ddb4]">
                      {index + 1}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                      <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b66b_0%,#f59e0b_100%)]" style={{ width: `${58 + index * 6}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

       

        <footer className="rounded-[2.2rem] border border-[#dcc8a0]/14 bg-[linear-gradient(180deg,#090807_0%,#130f0c_100%)] px-6 py-8 shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#f1ddb4]">TaskFlow Nexus</p>
              <p className="mt-4 text-sm leading-7 text-[#d7c8af]">
                A modern task management system for admins, project managers, and team members, built with one consistent black-and-gold product identity.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1ddb4]">Platform</p>
                <div className="mt-4 space-y-2 text-sm text-[#d7c8af]">
                  <button type="button" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="block transition hover:text-white">Projects</button>
                  <button type="button" onClick={() => document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" })} className="block transition hover:text-white">Tasks</button>
                  <button type="button" onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })} className="block transition hover:text-white">Workflow</button>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1ddb4]">Access</p>
                <div className="mt-4 space-y-2 text-sm text-[#d7c8af]">
                  <button type="button" onClick={() => goTo("/login")} className="block transition hover:text-white">Admin</button>
                  <button type="button" onClick={() => goTo("/login")} className="block transition hover:text-white">Project Manager</button>
                  <button type="button" onClick={() => goTo("/login")} className="block transition hover:text-white">Team Member</button>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1ddb4]">Navigation</p>
                <div className="mt-4 space-y-2 text-sm text-[#d7c8af]">
                  <button type="button" onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })} className="block transition hover:text-white">Workflow</button>
                  <button type="button" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="block transition hover:text-white">Projects</button>
                  <button type="button" onClick={() => document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" })} className="block transition hover:text-white">Tasks</button>
                  <button type="button" onClick={() => document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" })} className="block transition hover:text-white">Roles</button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/8 pt-5 text-sm text-[#a8977b]">
            © 2026 TaskFlow Nexus. Crafted for a cleaner black-and-gold experience.
          </div>
        </footer>
      </div>
    </div>
  );
}

export function AuthScreen({ mode, form, setForm, loading, onSubmit }) {
  const isLogin = mode === "login";
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      
      {/* Use the selected project-planning video on login/register. */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0807]">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroImage}
        >
          <source src={authProjectVideoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,182,107,0.2)_0%,transparent_70%)] mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.4)_0%,rgba(10,8,7,0.95)_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative rounded-[2.5rem] border border-[#d8c39c]/20 bg-[linear-gradient(180deg,rgba(18,14,11,0.85)_0%,rgba(10,8,7,0.95)_100%)] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-12 animate-slide-up-fade backdrop-blur-md">
          <button type="button" onClick={() => goTo("/")} className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c39c]/20 bg-white/[0.03] text-[#e8d6b2] transition hover:bg-white/[0.08] hover:text-white">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2"><path d="M15 10H5M5 10l5 5M5 10l5-5"/></svg>
          </button>
          
          <div className="mb-8 mt-2 flex flex-col items-center text-center">
             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#e8d6b2_0%,#b48a3c_100%)] text-2xl font-black text-[#18120f] shadow-[0_0_20px_rgba(232,214,178,0.4)]">T</div>
             <h2 className="mt-6 font-serif text-3xl font-semibold tracking-tight">{isLogin ? "Welcome Back" : "Create Account"}</h2>
             <p className="mt-2 text-sm text-[#d7c8af]">{isLogin ? "Enter your credentials to access your workspace." : "Join the workflow ecosystem."}</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            {!isLogin ? <Field label="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Enter Your Name" /> : null}
            <Field label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="mahi@example.com" />
            <Field label="Password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Minimum 6 characters" />
            {!isLogin ? (
              <div>
                <Field
                  label="Confirm password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  placeholder="Repeat your password"
                />
                <p className="mt-2 text-xs text-[#bfae90]">Use the same password again to secure your account setup.</p>
              </div>
            ) : null}
            {!isLogin ? <SelectField label="User role" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} options={ROLE_OPTIONS} /> : null}
            <button type="submit" disabled={loading} className="mt-4 w-full rounded-[1.25rem] bg-[linear-gradient(135deg,#f1ddb4_0%,#b99b65_100%)] px-4 py-4 text-[15px] font-bold text-[#1b140d] shadow-[0_12px_30px_rgba(185,155,101,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(185,155,101,0.4)] disabled:opacity-70 disabled:hover:translate-y-0 text-center">
              {loading ? "Please wait..." : isLogin ? "Access Workspace" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-[#d8c39c]/10 pt-6">
            <p className="text-sm text-[#9f8f77]">
              {isLogin ? "New user?" : "Already registered?"}{" "}
              <button type="button" onClick={() => goTo(isLogin ? "/register" : "/login")} className="font-bold text-[#d8b66b] transition hover:text-[#f1ddb4]">
                {isLogin ? "Create account" : "Login instead"}
              </button>
            </p>
            {isLogin ? (
              <button type="button" onClick={() => goTo("/forgot-password")} className="text-sm font-medium text-[#b99b65] transition hover:text-[#f1ddb4]">
                Forgot password?
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
export function ForgotPasswordScreen({ form, setForm, loading, onSubmit, resetPasswordMeta }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      
      {/* Premium Video Background (Heavily Filtered for 3D Golden Abstraction) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0807]">
        <iframe
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.2] opacity-80"
          style={{ filter: "grayscale(100%) sepia(90%) hue-rotate(350deg) contrast(150%) brightness(55%) blur(1px)" }}
          src="https://www.youtube.com/embed/PhY7uAMKYg4?autoplay=1&mute=1&controls=0&loop=1&playlist=PhY7uAMKYg4&playsinline=1&modestbranding=1&rel=0"
          title="Background video"
          allow="autoplay; encrypted-media"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,182,107,0.2)_0%,transparent_70%)] mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.4)_0%,rgba(10,8,7,0.95)_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative rounded-[2.5rem] border border-[#d8c39c]/20 bg-[linear-gradient(180deg,rgba(18,14,11,0.85)_0%,rgba(10,8,7,0.95)_100%)] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-12 animate-slide-up-fade backdrop-blur-md">
          <button type="button" onClick={() => goTo("/login")} className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c39c]/20 bg-white/[0.03] text-[#e8d6b2] transition hover:bg-white/[0.08] hover:text-white">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2"><path d="M15 10H5M5 10l5 5M5 10l5-5"/></svg>
          </button>

          <div className="mb-8 mt-2 flex flex-col items-center text-center">
             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#e8d6b2_0%,#b48a3c_100%)] text-2xl font-black text-[#18120f] shadow-[0_0_20px_rgba(232,214,178,0.4)]">?</div>
             <h2 className="mt-6 font-serif text-3xl font-semibold tracking-tight">Forgot Password</h2>
             <p className="mt-2 text-sm text-[#d7c8af]">Enter your email to receive a secure reset link.</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <Field label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="mahit@example.com" />
            <button type="submit" disabled={loading} className="mt-4 w-full rounded-[1.25rem] bg-[linear-gradient(135deg,#f1ddb4_0%,#b99b65_100%)] px-4 py-4 text-[15px] font-bold text-[#1b140d] shadow-[0_12px_30px_rgba(185,155,101,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(185,155,101,0.4)] disabled:opacity-70 disabled:hover:translate-y-0 text-center">
              {loading ? "Generating..." : "Send Reset Link"}
            </button>
          </form>

          {resetPasswordMeta?.resetUrl ? (
            <div className="mt-8 rounded-[1.5rem] border border-[#d8c39c]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 text-sm text-[#d7c8af] animate-slide-up-fade">
              <p className="font-semibold text-white">Reset link ready</p>
              <p className="mt-2 break-all font-mono text-xs text-[#b99b65]">{resetPasswordMeta.resetUrl}</p>
              <button type="button" onClick={() => goTo(`/reset-password?token=${resetPasswordMeta.token}`)} className="mt-5 w-full rounded-full bg-[#111111] px-4 py-3 text-sm font-bold text-[#e8d6b2] transition hover:bg-[#1a1814] hover:text-white border border-[#d8c39c]/20">
                Open reset page
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export function ResetPasswordScreen({ form, setForm, loading, onSubmit }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      
      {/* Premium Video Background (Heavily Filtered for 3D Golden Abstraction) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0807]">
        <iframe
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.2] opacity-80"
          style={{ filter: "grayscale(100%) sepia(90%) hue-rotate(350deg) contrast(150%) brightness(55%) blur(1px)" }}
          src="https://www.youtube.com/embed/PhY7uAMKYg4?autoplay=1&mute=1&controls=0&loop=1&playlist=PhY7uAMKYg4&playsinline=1&modestbranding=1&rel=0"
          title="Background video"
          allow="autoplay; encrypted-media"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,182,107,0.2)_0%,transparent_70%)] mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.4)_0%,rgba(10,8,7,0.95)_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative rounded-[2.5rem] border border-[#d8c39c]/20 bg-[linear-gradient(180deg,rgba(18,14,11,0.85)_0%,rgba(10,8,7,0.95)_100%)] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-12 animate-slide-up-fade backdrop-blur-md">
          <button type="button" onClick={() => goTo("/login")} className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c39c]/20 bg-white/[0.03] text-[#e8d6b2] transition hover:bg-white/[0.08] hover:text-white">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2"><path d="M15 10H5M5 10l5 5M5 10l5-5"/></svg>
          </button>

          <div className="mb-8 mt-2 flex flex-col items-center text-center">
             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#e8d6b2_0%,#b48a3c_100%)] text-2xl font-black text-[#18120f] shadow-[0_0_20px_rgba(232,214,178,0.4)]">!</div>
             <h2 className="mt-6 font-serif text-3xl font-semibold tracking-tight">Create New Password</h2>
             <p className="mt-2 text-sm text-[#d7c8af]">Update your secure credentials.</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <Field label="New password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Minimum 6 characters" />
            <Field label="Confirm password" type="password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} placeholder="Repeat your new password" />
            <button type="submit" disabled={loading} className="mt-4 w-full rounded-[1.25rem] bg-[linear-gradient(135deg,#f1ddb4_0%,#b99b65_100%)] px-4 py-4 text-[15px] font-bold text-[#1b140d] shadow-[0_12px_30px_rgba(185,155,101,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(185,155,101,0.4)] disabled:opacity-70 disabled:hover:translate-y-0 text-center">
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
