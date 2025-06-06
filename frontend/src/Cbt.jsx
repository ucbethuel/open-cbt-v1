

import React, { useState, useEffect, useRef } from 'react';
import './index.css'

const Cbt = () => {
  
  // Configuration - Easy to modify
  const CONFIG = {
    EXAM_DURATION: 7200, // 2 hours in seconds
    API_BASE_URL: 'https://api.example.com', // Replace with your backend URL
    WARNING_TIMES: [1800, 900, 300], // 30, 15, 5 minutes warnings
    SUBJECTS: [
      { id: 'math', name: 'Mathematics', code: 'MTH' },
      { id: 'english', name: 'English Language', code: 'ENG' },
      { id: 'physics', name: 'Physics', code: 'PHY' },
      { id: 'chemistry', name: 'Chemistry', code: 'CHM' },
      { id: 'biology', name: 'Biology', code: 'BIO' }
    ],
    AUTO_SAVE_INTERVAL: 30000 // Auto-save every 30 seconds
  };

  // Student Information - Will come from authentication
  const [studentInfo] = useState({
    name: 'John Doe',
    studentId: '12345',
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
      // For demo purposes, using mock data. Replace with actual API call
      const mockQuestions = await getMockQuestions(subjectId);
      
      // Uncomment below for real API integration
      // const data = await apiCall(`/questions/${subjectId}?examId=${studentInfo.examId}`);
      
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
      ],
      biology: [
        {
          id: 7,
          text: "Which organ is responsible for pumping blood?",
          options: [
            { id: "A", text: "Liver" },
            { id: "B", text: "Kidney" },
            { id: "C", text: "Heart" },
            { id: "D", text: "Lungs" }
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

  const handleAnswerSelect = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getQuestionStatusClass = (index) => {
    if (!questions[index]) return 'bg-gray-400';
    
    const questionId = questions[index].id;
    if (flaggedQuestions.has(questionId)) return 'bg-yellow-500';
    if (selectedAnswers[questionId]) return 'bg-green-500';
    return 'bg-red-500';
  };

  // Keyboard Shortcuts - Fixed the questionSets reference
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion) return;

      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleAnswerSelect(currentQuestion.id, key);
      } else if (key === 'N') {
        handleNextQuestion();
      } else if (key === 'P') {
        handlePreviousQuestion();
      } else if (key === 'S') {
        handleSubmitExam();
      } else if (key === 'R') {
        setSelectedAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[currentQuestion.id];
          return newAnswers;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questions, currentQuestionIndex, selectedAnswers]);

  // Save progress to backend
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

      // Uncomment for real API integration
      // await apiCall('/progress/save', {
      //   method: 'POST',
      //   body: JSON.stringify(progressData)
      // });

      console.log('Progress saved:', progressData);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Load saved progress
  const loadProgress = async () => {
    try {
      // Uncomment for real API integration
      // const data = await apiCall(`/progress/${studentInfo.studentId}/${studentInfo.examId}`);
      // setSelectedAnswers(data.answers || {});
      // setFlaggedQuestions(new Set(data.flaggedQuestions || []));
      // setCurrentQuestionIndex(data.currentQuestion || 0);
      // setTimeRemaining(data.timeRemaining || CONFIG.EXAM_DURATION);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  // Submit exam
  const submitExam = async () => {
    try {
      const submissionData = {
        studentId: studentInfo.studentId,
        examId: studentInfo.examId,
        answers: selectedAnswers,
        submissionTime: new Date().toISOString(),
        timeUsed: CONFIG.EXAM_DURATION - timeRemaining
      };

      // Uncomment for real API integration
      // await apiCall('/exam/submit', {
      //   method: 'POST',
      //   body: JSON.stringify(submissionData)
      // });

      alert('Exam submitted successfully!');
      console.log('Exam submitted:', submissionData);
    } catch (error) {
      alert('Failed to submit exam. Please try again.');
      console.error('Submission failed:', error);
    }
  };

  // Handle subject change
  const handleSubjectChange = (index) => {
    setCurrentSubject(index);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions(new Set());
    loadQuestions(CONFIG.SUBJECTS[index].id);
  };

  const handleSubmitExam = () => {
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    
    if (unansweredCount > 0) {
      if (!window.confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }
    
    if (window.confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
      submitExam();
    }
  };

  const handleExitExam = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be saved.')) {
      saveProgress();
      alert('Exam exited. Your progress has been saved.');
    }
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          submitExam(); // Auto-submit when time expires
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

  // Calculator functions
  const handleCalculatorOperation = (value) => {
    if (value === 'C') {
      setCalculatorValue('0');
    } else if (value === '=') {
      try {
        const result = Function('"use strict"; return (' + calculatorValue + ')')();
        setCalculatorValue(result.toString());
      } catch (error) {
        setCalculatorValue('Error');
      }
    } else if (value === 'CE') {
      setCalculatorValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setCalculatorValue(prev => prev === '0' ? value : prev + value);
    }
  };

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => loadQuestions(CONFIG.SUBJECTS[currentSubject].id)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
   
    <div className="min-h-screen bg-gray-50 flex flex-col">
      

      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{studentInfo.course}</h1>
              <p className="text-sm text-gray-600">Exam ID: {studentInfo.examId}</p>
            </div>
            <div className="text-right">
              <div className={`text-xl font-mono p-2 rounded-lg shadow-inner ${
                timeRemaining < 300 ? 'bg-red-100 text-red-600' : 
                timeRemaining < 900 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100'
              }`}>
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-gray-500 mt-1">Time Remaining</p>
            </div>
          </div>
          
          {/* Subject Tabs */}
          <div className="flex flex-wrap gap-1 mb-4">
            {CONFIG.SUBJECTS.map((subject, index) => (
              <button
                key={subject.id}
                onClick={() => handleSubjectChange(index)}
                disabled={loading}
                className={`flex-1 min-w-0 py-3 px-4 text-center font-medium transition-colors duration-200 rounded-lg ${
                  currentSubject === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                }`}
              >
                <div className="truncate">{subject.name}</div>
                <div className="text-xs opacity-75">{subject.code}</div>
              </button>
            ))}
          </div>
          
          {questions.length > 0 && (
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length} - {CONFIG.SUBJECTS[currentSubject].name}
            </p>
          )}
        </div>
      </header>

      <main className="flex-grow flex max-h-[calc(100vh-140px)] overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No questions available for this subject.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Question Area */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="bg-gray-50 p-5 rounded-md mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-medium text-gray-800">
                      Question {currentQuestionIndex + 1}
                    </h2>
                    {flaggedQuestions.has(currentQuestion?.id) && (
                      <span className="text-yellow-500">
                        <i className="fas fa-flag"></i> Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {currentQuestion?.text}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion?.options.map(option => (
                    <div
                      key={option.id}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                      className={`p-4 border rounded-md cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedAnswers[currentQuestion.id] === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          selectedAnswers[currentQuestion.id] === option.id
                            ? 'border-blue-500'
                            : 'border-gray-400'
                        }`}>
                          {selectedAnswers[currentQuestion.id] === option.id && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium text-gray-700 mr-2">{option.id}.</span>
                        <span className="text-gray-700">{option.text}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`px-5 py-2.5 rounded-md font-medium ${
                      currentQuestionIndex === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={toggleFlagQuestion}
                    className={`px-5 py-2.5 rounded-md font-medium ${
                      flaggedQuestions.has(currentQuestion?.id)
                        ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    🚩 {flaggedQuestions.has(currentQuestion?.id) ? 'Unflag' : 'Flag for Review'}
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className={`px-5 py-2.5 rounded-md font-medium ${
                      currentQuestionIndex === questions.length - 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Question Palette */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-medium text-gray-700 mb-3">Question Navigator</h3>
                <div className="grid grid-cols-10 gap-2 mb-4">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToQuestion(index)}
                      className={`w-10 h-10 rounded-md text-white font-medium text-sm ${
                        currentQuestionIndex === index ? 'ring-2 ring-blue-500' : ''
                      } ${getQuestionStatusClass(index)}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                    <span className="text-sm text-gray-600">Answered ({Object.keys(selectedAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                    <span className="text-sm text-gray-600">Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                    <span className="text-sm text-gray-600">Flagged ({flaggedQuestions.size})</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Calculator Toggle */}
                <button
                  onClick={() => setIsCalculatorVisible(!isCalculatorVisible)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  🧮 {isCalculatorVisible ? 'Hide Calculator' : 'Show Calculator'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Student Info Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              👤
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{studentInfo.name}</h3>
              <p className="text-sm text-gray-500">ID: {studentInfo.studentId}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Subject</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{CONFIG.SUBJECTS[currentSubject].name}</p>
                <p>Questions: {questions.length}</p>
                <p>Answered: {Object.keys(selectedAnswers).length}</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Exam Status</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Time Used: {formatTime(CONFIG.EXAM_DURATION - timeRemaining)}</p>
                <p>Auto-saving: <span className="text-green-600">Active</span></p>
                <p>Connection: <span className="text-green-600">Stable</span></p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Instructions</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Read questions carefully</li>
                <li>Use flag feature for review</li>
                <li>Calculator available when needed</li>
                <li>Auto-save every 30 seconds</li>
                <li>Submit before time expires</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="mr-4">
              💾 Auto-saved
            </span>
            <span>
              📶 Connected
            </span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleExitExam}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium"
            >
              Exit Exam
            </button>
            <button
              onClick={handleSubmitExam}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </footer>

      {/* Calculator */}
       {isCalculatorVisible && (
        <div
          className="fixed shadow-lg rounded-lg bg-white overflow-hidden z-50"
          style={{
            left: `${calculatorPosition.x}px`,
            top: `${calculatorPosition.y}px`,
            width: isCalculatorMinimized ? '200px' : '280px'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="bg-gray-800 text-white p-3 flex justify-between items-center cursor-move"
            onMouseDown={handleMouseDown}
          >
            <span className="font-medium">Calculator</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCalculatorMinimized(!isCalculatorMinimized)}
                className="text-gray-300 hover:text-white"
              >
                <i className={`fas ${isCalculatorMinimized ? 'fa-expand' : 'fa-compress'}`}></i>
              </button>
              <button
                onClick={() => setIsCalculatorVisible(false)}
                className="text-gray-300 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          {!isCalculatorMinimized && (
            <>
              <div className="p-3 bg-gray-100">
                <input
                  type="text"
                  value={calculatorValue}
                  readOnly
                  className="w-full p-2 text-right text-xl font-mono bg-white border-none rounded shadow-inner"
                />
              </div>
              <div className="grid grid-cols-4 gap-1 p-2">
                {['C', 'CE', '/', '*'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalculatorOperation(btn)}
                    className={`p-3 rounded font-medium ${
                      ['C', 'CE'].includes(btn) 
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
                {['7', '8', '9', '-'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalculatorOperation(btn)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium"
                  >
                    {btn}
                  </button>
                ))}
                {['4', '5', '6', '+'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalculatorOperation(btn)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium"
                  >
                    {btn}
                  </button>
                ))}
                {['1', '2', '3'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalculatorOperation(btn)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium"
                  >
                    {btn}
                  </button>
                ))}
                <button
                  onClick={() => handleCalculatorOperation('=')}
                  className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium row-span-2"
                >
                  =
                </button>
                {['0', '.'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalculatorOperation(btn)}
                    className={`p-3 rounded font-medium ${
                      btn === '0' 
                        ? 'col-span-2 bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cbt;