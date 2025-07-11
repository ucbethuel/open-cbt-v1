import React from 'react';

const Calculator = ({
  value,
  onOperate,
  minimized,
  setMinimized,
  setVisible,
  position,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
}) => {
  return (
    <div
      className="calculator"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: minimized ? '200px' : '280px'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="calculator-header d-flex justify-content-between align-items-center p-2"
        onMouseDown={handleMouseDown}
      >
        <span className="fw-bold">Calculator</span>
        <div className="btn-group">
          <button onClick={() => setMinimized(!minimized)} className="btn btn-sm btn-light">
            <i className={`fas ${minimized ? 'fa-expand' : 'fa-compress'}`}></i>
          </button>
          <button onClick={() => setVisible(false)} className="btn btn-sm btn-light">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="p-2 bg-light">
            <input type="text" value={value} readOnly className="form-control text-end fw-bold fs-5" />
          </div>
          <div className="p-2">
            <div className="row g-1">
              {['C', 'CE', '/', '*'].map(btn => (
                <div key={btn} className="col-3">
                  <button className="btn btn-outline-danger w-100" onClick={() => onOperate(btn)}>{btn}</button>
                </div>
              ))}
              {['7', '8', '9', '-'].map(btn => (
                <div key={btn} className="col-3">
                  <button className="btn btn-outline-secondary w-100" onClick={() => onOperate(btn)}>{btn}</button>
                </div>
              ))}
              {['4', '5', '6', '+'].map(btn => (
                <div key={btn} className="col-3">
                  <button className="btn btn-outline-secondary w-100" onClick={() => onOperate(btn)}>{btn}</button>
                </div>
              ))}
              {['1', '2', '3'].map(btn => (
                <div key={btn} className="col-3">
                  <button className="btn btn-outline-secondary w-100" onClick={() => onOperate(btn)}>{btn}</button>
                </div>
              ))}
              <div className="col-3">
                <button className="btn btn-primary w-100 h-100" style={{ height: 'calc(100% + 42px)' }} onClick={() => onOperate('=')}>=</button>
              </div>
              <div className="col-6">
                <button className="btn btn-outline-secondary w-100" onClick={() => onOperate('0')}>0</button>
              </div>
              <div className="col-3">
                <button className="btn btn-outline-secondary w-100" onClick={() => onOperate('.')}>.</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calculator;
