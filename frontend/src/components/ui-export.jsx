export { Card, Field, SelectField, PublicNavButtons } from "./ui";

export function FeatureTag({ title, text }) {
  return <div className="rounded-[1.5rem] border border-white/15 bg-white/8 px-4 py-4"><p className="font-semibold text-white">{title}</p><p className="mt-1 text-sm text-white/80">{text}</p></div>;
}
