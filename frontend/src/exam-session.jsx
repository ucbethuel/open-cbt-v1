import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import {handleAnswerSelect, handleSubmitExam, handleNextQuestion, handlePreviousQuestion} from "./helpers/keyboardShortcode";
import handleCalculatorOperation from "./helpers/calculator";
import bootstrapStyle from "./styles/bootstrapStyle";
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProgressBar from './components/progressBar'; 
import CONFIG from './config'; // Assuming you have a config file for constants

const Exam = () => {
  // CONFIG = CONFIG;
  // Configuration - Easy to modify
  let CONFIG = {
    EXAM_DURATION: 7200, // 2 hours in seconds
    API_BASE_URL: 'http://127.0.0.1:8000', // Replace with your backend URL
    API_PATH: '/api/',
    WARNING_TIMES: [1800, 900, 300], // 30, 15, 5 minutes warnings
    SUBJECTS: [
      { id: 'math', name: 'Mathematics', code: 'MTH' },
      { id: 'english', name: 'English Language', code: 'ENG' },
      { id: 'physics', name: 'Physics', code: 'PHY' },
      { id: 'chemistry', name: 'Chemistry', code: 'CHM' }
    ],
    AUTO_SAVE_INTERVAL: 30000 // Auto-save every 30 seconds
  };
  

const location = useLocation();
const studentId = location.state?.studentId || 'GUEST';
// console.log(studentId.student_id)
const rawStudentData = localStorage.getItem('studentData');
  const studentData = rawStudentData ? JSON.parse(rawStudentData) : null;

  // Student Information - Will come from authentication
  const [studentInfo] = useState({
    name: studentData.first_name + " " + studentData.last_name,
    studentId: studentId, // Replace with actual student ID
    examId: 'CBT_2025_001',
    course: 'JAMB CBT Examination'
  });

  // Core States
  const [timeRemaining, setTimeRemaining] = useState(CONFIG.EXAM_DURATION);
  const [currentSubject, setCurrentSubject] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculator States
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  const [calculatorPosition, setCalculatorPosition] = useState({ x: 20, y: 300 });
  const [calculatorValue, setCalculatorValue] = useState('0');
  const [isCalculatorMinimized, setIsCalculatorMinimized] = useState(false);


  // Refs
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });
  const autoSaveRef = useRef();

  // API Functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.authToken || 'demo-token'}`,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

 
  // Load questions for selected subject
  const loadQuestions = async (subjectId) => {
    setLoading(true);
    setError(null);
    
    try {
      const mockQuestions = await getMockQuestions(subjectId);
      setQuestions(mockQuestions);
    } catch (err) {
      setError(`Failed to load questions: ${err.message}`);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Mock function - Replace with actual API call
  const getMockQuestions = async (subjectId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const questionSets = {
      math: [
        {
          id: 1,
          text: "If a company purchased a machine for $80,000 with a salvage value of $10,000 and a useful life of 5 years, what is the annual straight-line depreciation expense?",
          options: [
            { id: "A", text: "$14,000" },
            { id: "B", text: "$16,000" },
            { id: "C", text: "$18,000" },
            { id: "D", text: "$20,000" }
          ],
          correctAnswer: "A"
        },
        {
          id: 2,
          text: "Solve for x: 2x + 5 = 15",
          options: [
            { id: "A", text: "x = 5" },
            { id: "B", text: "x = 10" },
            { id: "C", text: "x = 7.5" },
            { id: "D", text: "x = 2.5" }
          ],
          correctAnswer: "A"
        }
      ],
      english: [
        {
          id: 3,
          text: "Choose the correct form: 'She ___ to the market every day.'",
          options: [
            { id: "A", text: "go" },
            { id: "B", text: "goes" },
            { id: "C", text: "going" },
            { id: "D", text: "gone" }
          ],
          correctAnswer: "B"
        },
        {
          id: 4,
          text: "What is the plural form of 'child'?",
          options: [
            { id: "A", text: "childs" },
            { id: "B", text: "childes" },
            { id: "C", text: "children" },
            { id: "D", text: "child" }
          ],
          correctAnswer: "C"
        }
      ],
      physics: [
        {
          id: 5,
          text: "What is the SI unit of force?",
          options: [
            { id: "A", text: "Joule" },
            { id: "B", text: "Newton" },
            { id: "C", text: "Pascal" },
            { id: "D", text: "Watt" }
          ],
          correctAnswer: "B"
        }
      ],
      chemistry: [
        {
          id: 6,
          text: "What is the chemical symbol for Gold?",
          options: [
            { id: "A", text: "Go" },
            { id: "B", text: "Gd" },
            { id: "C", text: "Au" },
            { id: "D", text: "Ag" }
          ],
          correctAnswer: "C"
        }
      ]
    };

    return questionSets[subjectId] || [];
  };

  // Utility functions
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  

  const toggleFlagQuestion = () => {
    if (!questions[currentQuestionIndex]) return;
    
    const questionId = questions[currentQuestionIndex].id;
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  

  const getQuestionStatusClass = (index) => {
    if (!questions[index]) return 'btn-secondary';
    
    const questionId = questions[index].id;
    if (flaggedQuestions.has(questionId)) return 'btn-warning';
    if (selectedAnswers[questionId]) return 'btn-success';

    return 'btn-danger';
  };

  
  // Keyboard Shortcuts
useKeyboardShortcuts({
  questions,
  currentQuestionIndex,
  handleAnswerSelect,
  handleNextQuestion,
  handlePreviousQuestion,
  handleSubmitExam,
  setSelectedAnswers,
});

  // Save progress to backend
  // TODO: Modularise this functions
  const saveProgress = async () => {
    try {
      const progressData = {
        studentId: studentInfo.studentId,
        examId: studentInfo.examId,
        subjectId: CONFIG.SUBJECTS[currentSubject].id,
        answers: selectedAnswers,
        flaggedQuestions: Array.from(flaggedQuestions),
        currentQuestion: currentQuestionIndex,
        timeRemaining,
        timestamp: new Date().toISOString()
      };

      console.log('Progress saved:', progressData);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Load saved progress
  // TODO: Modularise this functions
  const loadProgress = async () => {
    try {
      // Mock implementation
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  // Submit exam
  // TODO: Modularise this functions
  const submitExam = async () => {
    try {
      const submissionData = {
        studentId: studentInfo.studentId,
        examId: studentInfo.examId,
        answers: selectedAnswers,
        submissionTime: new Date().toISOString(),
        timeUsed: CONFIG.EXAM_DURATION - timeRemaining
      };

      alert('Exam submitted successfully!');
      console.log('Exam submitted:', submissionData);
    } catch (error) {
      alert('Failed to submit exam. Please try again.');
      console.error('Submission failed:', error);
    }
  };

  // Handle subject change
  // TODO: Modularise this functions
  const handleSubjectChange = (index) => {
    setCurrentSubject(index);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions(new Set());
    loadQuestions(CONFIG.SUBJECTS[index].id);
  };


  

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Time warnings
  useEffect(() => {
    if (CONFIG.WARNING_TIMES.includes(timeRemaining)) {
      const minutesLeft = timeRemaining / 60;
      alert(`Warning: ${minutesLeft} minutes remaining!`);
    }
  }, [timeRemaining]);

  // Auto-save effect
  useEffect(() => {
    autoSaveRef.current = setInterval(saveProgress, CONFIG.AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveRef.current);
  }, [selectedAnswers, flaggedQuestions, currentQuestionIndex]);

  // Load initial data
  useEffect(() => {
    loadProgress();
    loadQuestions(CONFIG.SUBJECTS[currentSubject].id);
  }, []);

  const progress = questions.length > 0 ? (Object.keys(selectedAnswers).length / questions.length * 100) : 0;


  const handleMouseDown = (e) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX - calculatorPosition.x;
    dragRef.current.startY = e.clientY - calculatorPosition.y;
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.isDragging) return;
    setCalculatorPosition({
      x: e.clientX - dragRef.current.startX,
      y: e.clientY - dragRef.current.startY
    });
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
  };

  // Loading state
  if (loading && questions.length === 0) {
    return (
      <>
        <style>{bootstrapStyle}</style>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading questions...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <style>{bootstrapStyle}</style>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="text-center">
            <div className="text-danger mb-3">
              <i className="fas fa-exclamation-triangle fa-2x"></i>
            </div>
            <p className="text-danger mb-3">{error}</p>
            <button 
              onClick={() => loadQuestions(CONFIG.SUBJECTS[currentSubject].id)}
              className="btn btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];



  // Render Logic.
  return (
    <>
      <style>{bootstrapStyle}</style>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      
      <div className="exam-container d-flex flex-column bg-light">
        {/* Header */}
        <header className="exam-header bg-white shadow-sm">
          <div className="container-fluid h-100 py-3">
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
                    className={`btn w-100 py-2 ${
                      currentSubject === index
                        ? 'btn-primary'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    <div className="fw-bold small">{subject.name}</div>
                    <div className="text-xs opacity-75">{subject.code}</div>
                  </button>
                </div>
              ))}
            </div>
            
            {questions.length > 0 && (
              <p className="text-muted mb-0">
                Question {currentQuestionIndex + 1} of {questions.length} - {CONFIG.SUBJECTS[currentSubject].name}
              </p>
            )}
          </div>
        </header>

        <main className="exam-main flex-grow-1">
          <div className="container-fluid h-100">
            <div className="row h-100">
              {/* Main content area */}
              <div className="col-md-8 h-100 py-3">
                <div className="question-area">
                  {questions.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No questions available for this subject.</p>
                    </div>
                  ) : (
                    <div className="h-100 d-flex flex-column">
                      {/* Question Area */}
                      <div className="card mb-4 flex-grow-1">
                        <div className="card-body">
                          <div className="bg-light p-4 rounded mb-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="card-title mb-0">
                                Question {currentQuestionIndex + 1}
                              </h5>
                              {flaggedQuestions.has(currentQuestion?.id) && (
                                <span className="badge bg-warning">
                                  <i className="fas fa-flag"></i> Flagged
                                </span>
                              )}
                            </div>
                            <p className="card-text lead">
                              {currentQuestion?.text}
                            </p>
                          </div>

                          {/* Options */}
                          <div className="mb-4">
                            {currentQuestion?.options.map(option => (
                              <div
                                key={option.id}
                                onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                                className={`answer-option p-3 border rounded mb-2 ${
                                  selectedAnswers[currentQuestion.id] === option.id
                                    ? 'selected border-primary'
                                    : 'border-secondary'
                                }`}
                              >
                                <div className="d-flex align-items-center">
                                  <div className={`me-3 ${
                                    selectedAnswers[currentQuestion.id] === option.id
                                      ? 'text-primary'
                                      : 'text-secondary'
                                  }`}>
                                    <i className={`fas ${
                                      selectedAnswers[currentQuestion.id] === option.id
                                        ? 'fa-circle-dot'
                                        : 'fa-circle'
                                    }`}></i>
                                  </div>
                                  <span className="fw-bold me-2">{option.id}.</span>
                                  <span>{option.text}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Navigation Controls */}
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
                              className={`btn ${
                                flaggedQuestions.has(currentQuestion?.id)
                                  ? 'btn-warning'
                                  : 'btn-outline-warning'
                              }`}
                            >
                              <i className="fas fa-flag me-2"></i>
                              {flaggedQuestions.has(currentQuestion?.id) ? 'Unflag' : 'Flag for Review'}
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

                      {/* Question Palette */}
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
                                <div className="bg-success" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
                                <small className="ms-2 text-muted">Answered ({Object.keys(selectedAnswers).length})</small>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div className="d-flex align-items-center">
                                <div className="bg-danger" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
                                <small className="ms-2 text-muted">Unanswered ({questions.length - Object.keys(selectedAnswers).length})</small>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div className="d-flex align-items-center">
                                <div className="bg-warning" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
                                <small className="ms-2 text-muted">Flagged ({flaggedQuestions.size})</small>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <ProgressBar  />

                          </div>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Info Sidebar */}
              <div className="col-md-4 border-start bg-white h-100 py-3">
                <div className="sidebar">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '48px', height: '48px'}}>
                      <i className="fas fa-user text-primary"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">{studentInfo.name}</h6>
                      <small className="text-muted">ID: {studentInfo.studentId}</small>
                    </div>
                    
                  </div>
                   {/* Calculator Toggle */}
                          <button
                            onClick={() => setIsCalculatorVisible(!isCalculatorVisible)}
                            className="btn btn-outline-secondary w-100"
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
                            {/* <p className="mb-1">Auto-saving: <span className="text-success">Active</span></p> */}
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
                      <div className="d-flex justify-content-between">
                      
                        <button
                          onClick={handleSubmitExam}
                          className="btn btn-primary w-50"
                        >
                          <i className="fas fa-paper-plane me-2"></i>Submit Exam
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Calculator Component */}
        {isCalculatorVisible && (
          <div
            className="calculator"
            style={{
              left: `${calculatorPosition.x}px`,
              top: `${calculatorPosition.y}px`,
              width: isCalculatorMinimized ? '200px' : '280px'
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
                <button
                  onClick={() => setIsCalculatorMinimized(!isCalculatorMinimized)}
                  className="btn btn-sm btn-light"
                >
                  <i className={`fas ${isCalculatorMinimized ? 'fa-expand' : 'fa-compress'}`}></i>
                </button>
                <button
                  onClick={() => setIsCalculatorVisible(false)}
                  className="btn btn-sm btn-light"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {!isCalculatorMinimized && (
              <>
                <div className="p-2 bg-light">
                  <input
                    type="text"
                    value={calculatorValue}
                    readOnly
                    className="form-control text-end fw-bold fs-5"
                  />
                </div>
                <div className="p-2">
                  <div className="row g-1">
                    {['C', 'CE', '/', '*'].map(btn => (
                      <div key={btn} className="col-3">
                        <button
                          className="btn btn-outline-danger w-100"
                          onClick={() => handleCalculatorOperation(btn)}
                        >
                          {btn}
                        </button>
                      </div>
                    ))}
                    {['7', '8', '9', '-'].map(btn => (
                      <div key={btn} className="col-3">
                        <button
                          className="btn btn-outline-secondary w-100"
                          onClick={() => handleCalculatorOperation(btn)}
                        >
                          {btn}
                        </button>
                      </div>
                    ))}
                    {['4', '5', '6', '+'].map(btn => (
                      <div key={btn} className="col-3">
                        <button
                          className="btn btn-outline-secondary w-100"
                          onClick={() => handleCalculatorOperation(btn)}
                        >
                          {btn}
                        </button>
                      </div>
                    ))}
                    {['1', '2', '3'].map(btn => (
                      <div key={btn} className="col-3">
                        <button
                          className="btn btn-outline-secondary w-100"
                          onClick={() => handleCalculatorOperation(btn)}
                        >
                          {btn}
                        </button>
                      </div>
                    ))}
                    <div className="col-3">
                      <button
                        className="btn btn-primary w-100 h-100"
                        style={{ height: 'calc(100% + 42px)' }}
                        onClick={() => handleCalculatorOperation('=')}
                      >
                        =
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-outline-secondary w-100"
                        onClick={() => handleCalculatorOperation('0')}
                      >
                        0
                      </button>
                    </div>
                    <div className="col-3">
                      <button
                        className="btn btn-outline-secondary w-100"
                        onClick={() => handleCalculatorOperation('.')}
                      >
                        .
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Exam;
