import React from 'react';
import { Droplets, Wind, Sun, Gauge } from 'lucide-react';
import WeatherIcon from './WeatherIcon.jsx';
import StatDial from './StatDial.jsx';
import { describeWeatherCode, windDirectionLabel } from '../api/weatherApi.js';

const UV_MAX = 11; // WHO reference scale for UV index

export default function CurrentConditions({ location, data, unit }) {
  const cur = data.current;
  const daily = data.daily;
  const { label, icon } = describeWeatherCode(cur.weather_code, cur.is_day);
  const unitSymbol = unit === 'fahrenheit' ? '\u00b0F' : '\u00b0C';
  const windUnitLabel = unit === 'fahrenheit' ? 'mph' : 'km/h';

  const cityLine = [location.admin1, location.country].filter(Boolean).join(', ');
  const now = new Date();
  const dateLabel = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <section className={`hero-conditions ${icon.includes('night') ? 'is-night' : 'is-day'}`}>
      <div className="hero-conditions-top">
        <div>
          <h1>{location.name}</h1>
          {cityLine && <span className="hero-region">{cityLine}</span>}
        </div>
        <span className="mono hero-date">{dateLabel}</span>
      </div>

      <div className="hero-main">
        <WeatherIcon variant={icon} size={72} />
        <div className="hero-temp-block">
          <span className="hero-temp">{Math.round(cur.temperature_2m)}<span className="hero-temp-unit">{unitSymbol}</span></span>
          <span className="hero-condition">{label}</span>
          <span className="hero-feels mono">Feels like {Math.round(cur.apparent_temperature)}{unitSymbol}</span>
        </div>
        <div className="hero-hilo mono">
          <span>H {Math.round(daily.temperature_2m_max[0])}{unitSymbol}</span>
          <span>L {Math.round(daily.temperature_2m_min[0])}{unitSymbol}</span>
        </div>
      </div>

      <div className="stat-dial-row">
        <StatDial label="Humidity" value={cur.relative_humidity_2m} unit="%" pct={cur.relative_humidity_2m} icon={Droplets} />
        <StatDial
          label={`Wind ${windDirectionLabel(cur.wind_direction_10m)}`}
          value={Math.round(cur.wind_speed_10m)}
          unit={windUnitLabel}
          pct={Math.min(100, (cur.wind_speed_10m / (unit === 'fahrenheit' ? 40 : 60)) * 100)}
          icon={Wind}
        />
        <StatDial label="UV index" value={Math.round(cur.uv_index)} unit="" pct={(cur.uv_index / UV_MAX) * 100} icon={Sun} />
        <StatDial label="Pressure" value={Math.round(cur.pressure_msl)} unit="hPa" pct={((cur.pressure_msl - 970) / (1050 - 970)) * 100} icon={Gauge} />
      </div>
    </section>
  );
}
