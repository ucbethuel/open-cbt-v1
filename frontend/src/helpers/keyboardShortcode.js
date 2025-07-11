// export const handleSubmitExam = () => {
//     const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    
//     if (unansweredCount > 0) {
//       if (!window.confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`)) {
//         return;
//       }
//     }
    
//     if (window.confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
//       submitExam();
//     }
//   };

//   export const handleAnswerSelect = (questionId, optionId) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: optionId
//     }));
//   };

//   export const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   export const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   export const handleNextQuestion = (
//   currentQuestionIndex,
//   setCurrentQuestionIndex,
//   questions
// ) => {
//   if (currentQuestionIndex < questions.length - 1) {
//     setCurrentQuestionIndex(currentQuestionIndex + 1);
//   }
// };


// keyboardShortcode.js
// src/utils/functions/keyboardShortcode.js
// Handle selecting an answer
export const handleAnswerSelect = (questionId, optionId, setSelectedAnswers) => {
  if (typeof setSelectedAnswers !== 'function') return;

  setSelectedAnswers(prev => ({
    ...prev,
    [questionId]: optionId
  }));
};

// Handle going to the next question
export const handleNextQuestion = (currentQuestionIndex, setCurrentQuestionIndex, questions) => {
  if (
    typeof currentQuestionIndex !== 'number' ||
    typeof setCurrentQuestionIndex !== 'function' ||
    !Array.isArray(questions)
  ) return;

  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }
};

// Handle going to the previous question
export const handlePreviousQuestion = (currentQuestionIndex, setCurrentQuestionIndex) => {
  if (
    typeof currentQuestionIndex !== 'number' ||
    typeof setCurrentQuestionIndex !== 'function'
  ) return;

  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }
};

// Handle exam submission with confirmation
export const handleSubmitExam = ({ questions, selectedAnswers, submitExam }) => {
  if (!Array.isArray(questions) || typeof selectedAnswers !== 'object' || typeof submitExam !== 'function') return;

  const unansweredCount = questions.length - Object.keys(selectedAnswers).length;

  if (unansweredCount > 0) {
    const confirmContinue = window.confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`);
    if (!confirmContinue) return;
  }

  const confirmSubmit = window.confirm('Are you sure you want to submit your exam? This action cannot be undone.');
  if (confirmSubmit) {
    submitExam();
  }
};



