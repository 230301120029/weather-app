import { useState, useEffect } from "react";
import useTheme from "./useTheme";
import ThemeBar from "./ThemeBar";

const icon = (c) => `https://openweathermap.org/img/wn/${c}@2x.png`;
const SKY = { Clear: "sky-clear", Clouds: "sky-clouds", Rain: "sky-rain", Drizzle: "sky-rain", Thunderstorm: "sky-storm", Snow: "sky-snow" };
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export default function App() {
  const theme = useTheme();
  const [city, setCity] = useState("");
  const [data, setData] = useState(read("last"));
  const [recent, setRecent] = useState(read("recent") || []);
  const [unit, setUnit] = useState(read("unit") || "C");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const T = (v) => (unit === "C" ? `${v}°C` : `${Math.round((v * 9) / 5 + 32)}°F`);
  const clock = (u, tz) => new Date((u + tz) * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

  async function fetchWeather(qs) {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/weather?" + qs);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Something went wrong");
      setData(json); save("last", json);
      const rec = [json.city, ...recent.filter((c) => c !== json.city)].slice(0, 5);
      setRecent(rec); save("recent", rec);
    } catch (e) {
      setErr(e.message === "Failed to fetch" ? "Cannot reach server. Showing last result." : e.message);
    } finally { setBusy(false); }
  }
  const search = (e, c = city) => {
    e?.preventDefault();
    c.trim() ? fetchWeather("city=" + encodeURIComponent(c.trim())) : setErr("Enter a city name.");
  };
  const locate = () =>
    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition((p) => fetchWeather(`lat=${p.coords.latitude}&lon=${p.coords.longitude}`), () => setErr("Location permission denied."))
      : setErr("Geolocation not supported.");
  const flip = () => { const u = unit === "C" ? "F" : "C"; setUnit(u); save("unit", u); };

  useEffect(() => { if (recent[0] && !data) fetchWeather("city=" + encodeURIComponent(recent[0])); }, []);

  const tiles = data && [
    ["🌡️ Feels like", T(data.feelsLike)], ["💧 Humidity", data.humidity + "%"], ["💨 Wind", data.wind + " m/s"],
    ["🧭 Pressure", data.pressure + " hPa"], ["👁️ Visibility", data.visibility + " km"],
    ["🌅 Sunrise", clock(data.sunrise, data.timezone)], ["🌇 Sunset", clock(data.sunset, data.timezone)],
  ];

  return (
    <main className="wrap">
      <header className="bar"><h1 className="logo">⛅ SkyCast</h1><ThemeBar t={theme} /></header>
      <form className="search" onSubmit={search}>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Search city, e.g. Bhubaneswar" />
        <button disabled={busy}>{busy ? "Loading..." : "Search"}</button>
        <button type="button" className="ghost" onClick={locate}>📍 My location</button>
        <button type="button" className="ghost" onClick={flip}>°{unit === "C" ? "F" : "C"}</button>
      </form>
      {recent.length > 0 && (
        <div className="chips">{recent.map((c) => <button key={c} className="ghost chip" onClick={() => { setCity(c); search(null, c); }}>🕘 {c}</button>)}</div>
      )}
      {err && <p className="err">{err}</p>}
      {data && (
        <div className={busy ? "skel" : ""}>
          <section className={`hero ${SKY[data.main] || ""} ${data.icon.endsWith("n") ? "night" : ""}`}>
            <img src={icon(data.icon)} alt={data.description} />
            <div>
              <h2>{data.city}, {data.country}</h2>
              <div className="big">{T(data.temp)}</div>
              <p className="cap">{data.description}</p>
            </div>
          </section>
          <section className="tiles">{tiles.map(([l, v]) => <div className="glass tile" key={l}><small>{l}</small><b>{v}</b></div>)}</section>
          <h3 className="sec">Next 24 hours</h3>
          <section className="hourly">
            {data.hourly.map((h) => (
              <div className="glass hr" key={h.dt}>
                <small className="muted">{clock(h.dt, data.timezone)}</small><img src={icon(h.icon)} alt="" />
                <b>{T(h.temp)}</b><small className="muted">☔ {h.pop}%</small>
              </div>
            ))}
          </section>
          <h3 className="sec">5-day forecast</h3>
          <section className="days">
            {data.forecast.map((f) => (
              <div className="glass day" key={f.date}>
                <strong>{new Date(f.date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</strong>
                <img src={icon(f.icon)} alt="" /><div><b>{T(f.temp)}</b></div><small className="muted cap">{f.description}</small>
              </div>
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
