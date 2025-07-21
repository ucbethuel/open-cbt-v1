

// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import ProgressBar from './components/progressBar'; 
// import bootstrapStyle from "./styles/bootstrapStyle";

// const Exam = () => {
//   // Configuration - Easy to modify
//   let CONFIG = {
//     EXAM_DURATION: 7200, // 2 hours in seconds
//     API_BASE_URL: 'http://127.0.0.1:8000', // Replace with your backend URL
//     API_PATH: '/api/',
//     WARNING_TIMES: [1800, 900, 300], // 30, 15, 5 minutes warnings
//     SUBJECTS: [
//       { id: 'math', name: 'Mathematics', code: 'MTH' },
//       { id: 'english', name: 'English Language', code: 'ENG' },
//       { id: 'physics', name: 'Physics', code: 'PHY' },
//       { id: 'chemistry', name: 'Chemistry', code: 'CHM' }
//     ],
//     AUTO_SAVE_INTERVAL: 30000 // Auto-save every 30 seconds
//   };

//   const location = useLocation();
//   const studentId = location.state?.studentId || 'GUEST';
  
//   // Get student data from localStorage or use default
//   const getStudentData = () => {
//     try {
//       const rawStudentData = localStorage.getItem('studentData');
//       return rawStudentData ? JSON.parse(rawStudentData) : { first_name: 'Guest', last_name: 'User' };
//     } catch (error) {
//       console.error('Error parsing student data:', error);
//       return { first_name: 'Guest', last_name: 'User' };
//     }
//   };

//   const studentData = getStudentData();

//   // Student Information
//   const [studentInfo] = useState({
//     name: studentData.first_name + " " + studentData.last_name,
//     studentId: studentId,
//     examId: 'CBT_2025_001',
//     course: 'JAMB CBT Examination'
//   });

//   // Core States
//   const [timeRemaining, setTimeRemaining] = useState(CONFIG.EXAM_DURATION);
//   const [currentSubject, setCurrentSubject] = useState(0);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [questions, setQuestions] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Calculator States
//   const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
//   const [calculatorPosition, setCalculatorPosition] = useState({ x: 20, y: 300 });
//   const [calculatorValue, setCalculatorValue] = useState('0');
//   const [isCalculatorMinimized, setIsCalculatorMinimized] = useState(false);

//   // Refs
//   const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });
//   const autoSaveRef = useRef();

//   // Handler functions - Define these before using them
//   const handleAnswerSelect = (questionId, answerId) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: answerId
//     }));
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleSubmitExam = () => {
//     const confirmed = window.confirm('Are you sure you want to submit the exam?');
//     if (confirmed) {
//       submitExam();
//     }
//   };

//   // Calculator operation handler
//   const handleCalculatorOperation = (operation) => {
//     setCalculatorValue(prev => {
//       try {
//         switch (operation) {
//           case 'C':
//             return '0';
//           case 'CE':
//             return '0';
//           case '=':
//             // Simple evaluation - in production, use a proper math parser
//             return String(eval(prev.replace(/[^0-9+\-*/.]/g, '')));
//           case '+':
//           case '-':
//           case '*':
//           case '/':
//             return prev + operation;
//           case '.':
//             return prev.includes('.') ? prev : prev + '.';
//           default:
//             return prev === '0' ? operation : prev + operation;
//         }
//       } catch (error) {
//         return 'Error';
//       }
//     });
//   };

//   // Mock function - Replace with actual API call
//   const getMockQuestions = async (subjectId) => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     const questionSets = {
//       math: [
//         {
//           id: 1,
//           text: "If a company purchased a machine for $80,000 with a salvage value of $10,000 and a useful life of 5 years, what is the annual straight-line depreciation expense?",
//           options: [
//             { id: "A", text: "$14,000" },
//             { id: "B", text: "$16,000" },
//             { id: "C", text: "$18,000" },
//             { id: "D", text: "$20,000" }
//           ],
//           correctAnswer: "A"
//         },
//         {
//           id: 2,
//           text: "Solve for x: 2x + 5 = 15",
//           options: [
//             { id: "A", text: "x = 5" },
//             { id: "B", text: "x = 10" },
//             { id: "C", text: "x = 7.5" },
//             { id: "D", text: "x = 2.5" }
//           ],
//           correctAnswer: "A"
//         }
//       ],
//       english: [
//         {
//           id: 3,
//           text: "Choose the correct form: 'She ___ to the market every day.'",
//           options: [
//             { id: "A", text: "go" },
//             { id: "B", text: "goes" },
//             { id: "C", text: "going" },
//             { id: "D", text: "gone" }
//           ],
//           correctAnswer: "B"
//         },
//         {
//           id: 4,
//           text: "What is the plural form of 'child'?",
//           options: [
//             { id: "A", text: "childs" },
//             { id: "B", text: "childes" },
//             { id: "C", text: "children" },
//             { id: "D", text: "child" }
//           ],
//           correctAnswer: "C"
//         }
//       ],
//       physics: [
//         {
//           id: 5,
//           text: "What is the SI unit of force?",
//           options: [
//             { id: "A", text: "Joule" },
//             { id: "B", text: "Newton" },
//             { id: "C", text: "Pascal" },
//             { id: "D", text: "Watt" }
//           ],
//           correctAnswer: "B"
//         }
//       ],
//       chemistry: [
//         {
//           id: 6,
//           text: "What is the chemical symbol for Gold?",
//           options: [
//             { id: "A", text: "Go" },
//             { id: "B", text: "Gd" },
//             { id: "C", text: "Au" },
//             { id: "D", text: "Ag" }
//           ],
//           correctAnswer: "C"
//         }
//       ]
//     };

//     return questionSets[subjectId] || [];
//   };

//   // Load questions for selected subject
//   const loadQuestions = async (subjectId) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const mockQuestions = await getMockQuestions(subjectId);
//       setQuestions(mockQuestions);
//     } catch (err) {
//       setError(`Failed to load questions: ${err.message}`);
//       setQuestions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Utility functions
//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const toggleFlagQuestion = () => {
//     if (!questions[currentQuestionIndex]) return;
    
//     const questionId = questions[currentQuestionIndex].id;
//     setFlaggedQuestions(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(questionId)) {
//         newSet.delete(questionId);
//       } else {
//         newSet.add(questionId);
//       }
//       return newSet;
//     });
//   };

//   const navigateToQuestion = (index) => {
//     if (index >= 0 && index < questions.length) {
//       setCurrentQuestionIndex(index);
//     }
//   };

//   const getQuestionStatusClass = (index) => {
//     if (!questions[index]) return 'btn-secondary';
    
//     const questionId = questions[index].id;
//     if (flaggedQuestions.has(questionId)) return 'btn-warning';
//     if (selectedAnswers[questionId]) return 'btn-success';

//     return 'btn-danger';
//   };

//   // Save progress to backend
//   const saveProgress = async () => {
//     try {
//       const progressData = {
//         studentId: studentInfo.studentId,
//         examId: studentInfo.examId,
//         subjectId: CONFIG.SUBJECTS[currentSubject].id,
//         answers: selectedAnswers,
//         flaggedQuestions: Array.from(flaggedQuestions),
//         currentQuestion: currentQuestionIndex,
//         timeRemaining,
//         timestamp: new Date().toISOString()
//       };

//       console.log('Progress saved:', progressData);
//     } catch (error) {
//       console.error('Failed to save progress:', error);
//     }
//   };

//   // Load saved progress
//   const loadProgress = async () => {
//     try {
//       // Mock implementation
//     } catch (error) {
//       console.error('Failed to load progress:', error);
//     }
//   };

//   // Submit exam
//   const submitExam = async () => {
//     try {
//       const submissionData = {
//         studentId: studentInfo.studentId,
//         examId: studentInfo.examId,
//         answers: selectedAnswers,
//         submissionTime: new Date().toISOString(),
//         timeUsed: CONFIG.EXAM_DURATION - timeRemaining
//       };

//       alert('Exam submitted successfully!');
//       console.log('Exam submitted:', submissionData);
//     } catch (error) {
//       alert('Failed to submit exam. Please try again.');
//       console.error('Submission failed:', error);
//     }
//   };

//   // Handle subject change
//   const handleSubjectChange = (index) => {
//     setCurrentSubject(index);
//     setCurrentQuestionIndex(0);
//     // setSelectedAnswers({});
//     setFlaggedQuestions(new Set());
//     loadQuestions(CONFIG.SUBJECTS[index].id);
//   };

//   // Keyboard shortcuts effect - Fixed to use proper dependencies
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       // Prevent default behavior for our shortcuts
//       const key = e.key.toUpperCase();
//       const currentQuestion = questions[currentQuestionIndex];
      
//       if (!currentQuestion) return;

//       // Prevent default for our specific keys
//       if (['A', 'B', 'C', 'D', 'N', 'P', 'S', 'R'].includes(key)) {
//         e.preventDefault();
//       }

//       switch (key) {
//         case 'A':
//         case 'B':
//         case 'C':
//         case 'D':
//           handleAnswerSelect(currentQuestion.id, key);
//           break;
//         case 'N':
//           handleNextQuestion();
//           break;
//         case 'P':
//           handlePreviousQuestion();
//           break;
//         case 'S':
//           handleSubmitExam();
//           break;
//         case 'R':
//           setSelectedAnswers((prev) => {
//             const newAnswers = { ...prev };
//             delete newAnswers[currentQuestion.id];
//             return newAnswers;
//           });
//           break;
//         default:
//           break;
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [questions, currentQuestionIndex]); // Removed selectedAnswers from dependencies

//   // Timer effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 0) {
//           clearInterval(timer);
//           submitExam();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Time warnings
//   useEffect(() => {
//     if (CONFIG.WARNING_TIMES.includes(timeRemaining)) {
//       const minutesLeft = timeRemaining / 60;
//       alert(`Warning: ${minutesLeft} minutes remaining!`);
//     }
//   }, [timeRemaining]);

//   // Auto-save effect
//   useEffect(() => {
//     autoSaveRef.current = setInterval(saveProgress, CONFIG.AUTO_SAVE_INTERVAL);
//     return () => clearInterval(autoSaveRef.current);
//   }, [selectedAnswers, flaggedQuestions, currentQuestionIndex]);

//   // Load initial data
//   useEffect(() => {
//     loadProgress();
//     loadQuestions(CONFIG.SUBJECTS[currentSubject].id);
//   }, []);

//   // Calculator drag handlers
//   const handleMouseDown = (e) => {
//     dragRef.current.isDragging = true;
//     dragRef.current.startX = e.clientX - calculatorPosition.x;
//     dragRef.current.startY = e.clientY - calculatorPosition.y;
//   };

//   const handleMouseMove = (e) => {
//     if (!dragRef.current.isDragging) return;
//     setCalculatorPosition({
//       x: e.clientX - dragRef.current.startX,
//       y: e.clientY - dragRef.current.startY
//     });
//   };

//   const handleMouseUp = () => {
//     dragRef.current.isDragging = false;
//   };

//   // Loading state
//   if (loading && questions.length === 0) {
//     return (
//       <>
//         <style>{bootstrapStyle}</style>
//         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
//         <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//           <div className="text-center">
//             <div className="spinner-border text-primary mb-3" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <p className="text-muted">Loading questions...</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <>
//         <style>{bootstrapStyle}</style>
//         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
//         <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//           <div className="text-center">
//             <div className="text-danger mb-3">
//               <i className="fas fa-exclamation-triangle fa-2x"></i>
//             </div>
//             <p className="text-danger mb-3">{error}</p>
//             <button 
//               onClick={() => loadQuestions(CONFIG.SUBJECTS[currentSubject].id)}
//               className="btn btn-primary"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   const currentQuestion = questions[currentQuestionIndex];

//   // Render Logic
//   return (
//     <>
//       <style>{bootstrapStyle}</style>
//       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
//       <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      
//       <div className="exam-container d-flex flex-column bg-light">
//         {/* Header */}
//         <header className="exam-header bg-white shadow-sm">
//           <div className="container-fluid h-100 py-3">
//             <div className="row align-items-center mb-3">
//               <div className="col-md-8">
//                 <h1 className="h3 mb-1 text-dark">{studentInfo.course}</h1>
//                 <small className="text-muted">Exam ID: {studentInfo.examId}</small>
//               </div>
              
//               <div className="col-md-4 text-end">
//                 <div className={`p-2 rounded font-monospace fw-bold fs-5 ${
//                   timeRemaining < 300 ? 'time-critical' : 
//                   timeRemaining < 900 ? 'time-warning' : 'bg-light'
//                 }`}>
//                   {formatTime(timeRemaining)}
//                 </div>
//                 <small className="text-muted">Time Remaining</small>
//               </div>
//             </div>
            
//             {/* Subject Tabs */}
//             <div className="row g-1 mb-3">
//               {CONFIG.SUBJECTS.map((subject, index) => (
//                 <div key={subject.id} className="col">
//                   <button
//                     onClick={() => handleSubjectChange(index)}
//                     disabled={loading}
//                     className={`btn w-100 py-2 ${
//                       currentSubject === index
//                         ? 'btn-primary'
//                         : 'btn-outline-secondary'
//                     }`}
//                   >
//                     <div className="fw-bold small">{subject.name}</div>
//                     <div className="text-xs opacity-75">{subject.code}</div>
//                   </button>
//                 </div>
//               ))}
//             </div>
            
//             {questions.length > 0 && (
//               <p className="text-muted mb-0">
//                 Question {currentQuestionIndex + 1} of {questions.length} - {CONFIG.SUBJECTS[currentSubject].name}
//               </p>
//             )}
//           </div>
//         </header>

//         <main className="exam-main flex-grow-1">
//           <div className="container-fluid h-100">
//             <div className="row h-100">
//               {/* Main content area */}
//               <div className="col-md-8 h-100 py-3">
//                 <div className="question-area">
//                   {questions.length === 0 ? (
//                     <div className="text-center py-5">
//                       <p className="text-muted">No questions available for this subject.</p>
//                     </div>
//                   ) : (
//                     <div className="h-100 d-flex flex-column">
//                       {/* Question Area */}
//                       <div className="card mb-4 flex-grow-1">
//                         <div className="card-body">
//                           <div className="bg-light p-4 rounded mb-4">
//                             <div className="d-flex justify-content-between align-items-start mb-2">
//                               <h5 className="card-title mb-0">
//                                 Question {currentQuestionIndex + 1}
//                               </h5>
//                               {flaggedQuestions.has(currentQuestion?.id) && (
//                                 <span className="badge bg-warning">
//                                   <i className="fas fa-flag"></i> Flagged
//                                 </span>
//                               )}
//                             </div>
//                             <p className="card-text lead">
//                               {currentQuestion?.text}
//                             </p>
//                           </div>

//                           {/* Options */}
//                           <div className="mb-4">
//                             {currentQuestion?.options.map(option => (
//                               <div
//                                 key={option.id}
//                                 onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
//                                 className={`answer-option p-3 border rounded mb-2 cursor-pointer ${
//                                   selectedAnswers[currentQuestion.id] === option.id
//                                     ? 'selected border-primary bg-primary bg-opacity-10'
//                                     : 'border-secondary'
//                                 }`}
//                                 style={{ cursor: 'pointer' }}
//                               >
//                                 <div className="d-flex align-items-center">
//                                   <div className={`me-3 ${
//                                     selectedAnswers[currentQuestion.id] === option.id
//                                       ? 'text-primary'
//                                       : 'text-secondary'
//                                   }`}>
//                                     <i className={`fas ${
//                                       selectedAnswers[currentQuestion.id] === option.id
//                                         ? 'fa-circle-dot'
//                                         : 'fa-circle'
//                                     }`}></i>
//                                   </div>
//                                   <span className="fw-bold me-2">{option.id}.</span>
//                                   <span>{option.text}</span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>

//                           {/* Navigation Controls */}
//                           <div className="d-flex justify-content-between align-items-center">
//                             <button
//                               onClick={handlePreviousQuestion}
//                               disabled={currentQuestionIndex === 0}
//                               className="btn btn-outline-secondary"
//                             >
//                               <i className="fas fa-arrow-left me-2"></i>Previous
//                             </button>

//                             <button
//                               onClick={toggleFlagQuestion}
//                               className={`btn ${
//                                 flaggedQuestions.has(currentQuestion?.id)
//                                   ? 'btn-warning'
//                                   : 'btn-outline-warning'
//                               }`}
//                             >
//                               <i className="fas fa-flag me-2"></i>
//                               {flaggedQuestions.has(currentQuestion?.id) ? 'Unflag' : 'Flag for Review'}
//                             </button>

//                             <button
//                               onClick={handleNextQuestion}
//                               disabled={currentQuestionIndex === questions.length - 1}
//                               className="btn btn-outline-secondary"
//                             >
//                               Next<i className="fas fa-arrow-right ms-2"></i>
//                             </button>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Question Palette */}
//                       <div className="card">
//                         <div className="card-body">
//                           <h6 className="card-title">Question Navigator</h6>
//                           <div className="question-palette mb-3">
//                             <div className="row g-2">
//                               {questions.map((_, index) => (
//                                 <div key={index} className="col-auto">
//                                   <button
//                                     onClick={() => navigateToQuestion(index)}
//                                     className={`btn question-btn ${getQuestionStatusClass(index)} ${
//                                       currentQuestionIndex === index ? 'active' : ''
//                                     }`}
//                                   >
//                                     {index + 1}
//                                   </button>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>

//                           <div className="row g-3 mb-3">
//                             <div className="col-auto">
//                               <div className="d-flex align-items-center">
//                                 <div className="bg-success" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
//                                 <small className="ms-2 text-muted">Answered ({Object.keys(selectedAnswers).length})</small>
//                               </div>
//                             </div>
//                             <div className="col-auto">
//                               <div className="d-flex align-items-center">
//                                 <div className="bg-danger" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
//                                 <small className="ms-2 text-muted">Unanswered ({questions.length - Object.keys(selectedAnswers).length})</small>
//                               </div>
//                             </div>
//                             <div className="col-auto">
//                               <div className="d-flex align-items-center">
//                                 <div className="bg-warning" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
//                                 <small className="ms-2 text-muted">Flagged ({flaggedQuestions.size})</small>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Progress Bar */}
//                           <div className="mb-3">
//                             <ProgressBar />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Student Info Sidebar */}
//               <div className="col-md-4 border-start bg-white h-100 py-3">
//                 <div className="sidebar">
//                   <div className="d-flex align-items-center mb-4">
//                     <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '48px', height: '48px'}}>
//                       <i className="fas fa-user text-primary"></i>
//                     </div>
//                     <div>
//                       <h6 className="mb-0">{studentInfo.name}</h6>
//                       <small className="text-muted">ID: {studentInfo.studentId}</small>
//                     </div>
//                   </div>
                  
//                   {/* Calculator Toggle */}
//                   <button
//                     onClick={() => setIsCalculatorVisible(!isCalculatorVisible)}
//                     className="btn btn-outline-secondary w-100 mb-3"
//                   >
//                     <i className="fas fa-calculator me-2"></i>
//                     {isCalculatorVisible ? 'Hide Calculator' : 'Show Calculator'}
//                   </button>

//                   <div className="row g-3">
//                     <div className="col-12">
//                       <div className="card bg-light">
//                         <div className="card-body">
//                           <h6 className="card-title">Current Subject</h6>
//                           <div className="small text-muted">
//                             <p className="mb-1">{CONFIG.SUBJECTS[currentSubject].name}</p>
//                             <p className="mb-1">Questions: {questions.length}</p>
//                             <p className="mb-0">Answered: {Object.keys(selectedAnswers).length}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="col-12">
//                       <div className="card bg-light">
//                         <div className="card-body">
//                           <h6 className="card-title">Exam Status</h6>
//                           <div className="small text-muted">
//                             <p className="mb-1">Time Used: {formatTime(CONFIG.EXAM_DURATION - timeRemaining)}</p>
//                             <p className="mb-0">Connection: <span className="text-success">Stable</span></p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="col-12">
//                       <div className="card bg-light">
//                         <div className="card-body">
//                           <h6 className="card-title">Instructions</h6>
//                           <ul className="list-unstyled small text-muted mb-0">
//                             <li className="mb-1">• Read questions carefully</li>
//                             <li className="mb-1">• Use flag feature for review</li>
//                             <li className="mb-1">• Calculator available when needed</li>
//                             <li className="mb-1">• Auto-save every 30 seconds</li>
//                             <li className="mb-1">• Press 'S' to submit exam</li>
//                             <li className="mb-1">• Press 'N' for next, 'P' for previous</li>
//                             <li className="mb-1">• Press 'R' to clear selected option</li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="col-12">
//                       <button
//                         onClick={handleSubmitExam}
//                         className="btn btn-primary w-100"
//                       >
//                         <i className="fas fa-paper-plane me-2"></i>Submit Exam
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>

//         {/* Calculator Component */}
//         {isCalculatorVisible && (
//           <div
//             className="calculator position-fixed bg-white border shadow-lg rounded"
//             style={{
//               left: `${calculatorPosition.x}px`,
//               top: `${calculatorPosition.y}px`,
//               width: isCalculatorMinimized ? '200px' : '280px',
//               zIndex: 1000
//             }}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//           >
//             <div
//               className="calculator-header d-flex justify-content-between align-items-center p-2 bg-light border-bottom"
//               onMouseDown={handleMouseDown}
//               style={{ cursor: 'move' }}
//             >
//               <span className="fw-bold">Calculator</span>
//               <div className="btn-group">
//                 <button
//                   onClick={() => setIsCalculatorMinimized(!isCalculatorMinimized)}
//                   className="btn btn-sm btn-light"
//                 >
//                   <i className={`fas ${isCalculatorMinimized ? 'fa-expand' : 'fa-compress'}`}></i>
//                 </button>
//                 <button
//                   onClick={() => setIsCalculatorVisible(false)}
//                   className="btn btn-sm btn-light"
//                 >
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>
//             </div>

//             {!isCalculatorMinimized && (
//               <>
//                 <div className="p-2 bg-light">
//                   <input
//                     type="text"
//                     value={calculatorValue}
//                     readOnly
//                     className="form-control text-end fw-bold fs-5"
//                   />
//                 </div>
//                 <div className="p-2">
//                   <div className="row g-1">
//                     {['C', 'CE', '/', '*'].map(btn => (
//                       <div key={btn} className="col-3">
//                         <button
//                           onClick={() => handleCalculatorOperation(btn)}
//                           className="btn btn-outline-secondary w-100"
//                         >
//                           {btn}
//                         </button>
//                       </div>
//                     ))}
//                     {['7', '8', '9', '-'].map(btn => (
//                       <div key={btn} className="col-3">
//                         <button
//                           onClick={() => handleCalculatorOperation(btn)}
//                           className="btn btn-outline-secondary w-100"
//                         >
//                           {btn}
//                         </button>
//                       </div>
//                     ))}
//                     {['4', '5', '6', '+'].map(btn => (
//                       <div key={btn} className="col-3">
//                         <button
//                           onClick={() => handleCalculatorOperation(btn)}
//                           className="btn btn-outline-secondary w-100"
//                         >
//                           {btn}
//                         </button>
//                       </div>
//                     ))}
//                     {['1', '2', '3'].map(btn => (
//                       <div key={btn} className="col-3">
//                         <button
//                           onClick={() => handleCalculatorOperation(btn)}
//                           className="btn btn-outline-secondary w-100"
//                         >
//                           {btn}
//                         </button>
//                       </div>
//                     ))}
//                     <div className="col-3">
//                       <button
//                         onClick={() => handleCalculatorOperation('=')}
//                         className="btn btn-primary w-100"
//                       >
//                         =
//                       </button>
//                     </div>
//                     {['0', '.'].map(btn => (
//                       <div key={btn} className="col-6">
//                         <button
//                           onClick={() => handleCalculatorOperation(btn)}
//                           className="btn btn-outline-secondary w-100"
//                         >
//                           {btn}
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                  </div>
//             </>
//           )}
//         </div>
//       )}
//       </div>

//       {/* Global styles */}
//     </>
//   );
// }

// export default Exam;

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from './components/progressBar'; 
import bootstrapStyle from "./styles/bootstrapStyle";

const Exam = () => {
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
  const navigate = useNavigate();
 const studentId = localStorage.getItem("studentID");

if (!studentId || studentId === 'GUEST') {
  alert("Missing or invalid student ID. Please log in again.");
  navigate("/login"); // Or your login/dashboard route
  return null;
}
  
  // Get student data from localStorage or use default
  const getStudentData = () => {
    try {
      const rawStudentData = localStorage.getItem('studentData');
      return rawStudentData ? JSON.parse(rawStudentData) : { first_name: 'Guest', last_name: 'User' };
    } catch (error) {
      console.error('Error parsing student data:', error);
      return { first_name: 'Guest', last_name: 'User' };
    }
  };

  const studentData = getStudentData();

  // Student Information
  const [studentInfo] = useState({
    name: studentData.first_name + " " + studentData.last_name,
    studentId: studentId,
    examId: 'CBT_2025_001',
    course: 'JAMB CBT Examination'
  });

  // Core States
  const [timeRemaining, setTimeRemaining] = useState(CONFIG.EXAM_DURATION);
  const [currentSubject, setCurrentSubject] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState({}); // Store all questions by subject
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [examSessionId, setExamSessionId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);

  // Calculator States
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  const [calculatorPosition, setCalculatorPosition] = useState({ x: 20, y: 300 });
  const [calculatorValue, setCalculatorValue] = useState('0');
  const [isCalculatorMinimized, setIsCalculatorMinimized] = useState(false);

  // Refs
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });
  const autoSaveRef = useRef();
  const lastSavedAnswers = useRef({});

  // API Helper Functions
  const apiCall = async (endpoint, options = {}) => {
  const studentId = localStorage.getItem('studentID'); // fetch from localStorage

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_PATH}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `StudentID ${studentId}`,
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API error:`, errorData);
      throw new Error(`API call failed: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return await response.json();

  } catch (error) {
    console.error("API Call Failed:", error.message);
    throw error;
  }
};


      // if (!response.ok) {
      //   throw new Error(`API call failed: ${response.status} - ${response.statusText}`);
      // }
    //   if (!response.ok) {
    //   const errorData = await response.json().catch(() => ({}));
    //   console.error(`API error:`, errorData);
    //   throw new Error(`API call failed: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
    // }


  //     return await response.json();
  //   } catch (error) {
  //     console.error(`API Error for ${endpoint}:`, error);
  //     throw error;
  //   }
  // };
//   const newSession = await apiCall('exam-sessions/', {
//   method: 'POST',
//   body: JSON.stringify(sessionData)
// });

  // Load all questions from backend and store in localStorage
  const loadAllQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if questions are already in localStorage
      const cachedQuestions = localStorage.getItem('examQuestions');
      if (cachedQuestions) {
        const parsedQuestions = JSON.parse(cachedQuestions);
        setAllQuestions(parsedQuestions);
        
        // Load questions for current subject
        const subjectQuestions = parsedQuestions[CONFIG.SUBJECTS[currentSubject].id] || [];
        setQuestions(subjectQuestions);
        setLoading(false);
        return;
      }

      // Fetch all questions from backend
      const questionsData = await apiCall('questions/');
      console.log("Fetched questions:", questionsData);

      
      // Group questions by subject
      const questionsBySubject = {};
      CONFIG.SUBJECTS.forEach(subject => {
        questionsBySubject[subject.id] = questionsData.filter(q => 
          q.subject?.name?.toLowerCase() === subject.name.toLowerCase() ||
          q.subject?.code?.toLowerCase() === subject.code.toLowerCase()
        );
      });

      // Store in localStorage and state
      localStorage.setItem('examQuestions', JSON.stringify(questionsBySubject));
      setAllQuestions(questionsBySubject);
      
      // Load questions for current subject
      const subjectQuestions = questionsBySubject[CONFIG.SUBJECTS[currentSubject].id] || [];
      setQuestions(subjectQuestions);

    } catch (error) {
      console.error('Error loading questions:', error);
      setError(`Failed to load questions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create or get exam session
 // Create or get exam session
const initializeExamSession = async () => {
  try {
    const existingSessionId = localStorage.getItem('examSessionId');

    const isValidSessionId = existingSessionId && existingSessionId !== 'undefined' && existingSessionId !== 'null';

    if (isValidSessionId) {
      console.log("✅ Found existing session ID:", existingSessionId);
      setExamSessionId(existingSessionId);
      await loadExistingSession(existingSessionId);
      return;
    }

    // Get exam ID from location state or use default
     // No valid session — create a new one
    const examId = location.state?.examId || 1;
    const studentId = localStorage.getItem('studentID');

    // Create new exam session
    const sessionData = {
      student: studentId, // Use studentId as expected by backend
      exam: examId, // Use exam (not examId) as expected by backend
      time_remaining: CONFIG.EXAM_DURATION, // required field
      started_at: new Date().toISOString(),
      status: 'active'
    };

    const newSession = await apiCall('exam-sessions/', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });

    setExamSessionId(newSession.id);
    localStorage.setItem('examSessionId', newSession.id);
    
  } catch (error) {
    console.error('Error initializing exam session:', error);
    setError(`Failed to initialize exam session: ${error.message}`);
  }
};
  // Load existing exam session
  const loadExistingSession = async (sessionId) => {
    try {
      // const session = await apiCall(`exam-sessions/${sessionId}/`);
    //  const session = await apiCall(`exam-sessions/${sessionId}/`);

// Extract questions from session response
      const sessionQuestions = session.questions || [];

      // Group questions by subject
      const questionsBySubject = {};
      CONFIG.SUBJECTS.forEach(subject => {
        questionsBySubject[subject.id] = sessionQuestions.filter(q => {
          return (
            q.subject?.name?.toLowerCase() === subject.name.toLowerCase() ||
            q.subject?.code?.toLowerCase() === subject.code.toLowerCase()
          );
        });
      });

      // Save to state/localStorage
      localStorage.setItem('examQuestions', JSON.stringify(questionsBySubject));
      setAllQuestions(questionsBySubject);

      // Load current subject questions
      const subjectQuestions = questionsBySubject[CONFIG.SUBJECTS[currentSubject].id] || [];
      setQuestions(subjectQuestions);

      // Load saved answers
      const answers = await apiCall(`answers/?session=${sessionId}`);
      const answersMap = {};
      answers.forEach(answer => {
        answersMap[answer.question] = answer.selected_option;
      });
      
      setSelectedAnswers(answersMap);
      lastSavedAnswers.current = {...answersMap};
      
      // Calculate time remaining if session has a time limit
      if (session.started_at) {
        const startTime = new Date(session.started_at);
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        const remainingTime = Math.max(0, CONFIG.EXAM_DURATION - elapsedSeconds);
        setTimeRemaining(remainingTime);
      }
      
    } catch (error) {
      console.error('Error loading existing session:', error);
    }
  };

  // Save answers to backend
  const saveAnswersToBackend = async (answersToSave = selectedAnswers) => {
    if (!examSessionId) return;

    try {
      const promises = [];
      
      // Only save answers that have changed
      for (const [questionId, selectedOption] of Object.entries(answersToSave)) {
        if (lastSavedAnswers.current[questionId] !== selectedOption) {
          const answerData = {
            session: examSessionId,
            question: questionId,
            selected_option: selectedOption,
            answered_at: new Date().toISOString()
          };

          promises.push(
            apiCall('answers/', {
              method: 'POST',
              body: JSON.stringify(answerData)
            }).catch(error => {
              // If answer exists, update it
              if (error.message.includes('400')) {
                return apiCall(`answers/${questionId}/`, {
                  method: 'PUT',
                  body: JSON.stringify(answerData)
                });
              }
              throw error;
            })
          );
        }
      }

      await Promise.all(promises);
      lastSavedAnswers.current = {...answersToSave};
      
    } catch (error) {
      console.error('Error saving answers:', error);
      // Don't show error to user as this is auto-save
    }
  };

  // Submit exam to backend
  const submitExam = async () => {
    if (!examSessionId) return;

    try {
      setLoading(true);
      
      // Save any pending answers
      await saveAnswersToBackend();
      
      // Update exam session status
      const submissionData = {
        status: 'completed',
        submitted_at: new Date().toISOString(),
        time_taken: CONFIG.EXAM_DURATION - timeRemaining
      };

      await apiCall(`exam-sessions/${examSessionId}/`, {
        method: 'PATCH',
        body: JSON.stringify(submissionData)
      });

      // Clear localStorage
      localStorage.removeItem('examSessionId');
      localStorage.removeItem('examQuestions');
      
      alert('Exam submitted successfully!');
      navigate('/exit');
      
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler functions
  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    const confirmed = window.confirm('Are you sure you want to submit the exam?');
    if (confirmed) {
      submitExam();
    }
  };

  // Calculator operation handler
  const handleCalculatorOperation = (operation) => {
    setCalculatorValue(prev => {
      try {
        switch (operation) {
          case 'C':
            return '0';
          case 'CE':
            return '0';
          case '=':
            // Simple evaluation - in production, use a proper math parser
            return String(eval(prev.replace(/[^0-9+\-*/.]/g, '')));
          case '+':
          case '-':
          case '*':
          case '/':
            return prev + operation;
          case '.':
            return prev.includes('.') ? prev : prev + '.';
          default:
            return prev === '0' ? operation : prev + operation;
        }
      } catch (error) {
        return 'Error';
      }
    });
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

  // Handle subject change
  const handleSubjectChange = (index) => {
    setCurrentSubject(index);
    setCurrentQuestionIndex(0);
    
    // Load questions for the selected subject
    const subjectQuestions = allQuestions[CONFIG.SUBJECTS[index].id] || [];
    setQuestions(subjectQuestions);
  };

  // Effects

  // Initialize exam session and load questions
  useEffect(() => {
    initializeExamSession();
    loadAllQuestions();
  }, []);

  // Auto-save answers
  useEffect(() => {
    if (examSessionId && Object.keys(selectedAnswers).length > 0) {
      const saveTimer = setTimeout(() => {
        saveAnswersToBackend();
      }, 2000); // Save 2 seconds after user stops selecting answers

      return () => clearTimeout(saveTimer);
    }
  }, [selectedAnswers, examSessionId]);

  // Periodic auto-save
  useEffect(() => {
    if (examSessionId) {
      const interval = setInterval(() => {
        saveAnswersToBackend();
      }, CONFIG.AUTO_SAVE_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [examSessionId]);

  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const currentQuestion = questions[currentQuestionIndex];
      
      if (!currentQuestion) return;

      if (['A', 'B', 'C', 'D', 'N', 'P', 'S', 'R'].includes(key)) {
        e.preventDefault();
      }

      switch (key) {
        case 'A':
        case 'B':
        case 'C':
        case 'D':
          handleAnswerSelect(currentQuestion.id, key);
          break;
        case 'N':
          handleNextQuestion();
          break;
        case 'P':
          handlePreviousQuestion();
          break;
        case 'S':
          handleSubmitExam();
          break;
        case 'R':
          setSelectedAnswers((prev) => {
            const newAnswers = { ...prev };
            delete newAnswers[currentQuestion.id];
            return newAnswers;
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questions, currentQuestionIndex]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
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

  // Calculator drag handlers
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

  // Prevent page refresh/close without warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

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
            <p className="text-muted">Loading exam questions...</p>
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
            <div className="d-flex gap-2 justify-content-center">
              <button 
                onClick={() => {
                  setError(null);
                  loadAllQuestions();
                }}
                className="btn btn-primary"
              >
                Retry Loading Questions
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('examQuestions');
                  localStorage.removeItem('examSessionId');
                  window.location.reload();
                }}
                className="btn btn-secondary"
              >
                Reset Exam
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Render Logic
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
                <small className="text-muted">
                  Exam ID: {studentInfo.examId} | Session: {examSessionId}
                </small>
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
              {CONFIG.SUBJECTS.map((subject, index) => {
                const subjectQuestions = allQuestions[subject.id] || [];
                const subjectAnswers = subjectQuestions.filter(q => selectedAnswers[q.id]);
                
                return (
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
                      <div className="text-xs opacity-75">
                        {subject.code} ({subjectAnswers.length}/{subjectQuestions.length})
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            
            {questions.length > 0 && (
              <div className="d-flex justify-content-between align-items-center">
                <p className="text-muted mb-0">
                  Question {currentQuestionIndex + 1} of {questions.length} - {CONFIG.SUBJECTS[currentSubject].name}
                </p>
                <small className="text-muted">
                  Auto-save: {Object.keys(selectedAnswers).length > Object.keys(lastSavedAnswers.current).length ? 'Saving...' : 'Saved'}
                </small>
              </div>
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
                              <div className="d-flex gap-2">
                                {flaggedQuestions.has(currentQuestion?.id) && (
                                  <span className="badge bg-warning">
                                    <i className="fas fa-flag"></i> Flagged
                                  </span>
                                )}
                                {selectedAnswers[currentQuestion?.id] && (
                                  <span className="badge bg-success">
                                    <i className="fas fa-check"></i> Answered
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="card-text lead">
                              {currentQuestion?.text || currentQuestion?.question_text}
                            </p>
                          </div>

                          {/* Options */}
                          <div className="mb-4">
                            {currentQuestion?.options?.map(option => (
                              <div
                                key={option.id}
                                onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                                className={`answer-option p-3 border rounded mb-2 cursor-pointer ${
                                  selectedAnswers[currentQuestion.id] === option.id
                                    ? 'selected border-primary bg-primary bg-opacity-10'
                                    : 'border-secondary'
                                }`}
                                style={{ cursor: 'pointer' }}
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
                                  <span>{option.text || option.option_text}</span>
                                </div>
                              </div>
                            )) || (
                              // Fallback for different option structure
                              ['A', 'B', 'C', 'D'].map(optionId => (
                                <div
                                  key={optionId}
                                  onClick={() => handleAnswerSelect(currentQuestion.id, optionId)}
                                  className={`answer-option p-3 border rounded mb-2 cursor-pointer ${
                                    selectedAnswers[currentQuestion.id] === optionId
                                      ? 'selected border-primary bg-primary bg-opacity-10'
                                      : 'border-secondary'
                                  }`}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div className="d-flex align-items-center">
                                    <div className={`me-3 ${
                                      selectedAnswers[currentQuestion.id] === optionId
                                        ? 'text-primary'
                                        : 'text-secondary'
                                    }`}>
                                      <i className={`fas ${
                                        selectedAnswers[currentQuestion.id] === optionId
                                          ? 'fa-circle-dot'
                                          : 'fa-circle'
                                      }`}></i>
                                    </div>
                                    <span className="fw-bold me-2">{optionId}.</span>
                                    <span>{currentQuestion[`option_${optionId.toLowerCase()}`]}</span>
                                  </div>
                                </div>
                              ))
                            )}
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
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <small className="text-muted">Overall Progress</small>
                              <small className="text-muted">
                                {Math.round((Object.keys(selectedAnswers).length / questions.length) * 100)}%
                              </small>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-primary" 
                                style={{ 
                                  width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-md-4 bg-white border-start h-100 py-3">
                <div className="sidebar-content">
                  {/* Student Info */}
                  <div className="card mb-3">
                    <div className="card-body">
                      <h6 className="card-title">Student Information</h6>
                      <div className="student-info">
                        <div className="mb-2">
                          <strong>Name:</strong> {studentInfo.name}
                        </div>
                        <div className="mb-2">
                          <strong>Student ID:</strong> {studentInfo.studentId}
                        </div>
                        <div className="mb-2">
                          <strong>Subject:</strong> {CONFIG.SUBJECTS[currentSubject].name}
                        </div>
                        <div className="mb-2">
                          <strong>Questions:</strong> {currentQuestionIndex + 1} of {questions.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculator */}
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="card-title mb-0">Calculator</h6>
                        <button
                          onClick={() => setIsCalculatorVisible(!isCalculatorVisible)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          {isCalculatorVisible ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="card mb-3">
                    <div className="card-body">
                      <h6 className="card-title">Quick Actions</h6>
                      <div className="d-grid gap-2">
                        <button
                          onClick={() => setSelectedAnswers(prev => {
                            const newAnswers = { ...prev };
                            delete newAnswers[currentQuestion?.id];
                            return newAnswers;
                          })}
                          className="btn btn-outline-warning btn-sm"
                          disabled={!selectedAnswers[currentQuestion?.id]}
                        >
                          <i className="fas fa-times me-2"></i>Clear Answer
                        </button>
                        <button
                          onClick={() => {
                            const flaggedQuestionsList = questions.filter(q => flaggedQuestions.has(q.id));
                            if (flaggedQuestionsList.length > 0) {
                              const nextFlagged = flaggedQuestionsList.find(q => 
                                questions.findIndex(question => question.id === q.id) > currentQuestionIndex
                              );
                              if (nextFlagged) {
                                const index = questions.findIndex(q => q.id === nextFlagged.id);
                                navigateToQuestion(index);
                              }
                            }
                          }}
                          className="btn btn-outline-info btn-sm"
                          disabled={flaggedQuestions.size === 0}
                        >
                          <i className="fas fa-flag me-2"></i>Next Flagged
                        </button>
                        <button
                          onClick={() => {
                            const unansweredQuestions = questions.filter(q => !selectedAnswers[q.id]);
                            if (unansweredQuestions.length > 0) {
                              const nextUnanswered = unansweredQuestions.find(q => 
                                questions.findIndex(question => question.id === q.id) > currentQuestionIndex
                              );
                              if (nextUnanswered) {
                                const index = questions.findIndex(q => q.id === nextUnanswered.id);
                                navigateToQuestion(index);
                              }
                            }
                          }}
                          className="btn btn-outline-danger btn-sm"
                          disabled={Object.keys(selectedAnswers).length === questions.length}
                        >
                          <i className="fas fa-question me-2"></i>Next Unanswered
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Keyboard Shortcuts */}
                  <div className="card mb-3">
                    <div className="card-body">
                      <h6 className="card-title">Keyboard Shortcuts</h6>
                      <div className="shortcuts">
                        <div className="row g-2 mb-2">
                          <div className="col-4"><kbd>A-D</kbd></div>
                          <div className="col-8"><small>Select option</small></div>
                        </div>
                        <div className="row g-2 mb-2">
                          <div className="col-4"><kbd>N</kbd></div>
                          <div className="col-8"><small>Next question</small></div>
                        </div>
                        <div className="row g-2 mb-2">
                          <div className="col-4"><kbd>P</kbd></div>
                          <div className="col-8"><small>Previous question</small></div>
                        </div>
                        <div className="row g-2 mb-2">
                          <div className="col-4"><kbd>R</kbd></div>
                          <div className="col-8"><small>Reset answer</small></div>
                        </div>
                        <div className="row g-2">
                          <div className="col-4"><kbd>S</kbd></div>
                          <div className="col-8"><small>Submit exam</small></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title text-danger">Submit Exam</h6>
                      <p className="text-muted small mb-3">
                        Make sure you have answered all questions before submitting.
                      </p>
                      <button
                        onClick={handleSubmitExam}
                        disabled={loading}
                        className="btn btn-danger w-100"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Submit Exam
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Calculator (if enabled) */}
      {isCalculatorVisible && (
        <div
          className="floating-calculator position-fixed bg-white border rounded shadow"
          style={{
            left: `${calculatorPosition.x}px`,
            top: `${calculatorPosition.y}px`,
            zIndex: 1000,
            width: '250px',
            display: isCalculatorMinimized ? 'none' : 'block'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="calculator-header bg-primary text-white p-2 d-flex justify-content-between align-items-center"
            style={{ cursor: 'move' }}
            onMouseDown={handleMouseDown}
          >
            <span className="small fw-bold">Calculator</span>
            <div>
              <button
                onClick={() => setIsCalculatorMinimized(!isCalculatorMinimized)}
                className="btn btn-sm btn-outline-light me-1"
                style={{ padding: '2px 6px' }}
              >
                <i className="fas fa-minus"></i>
              </button>
              <button
                onClick={() => setIsCalculatorVisible(false)}
                className="btn btn-sm btn-outline-light"
                style={{ padding: '2px 6px' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div className="p-3">
            <div className="mb-2">
              <input
                type="text"
                value={calculatorValue}
                readOnly
                className="form-control text-end"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
            <div className="calculator-buttons">
              {/* Calculator buttons - same as sidebar calculator */}
              <div className="row g-1 mb-1">
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('C')}
                    className="btn btn-sm btn-outline-danger w-100"
                  >
                    C
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('CE')}
                    className="btn btn-sm btn-outline-warning w-100"
                  >
                    CE
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('/')}
                    className="btn btn-sm btn-outline-secondary w-100"
                  >
                    ÷
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('*')}
                    className="btn btn-sm btn-outline-secondary w-100"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="row g-1 mb-1">
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('7')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    7
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('8')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    8
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('9')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    9
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('-')}
                    className="btn btn-sm btn-outline-secondary w-100"
                  >
                    -
                  </button>
                </div>
              </div>
              <div className="row g-1 mb-1">
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('4')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    4
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('5')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    5
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('6')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    6
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('+')}
                    className="btn btn-sm btn-outline-secondary w-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="row g-1 mb-1">
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('1')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    1
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('2')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    2
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('3')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    3
                  </button>
                </div>
                <div className="col-3 d-flex" style={{ flexDirection: 'column' }}>
                  <button
                    onClick={() => handleCalculatorOperation('=')}
                    className="btn btn-sm btn-primary flex-grow-1"
                  >
                    =
                  </button>
                </div>
              </div>
              <div className="row g-1">
                <div className="col-6">
                  <button
                    onClick={() => handleCalculatorOperation('0')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    0
                  </button>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => handleCalculatorOperation('.')}
                    className="btn btn-sm btn-outline-dark w-100"
                  >
                    .
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .exam-container {
          height: 100vh;
          overflow: hidden;
        }
        
        .exam-header {
          border-bottom: 2px solid #dee2e6;
          flex-shrink: 0;
        }
        
        .exam-main {
          overflow-y: auto;
        }
        
        .time-critical {
          background: #dc3545 !important;
          color: white !important;
          animation: pulse 1s infinite;
        }
        
        .time-warning {
          background: #ffc107 !important;
          color: black !important;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        .answer-option {
          transition: all 0.2s ease;
        }
        
        .answer-option:hover {
          border-color: #0d6efd !important;
          background: rgba(13, 110, 253, 0.05) !important;
        }
        
        .answer-option.selected {
          border-color: #0d6efd !important;
          background: rgba(13, 110, 253, 0.1) !important;
        }
        
        .question-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 14px;
          padding: 0;
        }
        
        .question-btn.active {
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
        }
        
        .floating-calculator {
          user-select: none;
        }
        
        .calculator-header {
          cursor: move;
        }
        
        .shortcuts kbd {
          font-size: 10px;
        }
        
        .sidebar-content {
          max-height: 100%;
          overflow-y: auto;
        }
        
        .calculator-buttons .btn {
          font-size: 12px;
          padding: 4px 8px;
        }
        
        .progress {
          border-radius: 10px;
        }
        
        .progress-bar {
          transition: width 0.3s ease;
        }
        
        .card {
          border: 1px solid #dee2e6;
          border-radius: 8px;
        }
        
        .card-title {
          font-size: 14px;
          font-weight: 600;
          color: #495057;
        }
        
        .text-xs {
          font-size: 0.75rem;
        }
        
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }
        
        @media (max-width: 768px) {
          .col-md-8, .col-md-4 {
            flex: 0 0 100%;
          }
          
          .exam-main .row {
            flex-direction: column;
          }
          
          .floating-calculator {
            width: 200px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Exam;
