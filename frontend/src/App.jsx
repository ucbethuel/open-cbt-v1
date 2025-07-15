
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
<<<<<<< HEAD
import Exam from './exam-session';
=======
import Exam from './complete';
import AdminDashboard from './Admin/Cctexam/AdminDashboard'; 
import CbtAdminDashboard from './Admin/Cbtexam/CbtAdminDashboard'; 
import StudentRegister from './Admin/Student/StudentRegister'; 
import StudentReport from './Admin/Student/StudentReport'; 
import StudentReportPage from './Admin/Student/Mockdata'; 
import AdminLogin from './Admin/AdminLogin';
>>>>>>> c97f2af2480c478f48459fb4f5f40a30706940b4

const App = () => {
  return (
    <Routes>
      {/* Redirect root to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={<Login />} />
<<<<<<< HEAD
      <Route path="/exam" element={<Exam />} />
      <Route path="/exam-session" element={<Exam />} />
=======
      <Route path="/admindashboard" element={<AdminLogin />} />
      <Route path="/complete" element={<Exam />} />
      <Route path="/admindashboard/cct" element={<AdminDashboard />} />
      <Route path="/jambadmindashboard" element={<CbtAdminDashboard />} />
      <Route path="/registerstudent" element={<StudentRegister />} />
      <Route path="/studentreport" element={<StudentReport />} />
      <Route path="/studentreportdata" element={<StudentReportPage />} />
>>>>>>> c97f2af2480c478f48459fb4f5f40a30706940b4
    </Routes>
  );
};

export default App;
