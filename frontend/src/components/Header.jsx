const Header = ({ studentInfo, timeRemaining, formatTime, currentSubject, loading, handleSubjectChange, CONFIG, questions, currentQuestionIndex }) => (
  <header className="exam-header bg-white shadow-sm">
    <div className="container-fluid h-100 py-3">
      {/* Top info */}
      <div className="row align-items-center mb-3">
        <div className="col-md-8">
          <h1 className="h3 mb-1 text-dark">{studentInfo.course}</h1>
          <small className="text-muted">Exam ID: {studentInfo.examId}</small>
        </div>
        <div className="col-md-4 text-end">
          <div className={`p-2 rounded font-monospace fw-bold fs-5 ${
            timeRemaining < 300 ? 'time-critical' : 
            timeRemaining < 900 ? 'time-warning' : 'bg-light'
          }`}>
            {formatTime(timeRemaining)}
          </div>
          <small className="text-muted">Time Remaining</small>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="row g-1 mb-3">
        {CONFIG.SUBJECTS.map((subject, index) => (
          <div key={subject.id} className="col">
            <button
              onClick={() => handleSubjectChange(index)}
              disabled={loading}
              className={`btn w-100 py-2 ${currentSubject === index ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              <div className="fw-bold small">{subject.name}</div>
              <div className="text-xs opacity-75">{subject.code}</div>
            </button>
          </div>
        ))}
      </div>

      {/* Question Count */}
      {questions.length > 0 && (
        <p className="text-muted mb-0">
          Question {currentQuestionIndex + 1} of {questions.length} - {CONFIG.SUBJECTS[currentSubject].name}
        </p>
      )}
    </div>
  </header>
);

export default Header;
