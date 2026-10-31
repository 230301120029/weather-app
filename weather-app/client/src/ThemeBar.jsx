import { ACCENTS } from "./useTheme";
const C = { indigo: "#6366f1,#a855f7", ocean: "#0ea5e9,#22d3ee", emerald: "#10b981,#84cc16", sunset: "#f97316,#ec4899" };
export default function ThemeBar({ t }) {
  return (
    <div className="tools">
      <div className="dots">
        {ACCENTS.map((a) => (
          <button key={a} title={a} className={"dot" + (t.accent === a ? " on" : "")}
            style={{ background: `linear-gradient(135deg,${C[a]})` }} onClick={() => t.setAccent(a)} />
        ))}
      </div>
      <button className="ghost" onClick={t.toggle}>{t.theme === "dark" ? "☀️ Light" : "🌙 Dark"}</button>
    </div>
  );
}
