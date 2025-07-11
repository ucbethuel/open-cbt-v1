export const saveProgress = async ({
  studentInfo,
  selectedAnswers,
  flaggedQuestions,
  currentQuestionIndex,
  currentSubject,
  timeRemaining,
  CONFIG
}) => {
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
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
};

export const submitExam = async ({
  studentInfo,
  selectedAnswers,
  timeRemaining,
  CONFIG
}) => {
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

export const loadProgress = async () => {
  try {
    // Implement if needed
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
};
