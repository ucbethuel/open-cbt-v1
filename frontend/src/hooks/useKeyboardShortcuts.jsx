import { useEffect } from 'react';

const useKeyboardShortcuts = ({
  questions = [],
  currentQuestionIndex,
  handleAnswerSelect,
  handleNextQuestion,
  handlePreviousQuestion,
  handleSubmitExam,
  setSelectedAnswers,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Defensive: Ignore if no questions or index out of range
      if (!Array.isArray(questions) || currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
        return;
      }

      const key = e.key.toUpperCase();
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion?.id) return;

      switch (key) {
        case 'A':
        case 'B':
        case 'C':
        case 'D':
          handleAnswerSelect?.(currentQuestion.id, key);
          break;

        case 'N':
          handleNextQuestion?.();
          break;

        case 'P':
          handlePreviousQuestion?.();
          break;

        case 'S':
          handleSubmitExam?.();
          break;

        case 'R':
          setSelectedAnswers?.((prev) => {
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

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    questions,
    currentQuestionIndex,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitExam,
    setSelectedAnswers,
  ]);
};

export default useKeyboardShortcuts;
