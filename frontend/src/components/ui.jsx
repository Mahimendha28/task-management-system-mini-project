import { useEffect, useRef, useState } from "react";
import { goTo } from "../lib/app-config";

function DropdownChevron({ open = false }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 text-[#e8d6b2] transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m5 7 5 6 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SelectionCheck({ selected = false }) {
  return (
    <span
      className={`ml-3 flex h-5 w-5 items-center justify-center rounded-full border ${
        selected
          ? "border-[#d8c39c]/40 bg-[#e8d6b2] text-[#1b140d]"
          : "border-[#d8c39c]/18 text-transparent"
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="m5 10 3 3 7-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Notice({ notice }) {
  if (!notice?.message) return null;
  const tone =
    notice.type === "error"
      ? "border-[#7f1d1d] bg-[#2a1414] text-[#f8c9c1]"
      : "border-[#b99b65] bg-[#171411] text-[#f1ddb4]";
  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[100] w-full max-w-sm">
      <div
        className={`pointer-events-auto rounded-2xl border px-5 py-4 text-sm font-medium shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur ${tone}`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
              notice.type === "error" ? "bg-rose-400" : "bg-[#e8d6b2]"
            }`}
          />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] opacity-80">
              {notice.type === "error" ? "Error" : "Success"}
            </p>
            <p className="mt-1 text-base leading-6">{notice.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Card({ title, subtitle, children }) {
  return (
    <section className="dashboard-reveal rounded-[1.4rem] border border-[#d8c39c]/14 bg-[linear-gradient(180deg,#0d0b0a_0%,#17120e_100%)] p-5 text-white shadow-[0_18px_54px_rgba(0,0,0,0.22)] backdrop-blur">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a8054]">{title}</p>
        <p className="mt-2 text-sm leading-6 text-[#d7c8af]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export function Field({ label, type = "text", value, onChange, placeholder = "" }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#e8d6b2]">{label}</span>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-2xl border border-[#d8c39c]/18 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-[#9f8f77] transition-all duration-300 focus:border-[#b99b65] focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(185,155,101,0.15)] ${
            type === "date" ? "[color-scheme:light]" : ""
          } ${isPassword ? "pr-12" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-4 flex items-center justify-center text-[#9f8f77] hover:text-[#e8d6b2] transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {!showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </label>
  );
}

export function TextArea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#e8d6b2]">{label}</span>
      <textarea value={value} onChange={onChange} rows={4} className="w-full rounded-2xl border border-[#d8c39c]/18 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-[#8c6b2f]" />
    </label>
  );
}

export function SelectField({ label, value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption?.label || placeholder || "Select an option";

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (nextValue) => {
    onChange({ target: { value: nextValue } });
    setIsOpen(false);
  };

  return (
    <label ref={containerRef} className="block">
      <span className="mb-2 block text-sm font-medium text-[#e8d6b2]">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left outline-none transition ${
            isOpen
              ? "border-[#b99b65] bg-white/[0.06] shadow-[0_0_0_1px_rgba(185,155,101,0.18)]"
              : "border-[#d8c39c]/18 bg-white/[0.04]"
          }`}
        >
          <span className={selectedOption ? "text-white" : "text-[#9f8f77]"}>{displayText}</span>
          <DropdownChevron open={isOpen} />
        </button>

        {isOpen ? (
          <div className="relative z-30 mt-3 overflow-hidden rounded-[1.4rem] border border-[#d8c39c]/16 bg-[linear-gradient(180deg,#100d0a_0%,#17120e_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="max-h-64 overflow-y-auto p-2">
              {placeholder ? (
                <button
                  type="button"
                  onClick={() => handleSelect("")}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition ${
                    value === ""
                      ? "bg-[#f1ddb4]/10 text-[#f7e7c5]"
                      : "text-[#9f8f77] hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span>{placeholder}</span>
                  <SelectionCheck selected={value === ""} />
                </button>
              ) : null}

              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition ${
                      isSelected
                        ? "bg-[#f1ddb4]/10 text-[#f7e7c5]"
                        : "text-[#d7c8af] hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span>{option.label}</span>
                    <SelectionCheck selected={isSelected} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </label>
  );
}

export function StatusPill({ text }) {
  const value = String(text).toLowerCase();
  const styles = {
    planning: "bg-slate-200 text-slate-700",
    active: "bg-emerald-100 text-emerald-800",
    completed: "bg-indigo-100 text-indigo-800",
    todo: "bg-amber-100 text-amber-800",
    "in-progress": "bg-sky-100 text-sky-800",
    done: "bg-emerald-100 text-emerald-800",
    inactive: "bg-rose-100 text-rose-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[value] || styles.planning}`}>{value.replace("-", " ")}</span>;
}

export function MiniButton({ text, onClick, tone, disabled = false }) {
  const styles = {
    dark: "bg-[#111111] text-[#e8d6b2]",
    light: "border border-[#d7c39c] bg-[#f5ead3] text-[#433521]",
    danger: "bg-[#7f1d1d] text-[#f9e4c0]",
  };
  return <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex min-h-10 min-w-[5rem] items-center justify-center rounded-xl px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${styles[tone]}`}>{text}</button>;
}

export function Tag({ text }) {
  return <span className="rounded-full bg-[#111111] px-3 py-1 text-xs font-medium text-[#e8d6b2]">{text}</span>;
}

export function MetricBox({ label, value }) {
  return <div className="rounded-[1.5rem] bg-[#f5ead3] px-4 py-5"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a8054]">{label}</p><p className="mt-3 text-3xl font-semibold text-[#171411]">{value}</p></div>;
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.04] px-5 py-8 text-center">
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export function MultiSelect({ options, selectedValues, onToggle, label = "Select items" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));
  const selectedText = selectedOptions.length
    ? selectedOptions.map((option) => option.label).join(", ")
    : "Select members";

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-2 block text-sm font-medium text-[#e8d6b2]">{label}</span>
      {options.length ? (
        <>
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left outline-none transition ${
              isOpen
                ? "border-[#b99b65] bg-white/[0.06] shadow-[0_0_0_1px_rgba(185,155,101,0.18)]"
                : "border-[#d8c39c]/18 bg-white/[0.04]"
            }`}
          >
            <span className={selectedOptions.length ? "text-white" : "text-[#9f8f77]"}>
              {selectedText}
            </span>
            <DropdownChevron open={isOpen} />
          </button>

          {isOpen ? (
            <div className="relative z-30 mt-3 overflow-hidden rounded-[1.4rem] border border-[#d8c39c]/16 bg-[linear-gradient(180deg,#100d0a_0%,#17120e_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="max-h-64 overflow-y-auto p-2">
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onToggle(option.value)}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition ${
                        isSelected
                          ? "bg-[#f1ddb4]/10 text-[#f7e7c5]"
                          : "text-[#d7c8af] hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <span>{option.label}</span>
                      <SelectionCheck selected={isSelected} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {selectedOptions.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onToggle(option.value)}
                  className="rounded-full border border-[#d8c39c]/12 bg-[linear-gradient(180deg,#100d0a_0%,#17120e_100%)] px-3 py-1.5 text-xs font-medium text-[#e8d6b2] shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition hover:border-[#b99b65]/30 hover:text-[#f4e5c2]"
                >
                  {option.label} x
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#9f8f77]">No members selected yet.</p>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d8c39c]/18 bg-white/[0.03] px-4 py-4 text-sm text-[#bfae90]">
          No members available yet. Register a `Team Member` user first, then refresh this dashboard.
        </div>
      )}
    </div>
  );
}

export function PublicNavButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={() => goTo("/register")} className="rounded-full bg-[#f1ddb4] px-5 py-3 text-sm font-semibold text-[#1b140d] shadow-[0_12px_30px_rgba(232,214,178,0.14)]">New user registration</button>
      <button type="button" onClick={() => goTo("/login")} className="rounded-full border border-[#d8c39c]/18 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-[#f1ddb4]">Login with existing user</button>
    </div>
  );
}
