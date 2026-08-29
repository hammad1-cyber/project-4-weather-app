import React from 'react';
import { useWeather } from './hooks/useWeather.js';
import SearchBar from './components/SearchBar.jsx';
import RecentSearches from './components/RecentSearches.jsx';
import CurrentConditions from './components/CurrentConditions.jsx';
import HourlyStrip from './components/HourlyStrip.jsx';
import DailyForecast from './components/DailyForecast.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';
import ErrorState from './components/ErrorState.jsx';

export default function App() {
  const {
    unit, changeUnit,
    location, data, status, error,
    selectLocation, retry,
    recents, geoStatus, useMyLocation,
  } = useWeather();

  return (
    <div className="app">
      <header className="app-header">
        <div className="wrap header-row">
          <div className="wordmark-lockup">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <path d="M2 15 Q7 10 13 15 T24 15" stroke="var(--amber)" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M2 19 Q7 14 13 19 T24 19" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
            </svg>
            <span className="wordmark">Isobar</span>
          </div>

          <SearchBar onSelect={selectLocation} onUseLocation={useMyLocation} geoStatus={geoStatus} />

          <div className="unit-toggle" role="group" aria-label="Temperature unit">
            <button className={unit === 'celsius' ? 'active' : ''} onClick={() => changeUnit('celsius')}>&deg;C</button>
            <button className={unit === 'fahrenheit' ? 'active' : ''} onClick={() => changeUnit('fahrenheit')}>&deg;F</button>
          </div>
        </div>
        <div className="wrap">
          <RecentSearches recents={recents} onSelect={selectLocation} currentName={location?.name} />
        </div>
      </header>

      <main className="wrap app-main">
        {status === 'loading' && !data && <LoadingSkeleton />}

        {status === 'error' && (
          <ErrorState message={error?.message} onRetry={retry} />
        )}

        {data && location && status !== 'error' && (
          <>
            <CurrentConditions location={location} data={data} unit={unit} />
            <div className="isobar-divider">
              <svg viewBox="0 0 800 24" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 12 Q50 2 100 12 T200 12 T300 12 T400 12 T500 12 T600 12 T700 12 T800 12" />
              </svg>
            </div>
            <div className="forecast-grid">
              <HourlyStrip data={data} unit={unit} />
              <DailyForecast data={data} unit={unit} />
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="wrap footer-row mono">
          <span>Weather data by Open-Meteo.com</span>
          <span>Isobar &mdash; a weather instrument, not a forecast promise</span>
        </div>
      </footer>
    </div>
  );
}
