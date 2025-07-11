import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CONFIG from './config/examConfig';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { apiCall } from './helpers/api';
import { formatTime } from './helpers/timerUtils';
import { getMockQuestions, getQuestionStatusClass } from './helpers/questionUtils';
import { saveProgress, submitExam, loadProgress } from './helpers/examUtils';
import ProgressBar from './components/ProgressBar';
import bootstrapStyle from './utils/functions/bootstrapStyle';

const Exam = () => {
  const location = useLocation();
  const studentId = location.state?.studentId || 'GUEST';
  const rawStudentData = localStorage.getItem('studentData');
  const studentData = rawStudentData ? JSON.parse(rawStudentData) : {};

  const [studentInfo] = useState({
    name: `${studentData.first_name || 'Test'} ${studentData.last_name || 'User'}`,
    studentId,
    examId: 'CBT_2025_001',
    course: 'JAMB CBT Examination'
  });

  const [timeRemaining, setTimeRemaining] = useState(CONFIG.EXAM_DURATION);
  const [currentSubject, setCurrentSubject] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });
  const autoSaveRef = useRef();

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

  const toggleFlagQuestion = () => {
    const questionId = questions[currentQuestionIndex]?.id;
    if (!questionId) return;
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.has(questionId) ? newSet.delete(questionId) : newSet.add(questionId);
      return newSet;
    });
  };

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) setCurrentQuestionIndex(index);
  };

  const handleSubjectChange = (index) => {
    setCurrentSubject(index);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions(new Set());
    loadQuestions(CONFIG.SUBJECTS[index].id);
  };

  useKeyboardShortcuts({
    questions,
    currentQuestionIndex,
    setSelectedAnswers,
    handleAnswerSelect: (questionId, optionId) =>
      setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId })),
    handleNextQuestion: () =>
      setCurrentQuestionIndex(prev => (prev < questions.length - 1 ? prev + 1 : prev)),
    handlePreviousQuestion: () =>
      setCurrentQuestionIndex(prev => (prev > 0 ? prev - 1 : prev)),
    handleSubmitExam: () => {
      const unanswered = questions.length - Object.keys(selectedAnswers).length;
      if (
        unanswered > 0 &&
        !window.confirm(`You have ${unanswered} unanswered questions. Still submit?`)
      ) return;
      submitExam({ studentInfo, selectedAnswers, timeRemaining, CONFIG });
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          submitExam({ studentInfo, selectedAnswers, timeRemaining, CONFIG });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (CONFIG.WARNING_TIMES.includes(timeRemaining)) {
      alert(`Warning: ${timeRemaining / 60} minutes remaining`);
    }
  }, [timeRemaining]);

  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      saveProgress({
        studentInfo,
        selectedAnswers,
        flaggedQuestions,
        currentQuestionIndex,
        currentSubject,
        timeRemaining,
        CONFIG
      });
    }, CONFIG.AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveRef.current);
  }, [selectedAnswers, flaggedQuestions, currentQuestionIndex]);

  useEffect(() => {
    loadProgress();
    loadQuestions(CONFIG.SUBJECTS[currentSubject].id);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  // ========================
  // ✅ Render Inline UI Here
  // ========================
  if (loading && questions.length === 0) {
    return (
      <>
        <style>{bootstrapStyle}</style>
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted">Loading questions...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{bootstrapStyle}</style>
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="text-center">
            <div className="text-danger mb-3">
              <i className="fas fa-exclamation-triangle fa-2x" />
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

  return (
    <>
      <style>{bootstrapStyle}</style>
      <div className="container mt-4">
        <h3>{studentInfo.course}</h3>
        <div className="d-flex justify-content-between">
          <span><strong>Name:</strong> {studentInfo.name}</span>
          <span><strong>ID:</strong> {studentInfo.studentId}</span>
          <span><strong>Time Left:</strong> {formatTime(timeRemaining)}</span>
        </div>
        <hr />
        <div className="mb-3">
          {CONFIG.SUBJECTS.map((subject, index) => (
            <button
              key={subject.id}
              className={`btn btn-outline-${index === currentSubject ? 'primary' : 'secondary'} me-2`}
              onClick={() => handleSubjectChange(index)}
            >
              {subject.name}
            </button>
          ))}
        </div>

        {currentQuestion && (
          <div className="card mb-4">
            <div className="card-header">
              <h5>Question {currentQuestionIndex + 1}</h5>
            </div>
            <div className="card-body">
              <p>{currentQuestion.text}</p>
              <div className="list-group">
                {currentQuestion.options.map(option => (
                  <button
                    key={option.id}
                    className={`list-group-item list-group-item-action ${selectedAnswers[currentQuestion.id] === option.id ? 'active' : ''}`}
                    onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: option.id }))}
                  >
                    {option.id}. {option.text}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <button className="btn btn-secondary me-2" onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}>Previous</button>
                <button className="btn btn-secondary me-2" onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1))}>Next</button>
                <button className="btn btn-warning me-2" onClick={toggleFlagQuestion}>Flag</button>
                <button className="btn btn-success" onClick={() => submitExam({ studentInfo, selectedAnswers, timeRemaining, CONFIG })}>Submit</button>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex flex-wrap gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm ${getQuestionStatusClass(index, questions, selectedAnswers, flaggedQuestions)}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Exam;
