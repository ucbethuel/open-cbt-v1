import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ExamComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get submission data from navigation state or localStorage
  const getSubmissionData = () => {
    if (location.state?.submissionData) {
      return location.state.submissionData;
    }
    
    try {
      const savedSubmission = localStorage.getItem('examSubmission');
      if (savedSubmission) {
        return JSON.parse(savedSubmission);
      }
    } catch (error) {
      console.error('Error loading submission data:', error);
    }
    
    return null;
  };

  const submissionData = getSubmissionData();
  const isSuccess = location.state?.success || submissionData;

  const handleReturnToDashboard = () => {
    // Clear any remaining exam data
    localStorage.removeItem('examSubmission');
    localStorage.removeItem('examAnswers');
    localStorage.removeItem('examQuestions');
    localStorage.removeItem('examSessionId');
    
    navigate('/dashboard');
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    navigate('/login');
  };

  if (!isSuccess) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        
        <div className="text-center">
          <div className="text-warning mb-3">
            <i className="fas fa-exclamation-triangle fa-3x"></i>
          </div>
          <h3>No Exam Data Found</h3>
          <p className="text-muted mb-4">
            We couldn't find your exam submission data.
          </p>
          <button 
            onClick={handleReturnToDashboard}
            className="btn btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completionPercentage = submissionData 
    ? Math.round((submissionData.answeredQuestions / submissionData.totalQuestions) * 100)
    : 0;

  return (
    <div className="vh-100 bg-light d-flex align-items-center justify-content-center">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5 text-center">
                {/* Success Icon */}
                <div className="mb-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-check text-white fa-2x"></i>
                  </div>
                </div>

                {/* Title */}
                <h1 className="h2 fw-bold text-success mb-3">
                  Exam Submitted Successfully!
                </h1>
                
                <p className="text-muted mb-4">
                  Your exam has been submitted and saved. Thank you for completing the CBT examination.
                </p>

                {/* Exam Statistics */}
                {submissionData && (
                  <div className="bg-light rounded p-4 mb-4">
                    <h5 className="fw-bold mb-3">Exam Summary</h5>
                    
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <div className="text-center">
                          <div className="h4 fw-bold text-primary mb-1">
                            {submissionData.answeredQuestions}
                          </div>
                          <small className="text-muted">Questions Answered</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center">
                          <div className="h4 fw-bold text-secondary mb-1">
                            {submissionData.totalQuestions}
                          </div>
                          <small className="text-muted">Total Questions</small>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <div className="text-center">
                          <div className="h4 fw-bold text-info mb-1">
                            {completionPercentage}%
                          </div>
                          <small className="text-muted">Completion Rate</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center">
                          <div className="h4 fw-bold text-warning mb-1">
                            {formatTime(submissionData.timeTaken)}
                          </div>
                          <small className="text-muted">Time Taken</small>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">Overall Progress</small>
                        <small className="text-muted">{completionPercentage}%</small>
                      </div>
                      <div className="progress" style={{ height: '10px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-muted small">
                      <div className="mb-1">
                        <strong>Student ID:</strong> {submissionData.studentId}
                      </div>
                      <div>
                        <strong>Submitted:</strong> {new Date(submissionData.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Important Notice */}
                <div className="alert alert-info d-flex align-items-center mb-4">
                  <i className="fas fa-info-circle me-2"></i>
                  <div className="text-start">
                    <strong>Important:</strong> Your exam has been successfully submitted. 
                    Results will be available after the examination period ends.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button
                    onClick={handleReturnToDashboard}
                    className="btn btn-primary btn-lg px-4"
                  >
                    <i className="fas fa-home me-2"></i>
                    Return to Dashboard
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-secondary btn-lg px-4"
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </div>

                {/* Footer Note */}
                <div className="mt-4 pt-3 border-top">
                  <small className="text-muted">
                    If you have any questions about your exam submission, 
                    please contact the examination office.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .card {
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .progress {
          border-radius: 10px;
          background-color: #e9ecef;
        }
        
        .progress-bar {
          border-radius: 10px;
          transition: width 0.6s ease;
        }
        
        .btn {
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .alert {
          border-radius: 10px;
          border: none;
        }
        
        .bg-light {
          background-color: #f8f9fa !important;
        }
        
        @media (max-width: 768px) {
          .card-body {
            padding: 2rem !important;
          }
          
          .h2 {
            font-size: 1.5rem !important;
          }
          
          .h4 {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExamComplete;