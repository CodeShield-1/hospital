import React from 'react';

export default function LoadingSpinner({ fullPage }) {
  return (
    <div className={`loading-container ${fullPage ? 'full-page' : ''}`}>
      <div className="spinner"></div>
      <p className="text-muted">Loading...</p>
    </div>
  );
}
