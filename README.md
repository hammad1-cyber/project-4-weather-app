# Isobar — Weather

A weather application built with React, calling a real, live weather API
(no mock data). Search any city worldwide, see current conditions, an
hourly outlook, and a 7-day forecast, with real loading and error states.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`). On first
load, the app will ask for your location; allow it for local weather, or
deny it and it falls back to London automatically.

## The API

This uses [Open-Meteo](https://open-meteo.com) — a free weather API that
requires **no API key and no signup**, which is why the app works the
moment you run it. Two endpoints are used:

- `geocoding-api.open-meteo.com/v1/search` — turns a typed city name into
  coordinates, called live as you type in the search box (debounced).
- `api.open-meteo.com/v1/forecast` — turns coordinates into current
  conditions plus hourly and 7-day forecasts.

Both are called directly from the browser in `src/api/weatherApi.js` —
open that file to see the actual `fetch()` calls, request parameters, and
how HTTP and network errors are turned into a typed `WeatherApiError`.

## What's inside

- **Search city** — live autocomplete against the real geocoding API as
  you type, with its own loading and "no results" states.
- **Current temperature & conditions** — large hero display with a
  custom line-icon set (no emoji, no stock icon pack) mapped from the
  API's WMO weather codes.
- **Forecast** — next 24 hours (horizontal scroll) and a 7-day outlook
  with min/max range bars.
- **°C / °F toggle** — re-fetches from the API in the selected unit.
- **"Use my location"** — real `navigator.geolocation` integration with
  its own error state if permission is denied.
- **Recent searches** — persisted to `localStorage`.
- **Loading state** — a shimmering skeleton shown while a request is in
  flight, not a blank screen or spinner-only.
- **Error handling** — network failures, HTTP errors, and "no cities
  found" are all handled distinctly with a retry action, not just a
  console error.
- Fully responsive.

## Project structure

```
src/
  api/weatherApi.js       real fetch() calls to Open-Meteo + WMO code mapping
  hooks/useWeather.js      location, forecast, loading/error, recents, geolocation
  hooks/useDebouncedValue.js
  components/              SearchBar, CurrentConditions, HourlyStrip,
                           DailyForecast, StatDial, WeatherIcon,
                           LoadingSkeleton, ErrorState, RecentSearches
  index.css                the instrument-panel design system
```

## Notes for production use

- Open-Meteo's free tier is generous but rate-limited per IP; for a
  high-traffic production app, consider proxying requests through your
  own backend and adding a cache layer.
- No API key is used or needed for this integration, so there's nothing
  to rotate or keep secret — but if you swap in a different weather
  provider that requires a key, don't put it directly in frontend code;
  proxy it through a backend route instead.
