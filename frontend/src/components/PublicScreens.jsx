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

export function LandingScreen({ theme = "dark", setTheme = () => {} }) {
  const isLight = theme === "light";

  return (
    <div className={isLight ? "landing-light" : ""}>
      <section className="landing-hero relative min-h-screen overflow-hidden">
        <img
          src={heroImage}
          alt="Task management workspace"
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />
        <div className={`absolute inset-0 hidden overflow-hidden md:block ${isLight ? 'bg-white' : ''}`}>
          <video
            className={`absolute inset-0 h-full w-full object-cover ${isLight ? 'opacity-[0.85]' : 'opacity-100'}`}
            style={{ filter: isLight ? "grayscale(15%) contrast(110%) brightness(135%) sepia(10%)" : "none" }}
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
        <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(248,242,228,0.45)_52%,rgba(248,242,228,0.85)_100%)]' : 'bg-[linear-gradient(180deg,rgba(10,10,10,0.38)_0%,rgba(10,10,10,0.48)_32%,rgba(10,10,10,0.70)_100%)]'}`} />
        <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(90deg,rgba(255,250,240,0.25)_0%,rgba(248,242,228,0.15)_50%,transparent_100%)]' : 'bg-[linear-gradient(90deg,rgba(17,17,17,0.68)_0%,rgba(36,28,18,0.42)_50%,rgba(140,107,47,0.18)_100%)]'}`} />
        <div className={`absolute inset-0 ${isLight ? 'bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.03),transparent_32%)]' : 'bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(232,214,178,0.10),transparent_32%)]'}`} />
        <div className={`absolute inset-x-0 top-0 h-32 ${isLight ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_0%,transparent_100%)]' : 'bg-[linear-gradient(180deg,rgba(12,10,9,0.55)_0%,transparent_100%)]'}`} />
        <div className={`absolute inset-x-0 bottom-0 h-44 ${isLight ? 'bg-[linear-gradient(180deg,transparent_0%,rgba(248,242,228,0.75)_100%)]' : 'bg-[linear-gradient(180deg,transparent_0%,rgba(15,12,10,0.72)_100%)]'}`} />

        <div className="fixed inset-x-0 top-0 z-40 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-full border border-[#e8d6b2]/25 bg-[linear-gradient(90deg,rgba(255,250,241,0.12),rgba(232,214,178,0.08))] px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.25)] backdrop-blur-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#f1ddb4]">TaskFlow Nexus</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTheme(isLight ? "dark" : "light")}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d8c39c]/22 bg-white/[0.08] text-[#f1ddb4] transition hover:-translate-y-0.5 hover:bg-white/[0.16]"
                  aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
                  title={isLight ? "Dark mode" : "Light mode"}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    {isLight ? (
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                      </>
                    )}
                  </svg>
                </button>
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
                    <p className="landing-reveal inline-flex rounded-full border border-[#e8d6b2]/35 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#f1ddb4]">
                      Smart Team Workflow
                    </p>
                    <h2 className="landing-reveal landing-headline mt-6 max-w-4xl font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl xl:text-7xl">
                      Keep projects, tasks, and teams moving in one modern workspace.
                    </h2>
                    <p className="landing-reveal mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                      Plan work, assign owners, track delivery, and review progress with a task management system designed for real teams, real meetings, and real deadlines.
                    </p>
                    <div className="landing-reveal mt-8">
                      <button
                        type="button"
                        onClick={() => goTo("/register")}
                        className="rounded-full bg-[#f59e0b] px-8 py-4 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(245,158,11,0.34)] transition hover:bg-[#fbbf24]"
                      >
                        Get Started
                      </button>
                    </div>
                    <div id="roles" className="landing-reveal mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
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
        <section className={`landing-reveal overflow-hidden rounded-[1.6rem] border p-6 ${isLight ? 'border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]' : 'border-[#d8c39c]/16 bg-[linear-gradient(180deg,#090807_0%,#120e0b_52%,#1d150f_100%)] shadow-[0_22px_60px_rgba(0,0,0,0.28)]'}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isLight ? 'text-amber-700' : 'text-[#9a8054]'}`}>Auto Slider</p>
              <h3 className={`mt-3 font-serif text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Moving visuals that keep the landing page alive.</h3>
            </div>
            {/* <p className="max-w-xl text-sm leading-6 text-[#d7c8af]">A continuous image strip with darker premium cards, smoother motion, and hover effects that stay inside your black-and-gold theme.</p> */}
          </div>

          <div className="landing-slider-track mt-8 flex w-max gap-5">
            {[...sliderImages, ...sliderImages].map((item, index) => (
              <div key={`${item.title}-${index}`} className={`group w-[280px] shrink-0 overflow-hidden rounded-[1.8rem] border transition duration-300 hover:-translate-y-2 ${isLight ? 'border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-slate-300 hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)]' : 'border-[#d8c39c]/14 bg-[linear-gradient(180deg,#111111_0%,#1d1712_100%)] shadow-[0_16px_36px_rgba(0,0,0,0.24)] hover:border-[#d8c39c]/28 hover:bg-[linear-gradient(180deg,#18130f_0%,#2c1f10_100%)] hover:shadow-[0_22px_48px_rgba(0,0,0,0.34)]'}`}>
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-base font-semibold transition duration-300 ${isLight ? 'text-slate-900 group-hover:text-amber-700' : 'text-white group-hover:text-[#f1ddb4]'}`}>{item.title}</p>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${isLight ? 'border-slate-200 bg-slate-100 text-slate-600' : 'border-[#d8c39c]/18 bg-[#e8d6b2] text-[#3b2a11]'}`}>{item.badge}</span>
                  </div>
                  <p className={`mt-2 text-sm transition duration-300 ${isLight ? 'text-slate-500 group-hover:text-slate-700' : 'text-[#d7c8af] group-hover:text-[#f3e7d0]'}`}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className={`landing-reveal rounded-[1.6rem] border p-6 ${isLight ? 'border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]' : 'border-[#dcc8a0]/14 bg-[linear-gradient(180deg,#0a0908_0%,#14100d_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.28)]'}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isLight ? 'text-amber-700' : 'text-[#f1ddb4]'}`}>Project Showcase</p>
            <h3 className={`mt-3 font-serif text-3xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Project records arranged like a calm delivery map.</h3>
            <p className={`mt-4 max-w-2xl text-sm leading-7 ${isLight ? 'text-slate-500' : 'text-[#d7c8af]'}`}>
              Use separate projects for product work, client work, internal operations, campaigns, and reporting. This section shows how different project cards can look inside your system.
            </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: "6", label: "Project cards" },
                { value: "3", label: "Status layers" },
                { value: "1", label: "Unified workspace" },
              ].map((item) => (
                <div key={item.label} className={`group rounded-[1.4rem] border px-4 py-4 transition duration-300 hover:-translate-y-1 ${isLight ? 'border-slate-200 bg-slate-50 hover:border-amber-200 hover:bg-amber-50' : 'border-[#dcc8a0]/12 bg-white/[0.03] hover:border-[#dcc8a0]/26 hover:bg-[rgba(232,214,178,0.08)]'}`}>
                  <p className={`text-2xl font-semibold transition duration-300 ${isLight ? 'text-slate-900 group-hover:text-amber-700' : 'text-white group-hover:text-[#f1ddb4]'}`}>{item.value}</p>
                  <p className={`mt-1 text-sm transition duration-300 ${isLight ? 'text-slate-500 group-hover:text-slate-700' : 'text-[#d7c8af] group-hover:text-[#f3e7d0]'}`}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {projectShowcase.map((project, index) => {
                const isOdd = index % 2 !== 0;
                return (
                  <div
                    key={project.title}
                    className={`group landing-reveal flex flex-col gap-4 rounded-[1.2rem] border p-4 transition duration-300 hover:-translate-y-1 sm:items-center ${isLight ? 'border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.1)]' : 'border-[#dcc8a0]/12 bg-[linear-gradient(180deg,#12100e_0%,#1d1712_100%)] shadow-[0_12px_30px_rgba(0,0,0,0.24)] hover:border-[#dcc8a0]/24 hover:bg-[linear-gradient(180deg,#18130f_0%,#2d1f10_100%)] hover:shadow-[0_20px_44px_rgba(0,0,0,0.36)]'} ${
                      isOdd ? "sm:flex-row-reverse text-right lg:translate-y-8 project-card-odd" : "sm:flex-row project-card-even"
                    }`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className={`flex items-center gap-3 sm:w-56 ${isOdd ? "sm:justify-end" : ""}`}>
                      {!isOdd && <span className={`h-3 w-3 shrink-0 rounded-full ${project.accent}`} />}
                      <h4 className={`text-lg font-semibold transition duration-300 ${isLight ? 'text-slate-900 group-hover:text-amber-700' : 'text-white group-hover:text-[#f1ddb4]'}`}>{project.title}</h4>
                      {isOdd && <span className={`h-3 w-3 shrink-0 rounded-full ${project.accent}`} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isLight ? 'border-slate-200 bg-slate-100 text-amber-700' : 'border-[#dcc8a0]/14 bg-white/[0.05] text-[#f1ddb4]'}`}>
                        {project.status}
                      </span>
                      <p className={`mt-3 text-sm leading-6 transition duration-300 ${isLight ? 'text-slate-500 group-hover:text-slate-700' : 'text-[#d7c8af] group-hover:text-[#f3e7d0]'}`}>{project.detail}</p>
                      <div className={`mt-4 h-2 overflow-hidden rounded-full ${isLight ? 'bg-slate-200' : 'bg-white/8'}`}>
                        <div className={`h-full rounded-full ${isLight ? 'bg-[linear-gradient(90deg,#d97706_0%,#0ea5e9_100%)]' : 'bg-[linear-gradient(90deg,#d8b66b_0%,#38bdf8_100%)]'}`} style={{ width: `${62 + index * 5}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </section>

        <section id="tasks" className={`landing-reveal rounded-[1.6rem] border p-8 ${isLight ? 'border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]' : 'border-[#dcc8a0]/14 bg-[linear-gradient(180deg,#090807_0%,#15100d_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.28)]'}`}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${isLight ? 'text-amber-700' : 'text-[#f1ddb4]'}`}>Task Workflow</p>
            <h3 className={`mt-3 font-serif text-4xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Staggered lifecycle of tasks inside our ecosystem.</h3>
            <p className={`mt-4 text-sm leading-6 ${isLight ? 'text-slate-500' : 'text-[#d7c8af]'}`}>A structured timeline displaying how tasks progress, priority escalation, file attachments, and completion milestones.</p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Center vertical timeline rail line */}
            <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block ${isLight ? 'bg-[linear-gradient(180deg,rgba(180,83,9,0.1)_0%,#d97706_30%,#0ea5e9_70%,rgba(14,165,233,0.1)_100%)]' : 'bg-[linear-gradient(180deg,rgba(216,182,107,0.1)_0%,#d8b66b_30%,#38bdf8_70%,rgba(56,189,248,0.1)_100%)]'}`} />

            <div className="space-y-12">
              {taskTypes.map((task, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={task.title}
                    className={`group relative flex flex-col md:flex-row md:items-center ${
                      isLeft ? "md:justify-start" : "md:justify-end"
                    }`}
                  >
                    {/* Timeline Node in the Center */}
                    <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold shadow-lg transition duration-300 group-hover:scale-110 ${isLight ? 'bg-white border-amber-500 text-amber-700 group-hover:bg-amber-500 group-hover:text-white' : 'bg-[#111111] border-[#d8b66b] text-[#f1ddb4] group-hover:bg-[#d8b66b] group-hover:text-[#111111]'}`}>
                      {index + 1}
                    </div>

                    {/* Content Card (fits on one side of the line) */}
                    <div
                      className={`landing-reveal w-full md:w-[45%] rounded-[1.5rem] border p-6 transition duration-300 hover:-translate-y-1 ${isLight ? 'border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.1)]' : 'border-[#dcc8a0]/12 bg-[linear-gradient(180deg,#12100e_0%,#1e1712_100%)] shadow-xl hover:border-[#dcc8a0]/24 hover:bg-[linear-gradient(180deg,#18130f_0%,#2d1f10_100%)] hover:shadow-2xl'} ${
                        isLeft ? "task-card-left" : "task-card-right"
                      }`}
                    >
                      {/* Mobile Node Badge */}
                      <span className={`inline-flex md:hidden h-8 w-8 mb-4 items-center justify-center rounded-full text-xs font-semibold ${isLight ? 'bg-[linear-gradient(135deg,#f59e0b_0%,#d97706_100%)] text-white' : 'bg-[linear-gradient(135deg,#111111_0%,#8c6b2f_100%)] text-[#f1ddb4]'}`}>
                        {index + 1}
                      </span>
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <h4 className={`text-xl font-semibold transition duration-300 ${isLight ? 'text-slate-900 group-hover:text-amber-700' : 'text-white group-hover:text-[#f1ddb4]'}`}>
                          {task.title}
                        </h4>
                        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${isLight ? 'border-slate-200 bg-slate-100 text-amber-700' : 'border-[#dcc8a0]/18 bg-white/[0.04] text-[#f1ddb4]'}`}>
                          {task.badge}
                        </span>
                      </div>
                      <p className={`mt-3 text-sm leading-7 transition duration-300 ${isLight ? 'text-slate-500 group-hover:text-slate-700' : 'text-[#d7c8af] group-hover:text-[#f3e7d0]'}`}>
                        {task.text}
                      </p>
                      <div className={`mt-5 h-1.5 overflow-hidden rounded-full ${isLight ? 'bg-slate-200' : 'bg-white/8'}`}>
                        <div className={`h-full rounded-full ${isLight ? 'bg-[linear-gradient(90deg,#d97706_0%,#0ea5e9_100%)]' : 'bg-[linear-gradient(90deg,#d8b66b_0%,#38bdf8_100%)]'}`} style={{ width: `${58 + index * 6}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

       

        <footer className={`rounded-[2.2rem] border px-6 py-8 ${isLight ? 'border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]' : 'border-[#dcc8a0]/14 bg-[linear-gradient(180deg,#090807_0%,#130f0c_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.24)]'}`}>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <p className={`text-sm font-semibold uppercase tracking-[0.34em] ${isLight ? 'text-amber-700' : 'text-[#f1ddb4]'}`}>TaskFlow Nexus</p>
              <p className={`mt-4 text-sm leading-7 ${isLight ? 'text-slate-500' : 'text-[#d7c8af]'}`}>
                A modern task management system for admins, project managers, and team members, built with one consistent black-and-gold product identity.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${isLight ? 'text-amber-700' : 'text-[#f1ddb4]'}`}>Platform</p>
                <div className={`mt-4 space-y-2 text-sm ${isLight ? 'text-slate-500' : 'text-[#d7c8af]'}`}>
                  <button type="button" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Projects</button>
                  <button type="button" onClick={() => document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" })} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Tasks</button>
                  <button type="button" onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Workflow</button>
                </div>
              </div>
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${isLight ? 'text-amber-700' : 'text-[#f1ddb4]'}`}>Access</p>
                <div className={`mt-4 space-y-2 text-sm ${isLight ? 'text-slate-500' : 'text-[#d7c8af]'}`}>
                  <button type="button" onClick={() => goTo("/login")} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Admin</button>
                  <button type="button" onClick={() => goTo("/login")} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Project Manager</button>
                  <button type="button" onClick={() => goTo("/login")} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Team Member</button>
                </div>
              </div>
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${isLight ? 'text-amber-700' : 'text-[#f1ddb4]'}`}>Navigation</p>
                <div className={`mt-4 space-y-2 text-sm ${isLight ? 'text-slate-500' : 'text-[#d7c8af]'}`}>
                  <button type="button" onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Workflow</button>
                  <button type="button" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Projects</button>
                  <button type="button" onClick={() => document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" })} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Tasks</button>
                  <button type="button" onClick={() => document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" })} className={`block transition ${isLight ? 'hover:text-slate-900' : 'hover:text-white'}`}>Roles</button>
                </div>
              </div>
            </div>
          </div>
          <div className={`mt-8 border-t pt-5 text-sm ${isLight ? 'border-slate-200 text-slate-400' : 'border-white/8 text-[#a8977b]'}`}>
            © 2026 TaskFlow Nexus. Crafted for a cleaner black-and-gold experience.
          </div>
        </footer>
      </div>
    </div>
  );
}

export function AuthScreen({ mode, form, setForm, loading, onSubmit, theme }) {
  const isLogin = mode === "login";
  const isLight = theme === "light";
  return (
    <div className={isLight ? "landing-light relative flex min-h-screen items-center justify-center overflow-hidden" : "relative flex min-h-screen items-center justify-center overflow-hidden"}>
      
      {/* Use the selected project-planning video on login/register. */}
      <div className={`absolute inset-0 z-0 overflow-hidden ${isLight ? 'bg-white' : 'bg-[#0a0807]'}`}>
        <video
          className={`absolute inset-0 h-full w-full object-cover ${isLight ? 'opacity-[0.80]' : 'opacity-90'}`}
          style={{ filter: isLight ? "grayscale(15%) contrast(115%) brightness(135%)" : "none" }}
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
        <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(248,242,228,0.65)_100%)]' : 'bg-[linear-gradient(180deg,rgba(15,12,10,0.4)_0%,rgba(10,8,7,0.95)_100%)]'}`} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-6 sm:px-6">
        <section className="auth-card relative rounded-[1.75rem] border border-[#d8c39c]/16 bg-[linear-gradient(180deg,rgba(14,11,9,0.86)_0%,rgba(10,8,7,0.94)_100%)] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.5)] sm:p-6 animate-slide-up-fade backdrop-blur-md">
          <button type="button" onClick={() => goTo("/")} className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#d7c39c]/16 bg-white/[0.02] text-[#e8d6b2] transition hover:bg-white/[0.08] hover:text-white">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2"><path d="M15 10H5M5 10l5 5M5 10l5-5"/></svg>
          </button>
          
          <div className="mb-5 mt-5 text-center">
             <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#e8d6b2_0%,#b48a3c_100%)] text-base font-black text-[#18120f] shadow-[0_0_16px_rgba(232,214,178,0.2)]">T</div>
             <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">{isLogin ? "Login" : "Create Account"}</h2>
             <p className="mt-1 text-sm text-[#cdbb9d]">{isLogin ? "Access your workspace." : "Create your account."}</p>
          </div>

          <form className="space-y-3.5" onSubmit={onSubmit}>
            {!isLogin ? <Field label="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Enter your name" /> : null}
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
                <p className="mt-1.5 text-[11px] text-[#bfae90]">Repeat the same password to confirm your account.</p>
              </div>
            ) : null}
            {!isLogin ? <SelectField label="User role" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} options={ROLE_OPTIONS} /> : null}
            <button type="submit" disabled={loading} className={`mt-1 w-full rounded-[1rem] px-4 py-2.5 text-sm font-semibold shadow-[0_10px_24px_rgba(185,155,101,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(185,155,101,0.32)] disabled:opacity-70 disabled:hover:translate-y-0 text-center ${isLight ? 'bg-[linear-gradient(135deg,#f59e0b_0%,#d97706_100%)] text-white' : 'bg-[linear-gradient(135deg,#f1ddb4_0%,#b99b65_100%)] text-[#1b140d]'}`}>
              {loading ? "Please wait..." : isLogin ? "Access Workspace" : "Create Account"}
            </button>
          </form>

          <div className="mt-5 flex flex-col items-center justify-center gap-2.5 border-t border-[#d8c39c]/10 pt-4">
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
export function ForgotPasswordScreen({ form, setForm, loading, onSubmit, resetPasswordMeta, theme }) {
  const isLight = theme === "light";
  return (
    <div className={isLight ? "landing-light relative flex min-h-screen items-center justify-center overflow-hidden" : "relative flex min-h-screen items-center justify-center overflow-hidden"}>
      
      {/* Premium Video Background (Heavily Filtered for 3D Golden Abstraction) */}
      <div className={`absolute inset-0 z-0 overflow-hidden ${isLight ? 'bg-white' : 'bg-[#0a0807]'}`}>
        <iframe
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.2] ${isLight ? 'opacity-[0.80]' : 'opacity-80'}`}
          style={{ filter: isLight ? "grayscale(20%) sepia(20%) hue-rotate(15deg) contrast(120%) brightness(140%) blur(1px)" : "grayscale(100%) sepia(90%) hue-rotate(350deg) contrast(150%) brightness(55%) blur(1px)" }}
          src="https://www.youtube.com/embed/PhY7uAMKYg4?autoplay=1&mute=1&controls=0&loop=1&playlist=PhY7uAMKYg4&playsinline=1&modestbranding=1&rel=0"
          title="Background video"
          allow="autoplay; encrypted-media"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,182,107,0.2)_0%,transparent_70%)] mix-blend-color-dodge" />
        <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(248,242,228,0.65)_100%)]' : 'bg-[linear-gradient(180deg,rgba(15,12,10,0.4)_0%,rgba(10,8,7,0.95)_100%)]'}`} />
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <section className="auth-card relative rounded-[2.5rem] border border-[#d8c39c]/20 bg-[linear-gradient(180deg,rgba(18,14,11,0.85)_0%,rgba(10,8,7,0.95)_100%)] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-12 animate-slide-up-fade backdrop-blur-md">
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
            <button type="submit" disabled={loading} className={`mt-4 w-full rounded-[1.25rem] px-4 py-4 text-[15px] font-bold shadow-[0_12px_30px_rgba(185,155,101,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(185,155,101,0.4)] disabled:opacity-70 disabled:hover:translate-y-0 text-center ${isLight ? 'bg-[linear-gradient(135deg,#f59e0b_0%,#d97706_100%)] text-white' : 'bg-[linear-gradient(135deg,#f1ddb4_0%,#b99b65_100%)] text-[#1b140d]'}`}>
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

export function ResetPasswordScreen({ form, setForm, loading, onSubmit, theme }) {
  const isLight = theme === "light";
  return (
    <div className={isLight ? "landing-light relative flex min-h-screen items-center justify-center overflow-hidden" : "relative flex min-h-screen items-center justify-center overflow-hidden"}>
      
      {/* Premium Video Background (Heavily Filtered for 3D Golden Abstraction) */}
      <div className={`absolute inset-0 z-0 overflow-hidden ${isLight ? 'bg-white' : 'bg-[#0a0807]'}`}>
        <iframe
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.2] ${isLight ? 'opacity-[0.80]' : 'opacity-80'}`}
          style={{ filter: isLight ? "grayscale(20%) sepia(20%) hue-rotate(15deg) contrast(120%) brightness(140%) blur(1px)" : "grayscale(100%) sepia(90%) hue-rotate(350deg) contrast(150%) brightness(55%) blur(1px)" }}
          src="https://www.youtube.com/embed/PhY7uAMKYg4?autoplay=1&mute=1&controls=0&loop=1&playlist=PhY7uAMKYg4&playsinline=1&modestbranding=1&rel=0"
          title="Background video"
          allow="autoplay; encrypted-media"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,182,107,0.2)_0%,transparent_70%)] mix-blend-color-dodge" />
        <div className={`absolute inset-0 ${isLight ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(248,242,228,0.65)_100%)]' : 'bg-[linear-gradient(180deg,rgba(15,12,10,0.4)_0%,rgba(10,8,7,0.95)_100%)]'}`} />
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <section className="auth-card relative rounded-[2.5rem] border border-[#d8c39c]/20 bg-[linear-gradient(180deg,rgba(18,14,11,0.85)_0%,rgba(10,8,7,0.95)_100%)] p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-12 animate-slide-up-fade backdrop-blur-md">
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
            <button type="submit" disabled={loading} className={`mt-4 w-full rounded-[1.25rem] px-4 py-4 text-[15px] font-bold shadow-[0_12px_30px_rgba(185,155,101,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(185,155,101,0.4)] disabled:opacity-70 disabled:hover:translate-y-0 text-center ${isLight ? 'bg-[linear-gradient(135deg,#f59e0b_0%,#d97706_100%)] text-white' : 'bg-[linear-gradient(135deg,#f1ddb4_0%,#b99b65_100%)] text-[#1b140d]'}`}>
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
