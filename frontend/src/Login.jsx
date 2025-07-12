import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return setError("Please enter your student ID.");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/users/student-login/",
        {
          student_id: studentId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const studentData = response.data;
      console.log("Student Data:", response.data);
      localStorage.setItem("studentData", JSON.stringify(studentData));
      navigate("/complete", { state: { studentData } });
    } catch (error) {
      setError("Invalid student ID. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Student Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="studentId" className="form-label">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              className="form-control"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your student ID"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

// Old code

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [examId, setExamId] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Replace this with your real login logic
//   const login = async (id) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (id.trim()) resolve(true);
//         else reject(new Error('Invalid ID'));
//       }, 500);
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!examId) return setError('Please enter your candidate number.');

//     try {
//       setError('');
//       setLoading(true);
//       await login(examId);

//       // **Store examId in localStorage** before navigating
//       localStorage.setItem('examId', examId);

//       navigate('/complete', {
//         state: { examId } // Pass examId to the next page
//       });
//     } catch (err) {
//       setError('Failed to login. Please check your candidate number.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
//         <h2 className="text-center mb-4">Candidate Login</h2>

//         {error && <div className="alert alert-danger">{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="examId" className="form-label">Candidate Number</label>
//             <input
//               type="text"
//               id="examId"
//               className="form-control"
//               value={examId}
//               onChange={(e) => setExamId(e.target.value)}
//               placeholder="Enter your exam ID"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-100"
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
