import React from 'react';

const Sidebar = ({
  studentInfo,
  CONFIG,
  currentSubject,
  questions,
  selectedAnswers,
  timeRemaining,
  formatTime,
  handleSubmitExam,
  isCalculatorVisible,
  setIsCalculatorVisible
}) => {
  return (
    <div className="sidebar">
      <div className="d-flex align-items-center mb-4">
        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
          <i className="fas fa-user text-primary"></i>
        </div>
        <div>
          <h6 className="mb-0">{studentInfo.name}</h6>
          <small className="text-muted">ID: {studentInfo.studentId}</small>
        </div>
      </div>

      <button
        onClick={() => setIsCalculatorVisible(!isCalculatorVisible)}
        className="btn btn-outline-secondary w-100 mb-3"
      >
        <i className="fas fa-calculator me-2"></i>
        {isCalculatorVisible ? 'Hide Calculator' : 'Show Calculator'}
      </button>

      <div className="row g-3">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">Current Subject</h6>
              <div className="small text-muted">
                <p className="mb-1">{CONFIG.SUBJECTS[currentSubject].name}</p>
                <p className="mb-1">Questions: {questions.length}</p>
                <p className="mb-0">Answered: {Object.keys(selectedAnswers).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">Exam Status</h6>
              <div className="small text-muted">
                <p className="mb-1">Time Used: {formatTime(CONFIG.EXAM_DURATION - timeRemaining)}</p>
                <p className="mb-0">Connection: <span className="text-success">Stable</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">Instructions</h6>
              <ul className="list-unstyled small text-muted mb-0">
                <li className="mb-1">• Read questions carefully</li>
                <li className="mb-1">• Use flag feature for review</li>
                <li className="mb-1">• Calculator available when needed</li>
                <li className="mb-1">• Auto-save every 30 seconds</li>
                <li className="mb-1">• Press 'S' to submit exam</li>
                <li className="mb-1">• Press 'N' for next, 'P' for previous</li>
                <li className="mb-1">• Press 'R' to clear selected option</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12">
          <button onClick={handleSubmitExam} className="btn btn-primary w-100">
            <i className="fas fa-paper-plane me-2"></i>Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
