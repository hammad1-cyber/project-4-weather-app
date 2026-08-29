import React, { useMemo } from 'react';
import WeatherIcon from './WeatherIcon.jsx';
import { describeWeatherCode } from '../api/weatherApi.js';

export default function DailyForecast({ data, unit }) {
  const daily = data.daily;
  const unitSymbol = unit === 'fahrenheit' ? '\u00b0' : '\u00b0';

  const { weekMin, weekMax } = useMemo(() => ({
    weekMin: Math.min(...daily.temperature_2m_min),
    weekMax: Math.max(...daily.temperature_2m_max),
  }), [daily]);
  const span = Math.max(1, weekMax - weekMin);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>7-day forecast</h2>
      </div>
      <div className="daily-list">
        {daily.time.map((dateStr, i) => {
          const date = new Date(dateStr + 'T00:00:00');
          const isToday = i === 0;
          const { label, icon } = describeWeatherCode(daily.weather_code[i], 1);
          const min = daily.temperature_2m_min[i];
          const max = daily.temperature_2m_max[i];
          const barLeft = ((min - weekMin) / span) * 100;
          const barWidth = ((max - min) / span) * 100;

          return (
            <div className="daily-row" key={dateStr}>
              <span className="daily-day">{isToday ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' })}</span>
              <WeatherIcon variant={icon} size={22} />
              <span className="daily-label">{label}</span>
              <span className="mono daily-precip">{daily.precipitation_probability_max[i]}%</span>
              <div className="daily-range">
                <span className="mono daily-range-min">{Math.round(min)}{unitSymbol}</span>
                <div className="daily-range-track">
                  <div className="daily-range-fill" style={{ left: `${barLeft}%`, width: `${barWidth}%` }} />
                </div>
                <span className="mono daily-range-max">{Math.round(max)}{unitSymbol}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
