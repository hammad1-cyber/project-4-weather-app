import { useState, useEffect, useCallback, useRef } from 'react';
import { getForecast, WeatherApiError } from '../api/weatherApi.js';

const RECENTS_KEY = 'isobar-recent-cities-v1';
const UNIT_KEY = 'isobar-unit-v1';
const DEFAULT_CITY = { name: 'London', admin1: '', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 };

function loadRecents() {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function useWeather() {
  const [unit, setUnit] = useState(() => {
    try { return localStorage.getItem(UNIT_KEY) || 'celsius'; } catch { return 'celsius'; }
  });
  const [location, setLocation] = useState(null); // { name, admin1, country, latitude, longitude }
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [recents, setRecents] = useState(loadRecents);
  const [geoStatus, setGeoStatus] = useState('idle'); // idle | locating | error

  const abortRef = useRef(null);

  const fetchForecast = useCallback(async (loc, unitOverride) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setError(null);
    try {
      const windUnit = (unitOverride || unit) === 'fahrenheit' ? 'mph' : 'kmh';
      const result = await getForecast(
        { latitude: loc.latitude, longitude: loc.longitude, unit: unitOverride || unit, windUnit },
        { signal: controller.signal }
      );
      setData(result);
      setStatus('success');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setStatus('error');
      setError(err instanceof WeatherApiError ? err : new WeatherApiError('Something went wrong fetching the forecast.'));
    }
  }, [unit]);

  const selectLocation = useCallback((loc, opts = {}) => {
    setLocation(loc);
    fetchForecast(loc);
    if (!opts.skipRecents) {
      setRecents(prev => {
        const next = [loc, ...prev.filter(r => `${r.latitude},${r.longitude}` !== `${loc.latitude},${loc.longitude}`)].slice(0, 6);
        try { localStorage.setItem(RECENTS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    }
  }, [fetchForecast]);

  const retry = useCallback(() => {
    if (location) fetchForecast(location);
  }, [location, fetchForecast]);

  const changeUnit = useCallback((nextUnit) => {
    setUnit(nextUnit);
    try { localStorage.setItem(UNIT_KEY, nextUnit); } catch { /* ignore */ }
    if (location) fetchForecast(location, nextUnit);
  }, [location, fetchForecast]);

  const useMyLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('error');
      return;
    }
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoStatus('idle');
        selectLocation({
          name: 'Current location',
          admin1: '', country: '',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }, { skipRecents: true });
      },
      () => setGeoStatus('error'),
      { timeout: 8000 }
    );
  }, [selectLocation]);

  // initial load: try geolocation silently, fall back to a default city
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      selectLocation(DEFAULT_CITY, { skipRecents: true });
      return;
    }
    let settled = false;
    const fallback = setTimeout(() => {
      if (!settled) { settled = true; selectLocation(DEFAULT_CITY, { skipRecents: true }); }
    }, 2500);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (settled) return;
        settled = true;
        clearTimeout(fallback);
        selectLocation({ name: 'Current location', admin1: '', country: '', latitude: pos.coords.latitude, longitude: pos.coords.longitude }, { skipRecents: true });
      },
      () => {
        if (settled) return;
        settled = true;
        clearTimeout(fallback);
        selectLocation(DEFAULT_CITY, { skipRecents: true });
      },
      { timeout: 2500 }
    );
    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    unit, changeUnit,
    location, data, status, error,
    selectLocation, retry,
    recents, geoStatus, useMyLocation,
  };
}
