import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchCities } from '../api/weatherApi.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';

export default function SearchBar({ onSelect, onUseLocation, geoStatus }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 350);
  const abortRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSearching(false);
      setSearchError(null);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setSearching(true);
    setSearchError(null);
    searchCities(q, { signal: controller.signal })
      .then(results => { setSuggestions(results); setSearching(false); })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setSearchError('Search failed. Check your connection.');
        setSuggestions([]);
        setSearching(false);
      });
    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(city) {
    onSelect(city);
    setQuery('');
    setSuggestions([]);
    setOpen(false);
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div className="search-bar" ref={containerRef}>
      <div className="search-input">
        <Search size={16} strokeWidth={1.8} />
        <input
          type="text"
          placeholder="Search for a city\u2026"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {searching && <Loader2 size={15} className="spin" />}
      </div>

      <button className="locate-btn" onClick={onUseLocation} disabled={geoStatus === 'locating'}>
        <MapPin size={14} strokeWidth={1.9} />
        {geoStatus === 'locating' ? 'Locating\u2026' : 'Use my location'}
      </button>

      {showDropdown && (
        <div className="search-dropdown">
          {searchError && <p className="search-dropdown-note">{searchError}</p>}
          {!searchError && !searching && suggestions.length === 0 && (
            <p className="search-dropdown-note">No cities found for &ldquo;{query}&rdquo;.</p>
          )}
          {suggestions.map(city => (
            <button key={city.id} className="search-result" onClick={() => handleSelect(city)}>
              <span>{city.name}</span>
              <span className="mono search-result-region">
                {[city.admin1, city.country].filter(Boolean).join(', ')}
              </span>
            </button>
          ))}
        </div>
      )}

      {geoStatus === 'error' && (
        <p className="geo-error mono">Couldn&rsquo;t get your location \u2014 search for a city instead.</p>
      )}
    </div>
  );
}
