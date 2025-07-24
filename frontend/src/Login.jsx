// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const Login = () => {
//   const [studentId, setStudentId] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!studentId) return setError("Please enter your student ID.");

//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:8000/api/users/student-login/", {
//   params: {
//     student_id: studentId,
//   },
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

//       const studentData = response.data;
//       console.log("Student Data:", response.data);
//       localStorage.setItem("studentData", JSON.stringify(studentData));
//       console.log('Navigating with studentData:', studentData);
//       console.log('Student ID being passed:', studentData.studentId);
//       navigate("/dashboard", { state: { studentId: studentData.studentId, studentData: studentData } });
//     } catch (error) {
//       setError("Invalid student ID. Please try again.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div
//         className="card shadow p-4"
//         style={{ maxWidth: "400px", width: "100%" }}
//       >
//         <h2 className="text-center mb-4">Student Login</h2>

//         {error && <div className="alert alert-danger">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="studentId" className="form-label">
//               Student ID
//             </label>
//             <input
//               type="text"
//               id="studentId"
//               className="form-control"
//               value={studentId}
//               onChange={(e) => setStudentId(e.target.value)}
//               placeholder="Enter your student ID"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-100"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user recently completed exam (6-hour restriction)
  useEffect(() => {
    const examCompletedAt = localStorage.getItem('examCompletedAt');
    if (examCompletedAt) {
      const completedTime = new Date(examCompletedAt);
      const now = new Date();
      const hoursSinceCompletion = (now - completedTime) / (1000 * 60 * 60);
      
      if (hoursSinceCompletion < 6) {
        const remainingHours = Math.ceil(6 - hoursSinceCompletion);
        setError(`You cannot login again until ${remainingHours} hours after completing your last exam.`);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!studentId.trim()) {
      setError('Please enter your Student ID');
      return;
    }

    // Check 6-hour restriction
    const examCompletedAt = localStorage.getItem('examCompletedAt');
    if (examCompletedAt) {
      const completedTime = new Date(examCompletedAt);
      const now = new Date();
      const hoursSinceCompletion = (now - completedTime) / (1000 * 60 * 60);
      
      if (hoursSinceCompletion < 6) {
        const remainingHours = Math.ceil(6 - hoursSinceCompletion);
        setError(`You cannot login again until ${remainingHours} hours after completing your last exam.`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // Use GET request with student_id as query param
      const response = await fetch(`http://localhost:8000/api/users/student-login/?student_id=${encodeURIComponent(studentId.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          setError(errorData.error || 'You are not permitted to login. Please contact admin.');
          return;
        }
        if (response.status === 404) {
          setError('Invalid student ID. Please try again.');
          return;
        }
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      // Normalize student data (handle both {student: {...}} and {...} response)
      const studentObj = data.student ? data.student : data;
      // Store session information
      localStorage.setItem('studentID', studentObj.studentId || studentId.trim());
      localStorage.setItem('studentData', JSON.stringify(studentObj));
      localStorage.setItem('loginTime', new Date().toISOString());
      // Clear any old exam data
      localStorage.removeItem('examQuestions');
      localStorage.removeItem('examAnswers');
      localStorage.removeItem('examSessionId');
      // Navigate to dashboard with student data
      navigate('/dashboard', {
        state: {
          studentId: studentObj.studentId || studentId.trim(),
          studentData: studentObj
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your Student ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        await fetch(`http://127.0.0.1:8000/api/users/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-graduation-cap text-white fa-2x"></i>
                  </div>
                  <h2 className="h3 fw-bold text-dark mb-2">CBT Exam Portal</h2>
                  <p className="text-muted">Enter your Student ID to begin</p>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="studentId" className="form-label fw-semibold">
                      Student ID
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-user text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        id="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter your Student ID"
                        disabled={loading}
                        style={{ 
                          borderLeft: 'none',
                          boxShadow: 'none',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      <div className="small">{error}</div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !studentId.trim()}
                    className="btn btn-primary w-100 py-3 fw-semibold"
                    style={{ 
                      borderRadius: '10px',
                      fontSize: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login to Exam
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    Having trouble? Contact your exam administrator
                  </small>
                </div>

                {/* Debug/Admin Section */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 pt-3 border-top">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-secondary btn-sm w-100"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Clear Session (Debug)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .input-group-text {
          border-right: none;
          background: transparent;
        }
        
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
        
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .alert {
          border-radius: 10px;
          border: none;
        }
        
        @media (max-width: 768px) {
          .card-body {
            padding: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;