# ⛅ SkyCast – Weather Forecast App

A responsive weather application built with **React** and **Node.js/Express**. The backend works as a secure proxy to the **OpenWeatherMap API**, so the API key is never exposed to the browser.

## ✨ Features
- Current weather and 5-day forecast for any city
- Next 24 hours forecast with chance of rain
- "My location" button using browser geolocation
- °C / °F unit toggle
- Recent searches saved for quick access
- Detail tiles: feels like, humidity, wind, pressure, visibility, sunrise and sunset
- Weather-based hero card colours (clear, clouds, rain, storm, snow), darker at night
- Light / Dark mode and 4 colour palettes (Indigo, Ocean, Emerald, Sunset)
- Error handling for invalid city, invalid API key and service downtime, with last result kept as fallback
- 10-minute server-side caching
- Fully responsive (mobile, tablet, desktop)

## 🛠 Tech Stack
React (Vite), Node.js, Express.js, OpenWeatherMap API, CSS variables for theming

## 🔌 API
`GET /api/weather?city=London`
`GET /api/weather?lat=20.29&lon=85.84`

## 🚀 Run Locally
1. Install Node.js 18 or newer.
2. Get a free API key from https://openweathermap.org/api
3. Open a terminal inside the project folder, then:
```
cp server/.env.example server/.env
```
(on Windows, copy the file `.env.example` and rename the copy to `.env`)
4. Put your key in `server/.env`:
```
OPENWEATHER_API_KEY=your_key_here
```
5. Install and start:
```
npm run install-all
npm run dev:server
npm run dev:client
```
(run the last two in separate terminals)
6. Open http://localhost:5173

## 🌐 Deployment
Build: `npm run install-all && npm run build`
Start: `NODE_ENV=production npm start`
Set the environment variable `OPENWEATHER_API_KEY` on the hosting platform (Render, Railway, etc.).

## 👤 Author
Your Name
