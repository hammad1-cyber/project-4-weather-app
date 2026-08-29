import React from 'react';

export default function RecentSearches({ recents, onSelect, currentName }) {
  if (!recents || recents.length === 0) return null;
  return (
    <div className="recent-searches">
      <span className="mono recent-label">Recent</span>
      <div className="chip-row">
        {recents.map(city => (
          <button
            key={`${city.latitude},${city.longitude}`}
            className={`chip ${city.name === currentName ? 'active' : ''}`}
            onClick={() => onSelect(city)}
            type="button"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
}
