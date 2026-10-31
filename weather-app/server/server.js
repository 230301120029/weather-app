require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());

const BASE = "https://api.openweathermap.org/data/2.5";
const cache = new Map();
const TTL = 10 * 60 * 1000;

// Backend proxy: API key never reaches the browser. Supports city name or lat/lon.
app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  const city = (req.query.city || "").trim();
  let q;
  if (lat && lon && isFinite(lat) && isFinite(lon)) q = `lat=${+lat}&lon=${+lon}`;
  else if (city && city.length <= 60) q = `q=${encodeURIComponent(city)}`;
  else return res.status(400).json({ message: "Please provide a valid city name." });

  const key = q.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.time < TTL) return res.json({ ...hit.data, cached: true });
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return res.status(500).json({ message: "Server is missing the API key." });

  try {
    const u = `${q}&units=metric&appid=${apiKey}`;
    const [a, b] = await Promise.all([fetch(`${BASE}/weather?${u}`), fetch(`${BASE}/forecast?${u}`)]);
    if (a.status === 404) return res.status(404).json({ message: `City "${city}" not found.` });
    if (a.status === 401) return res.status(502).json({ message: "Weather API key is invalid or not active yet." });
    if (!a.ok || !b.ok) return res.status(502).json({ message: "Weather service unavailable. Try again later." });
    const c = await a.json();
    const f = await b.json();
    const data = {
      city: c.name, country: c.sys.country,
      temp: Math.round(c.main.temp), feelsLike: Math.round(c.main.feels_like),
      humidity: c.main.humidity, pressure: c.main.pressure, wind: c.wind.speed,
      visibility: Math.round((c.visibility || 0) / 1000),
      sunrise: c.sys.sunrise, sunset: c.sys.sunset, timezone: c.timezone,
      main: c.weather[0].main, description: c.weather[0].description, icon: c.weather[0].icon,
      hourly: f.list.slice(0, 8).map((i) => ({ dt: i.dt, temp: Math.round(i.main.temp), icon: i.weather[0].icon, pop: Math.round((i.pop || 0) * 100) })),
      forecast: f.list.filter((i) => i.dt_txt.includes("12:00:00")).map((i) => ({
        date: i.dt_txt.split(" ")[0], temp: Math.round(i.main.temp), description: i.weather[0].description, icon: i.weather[0].icon,
      })),
    };
    cache.set(key, { data, time: Date.now() });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not reach the weather service." });
  }
});

if (process.env.NODE_ENV === "production") {
  const dist = path.join(__dirname, "../client/dist");
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
