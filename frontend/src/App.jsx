
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
// import ExamSession from './realexam-session';
import ExamSession from './exam-session';
import Dashboard from './Dashboard';
import ExamComplete from './ExamComplete';



// import Exam from './complete';
import AdminDashboard from './Admin/Cctexam/AdminDashboard'; 
import CbtAdminDashboard from './Admin/Cbtexam/CbtAdminDashboard'; 
import StudentRegister from './Admin/Student/StudentRegister'; 
import StudentReport from './Admin/Student/StudentReport'; 
import StudentReportPage from './Admin/Student/Mockdata'; 
import AdminLogin from './Admin/AdminLogin';

const App = () => {
  return (
    <Routes>
      {/* Redirect root to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={<Login />} />
      {/* <Route path="/exam" element={<Exam/>} /> */}
      <Route path="/exam-session" element={<ExamSession />} />
      <Route path="/exam-complete" element={<ExamComplete />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Admin routes */}
      <Route path="/admindashboard" element={<AdminLogin />} />
      {/* <Route path="/complete" element={<Exam />} /> */}
      <Route path="/admindashboard/cct" element={<AdminDashboard />} />
      <Route path="/jambadmindashboard" element={<CbtAdminDashboard />} />
      <Route path="/registerstudent" element={<StudentRegister />} />
      <Route path="/studentreport" element={<StudentReport />} />
      <Route path="/studentreportdata" element={<StudentReportPage />} />
    </Routes>
  );
};

export default App;
