import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <AlertTriangle size={26} strokeWidth={1.6} />
      <h2>Couldn&rsquo;t load the forecast</h2>
      <p>{message || 'Something went wrong talking to the weather service.'}</p>
      <button className="btn btn-primary" onClick={onRetry}>
        <RotateCcw size={14} strokeWidth={2} />
        Try again
      </button>
    </div>
  );
}
