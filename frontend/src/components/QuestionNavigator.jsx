import React from 'react';
import ProgressBar1 from './ProgressBar1';

const QuestionNavigator = ({
  questions,
  selectedAnswers,
  flaggedQuestions,
  currentQuestionIndex,
  navigateToQuestion,
  getQuestionStatusClass
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="card-title">Question Navigator</h6>
        <div className="question-palette mb-3">
          <div className="row g-2">
            {questions.map((_, index) => (
              <div key={index} className="col-auto">
                <button
                  onClick={() => navigateToQuestion(index)}
                  className={`btn question-btn ${getQuestionStatusClass(index)} ${
                    currentQuestionIndex === index ? 'active' : ''
                  }`}
                >
                  {index + 1}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <div className="bg-success" style={{ width: '16px', height: '16px', borderRadius: '2px' }}></div>
              <small className="ms-2 text-muted">Answered ({Object.keys(selectedAnswers).length})</small>
            </div>
          </div>
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <div className="bg-danger" style={{ width: '16px', height: '16px', borderRadius: '2px' }}></div>
              <small className="ms-2 text-muted">Unanswered ({questions.length - Object.keys(selectedAnswers).length})</small>
            </div>
          </div>
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <div className="bg-warning" style={{ width: '16px', height: '16px', borderRadius: '2px' }}></div>
              <small className="ms-2 text-muted">Flagged ({flaggedQuestions.size})</small>
            </div>
          </div>
        </div>

        <ProgressBar1 />
      </div>
    </div>
  );
};

export default QuestionNavigator;
