import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [examId, setExamId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Replace this with your real login logic
  const login = async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id.trim()) resolve(true);
        else reject(new Error('Invalid ID'));
      }, 500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!examId) return setError('Please enter your candidate number.');

    try {
      setError('');
      setLoading(true);
      await login(examId);

      // **Store examId in localStorage** before navigating
      localStorage.setItem('examId', examId);

     
      navigate('/complete', {
        state: { examId } // Pass examId to the next page
      });
    } catch (err) {
      setError('Failed to login. Please check your candidate number.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Candidate Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="examId" className="form-label">Candidate Number</label>
            <input
              type="text"
              id="examId"
              className="form-control"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              placeholder="Enter your exam ID"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
