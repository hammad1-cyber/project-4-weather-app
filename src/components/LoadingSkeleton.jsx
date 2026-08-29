import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-wrap" role="status" aria-label="Loading weather">
      <div className="skeleton-hero">
        <div className="skeleton-line skeleton-line-sm" />
        <div className="skeleton-block skeleton-temp" />
        <div className="skeleton-line skeleton-line-md" />
      </div>
      <div className="skeleton-dials">
        {Array.from({ length: 4 }).map((_, i) => <div className="skeleton-dial" key={i} />)}
      </div>
      <div className="skeleton-strip">
        {Array.from({ length: 7 }).map((_, i) => <div className="skeleton-day" key={i} />)}
      </div>
    </div>
  );
}
