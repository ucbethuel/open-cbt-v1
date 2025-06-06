// src/components/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ answered, total }) => {
  // Guard against division-by-zero
  const percent = total > 0
    ? Math.round((answered / total) * 100)
    : 0;

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between small text-muted mb-2">
        <span>Total Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="progress" style={{ height: '1rem' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${percent}%` }}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
