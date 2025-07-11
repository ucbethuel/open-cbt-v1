import React from 'react';

const QuestionCard = ({
  question,
  questions,
  currentQuestionIndex,
  selectedAnswers,
  handleAnswerSelect,
  flaggedQuestions,
  toggleFlagQuestion,
  handleNextQuestion,
  handlePreviousQuestion
}) => {
  if (!question) return null;

  return (
    <div className="card mb-4 flex-grow-1">
      <div className="card-body">
        <div className="bg-light p-4 rounded mb-4">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">Question {currentQuestionIndex + 1}</h5>
            {flaggedQuestions.has(question.id) && (
              <span className="badge bg-warning">
                <i className="fas fa-flag"></i> Flagged
              </span>
            )}
          </div>
          <p className="card-text lead">{question.text}</p>
        </div>

        {/* Options */}
        <div className="mb-4">
          {question.options.map(option => (
            <div
              key={option.id}
              onClick={() => handleAnswerSelect(question.id, option.id)}
              className={`answer-option p-3 border rounded mb-2 ${
                selectedAnswers[question.id] === option.id ? 'selected border-primary' : 'border-secondary'
              }`}
            >
              <div className="d-flex align-items-center">
                <div className={`me-3 ${
                  selectedAnswers[question.id] === option.id ? 'text-primary' : 'text-secondary'
                }`}>
                  <i className={`fas ${
                    selectedAnswers[question.id] === option.id ? 'fa-circle-dot' : 'fa-circle'
                  }`}></i>
                </div>
                <span className="fw-bold me-2">{option.id}.</span>
                <span>{option.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="d-flex justify-content-between align-items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn btn-outline-secondary"
          >
            <i className="fas fa-arrow-left me-2"></i>Previous
          </button>

          <button
            onClick={toggleFlagQuestion}
            className={`btn ${flaggedQuestions.has(question.id) ? 'btn-warning' : 'btn-outline-warning'}`}
          >
            <i className="fas fa-flag me-2"></i>
            {flaggedQuestions.has(question.id) ? 'Unflag' : 'Flag for Review'}
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="btn btn-outline-secondary"
          >
            Next<i className="fas fa-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
