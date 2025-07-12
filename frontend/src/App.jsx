
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Exam from './complete';
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
      <Route path="/admindashboard" element={<AdminLogin />} />
      <Route path="/complete" element={<Exam />} />
      <Route path="/admindashboard/cct" element={<AdminDashboard />} />
      <Route path="/jambadmindashboard" element={<CbtAdminDashboard />} />
      <Route path="/registerstudent" element={<StudentRegister />} />
      <Route path="/studentreport" element={<StudentReport />} />
      <Route path="/studentreportdata" element={<StudentReportPage />} />
    </Routes>
  );
};

export default App;
