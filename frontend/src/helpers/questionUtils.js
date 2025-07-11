// import CONFIG from "../config/examConfig";
import { apiCall } from "./api";

// const studentExamQuestionURL = CONFIG.API_BASE_URL + `api/studentexam/${8148368548}/data/`


export const getMockQuestions = async (subjectId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
let questionsURL = apiCall(`api/studentexam/${8148368548}/data/`)
  const questionSets = questionsURL["questions"]

  return questionSets[subjectId] || [];
};

export const getQuestionStatusClass = (question, index, selectedAnswers, flaggedQuestions) => {
  if (!question) return 'btn-secondary';
  const id = question.id;
  if (flaggedQuestions.has(id)) return 'btn-warning';
  if (selectedAnswers[id]) return 'btn-success';
  return 'btn-danger';
};
