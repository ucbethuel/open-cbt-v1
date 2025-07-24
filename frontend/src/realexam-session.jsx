// // import React, { useState, useEffect, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // // Configuration - Easy to modify
// // const CONFIG = {
// //   EXAM_DURATION: 7200, // 2 hours in seconds
// //   API_BASE_URL: 'http://127.0.0.1:8000',
// //   API_PATH: '/api/',
// //   WARNING_TIMES: [1800, 900, 300], // 30, 15, 5 minutes warnings
// //   SUBJECTS: [
// //     { id: 'math', name: 'Mathematics', code: 'MTH' },
// //     { id: 'english', name: 'English Language', code: 'ENG' },
// //     { id: 'physics', name: 'Physics', code: 'PHY' },
// //     { id: 'chemistry', name: 'Chemistry', code: 'CHM' }
// //   ],
// //   AUTO_SAVE_INTERVAL: 30000 // Auto-save every 30 seconds
// // };

// // const ExamSession = () => {
// //   const navigate = useNavigate();
  
// //   // Get student data from localStorage
// //   const getStudentData = () => {
// //     try {
// //       const studentId = localStorage.getItem('studentID');
// //       const rawStudentData = localStorage.getItem('studentData');
// //       const studentData = rawStudentData ? JSON.parse(rawStudentData) : {};
      
// //       if (!studentId || studentId === 'GUEST') {
// //         alert('Missing or invalid student ID. Please log in again.');
// //         navigate('/dashboard');
// //         return null;
// //       }
      
// //       return {
// //         studentId,
// //         name: `${studentData.first_name || 'Guest'} ${studentData.last_name || 'User'}`,
// //         examId: 'CBT_2025_001',
// //         course: 'JAMB CBT Examination'
// //       };
// //     } catch (error) {
// //       console.error('Error getting student data:', error);
// //       return null;
// //     }
// //   };

// //   const studentInfo = getStudentData();
  
// //   // Core States
// //   const [timeRemaining, setTimeRemaining] = useState(CONFIG.EXAM_DURATION);
// //   const [currentSubject, setCurrentSubject] = useState(0);
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //   const [questions, setQuestions] = useState([]);
// //   const [allQuestions, setAllQuestions] = useState({});
// //   const [selectedAnswers, setSelectedAnswers] = useState({});
// //   const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [examSessionId, setExamSessionId] = useState(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // Calculator States
// //   const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
// //   const [calculatorValue, setCalculatorValue] = useState('0');

// //   // Refs
// //   const autoSaveRef = useRef();
// //   const lastSavedAnswers = useRef({});

// //   // Utility Functions
// //   const formatTime = (seconds) => {
// //     const hours = Math.floor(seconds / 3600);
// //     const minutes = Math.floor((seconds % 3600) / 60);
// //     const secs = seconds % 60;
// //     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// //   };

// //   // API Helper Functions
// //   const apiCall = async (endpoint, options = {}) => {
// //     try {
// //       const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_PATH}${endpoint}`, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `StudentID ${studentInfo?.studentId}`,
// //           ...options.headers
// //         },
// //         ...options
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({}));
// //         throw new Error(`API call failed: ${response.status} - ${response.statusText}`);
// //       }

// //       return await response.json();
// //     } catch (error) {
// //       console.error(`API Error for ${endpoint}:`, error);
// //       throw error;
// //     }
// //   };

// //   // Load Questions from API and store in localStorage
// //   const loadAllQuestions = async () => {
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       // Check if questions are already in localStorage
// //       const cachedQuestions = localStorage.getItem('examQuestions');
// //       if (cachedQuestions) {
// //         const parsedQuestions = JSON.parse(cachedQuestions);
// //         setAllQuestions(parsedQuestions);
        
// //         // Load questions for current subject
// //         const subjectQuestions = parsedQuestions[CONFIG.SUBJECTS[currentSubject].id] || [];
// //         setQuestions(subjectQuestions);
// //         setLoading(false);
// //         return;
// //       }

// //       // Fetch all questions from backend
// //       const questionsData = await apiCall('questions/');
// //       console.log('Raw questions data:', questionsData);
      
// //       if (!Array.isArray(questionsData)) {
// //         throw new Error('Invalid questions data format received from server');
// //       }

// //       // Group questions by subject
// //       const questionsBySubject = {};
// //       CONFIG.SUBJECTS.forEach(subject => {
// //         const matched = questionsData.filter(q => {
// //           if (!q.subject) return false;
          
// //           const questionSubjectName = q.subject.name?.toLowerCase() || '';
// //           const questionSubjectCode = q.subject.code?.toLowerCase() || '';
// //           const configSubjectName = subject.name.toLowerCase();
// //           const configSubjectCode = subject.code.toLowerCase();

// //           return questionSubjectName === configSubjectName ||
// //                  questionSubjectCode === configSubjectCode ||
// //                  questionSubjectName.includes(configSubjectName) ||
// //                  configSubjectName.includes(questionSubjectName);
// //         });

// //         questionsBySubject[subject.id] = matched;
// //       });

// //       console.log('Grouped questions by subject:', questionsBySubject);

// //       // Store in localStorage and state
// //       localStorage.setItem('examQuestions', JSON.stringify(questionsBySubject));
// //       setAllQuestions(questionsBySubject);
      
// //       // Load questions for current subject
// //       const subjectQuestions = questionsBySubject[CONFIG.SUBJECTS[currentSubject].id] || [];
// //       setQuestions(subjectQuestions);

// //     } catch (error) {
// //       console.error('Error loading questions:', error);
// //       setError(`Failed to load questions: ${error.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Save answers to localStorage immediately
// //   const saveAnswersToLocalStorage = (answers) => {
// //     try {
// //       localStorage.setItem('examAnswers', JSON.stringify(answers));
// //       localStorage.setItem('examAnswersTimestamp', Date.now().toString());
// //     } catch (error) {
// //       console.error('Error saving answers to localStorage:', error);
// //     }
// //   };

// //   // Load answers from localStorage
// //   const loadAnswersFromLocalStorage = () => {
// //     try {
// //       const savedAnswers = localStorage.getItem('examAnswers');
// //       if (savedAnswers) {
// //         const answers = JSON.parse(savedAnswers);
// //         setSelectedAnswers(answers);
// //         return answers;
// //       }
// //     } catch (error) {
// //       console.error('Error loading answers from localStorage:', error);
// //     }
// //     return {};
// //   };

// //   // Save answers to backend (background operation)
// //   const saveAnswersToBackend = async (answersToSave = selectedAnswers) => {
// //     if (!examSessionId) return;

// //     try {
// //       const promises = [];
      
// //       for (const [questionId, selectedOption] of Object.entries(answersToSave)) {
// //         if (lastSavedAnswers.current[questionId] !== selectedOption) {
// //           const answerData = {
// //             session: examSessionId,
// //             question: questionId,
// //             selected_option: selectedOption,
// //             answered_at: new Date().toISOString()
// //           };

// //           promises.push(
// //             apiCall('answers/', {
// //               method: 'POST',
// //               body: JSON.stringify(answerData)
// //             }).catch(error => {
// //               if (error.message.includes('400')) {
// //                 return apiCall(`answers/${questionId}/`, {
// //                   method: 'PUT',
// //                   body: JSON.stringify(answerData)
// //                 });
// //               }
// //               throw error;
// //             })
// //           );
// //         }
// //       }

// //       await Promise.all(promises);
// //       lastSavedAnswers.current = {...answersToSave};
      
// //     } catch (error) {
// //       console.error('Error saving answers to backend:', error);
// //       // Don't show error to user as this is background save
// //     }
// //   };

// //   // Submit exam
// //   const submitExam = async () => {
// //     setIsSubmitting(true);
    
// //     try {
// //       const answeredCount = Object.keys(selectedAnswers).length;
// //       const totalQuestions = Object.values(allQuestions).reduce((sum, subjectQuestions) => sum + subjectQuestions.length, 0);
      
// //       const confirmed = window.confirm(
// //         `Are you sure you want to submit the exam?\n\nAnswered: ${answeredCount}/${totalQuestions} questions\n\nThis action cannot be undone.`
// //       );
      
// //       if (!confirmed) {
// //         setIsSubmitting(false);
// //         return;
// //       }

// //       // Try to save to backend first
// //       try {
// //         if (examSessionId) {
// //           await saveAnswersToBackend();
          
// //           const submissionData = {
// //             status: 'completed',
// //             submitted_at: new Date().toISOString(),
// //             time_taken: CONFIG.EXAM_DURATION - timeRemaining
// //           };

// //           await apiCall(`exam-sessions/${examSessionId}/`, {
// //             method: 'PATCH',
// //             body: JSON.stringify(submissionData)
// //           });
// //         }
// //       } catch (backendError) {
// //         console.error('Backend submission failed:', backendError);
// //         // Continue with localStorage submission
// //       }

// //       // Save submission data to localStorage as backup
// //       const submissionData = {
// //         studentId: studentInfo.studentId,
// //         answers: selectedAnswers,
// //         submittedAt: new Date().toISOString(),
// //         timeTaken: CONFIG.EXAM_DURATION - timeRemaining,
// //         totalQuestions,
// //         answeredQuestions: answeredCount
// //       };
      
// //       localStorage.setItem('examSubmission', JSON.stringify(submissionData));
      
// //       // Clear exam data
// //       localStorage.removeItem('examSessionId');
// //       localStorage.removeItem('examQuestions');
// //       localStorage.removeItem('examAnswers');
      
// //       alert('Exam submitted successfully!');
// //       navigate('/exam-complete', { 
// //         state: { 
// //           submissionData,
// //           success: true 
// //         } 
// //       });
      
// //     } catch (error) {
// //       console.error('Error submitting exam:', error);
// //       alert('Failed to submit exam. Please try again.');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Handler Functions
// //   const handleAnswerSelect = (questionId, answerId) => {
// //     const newAnswers = {
// //       ...selectedAnswers,
// //       [questionId]: answerId
// //     };
    
// //     setSelectedAnswers(newAnswers);
// //     saveAnswersToLocalStorage(newAnswers);
// //   };

// //   const handleNextQuestion = () => {
// //     if (currentQuestionIndex < questions.length - 1) {
// //       setCurrentQuestionIndex(prev => prev + 1);
// //     }
// //   };

// //   const handlePreviousQuestion = () => {
// //     if (currentQuestionIndex > 0) {
// //       setCurrentQuestionIndex(prev => prev - 1);
// //     }
// //   };

// //   const toggleFlagQuestion = () => {
// //     if (!questions[currentQuestionIndex]) return;
    
// //     const questionId = questions[currentQuestionIndex].id;
// //     setFlaggedQuestions(prev => {
// //       const newSet = new Set(prev);
// //       if (newSet.has(questionId)) {
// //         newSet.delete(questionId);
// //       } else {
// //         newSet.add(questionId);
// //       }
// //       return newSet;
// //     });
// //   };

// //   const navigateToQuestion = (index) => {
// //     if (index >= 0 && index < questions.length) {
// //       setCurrentQuestionIndex(index);
// //     }
// //   };

// //   const getQuestionStatusClass = (index) => {
// //     if (!questions[index]) return 'btn-secondary';
    
// //     const questionId = questions[index].id;
// //     if (flaggedQuestions.has(questionId)) return 'btn-warning';
// //     if (selectedAnswers[questionId]) return 'btn-success';
// //     return 'btn-danger';
// //   };

// //   const handleSubjectChange = (index) => {
// //     setCurrentSubject(index);
// //     setCurrentQuestionIndex(0);
    
// //     const subjectQuestions = allQuestions[CONFIG.SUBJECTS[index].id] || [];
// //     setQuestions(subjectQuestions);
// //   };

// //   // Calculator Functions
// //   const handleCalculatorOperation = (operation) => {
// //     setCalculatorValue(prev => {
// //       try {
// //         switch (operation) {
// //           case 'C':
// //             return '0';
// //           case 'CE':
// //             return '0';
// //           case '=':
// //             return String(eval(prev.replace(/[^0-9+\-*/.]/g, '')));
// //           case '+':
// //           case '-':
// //           case '*':
// //           case '/':
// //             return prev + operation;
// //           case '.':
// //             return prev.includes('.') ? prev : prev + '.';
// //           default:
// //             return prev === '0' ? operation : prev + operation;
// //         }
// //       } catch (error) {
// //         return 'Error';
// //       }
// //     });
// //   };

// //   // Render Question Options
// //   const renderQuestionOptions = (question) => {
// //     if (!question) return null;

// //     // Check if question has options array (newer format)
// //     if (question.options && Array.isArray(question.options)) {
// //       return question.options.map(option => (
// //         <div
// //           key={option.id}
// //           onClick={() => handleAnswerSelect(question.id, option.id)}
// //           className={`answer-option p-3 border rounded mb-2 cursor-pointer ${
// //             selectedAnswers[question.id] === option.id
// //               ? 'selected border-primary bg-primary bg-opacity-10'
// //               : 'border-secondary'
// //           }`}
// //           style={{ cursor: 'pointer' }}
// //         >
// //           <div className="d-flex align-items-center">
// //             <div className={`me-3 ${
// //               selectedAnswers[question.id] === option.id
// //                 ? 'text-primary'
// //                 : 'text-secondary'
// //             }`}>
// //               <i className={`fas ${
// //                 selectedAnswers[question.id] === option.id
// //                   ? 'fa-circle-dot'
// //                   : 'fa-circle'
// //               }`}></i>
// //             </div>
// //             <span className="fw-bold me-2">{option.id}.</span>
// //             <span>{option.text || option.option_text}</span>
// //           </div>
// //         </div>
// //       ));
// //     }

// //     // Fallback for older format with option_a, option_b, etc.
// //     return ['A', 'B', 'C', 'D'].map(optionId => {
// //       const optionText = question[`option_${optionId.toLowerCase()}`];
      
// //       if (!optionText) return null;
      
// //       return (
// //         <div
// //           key={optionId}
// //           onClick={() => handleAnswerSelect(question.id, optionId)}
// //           className={`answer-option p-3 border rounded mb-2 cursor-pointer ${
// //             selectedAnswers[question.id] === optionId
// //               ? 'selected border-primary bg-primary bg-opacity-10'
// //               : 'border-secondary'
// //           }`}
// //           style={{ cursor: 'pointer' }}
// //         >
// //           <div className="d-flex align-items-center">
// //             <div className={`me-3 ${
// //               selectedAnswers[question.id] === optionId
// //                 ? 'text-primary'
// //                 : 'text-secondary'
// //             }`}>
// //               <i className={`fas ${
// //                 selectedAnswers[question.id] === optionId
// //                   ? 'fa-circle-dot'
// //                   : 'fa-circle'
// //               }`}></i>
// //             </div>
// //             <span className="fw-bold me-2">{optionId}.</span>
// //             <span>{optionText}</span>
// //           </div>
// //         </div>
// //       );
// //     }).filter(Boolean);
// //   };

// //   // Effects
// //   useEffect(() => {
// //     if (!studentInfo) return;
    
// //     loadAllQuestions();
// //     loadAnswersFromLocalStorage();
    
// //     // Initialize exam session ID
// //     const sessionId = localStorage.getItem('examSessionId') || `session_${Date.now()}`;
// //     setExamSessionId(sessionId);
// //     localStorage.setItem('examSessionId', sessionId);
// //   }, []);

// //   // Auto-save to backend periodically
// //   useEffect(() => {
// //     if (examSessionId && Object.keys(selectedAnswers).length > 0) {
// //       const interval = setInterval(() => {
// //         saveAnswersToBackend();
// //       }, CONFIG.AUTO_SAVE_INTERVAL);

// //       return () => clearInterval(interval);
// //     }
// //   }, [selectedAnswers, examSessionId]);

// //   // Timer effect
// //   useEffect(() => {
// //     if (timeRemaining <= 0) return;

// //     const timer = setInterval(() => {
// //       setTimeRemaining(prev => {
// //         if (prev <= 1) {
// //           clearInterval(timer);
// //           submitExam();
// //           return 0;
// //         }
// //         return prev - 1;
// //       });
// //     }, 1000);

// //     return () => clearInterval(timer);
// //   }, []);

// //   // Time warnings
// //   useEffect(() => {
// //     if (CONFIG.WARNING_TIMES.includes(timeRemaining)) {
// //       const minutesLeft = timeRemaining / 60;
// //       alert(`Warning: ${minutesLeft} minutes remaining!`);
// //     }
// //   }, [timeRemaining]);

// //   // Keyboard shortcuts
// //   useEffect(() => {
// //     const handleKeyDown = (e) => {
// //       const key = e.key.toUpperCase();
// //       const currentQuestion = questions[currentQuestionIndex];
      
// //       if (!currentQuestion) return;

// //       if (['A', 'B', 'C', 'D', 'N', 'P', 'S', 'R'].includes(key)) {
// //         e.preventDefault();
// //       }

// //       switch (key) {
// //         case 'A':
// //         case 'B':
// //         case 'C':
// //         case 'D':
// //           handleAnswerSelect(currentQuestion.id, key);
// //           break;
// //         case 'N':
// //           handleNextQuestion();
// //           break;
// //         case 'P':
// //           handlePreviousQuestion();
// //           break;
// //         case 'S':
// //           submitExam();
// //           break;
// //         case 'R':
// //           setSelectedAnswers(prev => {
// //             const newAnswers = { ...prev };
// //             delete newAnswers[currentQuestion.id];
// //             saveAnswersToLocalStorage(newAnswers);
// //             return newAnswers;
// //           });
// //           break;
// //         default:
// //           break;
// //       }
// //     };

// //     window.addEventListener('keydown', handleKeyDown);
// //     return () => window.removeEventListener('keydown', handleKeyDown);
// //   }, [questions, currentQuestionIndex]);

// //   // Prevent page refresh
// //   useEffect(() => {
// //     const handleBeforeUnload = (e) => {
// //       e.preventDefault();
// //       e.returnValue = '';
// //     };

// //     window.addEventListener('beforeunload', handleBeforeUnload);
// //     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
// //   }, []);

// //   // Loading state
// //   if (loading && questions.length === 0) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
// //         <div className="text-center">
// //           <div className="spinner-border text-primary mb-3" role="status">
// //             <span className="visually-hidden">Loading...</span>
// //           </div>
// //           <p className="text-muted">Loading exam questions...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Error state
// //   if (error) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
// //         <div className="text-center">
// //           <div className="text-danger mb-3">
// //             <i className="fas fa-exclamation-triangle fa-2x"></i>
// //           </div>
// //           <p className="text-danger mb-3">{error}</p>
// //           <div className="d-flex gap-2 justify-content-center">
// //             <button 
// //               onClick={() => {
// //                 setError(null);
// //                 loadAllQuestions();
// //               }}
// //               className="btn btn-primary"
// //             >
// //               Retry Loading Questions
// //             </button>
// //             <button 
// //               onClick={() => {
// //                 localStorage.removeItem('examQuestions');
// //                 localStorage.removeItem('examSessionId');
// //                 window.location.reload();
// //               }}
// //               className="btn btn-secondary"
// //             >
// //               Reset Exam
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!studentInfo) {
// //     return null;
// //   }

// //   const currentQuestion = questions[currentQuestionIndex];
// //   const totalQuestions = Object.values(allQuestions).reduce((sum, subjectQuestions) => sum + subjectQuestions.length, 0);
// //   const answeredCount = Object.keys(selectedAnswers).length;

// //   return (
// //     <div className="exam-container d-flex flex-column bg-light vh-100">
// //       {/* Bootstrap CSS */}
// //       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
// //       <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      
// //       {/* Header */}
// //       <header className="exam-header bg-white shadow-sm">
// //         <div className="container-fluid h-100 py-3">
// //           <div className="row align-items-center mb-3">
// //             <div className="col-md-8">
// //               <h1 className="h3 mb-1 text-dark">{studentInfo.course}</h1>
// //               <small className="text-muted">
// //                 Student: {studentInfo.name} | ID: {studentInfo.studentId}
// //               </small>
// //             </div>
            
// //             <div className="col-md-4 text-end">
// //               <div className={`p-2 rounded font-monospace fw-bold fs-5 ${
// //                 timeRemaining < 300 ? 'bg-danger text-white' : 
// //                 timeRemaining < 900 ? 'bg-warning text-dark' : 'bg-light'
// //               }`}>
// //                 {formatTime(timeRemaining)}
// //               </div>
// //               <small className="text-muted">Time Remaining</small>
// //             </div>
// //           </div>
          
// //           {/* Subject Tabs */}
// //           <div className="row g-1 mb-3">
// //             {CONFIG.SUBJECTS.map((subject, index) => {
// //               const subjectQuestions = allQuestions[subject.id] || [];
// //               const subjectAnswers = subjectQuestions.filter(q => selectedAnswers[q.id]);
              
// //               return (
// //                 <div key={subject.id} className="col">
// //                   <button
// //                     onClick={() => handleSubjectChange(index)}
// //                     disabled={loading}
// //                     className={`btn w-100 py-2 ${
// //                       currentSubject === index
// //                         ? 'btn-primary'
// //                         : 'btn-outline-secondary'
// //                     }`}
// //                   >
// //                     <div className="fw-bold small">{subject.name}</div>
// //                     <div className="text-xs opacity-75">
// //                       {subject.code} ({subjectAnswers.length}/{subjectQuestions.length})
// //                     </div>
// //                   </button>
// //                 </div>
// //               );
// //             })}
// //           </div>
          
// //           {questions.length > 0 && (
// //             <div className="d-flex justify-content-between align-items-center">
// //               <p className="text-muted mb-0">
// //                 Question {currentQuestionIndex + 1} of {questions.length} - {CONFIG.SUBJECTS[currentSubject].name}
// //               </p>
// //               <small className="text-muted">
// //                 Progress: {answeredCount}/{totalQuestions} answered
// //               </small>
// //             </div>
// //           )}
// //         </div>
// //       </header>

// //       <main className="exam-main flex-grow-1">
// //         <div className="container-fluid h-100">
// //           <div className="row h-100">
// //             {/* Main content area */}
// //             <div className="col-md-8 h-100 py-3">
// //               {questions.length === 0 ? (
// //                 <div className="text-center py-5">
// //                   <div className="text-muted mb-3">
// //                     <i className="fas fa-question-circle fa-3x"></i>
// //                   </div>
// //                   <h5>No questions available</h5>
// //                   <p className="text-muted">
// //                     No questions found for {CONFIG.SUBJECTS[currentSubject]?.name}
// //                   </p>
// //                   <button 
// //                     onClick={() => {
// //                       localStorage.removeItem('examQuestions');
// //                       loadAllQuestions();
// //                     }}
// //                     className="btn btn-primary"
// //                   >
// //                     Reload Questions
// //                   </button>
// //                 </div>
// //               ) : currentQuestion ? (
// //                 <div className="h-100 d-flex flex-column">
// //                   {/* Question Area */}
// //                   <div className="card mb-4 flex-grow-1">
// //                     <div className="card-body">
// //                       <div className="bg-light p-4 rounded mb-4">
// //                         <div className="d-flex justify-content-between align-items-start mb-2">
// //                           <h5 className="card-title mb-0">
// //                             Question {currentQuestionIndex + 1}
// //                           </h5>
// //                           <div className="d-flex gap-2">
// //                             {flaggedQuestions.has(currentQuestion.id) && (
// //                               <span className="badge bg-warning">
// //                                 <i className="fas fa-flag"></i> Flagged
// //                               </span>
// //                             )}
// //                             {selectedAnswers[currentQuestion.id] && (
// //                               <span className="badge bg-success">
// //                                 <i className="fas fa-check"></i> Answered
// //                               </span>
// //                             )}
// //                           </div>
// //                         </div>
// //                         <p className="card-text lead">
// //                           {currentQuestion.text || currentQuestion.question_text}
// //                         </p>
// //                       </div>

// //                       {/* Options */}
// //                       <div className="mb-4">
// //                         {renderQuestionOptions(currentQuestion)}
// //                       </div>

// //                       {/* Navigation Controls */}
// //                       <div className="d-flex justify-content-between align-items-center">
// //                         <button
// //                           onClick={handlePreviousQuestion}
// //                           disabled={currentQuestionIndex === 0}
// //                           className="btn btn-outline-secondary"
// //                         >
// //                           <i className="fas fa-arrow-left me-2"></i>Previous
// //                         </button>

// //                         <button
// //                           onClick={toggleFlagQuestion}
// //                           className={`btn ${
// //                             flaggedQuestions.has(currentQuestion.id)
// //                               ? 'btn-warning'
// //                               : 'btn-outline-warning'
// //                           }`}
// //                         >
// //                           <i className="fas fa-flag me-2"></i>
// //                           {flaggedQuestions.has(currentQuestion.id) ? 'Unflag' : 'Flag'}
// //                         </button>

// //                         <button
// //                           onClick={handleNextQuestion}
// //                           disabled={currentQuestionIndex === questions.length - 1}
// //                           className="btn btn-outline-secondary"
// //                         >
// //                           Next<i className="fas fa-arrow-right ms-2"></i>
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Question Palette */}
// //                   <div className="card">
// //                     <div className="card-body">
// //                       <h6 className="card-title">Question Navigator</h6>
// //                       <div className="question-palette mb-3">
// //                         <div className="row g-2">
// //                           {questions.map((_, index) => (
// //                             <div key={index} className="col-auto">
// //                               <button
// //                                 onClick={() => navigateToQuestion(index)}
// //                                 className={`btn question-btn ${getQuestionStatusClass(index)} ${
// //                                   currentQuestionIndex === index ? 'active' : ''
// //                                 }`}
// //                                 style={{ width: '40px', height: '40px', borderRadius: '50%' }}
// //                               >
// //                                 {index + 1}
// //                               </button>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>

// //                       {/* Legend */}
// //                       <div className="row g-3 mb-3">
// //                         <div className="col-auto">
// //                           <div className="d-flex align-items-center">
// //                             <div className="bg-success" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
// //                             <small className="ms-2 text-muted">Answered</small>
// //                           </div>
// //                         </div>
// //                         <div className="col-auto">
// //                           <div className="d-flex align-items-center">
// //                             <div className="bg-danger" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
// //                             <small className="ms-2 text-muted">Unanswered</small>
// //                           </div>
// //                         </div>
// //                         <div className="col-auto">
// //                           <div className="d-flex align-items-center">
// //                             <div className="bg-warning" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
// //                             <small className="ms-2 text-muted">Flagged</small>
// //                           </div>
// //                         </div>
// //                       </div>

// //                       {/* Progress Bar */}
// //                       <div className="mb-3">
// //                         <div className="d-flex justify-content-between align-items-center mb-2">
// //                           <small className="text-muted">Overall Progress</small>
// //                           <small className="text-muted">
// //                             {Math.round((answeredCount / totalQuestions) * 100)}%
// //                           </small>
// //                         </div>
// //                         <div className="progress" style={{ height: '8px' }}>
// //                           <div 
// //                             className="progress-bar bg-primary" 
// //                             style={{ 
// //                               width: `${(answeredCount / totalQuestions) * 100}%` 
// //                             }}
// //                           ></div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="text-center py-5">
// //                   <div className="text-warning mb-3">
// //                     <i className="fas fa-exclamation-triangle fa-3x"></i>
// //                   </div>
// //                   <h5>Question not found</h5>
// //                   <p className="text-muted">Current question could not be loaded</p>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Sidebar */}
// //             <div className="col-md-4 bg-white border-start h-100 py-3">
// //               <div className="sidebar-content">
// //                 {/* Student Info */}
// //                 <div className="card mb-3">
// //                   <div className="card-body">
// //                     <h6 className="card-title">Student Information</h6>
// //                     <div className="student-info">
// //                       <div className="mb-2">
// //                         <strong>Name:</strong> {studentInfo.name}
// //                       </div>
// //                       <div className="mb-2">
// //                         <strong>Student ID:</strong> {studentInfo.studentId}
// //                       </div>
// //                       <div className="mb-2">
// //                         <strong>Subject:</strong> {CONFIG.SUBJECTS[currentSubject].name}
// //                       </div>
// //                       <div className="mb-2">
// //                         <strong>Questions:</strong> {currentQuestionIndex + 1} of {questions.length}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Calculator */}
// //                 <div className="card mb-3">
// //                   <div className="card-body">
// //                     <div className="d-flex justify-content-between align-items-center mb-2">
// //                       <h6 className="card-title mb-0">Calculator</h6>
// //                       <button
// //                         onClick={() => setIsCalculatorVisible(!isCalculatorVisible)}
// //                         className="btn btn-sm btn-outline-primary"
// //                       >
// //                         {isCalculatorVisible ? 'Hide' : 'Show'}
// //                       </button>
// //                     </div>
                    
// //                     {isCalculatorVisible && (
// //                       <div>
// //                         <div className="mb-2">
// //                           <input
// //                             type="text"
// //                             value={calculatorValue}
// //                             readOnly
// //                             className="form-control text-end"
// //                             style={{ fontFamily: 'monospace' }}
// //                           />
// //                         </div>
// //                         <div className="calculator-buttons">
// //                           <div className="row g-1 mb-1">
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('C')}
// //                                 className="btn btn-sm btn-outline-danger w-100"
// //                               >
// //                                 C
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('CE')}
// //                                 className="btn btn-sm btn-outline-warning w-100"
// //                               >
// //                                 CE
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('/')}
// //                                 className="btn btn-sm btn-outline-secondary w-100"
// //                               >
// //                                 ÷
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('*')}
// //                                 className="btn btn-sm btn-outline-secondary w-100"
// //                               >
// //                                 ×
// //                               </button>
// //                             </div>
// //                           </div>
// //                           <div className="row g-1 mb-1">
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('7')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 7
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('8')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 8
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('9')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 9
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('-')}
// //                                 className="btn btn-sm btn-outline-secondary w-100"
// //                               >
// //                                 -
// //                               </button>
// //                             </div>
// //                           </div>
// //                           <div className="row g-1 mb-1">
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('4')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 4
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('5')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 5
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('6')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 6
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('+')}
// //                                 className="btn btn-sm btn-outline-secondary w-100"
// //                               >
// //                                 +
// //                               </button>
// //                             </div>
// //                           </div>
// //                           <div className="row g-1 mb-1">
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('1')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 1
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('2')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 2
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('3')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 3
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('=')}
// //                                 className="btn btn-sm btn-primary w-100"
// //                               >
// //                                 =
// //                               </button>
// //                             </div>
// //                           </div>
// //                           <div className="row g-1">
// //                             <div className="col-6">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('0')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 0
// //                               </button>
// //                             </div>
// //                             <div className="col-3">
// //                               <button
// //                                 onClick={() => handleCalculatorOperation('.')}
// //                                 className="btn btn-sm btn-outline-dark w-100"
// //                               >
// //                                 .
// //                               </button>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>

// //                 {/* Quick Actions */}
// //                 <div className="card mb-3">
// //                   <div className="card-body">
// //                     <h6 className="card-title">Quick Actions</h6>
// //                     <div className="d-grid gap-2">
// //                       <button
// //                         onClick={() => {
// //                           if (currentQuestion) {
// //                             const newAnswers = { ...selectedAnswers };
// //                             delete newAnswers[currentQuestion.id];
// //                             setSelectedAnswers(newAnswers);
// //                             saveAnswersToLocalStorage(newAnswers);
// //                           }
// //                         }}
// //                         className="btn btn-outline-warning btn-sm"
// //                         disabled={!currentQuestion || !selectedAnswers[currentQuestion?.id]}
// //                       >
// //                         <i className="fas fa-times me-2"></i>Clear Answer
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Keyboard Shortcuts */}
// //                 <div className="card mb-3">
// //                   <div className="card-body">
// //                     <h6 className="card-title">Keyboard Shortcuts</h6>
// //                     <div className="shortcuts">
// //                       <div className="row g-2 mb-2">
// //                         <div className="col-4"><kbd>A-D</kbd></div>
// //                         <div className="col-8"><small>Select option</small></div>
// //                       </div>
// //                       <div className="row g-2 mb-2">
// //                         <div className="col-4"><kbd>N</kbd></div>
// //                         <div className="col-8"><small>Next question</small></div>
// //                       </div>
// //                       <div className="row g-2 mb-2">
// //                         <div className="col-4"><kbd>P</kbd></div>
// //                         <div className="col-8"><small>Previous question</small></div>
// //                       </div>
// //                       <div className="row g-2 mb-2">
// //                         <div className="col-4"><kbd>R</kbd></div>
// //                         <div className="col-8"><small>Reset answer</small></div>
// //                       </div>
// //                       <div className="row g-2">
// //                         <div className="col-4"><kbd>S</kbd></div>
// //                         <div className="col-8"><small>Submit exam</small></div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Submit Button */}
// //                 <div className="card">
// //                   <div className="card-body">
// //                     <h6 className="card-title text-danger">Submit Exam</h6>
// //                     <p className="text-muted small mb-3">
// //                       Answered: {answeredCount}/{totalQuestions} questions
// //                     </p>
// //                     <button
// //                       onClick={submitExam}
// //                       disabled={isSubmitting}
// //                       className="btn btn-danger w-100"
// //                     >
// //                       {isSubmitting ? (
// //                         <>
// //                           <span className="spinner-border spinner-border-sm me-2"></span>
// //                           Submitting...
// //                         </>
// //                       ) : (
// //                         <>
// //                           <i className="fas fa-paper-plane me-2"></i>
// //                           Submit Exam
// //                         </>
// //                       )}
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>

// //       {/* Custom Styles */}
// //       <style jsx>{`
// //         .exam-container {
// //           height: 100vh;
// //           overflow: hidden;
// //         }
        
// //         .exam-header {
// //           border-bottom: 2px solid #dee2e6;
// //           flex-shrink: 0;
// //         }
        
// //         .exam-main {
// //           overflow-y: auto;
// //         }
        
// //         .answer-option {
// //           transition: all 0.2s ease;
// //         }
        
// //         .answer-option:hover {
// //           border-color: #0d6efd !important;
// //           background: rgba(13, 110, 253, 0.05) !important;
// //         }
        
// //         .answer-option.selected {
// //           border-color: #0d6efd !important;
// //           background: rgba(13, 110, 253, 0.1) !important;
// //         }
        
// //         .question-btn {
// //           font-size: 14px;
// //           padding: 0;
// //         }
        
// //         .question-btn.active {
// //           box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
// //         }
        
// //         .shortcuts kbd {
// //           font-size: 10px;
// //         }
        
// //         .sidebar-content {
// //           max-height: 100%;
// //           overflow-y: auto;
// //         }
        
// //         .calculator-buttons .btn {
// //           font-size: 12px;
// //           padding: 4px 8px;
// //         }
        
// //         .progress {
// //           border-radius: 10px;
// //         }
        
// //         .progress-bar {
// //           transition: width 0.3s ease;
// //         }
        
// //         .card {
// //           border: 1px solid #dee2e6;
// //           border-radius: 8px;
// //         }
        
// //         .card-title {
// //           font-size: 14px;
// //           font-weight: 600;
// //           color: #495057;
// //         }
        
// //         .text-xs {
// //           font-size: 0.75rem;
// //         }
        
// //         .spinner-border-sm {
// //           width: 1rem;
// //           height: 1rem;
// //         }
        
// //         @media (max-width: 768px) {
// //           .col-md-8, .col-md-4 {
// //             flex: 0 0 100%;
// //           }
          
// //           .exam-main .row {
// //             flex-direction: column;
// //           }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default ExamSession;


// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Configuration - Easy to modify
// const CONFIG = {
//   EXAM_DURATION: 7200, // 2 hours in seconds
//   API_BASE_URL: 'http://127.0.0.1:8000',
//   API_PATH: '/api/',
//   WARNING_TIMES: [1800, 900, 300], // 30, 15, 5 minutes warnings
//   AUTO_SAVE_INTERVAL: 30000 // Auto-save every 30 seconds
// };

// const ExamSession = () => {
//   const navigate = useNavigate();
  
//   // Get student data from localStorage
//   const getStudentData = () => {
//     try {
//       const studentId = localStorage.getItem('studentID');
//       const rawStudentData = localStorage.getItem('studentData');
//       const studentData = rawStudentData ? JSON.parse(rawStudentData) : {};
      
//       if (!studentId || studentId === 'GUEST') {
//         alert('Missing or invalid student ID. Please log in again.');
//         navigate('/dashboard');
//         return null;
//       }
      
//       return {
//         studentId,
//         name: `${studentData.first_name || 'Guest'} ${studentData.last_name || 'User'}`,
//         examId: 'CBT_2025_001',
//         course: 'JAMB CBT Examination'
//       };
//     } catch (error) {
//       console.error('Error getting student data:', error);
//       return null;
//     }
//   };

//   const studentInfo = getStudentData();
  
//   // Core States
//   const [timeRemaining, setTimeRemaining] = useState(CONFIG.EXAM_DURATION);
//   const [currentSubject, setCurrentSubject] = useState(0);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [questions, setQuestions] = useState([]);
//   const [allQuestions, setAllQuestions] = useState({});
//   const [subjects, setSubjects] = useState([]);
//   const [examInfo, setExamInfo] = useState({
//     name: 'Loading...',
//     description: 'Please wait while we load exam information',
//     duration: CONFIG.EXAM_DURATION,
//     totalQuestions: 0
//   });
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [examSessionId, setExamSessionId] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Calculator States
//   const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
//   const [calculatorValue, setCalculatorValue] = useState('0');

//   // Refs
//   const autoSaveRef = useRef();
//   const lastSavedAnswers = useRef({});

//   // Utility Functions
//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // API Helper Function
//   const apiCall = async (endpoint, options = {}) => {
//     try {
//       const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_PATH}${endpoint}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `StudentID ${studentInfo?.studentId}`,
//           ...options.headers
//         },
//         ...options
//       });

//       if (!response.ok) {
//         throw new Error(`API call failed: ${response.status} - ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error(`API Error for ${endpoint}:`, error);
//       throw error;
//     }
//   };

//   // Load subjects from backend
//   const loadSubjects = async () => {
//     try {
//       const subjectsData = await apiCall('subjects/');
      
//       if (Array.isArray(subjectsData) && subjectsData.length > 0) {
//         const formattedSubjects = subjectsData.map(subject => ({
//           id: subject.id,
//           name: subject.name,
//           code: subject.code || subject.name.substring(0, 3).toUpperCase(),
//           description: subject.description || ''
//         }));
        
//         setSubjects(formattedSubjects);
//         return formattedSubjects;
//       } else {
//         throw new Error('No subjects found');
//       }
//     } catch (error) {
//       console.error('Error loading subjects:', error);
//       // Fallback to default subjects if backend fails
//       const fallbackSubjects = [
//         { id: 1, name: 'General Knowledge', code: 'GEN', description: 'General examination questions' }
//       ];
//       setSubjects(fallbackSubjects);
//       return fallbackSubjects;
//     }
//   };

//   // Load exam information from backend
//   const loadExamInfo = async () => {
//     try {
//       const examsData = await apiCall('exams/');
      
//       if (Array.isArray(examsData) && examsData.length > 0) {
//         const activeExam = examsData.find(exam => exam.is_active) || examsData[0];
        
//         setExamInfo({
//           id: activeExam.id,
//           name: activeExam.title || activeExam.name || 'Computer Based Test',
//           description: activeExam.description || 'Online Examination System',
//           duration: activeExam.duration_minutes ? activeExam.duration_minutes * 60 : CONFIG.EXAM_DURATION,
//           totalQuestions: activeExam.total_questions || 0,
//           instructions: activeExam.instructions || ''
//         });
        
//         if (activeExam.duration_minutes) {
//           setTimeRemaining(activeExam.duration_minutes * 60);
//         }
        
//         return activeExam;
//       } else {
//         throw new Error('No exams found');
//       }
//     } catch (error) {
//       console.error('Error loading exam info:', error);
//       setExamInfo({
//         id: 'default',
//         name: 'Computer Based Test',
//         description: 'Online Examination System',
//         duration: CONFIG.EXAM_DURATION,
//         totalQuestions: 0,
//         instructions: 'Please read each question carefully and select the best answer.'
//       });
//     }
//   };

//   // Load Questions from API and store in localStorage
//   const loadAllQuestions = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Ensure subjects are loaded first
//       let currentSubjects = subjects;
//       if (currentSubjects.length === 0) {
//         currentSubjects = await loadSubjects();
//       }

//       // Check if questions are already in localStorage
//       const cachedQuestions = localStorage.getItem('examQuestions');
//       if (cachedQuestions) {
//         const parsedQuestions = JSON.parse(cachedQuestions);
//         setAllQuestions(parsedQuestions);
        
//         // Load questions for current subject
//         const currentSubjectId = currentSubjects[0]?.id;
//         const subjectQuestions = parsedQuestions[currentSubjectId] || [];
//         setQuestions(subjectQuestions);
//         setLoading(false);
//         return;
//       }

//       // Fetch all questions from backend
//       const questionsData = await apiCall('questions/');
      
//       if (!Array.isArray(questionsData)) {
//         throw new Error('Invalid questions data format received from server');
//       }

//       // Group questions by subject
//       const questionsBySubject = {};
//       currentSubjects.forEach(subject => {
//         const matched = questionsData.filter(q => {
//           if (!q.subject) return false;
          
//           const questionSubject = typeof q.subject === 'object' ? q.subject : { id: q.subject, name: '', code: '' };
//           const questionSubjectId = questionSubject.id;
//           const questionSubjectName = questionSubject.name?.toLowerCase() || '';
//           const questionSubjectCode = questionSubject.code?.toLowerCase() || '';
//           const configSubjectName = subject.name.toLowerCase();
//           const configSubjectCode = subject.code.toLowerCase();

//           return questionSubjectId === subject.id ||
//                  questionSubjectName === configSubjectName ||
//                  questionSubjectCode === configSubjectCode ||
//                  questionSubjectName.includes(configSubjectName) ||
//                  configSubjectName.includes(questionSubjectName);
//         });

//         questionsBySubject[subject.id] = matched;
//       });

//       // Store in localStorage and state
//       localStorage.setItem('examQuestions', JSON.stringify(questionsBySubject));
//       setAllQuestions(questionsBySubject);
      
//       // Load questions for current subject
//       const currentSubjectId = currentSubjects[0]?.id;
//       const subjectQuestions = questionsBySubject[currentSubjectId] || [];
//       setQuestions(subjectQuestions);

//       // Update total questions count
//       const totalQuestions = Object.values(questionsBySubject).reduce((sum, subjectQuestions) => sum + subjectQuestions.length, 0);
//       setExamInfo(prev => ({ ...prev, totalQuestions }));

//     } catch (error) {
//       console.error('Error loading questions:', error);
//       setError(`Failed to load questions: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Save answers to localStorage immediately
//   const saveAnswersToLocalStorage = (answers) => {
//     try {
//       localStorage.setItem('examAnswers', JSON.stringify(answers));
//       localStorage.setItem('examAnswersTimestamp', Date.now().toString());
//       localStorage.setItem('examAnswersBackupCount', Object.keys(answers).length.toString());
//     } catch (error) {
//       console.error('Error saving answers to localStorage:', error);
//     }
//   };

//   // Load answers from localStorage
//   const loadAnswersFromLocalStorage = () => {
//     try {
//       const savedAnswers = localStorage.getItem('examAnswers');
//       if (savedAnswers) {
//         const answers = JSON.parse(savedAnswers);
//         setSelectedAnswers(answers);
//         return answers;
//       }
//     } catch (error) {
//       console.error('Error loading answers from localStorage:', error);
//     }
//     return {};
//   };

//   // Save answers to backend (background operation)
//   const saveAnswersToBackend = async (answersToSave = selectedAnswers) => {
//     if (!examSessionId) {
//       console.warn('No exam session ID available for saving answers');
//       return;
//     }

//     try {
//       const savePromises = [];
      
//       for (const [questionId, selectedOption] of Object.entries(answersToSave)) {
//         if (lastSavedAnswers.current[questionId] !== selectedOption && selectedOption) {
//           const answerData = {
//             session: examSessionId,
//             question: questionId,
//             selected_option: selectedOption,
//             answered_at: new Date().toISOString(),
//             student_id: studentInfo.studentId
//           };

//           savePromises.push(
//             apiCall('answers/', {
//               method: 'POST',
//               body: JSON.stringify(answerData)
//             }).catch(error => {
//               if (error.message.includes('400') || error.message.includes('already exists')) {
//                 return apiCall(`answers/${questionId}/`, {
//                   method: 'PUT',
//                   body: JSON.stringify(answerData)
//                 });
//               }
//               throw error;
//             })
//           );
//         }
//       }

//       if (savePromises.length > 0) {
//         await Promise.allSettled(savePromises);
//         lastSavedAnswers.current = {...answersToSave};
//         localStorage.setItem('examAnswersLastSync', Date.now().toString());
//       }
      
//     } catch (error) {
//       console.error('Error saving answers to backend:', error);
//       localStorage.setItem('examAnswersFailedSync', JSON.stringify(answersToSave));
//     }
//   };

//   // Initialize or create exam session
//   const initializeExamSession = async () => {
//     try {
//       let sessionId = localStorage.getItem('examSessionId');
      
//       if (!sessionId) {
//         const sessionData = {
//           student_id: studentInfo.studentId,
//           exam_id: examInfo.id || 1,
//           started_at: new Date().toISOString(),
//           status: 'in_progress'
//         };
        
//         const newSession = await apiCall('exam-sessions/', {
//           method: 'POST',
//           body: JSON.stringify(sessionData)
//         });
        
//         sessionId = newSession.id;
//         localStorage.setItem('examSessionId', sessionId);
//       }
      
//       setExamSessionId(sessionId);
//       return sessionId;
//     } catch (error) {
//       console.error('Error initializing exam session:', error);
//       const fallbackId = `session_${studentInfo.studentId}_${Date.now()}`;
//       localStorage.setItem('examSessionId', fallbackId);
//       setExamSessionId(fallbackId);
//       return fallbackId;
//     }
//   };

//   // Submit exam
//   const submitExam = async () => {
//     if (!examSessionId) {
//       alert('No active exam session found. Please restart the exam.');
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       const answeredCount = Object.keys(selectedAnswers).length;
//       const totalQuestions = Object.values(allQuestions).reduce((sum, subjectQuestions) => sum + subjectQuestions.length, 0);
      
//       const confirmed = window.confirm(
//         `Are you sure you want to submit the exam?\n\n` +
//         `Answered: ${answeredCount}/${totalQuestions} questions\n` +
//         `Time remaining: ${formatTime(timeRemaining)}\n\n` +
//         `This action cannot be undone and will end your exam session.`
//       );
      
//       if (!confirmed) {
//         setIsSubmitting(false);
//         return;
//       }

//       // Save final answers
//       await saveAnswersToBackend(selectedAnswers);
      
//       // Create submission data
//       const submissionData = {
//         studentId: studentInfo.studentId,
//         examSessionId: examSessionId,
//         submittedAt: new Date().toISOString(),
//         timeTaken: CONFIG.EXAM_DURATION - timeRemaining,
//         totalQuestions,
//         answeredQuestions: answeredCount,
//         flaggedQuestions: flaggedQuestions.size,
//         completionPercentage: Math.round((answeredCount / totalQuestions) * 100)
//       };
      
//       localStorage.setItem('examSubmission', JSON.stringify(submissionData));
//       localStorage.setItem('examCompletedAt', new Date().toISOString());
      
//       // Clear exam data
//       localStorage.removeItem('examQuestions');
//       localStorage.removeItem('examAnswers');
//       localStorage.removeItem('examSessionId');
      
//       navigate('/exam-complete', { 
//         state: { 
//           success: true, 
//           submissionData 
//         } 
//       });
      
//     } catch (error) {
//       console.error('Error submitting exam:', error);
      
//       // Fallback submission
//       const fallbackData = {
//         studentId: studentInfo.studentId,
//         examSessionId: examSessionId,
//         submittedAt: new Date().toISOString(),
//         timeTaken: CONFIG.EXAM_DURATION - timeRemaining,
//         totalQuestions: questions.length,
//         answeredQuestions: Object.keys(selectedAnswers).length,
//         flaggedQuestions: flaggedQuestions.size,
//         offlineSubmission: true
//       };
      
//       localStorage.setItem('examSubmission', JSON.stringify(fallbackData));
//       localStorage.setItem('examCompletedAt', new Date().toISOString());
      
//       const proceed = window.confirm(
//         'There was an issue submitting to the server, but your answers are saved locally. ' +
//         'Do you want to proceed to the completion page?'
//       );
      
//       if (proceed) {
//         navigate('/exam-complete', { 
//           state: { 
//             success: true, 
//             submissionData: fallbackData 
//           } 
//         });
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handler Functions
//   const handleAnswerSelect = (questionId, answerId, clearAnswer = false) => {
//     const newAnswers = clearAnswer 
//       ? (() => {
//           const updated = { ...selectedAnswers };
//           delete updated[questionId];
//           return updated;
//         })()
//       : {
//           ...selectedAnswers,
//           [questionId]: answerId
//         };
    
//     setSelectedAnswers(newAnswers);
//     saveAnswersToLocalStorage(newAnswers);
    
//     // Trigger background save to server after short delay
//     clearTimeout(autoSaveRef.current);
//     autoSaveRef.current = setTimeout(() => {
//       saveAnswersToBackend(newAnswers);
//     }, 2000);
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

//   const handleSubjectChange = (index) => {
//     setCurrentSubject(index);
//     setCurrentQuestionIndex(0);
    
//     const subjectQuestions = allQuestions[subjects[index]?.id] || [];
//     setQuestions(subjectQuestions);
//   };

//   // Calculator Functions
//   const handleCalculatorOperation = (operation) => {
//     setCalculatorValue(prev => {
//       try {
//         switch (operation) {
//           case 'C':
//             return '0';
//           case 'CE':
//             return '0';
//           case '=':
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

//   // Render Question Options
//   const renderQuestionOptions = (question) => {
//     if (!question) return null;

//     // Check if question has options array (newer format)
//     if (question.options && Array.isArray(question.options)) {
//       return question.options.map(option => (
//         <div
//           key={option.id}
//           onClick={() => handleAnswerSelect(question.id, option.id)}
//           className={`answer-option p-3 border rounded mb-2 cursor-pointer ${
//             selectedAnswers[question.id] === option.id
//               ? 'selected border-primary bg-primary bg-opacity-10'
//               : 'border-secondary'
//           }`}
//           style={{ cursor: 'pointer' }}
//         >
//           <div className="d-flex align-items-center">
//             <div className={`me-3 ${
//               selectedAnswers[question.id] === option.id
//                 ? 'text-primary'
//                 : 'text-secondary'
//             }`}>
//               <i className={`fas ${
//                 selectedAnswers[question.id] === option.id
//                   ? 'fa-circle-dot'
//                   : 'fa-circle'
//               }`}></i>
//             </div>
//             <span className="fw-bold me-2">{option.id}.</span>
//             <span>{option.text || option.option_text}</span>
//           </div>
//         </div>
//       ));
//     }

//     // Fallback for older format with option_a, option_b, etc.
//     return ['A', 'B', 'C', 'D'].map(optionId => {
//       const optionText = question[`option_${optionId.toLowerCase()}`];
      
//       if (!optionText) return null;
      
//       return (
//         <div
//           key={optionId}
//           onClick={() => handleAnswerSelect(question.id, optionId)}
//           className={`answer-option p-3 border rounded mb-2 cursor-pointer ${
//             selectedAnswers[question.id] === optionId
//               ? 'selected border-primary bg-primary bg-opacity-10'
//               : 'border-secondary'
//           }`}
//           style={{ cursor: 'pointer' }}
//         >
//           <div className="d-flex align-items-center">
//             <div className={`me-3 ${
//               selectedAnswers[question.id] === optionId
//                 ? 'text-primary'
//                 : 'text-secondary'
//             }`}>
//               <i className={`fas ${
//                 selectedAnswers[question.id] === optionId
//                   ? 'fa-circle-dot'
//                   : 'fa-circle'
//               }`}></i>
//             </div>
//             <span className="fw-bold me-2">{optionId}.</span>
//             <span>{optionText}</span>
//           </div>
//         </div>
//       );
//     }).filter(Boolean);
//   };

//   // Effects
//   useEffect(() => {
//     if (!studentInfo) return;
    
//     const initializeExam = async () => {
//       await loadExamInfo();
//       await loadSubjects();
//       await initializeExamSession();
//       await loadAllQuestions();
//     };
    
//     initializeExam();
//     loadAnswersFromLocalStorage();
//   }, [studentInfo]);

//   // Auto-save to backend periodically
//   useEffect(() => {
//     if (examSessionId && Object.keys(selectedAnswers).length > 0) {
//       const interval = setInterval(() => {
//         saveAnswersToBackend(selectedAnswers);
//       }, CONFIG.AUTO_SAVE_INTERVAL);

//       return () => clearInterval(interval);
//     }
//   }, [selectedAnswers, examSessionId]);

//   // Timer effect
//   useEffect(() => {
//     if (timeRemaining <= 0) return;

//     const timer = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           submitExam();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining]);

//   // Time warnings
//   useEffect(() => {
//     if (CONFIG.WARNING_TIMES.includes(timeRemaining)) {
//       const minutesLeft = timeRemaining / 60;
//       alert(`Warning: ${minutesLeft} minutes remaining!`);
//     }
//   }, [timeRemaining]);

//   // Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const key = e.key.toUpperCase();
//       const currentQuestion = questions[currentQuestionIndex];
      
//       if (!currentQuestion) return;

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
//           submitExam();
//           break;
//         case 'R':
//           handleAnswerSelect(currentQuestion.id, null, true);
//           break;
//         default:
//           break;
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [questions, currentQuestionIndex]);

//   // Prevent page refresh
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       e.preventDefault();
//       e.returnValue = '';
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, []);

//   // Loading state
//   if (loading && questions.length === 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-3" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted">Loading exam questions...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//         <div className="text-center">
//           <div className="text-danger mb-3">
//             <i className="fas fa-exclamation-triangle fa-2x"></i>
//           </div>
//           <p className="text-danger mb-3">{error}</p>
//           <div className="d-flex gap-2 justify-content-center">
//             <button 
//               onClick={() => {
//                 setError(null);
//                 loadAllQuestions();
//               }}
//               className="btn btn-primary"
//             >
//               Retry Loading Questions
//             </button>
//             <button 
//               onClick={() => {
//                 localStorage.removeItem('examQuestions');
//                 localStorage.removeItem('examSessionId');
//                 window.location.reload();
//               }}
//               className="btn btn-secondary"
//             >
//               Reset Exam
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!studentInfo) {
//     return null;
//   }

//   const currentQuestion = questions[currentQuestionIndex];
//   const totalQuestions = Object.values(allQuestions).reduce((sum, subjectQuestions) => sum + subjectQuestions.length, 0);
//   const answeredCount = Object.keys(selectedAnswers).length;

//   return (
//     <div className="exam-container d-flex flex-column bg-light vh-100">
//       {/* Bootstrap CSS */}
//       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
//       <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      
//       {/* Header */}
//       <header className="exam-header bg-white shadow-sm">
//         <div className="container-fluid h-100 py-3">
//           <div className="row align-items-center mb-3">
//             <div className="col-md-8">
//               <h1 className="h3 mb-1 text-dark">{examInfo.name}</h1>
//               <small className="text-muted">
//                 {examInfo.description} | Student: {studentInfo.name} | ID: {studentInfo.studentId}
//               </small>
//             </div>
            
//             <div className="col-md-4 text-end">
//               <div className={`p-2 rounded font-monospace fw-bold fs-5 ${
//                 timeRemaining < 300 ? 'bg-danger text-white' : 
//                 timeRemaining < 900 ? 'bg-warning text-dark' : 'bg-light'
//               }`}>
//                 {formatTime(timeRemaining)}
//               </div>
//               <small className="text-muted">Time Remaining</small>
//             </div>
//           </div>
          
//           {/* Subject Tabs */}
//           <div className="row g-1 mb-3">
//             {subjects.map((subject, index) => {
//               const subjectQuestions = allQuestions[subject.id] || [];
//               const subjectAnswers = subjectQuestions.filter(q => selectedAnswers[q.id]);
              
//               return (
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
//                     <div className="text-xs opacity-75">
//                       {subject.code} ({subjectAnswers.length}/{subjectQuestions.length})
//                     </div>
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
          
//           {questions.length > 0 && (
//             <div className="d-flex justify-content-between align-items-center">
//               <p className="text-muted mb-0">
//                 Question {currentQuestionIndex + 1} of {questions.length} - {subjects[currentSubject]?.name || 'Loading...'}
//               </p>
//               <small className="text-muted">
//                 Progress: {answeredCount}/{totalQuestions} answered
//               </small>
//             </div>
//           )}
//         </div>
//       </header>

//       <main className="exam-main flex-grow-1">
//         <div className="container-fluid h-100">
//           <div className="row h-100">
//             {/* Main content area */}
//             <div className="col-md-8 h-100 py-3">
//               {questions.length === 0 ? (
//                 <div className="text-center py-5">
//                   <div className="text-muted mb-3">
//                     <i className="fas fa-question-circle fa-3x"></i>
//                   </div>
//                   <h5>No questions available</h5>
//                   <p className="text-muted">
//                     No questions found for {subjects[currentSubject]?.name || 'this subject'}
//                   </p>
//                   <button 
//                     onClick={() => {
//                       localStorage.removeItem('examQuestions');
//                       loadAllQuestions();
//                     }}
//                     className="btn btn-primary"
//                   >
//                     Reload Questions
//                   </button>
//                 </div>
//               ) : currentQuestion ? (
//                 <div className="h-100 d-flex flex-column">
//                   {/* Question Area */}
//                   <div className="card mb-4 flex-grow-1">
//                     <div className="card-body">
//                       <div className="bg-light p-4 rounded mb-4">
//                         <div className="d-flex justify-content-between align-items-start mb-2">
//                           <h5 className="card-title mb-0">
//                             Question {currentQuestionIndex + 1}
//                           </h5>
//                           <div className="d-flex gap-2">
//                             {flaggedQuestions.has(currentQuestion.id) && (
//                               <span className="badge bg-warning">
//                                 <i className="fas fa-flag"></i> Flagged
//                               </span>
//                             )}
//                             {selectedAnswers[currentQuestion.id] && (
//                               <span className="badge bg-success">
//                                 <i className="fas fa-check"></i> Answered
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         <p className="card-text lead">
//                           {currentQuestion.text || currentQuestion.question_text}
//                         </p>
//                       </div>

//                       {/* Options */}
//                       <div className="mb-4">
//                         {renderQuestionOptions(currentQuestion)}
//                       </div>

//                       {/* Navigation Controls */}
//                       <div className="d-flex justify-content-between align-items-center">
//                         <button
//                           onClick={handlePreviousQuestion}
//                           disabled={currentQuestionIndex === 0}
//                           className="btn btn-outline-secondary"
//                         >
//                           <i className="fas fa-arrow-left me-2"></i>Previous
//                         </button>

//                         <button
//                           onClick={toggleFlagQuestion}
//                           className={`btn ${
//                             flaggedQuestions.has(currentQuestion.id)
//                               ? 'btn-warning'
//                               : 'btn-outline-warning'
//                           }`}
//                         >
//                           <i className="fas fa-flag me-2"></i>
//                           {flaggedQuestions.has(currentQuestion.id) ? 'Unflag' : 'Flag'}
//                         </button>

//                         <button
//                           onClick={handleNextQuestion}
//                           disabled={currentQuestionIndex === questions.length - 1}
//                           className="btn btn-outline-secondary"
//                         >
//                           Next<i className="fas fa-arrow-right ms-2"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Question Palette */}
//                   <div className="card">
//                     <div className="card-body">
//                       <h6 className="card-title">Question Navigator</h6>
//                       <div className="question-palette mb-3">
//                         <div className="row g-2">
//                           {questions.map((_, index) => (
//                             <div key={index} className="col-auto">
//                               <button
//                                 onClick={() => navigateToQuestion(index)}
//                                 className={`btn question-btn ${getQuestionStatusClass(index)} ${
//                                   currentQuestionIndex === index ? 'active' : ''
//                                 }`}
//                                 style={{ width: '40px', height: '40px', borderRadius: '50%' }}
//                               >
//                                 {index + 1}
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Legend */}
//                       <div className="row g-3 mb-3">
//                         <div className="col-auto">
//                           <div className="d-flex align-items-center">
//                             <div className="bg-success" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
//                             <small className="ms-2 text-muted">Answered</small>
//                           </div>
//                         </div>
//                         <div className="col-auto">
//                           <div className="d-flex align-items-center">
//                             <div className="bg-danger" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
//                             <small className="ms-2 text-muted">Unanswered</small>
//                           </div>
//                         </div>
//                         <div className="col-auto">
//                           <div className="d-flex align-items-center">
//                             <div className="bg-warning" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
//                             <small className="ms-2 text-muted">Flagged</small>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Progress Bar */}
//                       <div className="mb-3">
//                         <div className="d-flex justify-content-between align-items-center mb-2">
//                           <small className="text-muted">Overall Progress</small>
//                           <small className="text-muted">
//                             {Math.round((answeredCount / totalQuestions) * 100)}%
//                           </small>
//                         </div>
//                         <div className="progress" style={{ height: '8px' }}>
//                           <div 
//                             className="progress-bar bg-primary" 
//                             style={{ 
//                               width: `${(answeredCount / totalQuestions) * 100}%` 
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-5">
//                   <div className="text-warning mb-3">
//                     <i className="fas fa-exclamation-triangle fa-3x"></i>
//                   </div>
//                   <h5>Question not found</h5>
//                   <p className="text-muted">Current question could not be loaded</p>
//                 </div>
//               )}
//             </div>

//             {/* Sidebar */}
//             <div className="col-md-4 bg-white border-start h-100 py-3">
//               <div className="sidebar-content">
//                 {/* Student Info */}
//                 <div className="card mb-3">
//                   <div className="card-body">
//                     <h6 className="card-title">Student Information</h6>
//                     <div className="student-info">
//                       <div className="mb-2">
//                         <strong>Name:</strong> {studentInfo.name}
//                       </div>
//                       <div className="mb-2">
//                         <strong>Student ID:</strong> {studentInfo.studentId}
//                       </div>
//                       <div className="mb-2">
//                         <strong>Subject:</strong> {subjects[currentSubject]?.name || 'Loading...'}
//                       </div>
//                       <div className="mb-2">
//                         <strong>Questions:</strong> {currentQuestionIndex + 1} of {questions.length}
//                       </div>
//                       <div className="mb-2">
//                         <strong>Total Questions:</strong> {examInfo.totalQuestions}
//                       </div>
//                       <div className="mb-2">
//                         <strong>Duration:</strong> {Math.floor(examInfo.duration / 60)} minutes
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Calculator */}
//                 <div className="card mb-3">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                       <h6 className="card-title mb-0">Calculator</h6>
//                       <button
//                         onClick={() => setIsCalculatorVisible(!isCalculatorVisible)}
//                         className="btn btn-sm btn-outline-primary"
//                       >
//                         {isCalculatorVisible ? 'Hide' : 'Show'}
//                       </button>
//                     </div>
                    
//                     {isCalculatorVisible && (
//                       <div>
//                         <div className="mb-2">
//                           <input
//                             type="text"
//                             value={calculatorValue}
//                             readOnly
//                             className="form-control text-end"
//                             style={{ fontFamily: 'monospace' }}
//                           />
//                         </div>
//                         <div className="calculator-buttons">
//                           <div className="row g-1 mb-1">
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('C')}
//                                 className="btn btn-sm btn-outline-danger w-100"
//                               >
//                                 C
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('CE')}
//                                 className="btn btn-sm btn-outline-warning w-100"
//                               >
//                                 CE
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('/')}
//                                 className="btn btn-sm btn-outline-secondary w-100"
//                               >
//                                 ÷
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('*')}
//                                 className="btn btn-sm btn-outline-secondary w-100"
//                               >
//                                 ×
//                               </button>
//                             </div>
//                           </div>
//                           <div className="row g-1 mb-1">
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('7')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 7
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('8')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 8
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('9')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 9
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('-')}
//                                 className="btn btn-sm btn-outline-secondary w-100"
//                               >
//                                 -
//                               </button>
//                             </div>
//                           </div>
//                           <div className="row g-1 mb-1">
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('4')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 4
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('5')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 5
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('6')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 6
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('+')}
//                                 className="btn btn-sm btn-outline-secondary w-100"
//                               >
//                                 +
//                               </button>
//                             </div>
//                           </div>
//                           <div className="row g-1 mb-1">
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('1')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 1
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('2')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 2
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('3')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 3
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('=')}
//                                 className="btn btn-sm btn-primary w-100"
//                               >
//                                 =
//                               </button>
//                             </div>
//                           </div>
//                           <div className="row g-1">
//                             <div className="col-6">
//                               <button
//                                 onClick={() => handleCalculatorOperation('0')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 0
//                               </button>
//                             </div>
//                             <div className="col-3">
//                               <button
//                                 onClick={() => handleCalculatorOperation('.')}
//                                 className="btn btn-sm btn-outline-dark w-100"
//                               >
//                                 .
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="card mb-3">
//                   <div className="card-body">
//                     <h6 className="card-title">Quick Actions</h6>
//                     <div className="d-grid gap-2">
//                       <button
//                         onClick={() => {
//                           if (currentQuestion) {
//                             handleAnswerSelect(currentQuestion.id, null, true);
//                           }
//                         }}
//                         className="btn btn-outline-warning btn-sm"
//                         disabled={!currentQuestion || !selectedAnswers[currentQuestion?.id]}
//                       >
//                         <i className="fas fa-times me-2"></i>Clear Answer
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Keyboard Shortcuts */}
//                 <div className="card mb-3">
//                   <div className="card-body">
//                     <h6 className="card-title">Keyboard Shortcuts</h6>
//                     <div className="shortcuts">
//                       <div className="row g-2 mb-2">
//                         <div className="col-4"><kbd>A-D</kbd></div>
//                         <div className="col-8"><small>Select option</small></div>
//                       </div>
//                       <div className="row g-2 mb-2">
//                         <div className="col-4"><kbd>N</kbd></div>
//                         <div className="col-8"><small>Next question</small></div>
//                       </div>
//                       <div className="row g-2 mb-2">
//                         <div className="col-4"><kbd>P</kbd></div>
//                         <div className="col-8"><small>Previous question</small></div>
//                       </div>
//                       <div className="row g-2 mb-2">
//                         <div className="col-4"><kbd>R</kbd></div>
//                         <div className="col-8"><small>Reset answer</small></div>
//                       </div>
//                       <div className="row g-2">
//                         <div className="col-4"><kbd>S</kbd></div>
//                         <div className="col-8"><small>Submit exam</small></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="card">
//                   <div className="card-body">
//                     <h6 className="card-title text-danger">Submit Exam</h6>
//                     <p className="text-muted small mb-2">
//                       Exam: {examInfo.name}
//                     </p>
//                     <p className="text-muted small mb-3">
//                       Answered: {answeredCount}/{totalQuestions} questions
//                     </p>
//                     <div className="mb-3">
//                       <div className="d-flex justify-content-between align-items-center">
//                         <small className="text-muted">Answers Saved:</small>
//                         <small className={`${
//                           Object.keys(selectedAnswers).length === Object.keys(lastSavedAnswers.current).length 
//                             ? 'text-success' 
//                             : 'text-warning'
//                         }`}>
//                           {Object.keys(lastSavedAnswers.current).length}/{Object.keys(selectedAnswers).length}
//                         </small>
//                       </div>
//                     </div>
//                     <button
//                       onClick={submitExam}
//                       disabled={isSubmitting}
//                       className="btn btn-danger w-100"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2"></span>
//                           Submitting...
//                         </>
//                       ) : (
//                         <>
//                           <i className="fas fa-paper-plane me-2"></i>
//                           Submit Exam
//                         </>
//                       )}
//                     </button>
                    
//                     {/* Sync Status */}
//                     <div className="mt-2">
//                       <small className="text-muted d-flex align-items-center">
//                         <i className={`fas ${
//                           Object.keys(selectedAnswers).length === Object.keys(lastSavedAnswers.current).length 
//                             ? 'fa-check-circle text-success' 
//                             : 'fa-sync-alt fa-spin text-warning'
//                         } me-1`}></i>
//                         {Object.keys(selectedAnswers).length === Object.keys(lastSavedAnswers.current).length 
//                           ? 'All answers synced' 
//                           : 'Syncing answers...'}
//                       </small>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Custom Styles */}
//       <style jsx>{`
//         .exam-container {
//           height: 100vh;
//           overflow: hidden;
//         }
        
//         .exam-header {
//           border-bottom: 2px solid #dee2e6;
//           flex-shrink: 0;
//         }
        
//         .exam-main {
//           overflow-y: auto;
//         }
        
//         .answer-option {
//           transition: all 0.2s ease;
//         }
        
//         .answer-option:hover {
//           border-color: #0d6efd !important;
//           background: rgba(13, 110, 253, 0.05) !important;
//         }
        
//         .answer-option.selected {
//           border-color: #0d6efd !important;
//           background: rgba(13, 110, 253, 0.1) !important;
//         }
        
//         .question-btn {
//           font-size: 14px;
//           padding: 0;
//         }
        
//         .question-btn.active {
//           box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
//         }
        
//         .shortcuts kbd {
//           font-size: 10px;
//         }
        
//         .sidebar-content {
//           max-height: 100%;
//           overflow-y: auto;
//         }
        
//         .calculator-buttons .btn {
//           font-size: 12px;
//           padding: 4px 8px;
//         }
        
//         .progress {
//           border-radius: 10px;
//         }
        
//         .progress-bar {
//           transition: width 0.3s ease;
//         }
        
//         .card {
//           border: 1px solid #dee2e6;
//           border-radius: 8px;
//         }
        
//         .card-title {
//           font-size: 14px;
//           font-weight: 600;
//           color: #495057;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ExamSession;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Configuration - Easy to modify
const CONFIG = {
  EXAM_DURATION: 7200, // 2 hours in seconds
  API_BASE_URL: 'http://127.0.0.1:8000',
  API_PATH: '/api/',
  WARNING_TIMES: [1800, 900, 300], // 30, 15, 5 minutes warnings
  AUTO_SAVE_INTERVAL: 30000 // Auto-save every 30 seconds
};

const ExamSession = () => {
  const navigate = useNavigate();
  
  // Get student data from localStorage
  const getStudentData = () => {
    try {
      const studentId = localStorage.getItem('studentID');
      const rawStudentData = localStorage.getItem('studentData');
      const studentData = rawStudentData ? JSON.parse(rawStudentData) : {};
      
      if (!studentId || studentId === 'GUEST') {
        alert('Missing or invalid student ID. Please log in again.');
        navigate('/dashboard');
        return null;
      }
      
      return {
        studentId,
        name: `${studentData.first_name || 'Guest'} ${studentData.last_name || 'User'}`,
        examId: 'CBT_2025_001',
        course: 'JAMB CBT Examination'
      };
    } catch (error) {
      console.error('Error getting student data:', error);
      return null;
    }
  };

  const studentInfo = getStudentData();
  
  // Core States
  const [timeRemaining, setTimeRemaining] = useState(CONFIG.EXAM_DURATION);
  const [currentSubject, setCurrentSubject] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [examInfo, setExamInfo] = useState({
    name: 'Loading...',
    description: 'Please wait while we load exam information',
    duration: CONFIG.EXAM_DURATION,
    totalQuestions: 0
  });
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [examSessionId, setExamSessionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculator States
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('0');

  // Refs
  const autoSaveRef = useRef();
  const lastSavedAnswers = useRef({});

  // Utility Functions
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // API Helper Function
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_PATH}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `StudentID ${studentInfo?.studentId}`,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  };

  // Load subjects from backend
  const loadSubjects = async () => {
    try {
      const subjectsData = await apiCall('subjects/');
      
      if (Array.isArray(subjectsData) && subjectsData.length > 0) {
        const formattedSubjects = subjectsData.map(subject => ({
          id: subject.id,
          name: subject.name,
          code: subject.code || subject.name.substring(0, 3).toUpperCase(),
          description: subject.description || ''
        }));
        
        setSubjects(formattedSubjects);
        return formattedSubjects;
      } else {
        throw new Error('No subjects found');
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      // Fallback to default subjects if backend fails
      const fallbackSubjects = [
        { id: 1, name: 'General Knowledge', code: 'GEN', description: 'General examination questions' }
      ];
      setSubjects(fallbackSubjects);
      return fallbackSubjects;
    }
  };

  // Load exam information from backend
  const loadExamInfo = async () => {
    try {
      const examsData = await apiCall('exams/');
      
      if (Array.isArray(examsData) && examsData.length > 0) {
        const activeExam = examsData.find(exam => exam.is_active) || examsData[0];
        
        setExamInfo({
          id: activeExam.id,
          name: activeExam.title || activeExam.name || 'Computer Based Test',
          description: activeExam.description || 'Online Examination System',
          duration: activeExam.duration_minutes ? activeExam.duration_minutes * 60 : CONFIG.EXAM_DURATION,
          totalQuestions: activeExam.total_questions || 0,
          instructions: activeExam.instructions || ''
        });
        
        if (activeExam.duration_minutes) {
          setTimeRemaining(activeExam.duration_minutes * 60);
        }
        
        return activeExam;
      } else {
        throw new Error('No exams found');
      }
    } catch (error) {
      console.error('Error loading exam info:', error);
      setExamInfo({
        id: 'default',
        name: 'Computer Based Test',
        description: 'Online Examination System',
        duration: CONFIG.EXAM_DURATION,
        totalQuestions: 0,
        instructions: 'Please read each question carefully and select the best answer.'
      });
    }
  };

  // Load Questions from API and store in localStorage
  const loadAllQuestions = async () => {
    // Prevent multiple simultaneous loads
    if (loadAllQuestions.isLoading) {
      console.log('Questions already loading, skipping...');
      return;
    }
    
    loadAllQuestions.isLoading = true;
    setLoading(true);
    setError(null);

    try {
      // Ensure subjects are loaded first
      let currentSubjects = subjects;
      if (currentSubjects.length === 0) {
        currentSubjects = await loadSubjects();
      }

      // Check if questions are already in localStorage
      const cachedQuestions = localStorage.getItem('examQuestions');
      if (cachedQuestions) {
        const parsedQuestions = JSON.parse(cachedQuestions);
        setAllQuestions(parsedQuestions);
        
        // Load questions for current subject
        const currentSubjectId = currentSubjects[0]?.id;
        const subjectQuestions = parsedQuestions[currentSubjectId] || [];
        setQuestions(subjectQuestions);
        return parsedQuestions;
      }

      // Fetch all questions from backend
      const questionsData = await apiCall('questions/');
      
      if (!Array.isArray(questionsData)) {
        throw new Error('Invalid questions data format received from server');
      }

      // Group questions by subject
      const questionsBySubject = {};
      currentSubjects.forEach(subject => {
        const matched = questionsData.filter(q => {
          if (!q.subject) return false;
          
          const questionSubject = typeof q.subject === 'object' ? q.subject : { id: q.subject, name: '', code: '' };
          const questionSubjectId = questionSubject.id;
          const questionSubjectName = questionSubject.name?.toLowerCase() || '';
          const questionSubjectCode = questionSubject.code?.toLowerCase() || '';
          const configSubjectName = subject.name.toLowerCase();
          const configSubjectCode = subject.code.toLowerCase();

          return questionSubjectId === subject.id ||
                 questionSubjectName === configSubjectName ||
                 questionSubjectCode === configSubjectCode ||
                 questionSubjectName.includes(configSubjectName) ||
                 configSubjectName.includes(questionSubjectName);
        });

        questionsBySubject[subject.id] = matched;
      });

      // Store in localStorage and state
      localStorage.setItem('examQuestions', JSON.stringify(questionsBySubject));
      setAllQuestions(questionsBySubject);
      
      // Load questions for current subject
      const currentSubjectId = currentSubjects[0]?.id;
      const subjectQuestions = questionsBySubject[currentSubjectId] || [];
      setQuestions(subjectQuestions);

      // Update total questions count
      const totalQuestions = Object.values(questionsBySubject).reduce((sum, subjectQuestions) => sum + subjectQuestions.length, 0);
      setExamInfo(prev => ({ ...prev, totalQuestions }));

      return questionsBySubject;
    } catch (error) {
      console.error('Error loading questions:', error);
      setError(`Failed to load questions: ${error.message}`);
    } finally {
      setLoading(false);
      loadAllQuestions.isLoading = false;
    }
  };

  // Save answers to localStorage immediately
  const saveAnswersToLocalStorage = (answers) => {
    try {
      localStorage.setItem('examAnswers', JSON.stringify(answers));
      localStorage.setItem('examAnswersTimestamp', Date.now().toString());
      localStorage.setItem('examAnswersBackupCount', Object.keys(answers).length.toString());
    } catch (error) {
      console.error('Error saving answers to localStorage:', error);
    }
  };

  // Load answers from localStorage
  const loadAnswersFromLocalStorage = () => {
    try {
      const savedAnswers = localStorage.getItem('examAnswers');
      if (savedAnswers) {
        const answers = JSON.parse(savedAnswers);
        setSelectedAnswers(answers);
        return answers;
      }
    } catch (error) {
      console.error('Error loading answers from localStorage:', error);
    }
    return {};
  };

  // Save answers to backend (background operation)
  const saveAnswersToBackend = async (answersToSave = selectedAnswers) => {
    if (!examSessionId) {
      console.warn('No exam session ID available for saving answers');
      return;
    }

    try {
      const savePromises = [];
      
      for (const [questionId, selectedOption] of Object.entries(answersToSave)) {
        if (lastSavedAnswers.current[questionId] !== selectedOption && selectedOption) {
          const answerData = {
            session: examSessionId,
            question: questionId,
            selected_option: selectedOption,
            answered_at: new Date().toISOString(),
            student_id: studentInfo.studentId
          };

          savePromises.push(
            apiCall('answers/', {
              method: 'POST',
              body: JSON.stringify(answerData)
            }).catch(error => {
              if (error.message.includes('400') || error.message.includes('already exists')) {
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

      if (savePromises.length > 0) {
        await Promise.allSettled(savePromises);
        lastSavedAnswers.current = {...answersToSave};
        localStorage.setItem('examAnswersLastSync', Date.now().toString());
      }
      
    } catch (error) {
      console.error('Error saving answers to backend:', error);
      localStorage.setItem('examAnswersFailedSync', JSON.stringify(answersToSave));
    }
  };

  // Initialize or create exam session
  const initializeExamSession = async () => {
    try {
      let sessionId = localStorage.getItem('examSessionId');
      
      if (!sessionId) {
        const sessionData = {
          student_id: studentInfo.studentId,
          exam_id: examInfo.id || 1,
          started_at: new Date().toISOString(),
          status: 'in_progress'
        };
        
        const newSession = await apiCall('exam-sessions/', {
          method: 'POST',
          body: JSON.stringify(sessionData)
        });
        
        sessionId = newSession.id;
        localStorage.setItem('examSessionId', sessionId);
      }
      
      setExamSessionId(sessionId);
      return sessionId;
    } catch (error) {
      console.error('Error initializing exam session:', error);
      const fallbackId = `session_${studentInfo.studentId}_${Date.now()}`;
      localStorage.setItem('examSessionId', fallbackId);
      setExamSessionId(fallbackId);
      return fallbackId;
    }
  };

  // Submit exam
  const submitExam = async () => {
    if (!examSessionId) {
      alert('No active exam session found. Please restart the exam.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const answeredCount = Object.keys(selectedAnswers).length;
      const totalQuestions = Object.values(allQuestions).reduce((sum, subjectQuestions) => sum + subjectQuestions.length, 0);
      
      const confirmed = window.confirm(
        `Are you sure you want to submit the exam?\n\n` +
        `Answered: ${answeredCount}/${totalQuestions} questions\n` +
        `Time remaining: ${formatTime(timeRemaining)}\n\n` +
        `This action cannot be undone and will end your exam session.`
      );
      
      if (!confirmed) {
        setIsSubmitting(false);
        return;
      }

      // Save final answers
      await saveAnswersToBackend(selectedAnswers);
      
      // Create submission data
      const submissionData = {
        studentId: studentInfo.studentId,
        examSessionId: examSessionId,
        submittedAt: new Date().toISOString(),
        timeTaken: CONFIG.EXAM_DURATION - timeRemaining,
        totalQuestions,
        answeredQuestions: answeredCount,
        flaggedQuestions: flaggedQuestions.size,
        completionPercentage: Math.round((answeredCount / totalQuestions) * 100)
      };
      
      localStorage.setItem('examSubmission', JSON.stringify(submissionData));
      localStorage.setItem('examCompletedAt', new Date().toISOString());
      
      // Clear exam data
      localStorage.removeItem('examQuestions');
      localStorage.removeItem('examAnswers');
      localStorage.removeItem('examSessionId');
      
      navigate('/exam-complete', { 
        state: { 
          success: true, 
          submissionData 
        } 
      });
      
    } catch (error) {
      console.error('Error submitting exam:', error);
      
      // Fallback submission
      const fallbackData = {
        studentId: studentInfo.studentId,
        examSessionId: examSessionId,
        submittedAt: new Date().toISOString(),
        timeTaken: CONFIG.EXAM_DURATION - timeRemaining,
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(selectedAnswers).length,
        flaggedQuestions: flaggedQuestions.size,
        offlineSubmission: true
      };
      
      localStorage.setItem('examSubmission', JSON.stringify(fallbackData));
      localStorage.setItem('examCompletedAt', new Date().toISOString());
      
      const proceed = window.confirm(
        'There was an issue submitting to the server, but your answers are saved locally. ' +
        'Do you want to proceed to the completion page?'
      );
      
      if (proceed) {
        navigate('/exam-complete', { 
          state: { 
            success: true, 
            submissionData: fallbackData 
          } 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Functions
  const handleAnswerSelect = (questionId, answerId, clearAnswer = false) => {
    // Prevent multiple rapid selections
    if (isSubmitting) return;
    
    const newAnswers = clearAnswer 
      ? (() => {
          const updated = { ...selectedAnswers };
          delete updated[questionId];
          return updated;
        })()
      : {
          ...selectedAnswers,
          [questionId]: answerId
        };
    
    setSelectedAnswers(newAnswers);
    saveAnswersToLocalStorage(newAnswers);
    
    // Trigger background save to server after short delay
    clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      // Only save if answers actually changed
      if (lastSavedAnswers.current[questionId] !== answerId) {
        saveAnswersToBackend(newAnswers);
      }
    }, 2000);
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

  const handleSubjectChange = (index) => {
    setCurrentSubject(index);
    setCurrentQuestionIndex(0);
    
    const subjectQuestions = allQuestions[subjects[index]?.id] || [];
    setQuestions(subjectQuestions);
  };

  // Calculator Functions
  const handleCalculatorOperation = (operation) => {
    setCalculatorValue(prev => {
      try {
        switch (operation) {
          case 'C':
            return '0';
          case 'CE':
            return '0';
          case '=':
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

  // Render Question Options
  const renderQuestionOptions = (question) => {
    if (!question) return null;

    // Check if question has options array (newer format)
    if (question.options && Array.isArray(question.options)) {
      return question.options.map(option => (
        <div
          key={option.id}
          onClick={() => handleAnswerSelect(question.id, option.id)}
          className={`answer-option p-3 border rounded mb-2 cursor-pointer ${
            selectedAnswers[question.id] === option.id
              ? 'selected border-primary bg-primary bg-opacity-10'
              : 'border-secondary'
          }`}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex align-items-center">
            <div className={`me-3 ${
              selectedAnswers[question.id] === option.id
                ? 'text-primary'
                : 'text-secondary'
            }`}>
              <i className={`fas ${
                selectedAnswers[question.id] === option.id
                  ? 'fa-circle-dot'
                  : 'fa-circle'
              }`}></i>
            </div>
            <span className="fw-bold me-2">{option.id}.</span>
            <span>{option.text || option.option_text}</span>
          </div>
        </div>
      ));
    }

    // Fallback for older format with option_a, option_b, etc.
    return ['A', 'B', 'C', 'D'].map(optionId => {
      const optionText = question[`option_${optionId.toLowerCase()}`];
      
      if (!optionText) return null;
      
      return (
        <div
          key={optionId}
          onClick={() => handleAnswerSelect(question.id, optionId)}
          className={`answer-option p-3 border rounded mb-2 cursor-pointer ${
            selectedAnswers[question.id] === optionId
              ? 'selected border-primary bg-primary bg-opacity-10'
              : 'border-secondary'
          }`}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex align-items-center">
            <div className={`me-3 ${
              selectedAnswers[question.id] === optionId
                ? 'text-primary'
                : 'text-secondary'
            }`}>
              <i className={`fas ${
                selectedAnswers[question.id] === optionId
                  ? 'fa-circle-dot'
                  : 'fa-circle'
              }`}></i>
            </div>
            <span className="fw-bold me-2">{optionId}.</span>
            <span>{optionText}</span>
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  // Effects
  useEffect(() => {
    if (!studentInfo) return;
    
    let isMounted = true;
    
    const initializeExam = async () => {
      if (!isMounted) return;
      await loadExamInfo();
      if (!isMounted) return;
      await loadSubjects();
      if (!isMounted) return;
      await initializeExamSession();
      if (!isMounted) return;
      await loadAllQuestions();
    };
    
    initializeExam();
    loadAnswersFromLocalStorage();
    
    return () => {
      isMounted = false;
    };
  }, [studentInfo]);

  // Auto-save to backend periodically
  useEffect(() => {
    if (examSessionId && Object.keys(selectedAnswers).length > 0) {
      const interval = setInterval(() => {
        saveAnswersToBackend(selectedAnswers);
      }, CONFIG.AUTO_SAVE_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [selectedAnswers, examSessionId]);

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
  }, [timeRemaining]);

  // Time warnings
  useEffect(() => {
    if (CONFIG.WARNING_TIMES.includes(timeRemaining)) {
      const minutesLeft = timeRemaining / 60;
      alert(`Warning: ${minutesLeft} minutes remaining!`);
    }
  }, [timeRemaining]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSubmitting) return; // Disable shortcuts during submission
      
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
          if (!isSubmitting) {
            submitExam();
          }
          break;
        case 'R':
          handleAnswerSelect(currentQuestion.id, null, true);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [questions, currentQuestionIndex, isSubmitting]);

  // Prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitting && Object.keys(selectedAnswers).length > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved answers. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [selectedAnswers, isSubmitting]);

  // Retry failed syncs
  useEffect(() => {
    if (!examSessionId) return;
    
    const retryFailedSync = () => {
      const failedAnswers = localStorage.getItem('examAnswersFailedSync');
      if (failedAnswers) {
        try {
          const answers = JSON.parse(failedAnswers);
          saveAnswersToBackend(answers).then(() => {
            localStorage.removeItem('examAnswersFailedSync');
          }).catch(error => {
            console.error('Retry failed sync error:', error);
          });
        } catch (error) {
          console.error('Error parsing failed sync data:', error);
        }
      }
    };

    // Only retry if there are failed syncs
    const failedAnswers = localStorage.getItem('examAnswersFailedSync');
    if (failedAnswers) {
      // Retry failed syncs every 30 seconds
      const retryInterval = setInterval(retryFailedSync, 30000);
      
      // Also retry immediately
      retryFailedSync();
      
      return () => clearInterval(retryInterval);
    }
  }, [examSessionId]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining <= 0 || isSubmitting) return;

    const timer = setTimeout(() => {
      if (!isSubmitting) {
        submitExam();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining, isSubmitting]); // Add isSubmitting to prevent multiple submissions

  // Time warnings
  useEffect(() => {
    if (CONFIG.WARNING_TIMES.includes(timeRemaining) && timeRemaining > 0) {
      const minutesLeft = timeRemaining / 60;
      alert(`Warning: ${minutesLeft} minutes remaining!`);
    }
  }, [timeRemaining]);

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Exam...</h5>
          <p className="text-muted">Please wait while we prepare your examination</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="text-danger mb-3">
            <i className="fas fa-exclamation-triangle fa-2x"></i>
          </div>
          <h5 className="text-danger">Error Loading Exam</h5>
          <p className="text-muted mb-4">{error}</p>
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.removeItem('examQuestions');
                localStorage.removeItem('examSessionId');
                window.location.reload();
              }}
            >
              Retry Loading Questions
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                localStorage.removeItem('examQuestions');
                localStorage.removeItem('examSessionId');
                window.location.reload();
              }}
            >
              Reset Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!studentInfo) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = Object.values(allQuestions).reduce((sum, subjectQuestions) => sum + subjectQuestions.length, 0);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="exam-container d-flex flex-column bg-light vh-100">
      {/* Bootstrap CSS */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      
      {/* Header */}
      <header className="exam-header bg-white shadow-sm">
        <div className="container-fluid h-100 py-3">
          <div className="row align-items-center mb-3">
            <div className="col-md-8">
              <h1 className="h3 mb-1 text-dark">{examInfo.name}</h1>
              <small className="text-muted">
                {examInfo.description} | Student: {studentInfo.name} | ID: {studentInfo.studentId}
              </small>
            </div>
            
            <div className="col-md-4 text-end">
              <div className={`p-2 rounded font-monospace fw-bold fs-5 ${
                timeRemaining < 300 ? 'bg-danger text-white' : 
                timeRemaining < 900 ? 'bg-warning text-dark' : 'bg-light'
              }`}>
                {formatTime(timeRemaining)}
              </div>
              <small className="text-muted">Time Remaining</small>
            </div>
          </div>
          
          {/* Subject Tabs */}
          <div className="row g-1 mb-3">
            {subjects.map((subject, index) => {
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
                Question {currentQuestionIndex + 1} of {questions.length} - {subjects[currentSubject]?.name || 'Loading...'}
              </p>
              <small className="text-muted">
                Progress: {answeredCount}/{totalQuestions} answered
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
              {questions.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted mb-3">
                    <i className="fas fa-question-circle fa-3x"></i>
                  </div>
                  <h5>No questions available</h5>
                  <p className="text-muted">
                    No questions found for {subjects[currentSubject]?.name || 'this subject'}
                  </p>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('examQuestions');
                      loadAllQuestions();
                    }}
                    className="btn btn-primary"
                  >
                    Reload Questions
                  </button>
                </div>
              ) : currentQuestion ? (
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
                            {flaggedQuestions.has(currentQuestion.id) && (
                              <span className="badge bg-warning">
                                <i className="fas fa-flag"></i> Flagged
                              </span>
                            )}
                            {selectedAnswers[currentQuestion.id] && (
                              <span className="badge bg-success">
                                <i className="fas fa-check"></i> Answered
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="card-text lead">
                          {currentQuestion.text || currentQuestion.question_text}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="mb-4">
                        {renderQuestionOptions(currentQuestion)}
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
                            flaggedQuestions.has(currentQuestion.id)
                              ? 'btn-warning'
                              : 'btn-outline-warning'
                          }`}
                        >
                          <i className="fas fa-flag me-2"></i>
                          {flaggedQuestions.has(currentQuestion.id) ? 'Unflag' : 'Flag'}
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
                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                              >
                                {index + 1}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="row g-3 mb-3">
                        <div className="col-auto">
                          <div className="d-flex align-items-center">
                            <div className="bg-success" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
                            <small className="ms-2 text-muted">Answered</small>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="d-flex align-items-center">
                            <div className="bg-danger" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
                            <small className="ms-2 text-muted">Unanswered</small>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="d-flex align-items-center">
                            <div className="bg-warning" style={{width: '16px', height: '16px', borderRadius: '2px'}}></div>
                            <small className="ms-2 text-muted">Flagged</small>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">Overall Progress</small>
                          <small className="text-muted">
                            {Math.round((answeredCount / totalQuestions) * 100)}%
                          </small>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ 
                              width: `${(answeredCount / totalQuestions) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="text-warning mb-3">
                    <i className="fas fa-exclamation-triangle fa-3x"></i>
                  </div>
                  <h5>Question not found</h5>
                  <p className="text-muted">Current question could not be loaded</p>
                </div>
              )}
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
                        <strong>Subject:</strong> {subjects[currentSubject]?.name || 'Loading...'}
                      </div>
                      <div className="mb-2">
                        <strong>Questions:</strong> {currentQuestionIndex + 1} of {questions.length}
                      </div>
                      <div className="mb-2">
                        <strong>Total Questions:</strong> {examInfo.totalQuestions}
                      </div>
                      <div className="mb-2">
                        <strong>Duration:</strong> {Math.floor(examInfo.duration / 60)} minutes
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
                    
                    {isCalculatorVisible && (
                      <div>
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
                            <div className="col-3">
                              <button
                                onClick={() => handleCalculatorOperation('=')}
                                className="btn btn-sm btn-primary w-100"
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
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-title">Quick Actions</h6>
                    <div className="d-grid gap-2">
                      <button
                        onClick={() => {
                          if (currentQuestion) {
                            handleAnswerSelect(currentQuestion.id, null, true);
                          }
                        }}
                        className="btn btn-outline-warning btn-sm"
                        disabled={!currentQuestion || !selectedAnswers[currentQuestion?.id]}
                      >
                        <i className="fas fa-times me-2"></i>Clear Answer
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
                    <p className="text-muted small mb-2">
                      Exam: {examInfo.name}
                    </p>
                    <p className="text-muted small mb-3">
                      Answered: {answeredCount}/{totalQuestions} questions
                    </p>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Answers Saved:</small>
                        <small className={`${
                          Object.keys(selectedAnswers).length === Object.keys(lastSavedAnswers.current).length 
                            ? 'text-success' 
                            : 'text-warning'
                        }`}>
                          {Object.keys(lastSavedAnswers.current).length}/{Object.keys(selectedAnswers).length}
                        </small>
                      </div>
                    </div>
                    <button
                      onClick={submitExam}
                      disabled={isSubmitting}
                      className="btn btn-danger w-100"
                    >
                      {isSubmitting ? (
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
                    
                    {/* Sync Status */}
                    <div className="mt-2">
                      <small className="text-muted d-flex align-items-center">
                        <i className={`fas ${
                          Object.keys(selectedAnswers).length === Object.keys(lastSavedAnswers.current).length 
                            ? 'fa-check-circle text-success' 
                            : 'fa-sync-alt fa-spin text-warning'
                        } me-1`}></i>
                        {Object.keys(selectedAnswers).length === Object.keys(lastSavedAnswers.current).length 
                          ? 'All answers synced' 
                          : 'Syncing answers...'}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
          font-size: 14px;
          padding: 0;
        }
        
        .question-btn.active {
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
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
      `}</style>
    </div>
  );
};

export default ExamSession;