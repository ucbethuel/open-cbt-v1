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
      const response = await axios.get("http://localhost:8000/api/users/student-login/", {
  params: {
    student_id: studentId,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

      const studentData = response.data;
      console.log("Student Data:", response.data);
      localStorage.setItem("studentData", JSON.stringify(studentData));
      console.log('Navigating with studentData:', studentData);
      console.log('Student ID being passed:', studentData.studentId);
      navigate("/dashboard", { state: { studentId: studentData.studentId, studentData: studentData } });
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
