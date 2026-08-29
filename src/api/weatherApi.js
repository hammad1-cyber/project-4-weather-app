// ===========================================================
// Real API integration — Open-Meteo (open-meteo.com).
// Free, no API key required, plain HTTP GET + JSON. Two
// endpoints: geocoding (turn a city name into coordinates)
// and forecast (turn coordinates into weather data).
// ===========================================================

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

class WeatherApiError extends Error {
  constructor(message, kind = 'unknown') {
    super(message);
    this.kind = kind; // 'network' | 'not-found' | 'api' | 'unknown'
  }
}

/** Search for cities by name. Returns [] if nothing matches. */
export async function searchCities(query, { signal } = {}) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  let res;
  try {
    res = await fetch(url, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new WeatherApiError('Could not reach the location search service. Check your connection.', 'network');
  }
  if (!res.ok) {
    throw new WeatherApiError(`Location search failed (HTTP ${res.status}).`, 'api');
  }
  const data = await res.json();
  return (data.results || []).map(r => ({
    id: r.id,
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    countryCode: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}

/** Fetch current conditions + hourly (24h) + daily (7d) forecast for a coordinate. */
export async function getForecast({ latitude, longitude, unit = 'celsius', windUnit = 'kmh' }, { signal } = {}) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: [
      'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
      'is_day', 'weather_code', 'wind_speed_10m', 'wind_direction_10m',
      'pressure_msl', 'uv_index',
    ].join(','),
    hourly: ['temperature_2m', 'weather_code', 'precipitation_probability'].join(','),
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min',
      'precipitation_probability_max', 'uv_index_max', 'sunrise', 'sunset',
    ].join(','),
    temperature_unit: unit,
    wind_speed_unit: windUnit,
    timezone: 'auto',
    forecast_days: '7',
  });

  let res;
  try {
    res = await fetch(`${FORECAST_URL}?${params.toString()}`, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new WeatherApiError('Could not reach the weather service. Check your connection and try again.', 'network');
  }

  if (!res.ok) {
    let reason = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.reason) reason = body.reason;
    } catch { /* ignore parse failure, keep generic reason */ }
    throw new WeatherApiError(`Weather service error: ${reason}`, 'api');
  }

  return res.json();
}

export { WeatherApiError };

// ---------- WMO weather code interpretation ----------
// Open-Meteo returns a numeric WMO weather code; this maps it to
// a human label and one of our line-icon variants.

const WMO_MAP = {
  0: ['Clear sky', 'clear'],
  1: ['Mostly clear', 'clear'],
  2: ['Partly cloudy', 'partly-cloudy'],
  3: ['Overcast', 'cloudy'],
  45: ['Fog', 'fog'],
  48: ['Depositing rime fog', 'fog'],
  51: ['Light drizzle', 'drizzle'],
  53: ['Drizzle', 'drizzle'],
  55: ['Dense drizzle', 'drizzle'],
  56: ['Light freezing drizzle', 'drizzle'],
  57: ['Freezing drizzle', 'drizzle'],
  61: ['Slight rain', 'rain'],
  63: ['Rain', 'rain'],
  65: ['Heavy rain', 'rain'],
  66: ['Light freezing rain', 'rain'],
  67: ['Freezing rain', 'rain'],
  71: ['Slight snow', 'snow'],
  73: ['Snow', 'snow'],
  75: ['Heavy snow', 'snow'],
  77: ['Snow grains', 'snow'],
  80: ['Light rain showers', 'rain'],
  81: ['Rain showers', 'rain'],
  82: ['Violent rain showers', 'rain'],
  85: ['Slight snow showers', 'snow'],
  86: ['Heavy snow showers', 'snow'],
  95: ['Thunderstorm', 'storm'],
  96: ['Thunderstorm, slight hail', 'storm'],
  99: ['Thunderstorm, heavy hail', 'storm'],
};

export function describeWeatherCode(code, isDay = 1) {
  const [label, icon] = WMO_MAP[code] || ['Unknown', 'cloudy'];
  if ((icon === 'clear' || icon === 'partly-cloudy') && !isDay) {
    return { label, icon: icon === 'clear' ? 'clear-night' : 'partly-cloudy-night' };
  }
  return { label, icon };
}

export function windDirectionLabel(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}
