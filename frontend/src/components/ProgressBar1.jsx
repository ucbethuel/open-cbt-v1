import React from 'react';

const ProgressBar = () => {
  return (
    <div className="progress" style={{ height: '8px' }}>
      <div className="progress-bar bg-primary" style={{ width: '60%' }}></div>
    </div>
  );
};

export default ProgressBar;
