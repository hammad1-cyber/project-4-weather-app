import React from 'react';

const ICONS = {
  'clear': (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </>
  ),
  'clear-night': (
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" />
  ),
  'partly-cloudy': (
    <>
      <circle cx="8" cy="9" r="3.4" />
      <path d="M8 3.5v1.6M3.2 9h1.6M12.4 5.8l-1.1 1.1M3.7 5.8l1.1 1.1" />
      <path d="M8.5 19h8.7a3.6 3.6 0 0 0 .5-7.2 5 5 0 0 0-9.4-1.7 4.2 4.2 0 0 0-3.8 4.2 4.7 4.7 0 0 0 4 4.7Z" />
    </>
  ),
  'partly-cloudy-night': (
    <>
      <path d="M9.5 8.6a4.9 4.9 0 0 1 4.5-4 3.9 3.9 0 0 0 5 5.3 4.9 4.9 0 0 1-5.7 4.3" />
      <path d="M8.5 19h8.7a3.6 3.6 0 0 0 .5-7.2 5 5 0 0 0-9.4-1.7 4.2 4.2 0 0 0-3.8 4.2 4.7 4.7 0 0 0 4 4.7Z" />
    </>
  ),
  'cloudy': (
    <>
      <path d="M6.5 18h11.2a3.8 3.8 0 0 0 .5-7.6 5.6 5.6 0 0 0-10.7-1.7A4.6 4.6 0 0 0 3 13.2 4.9 4.9 0 0 0 6.5 18Z" />
      <path d="M2.5 14.2h1.6M20 8.6h1.6M17 5.2h1.4" opacity="0.6" />
    </>
  ),
  'fog': (
    <>
      <path d="M6.5 12.5h11.2a3.8 3.8 0 0 0 .5-7.6 5.6 5.6 0 0 0-10.7-1.4" />
      <path d="M3 16h18M3 19.5h18M6 12.9h.01" />
    </>
  ),
  'drizzle': (
    <>
      <path d="M6.5 13h11.2a3.8 3.8 0 0 0 .5-7.6A5.6 5.6 0 0 0 7.5 4.7 4.6 4.6 0 0 0 3 8.2 4.9 4.9 0 0 0 6.5 13Z" />
      <path d="M8 17.5v2M12 17.5v2M16 17.5v2" strokeLinecap="round" />
    </>
  ),
  'rain': (
    <>
      <path d="M6.5 12h11.2a3.8 3.8 0 0 0 .5-7.6A5.6 5.6 0 0 0 7.5 3.7 4.6 4.6 0 0 0 3 7.2 4.9 4.9 0 0 0 6.5 12Z" />
      <path d="M7.5 16.5 6 20M12 16.5 10.5 20M16.5 16.5 15 20" strokeLinecap="round" />
    </>
  ),
  'snow': (
    <>
      <path d="M6.5 11h11.2a3.8 3.8 0 0 0 .5-7.6A5.6 5.6 0 0 0 7.5 2.7 4.6 4.6 0 0 0 3 6.2 4.9 4.9 0 0 0 6.5 11Z" />
      <g strokeLinecap="round">
        <path d="M8 15.5v5M6 17l4 2M10 17l-4 2" />
        <path d="M16 15.5v5M14 17l4 2M18 17l-4 2" />
      </g>
    </>
  ),
  'storm': (
    <>
      <path d="M6.5 11h9.7a3.8 3.8 0 0 0 .5-7.6A5.6 5.6 0 0 0 6.2 4.6 4.6 4.6 0 0 0 3 8.1 4.9 4.9 0 0 0 6.5 11Z" />
      <path d="M13 13.5 9.5 18h3l-1.5 4.5 5-6h-3.2Z" strokeLinejoin="round" />
    </>
  ),
};

export default function WeatherIcon({ variant = 'clear', size = 28, className = '' }) {
  const content = ICONS[variant] || ICONS.clear;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={`weather-icon ${className}`}
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
