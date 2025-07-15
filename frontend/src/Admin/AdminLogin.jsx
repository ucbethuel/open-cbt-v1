import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './Cctexam/AdminDashboard'; // Adjust the import path as necessary

const AdminLogin = () => {
  const [mode, setMode] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!mode) return alert('Please select a mode');
    if (mode === 'JAMB') navigate('/jambadmindashboard');
    else if (mode === 'SCHOOL') navigate('/admindashboard/cct');
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <h2 className="mb-4">Select Exam Dashboard</h2>
      
      <div className="mb-3 w-50">
        <select 
          className="form-select" 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="">-- Choose Exam Mode --</option>
          <option value="JAMB">JAMB Mock Exam</option>
          <option value="SCHOOL">School Internal Exam</option>
        </select>
      </div>

      <button 
        className="btn btn-primary w-50" 
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
};

export default AdminLogin;
