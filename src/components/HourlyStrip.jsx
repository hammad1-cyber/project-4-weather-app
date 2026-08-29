import React from 'react';
import WeatherIcon from './WeatherIcon.jsx';
import { describeWeatherCode } from '../api/weatherApi.js';

export default function HourlyStrip({ data, unit }) {
  const unitSymbol = unit === 'fahrenheit' ? '\u00b0' : '\u00b0';
  const hourly = data.hourly;
  const nowIso = data.current.time;
  let startIdx = hourly.time.findIndex(t => t === nowIso);
  if (startIdx === -1) startIdx = 0;
  const slice = Array.from({ length: 24 }, (_, i) => startIdx + i).filter(i => i < hourly.time.length);

  return (
    <section className="panel hourly-panel">
      <div className="panel-head">
        <h2>Next 24 hours</h2>
      </div>
      <div className="hourly-scroll">
        {slice.map(i => {
          const time = new Date(hourly.time[i]);
          const { icon } = describeWeatherCode(hourly.weather_code[i], 1);
          return (
            <div className="hourly-item" key={hourly.time[i]}>
              <span className="mono hourly-time">{time.toLocaleTimeString(undefined, { hour: 'numeric' })}</span>
              <WeatherIcon variant={icon} size={22} />
              <span className="hourly-temp mono">{Math.round(hourly.temperature_2m[i])}{unitSymbol}</span>
              <span className="hourly-precip mono">{hourly.precipitation_probability[i]}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
