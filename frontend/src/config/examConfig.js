const CONFIG = {
  EXAM: {
    DURATION_SECONDS: 7200, // 2 hours
    AUTO_SAVE_INTERVAL_MS: 30000, // 30 seconds
    WARNING_TIMES_SECONDS: [1800, 900, 300], // 30, 15, 5 minutes
  },

  API: {
    BASE_URL: 'http://127.0.0.1:8000', 
    PATH: '/api/',
    ENDPOINTS: {
      // e.g. /api/student_exam/1/data/
      GET_STUDENT_EXAM_DATA: (studentId) => `/api/studentexam/${studentId}/data/`,
      // Optional: if you decide to separate Subject metadata in the future
      GET_ALL_SUBJECTS: () => `/api/subjects/`,
    },
  }
};

export default CONFIG;