# Weather Forecast App

React frontend + Node/Express backend that proxies the OpenWeatherMap API.

## Features
- Current weather and 5-day forecast for any city
- Backend proxy: the API key stays on the server (`.env`)
- Error handling (city not found, bad key, service down) with the last successful result kept as fallback
- 10-minute in-memory cache to reduce API calls
- Responsive UI

## Setup
1. Get a free key at https://openweathermap.org/api (new keys can take a few hours to activate).
2. `cp server/.env.example server/.env` and paste your key.
3. `npm run install-all`
4. Run in two terminals: `npm run dev:server` and `npm run dev:client`, then open http://localhost:5173

## API
`GET /api/weather?city=London` returns current weather and forecast JSON.

## Deployment (Render / Railway)
- Build command: `npm run install-all && npm run build`
- Start command: `NODE_ENV=production npm start`
- Add env var `OPENWEATHER_API_KEY` in the dashboard. Express serves the built React app in production.

## Tech
React (Vite), Node.js, Express, OpenWeatherMap API

## v2 Features
Light/Dark mode, 4 colour palettes, glass-style UI, °C/°F toggle, geolocation ("My location"), recent-search chips, weather-based hero gradients (day/night aware), hourly forecast, detail tiles (pressure, visibility, sunrise/sunset), skeleton loading, fully responsive.
