

// // import React, { useEffect, useState } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';

// // const Dashboard = () => {
// //   const [student, setStudent] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const studentId = location.state?.studentId;
// //   const initialStudentData = location.state?.studentData;

// //   console.log('Location state:', location.state);
// //   console.log('Student ID:', studentId);

// //   useEffect(() => {
// //     if (!studentId) {
// //       setError("No student ID provided. Please log in again.");
// //       setLoading(false);
// //       return;
// //     }

// //     // const url = `http://localhost:8000/api/users/student-login/`;
// //     // const url = `http://127.0.0.1:8000/api/student/${studentId}/`;
// //     // const url = `http://127.0.0.1:8000/api/studentexam/${studentId}/data`;
// //     const url = `http://127.0.0.1:8000//api/studentexam/1/data/`;
   
    
// //     console.log('Fetching:', url);

// //     fetch(url)
// //       .then(res => {
// //         if (!res.ok) {
// //           throw new Error(`Fetch failed. Status: ${res.status}`);
// //         }
// //         return res.json();
// //       })
// //       .then(data => {
// //         console.log("Student data:", data);
// //         setStudent(data);
// //         setLoading(false);
// //       })
// //       .catch(err => {
// //         console.error("Error:", err);
// //         setError("Could not load student data. Please check your connection or contact support.");
// //         setLoading(false);
// //       });
// //   }, [studentId]);

// //   const handleStartExam = () => {
// //     navigate('/exam-session', { state: { studentId: student.student_id } });
// //   };

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
// //         <div className="spinner-border text-primary" role="status">
// //           <span className="visually-hidden">Loading...</span>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
// //         <div className="alert alert-danger">{error}</div>
// //       </div>
// //     );
// //   }

// //   const fullName = `${student.first_name} ${student.last_name}`;
// //   const avatar = student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;

// //   return (
// //     <div className="position-relative vh-100 bg-light">
// //       <div className="d-flex flex-column align-items-center justify-content-center h-100 px-3">
// //         <div className="mb-4 text-center">
// //           <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
// //             Welcome, {fullName}
// //           </h1>
// //           <p className="lead mb-2">
// //             This is your CBT dashboard. Please verify your details below before starting the exam.
// //           </p>
// //         </div>

// //         <div className="card p-4 shadow" style={{ maxWidth: 500, width: '100%' }}>
// //           <div className="d-flex flex-column align-items-center mb-3">
// //             <img
// //               src={avatar}
// //               alt="Student Avatar"
// //               className="rounded-circle mb-2"
// //               style={{ width: 100, height: 100, objectFit: 'cover' }}
// //             />
// //             <h4 className="mb-1">{fullName}</h4>
// //             <small className="text-muted">ID: {student.student_id}</small>
// //           </div>

// //           <hr />

// //           <div className="text-start">
// //             <p><strong>Email:</strong> {student.email}</p>
// //             <p><strong>Phone:</strong> {student.phone_number || 'Not Provided'}</p>
// //             <p><strong>Course:</strong> {student.course}</p>
// //             <p><strong>Institution:</strong> {student.institution}</p>
// //             <p><strong>Gender:</strong> {student.gender || 'N/A'}</p>
// //             <p><strong>Date of Birth:</strong> {student.date_of_birth || 'N/A'}</p>
// //           </div>
// //         </div>
// //       </div>

// //       <button
// //         className="btn btn-primary position-absolute"
// //         style={{
// //           bottom: 40,
// //           right: 40,
// //           minWidth: 180,
// //           minHeight: 50,
// //           fontSize: '1.2rem',
// //           fontWeight: 'bold',
// //           boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
// //         }}
// //         onClick={handleStartExam}
// //       >
// //         Start Exam
// //       </button>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Dashboard = () => {
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const studentId = location.state?.studentId;
//   const initialStudentData = location.state?.studentData;

//   // Enhanced debugging
//   console.log('Full location object:', location);
//   console.log('Location state:', location.state);
//   console.log('Student ID:', studentId);
//   console.log('Student ID type:', typeof studentId);
//   console.log('Student ID is falsy?', !studentId);

//   useEffect(() => {
//     // More flexible check - also handle empty string, 0, etc.
//     if (!studentId && studentId !== 0) {
//       console.log('No valid student ID found');
//       setError("No student ID provided. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     // You had a hardcoded URL - let's make it dynamic
//     const url = `http://127.0.0.1:8000/api/studentexam/${studentId}/data/`;
    
//     console.log('Fetching:', url);

//     fetch(url)
//       .then(res => {
//         console.log('Response status:', res.status);
//         if (!res.ok) {
//           throw new Error(`Fetch failed. Status: ${res.status}`);
//         }
//         return res.json();
//       })
//       .then(data => {
//         console.log("Student data:", data);
//         setStudent(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Error:", err);
//         setError("Could not load student data. Please check your connection or contact support.");
//         setLoading(false);
//       });
//   }, [studentId]);

//   const handleStartExam = () => {
//     navigate('/exam-session', { state: { studentId: student.student_id } });
//   };

//   // Add debug info to the UI temporarily
//   if (!studentId && studentId !== 0) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//         <div className="alert alert-danger">
//           <h4>Debug Info:</h4>
//           <p>Location state: {JSON.stringify(location.state)}</p>
//           <p>Student ID: {JSON.stringify(studentId)}</p>
//           <p>Error: No student ID provided. Please log in again.</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//         <div className="alert alert-danger">{error}</div>
//       </div>
//     );
//   }

//   const fullName = `${student.first_name} ${student.last_name}`;
//   const avatar = student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;

//   return (
//     <div className="position-relative vh-100 bg-light">
//       <div className="d-flex flex-column align-items-center justify-content-center h-100 px-3">
//         <div className="mb-4 text-center">
//           <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
//             Welcome, {fullName}
//           </h1>
//           <p className="lead mb-2">
//             This is your CBT dashboard. Please verify your details below before starting the exam.
//           </p>
//         </div>

//         <div className="card p-4 shadow" style={{ maxWidth: 500, width: '100%' }}>
//           <div className="d-flex flex-column align-items-center mb-3">
//             <img
//               src={avatar}
//               alt="Student Avatar"
//               className="rounded-circle mb-2"
//               style={{ width: 100, height: 100, objectFit: 'cover' }}
//             />
//             <h4 className="mb-1">{fullName}</h4>
//             <small className="text-muted">ID: {student.student_id}</small>
//           </div>

//           <hr />

//           <div className="text-start">
//             <p><strong>Email:</strong> {student.email}</p>
//             <p><strong>Phone:</strong> {student.phone_number || 'Not Provided'}</p>
//             <p><strong>Course:</strong> {student.course}</p>
//             <p><strong>Institution:</strong> {student.institution}</p>
//             <p><strong>Gender:</strong> {student.gender || 'N/A'}</p>
//             <p><strong>Date of Birth:</strong> {student.date_of_birth || 'N/A'}</p>
//           </div>
//         </div>
//       </div>

//       <button
//         className="btn btn-primary position-absolute"
//         style={{
//           bottom: 40,
//           right: 40,
//           minWidth: 180,
//           minHeight: 50,
//           fontSize: '1.2rem',
//           fontWeight: 'bold',
//           boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
//         }}
//         onClick={handleStartExam}
//       >
//         Start Exam
//       </button>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle different possible data structures
  const studentId = location.state?.studentId || 
                   location.state?.studentData?.student_id || 
                   location.state?.studentData?.student?.student_id;
  const initialStudentData = location.state?.studentData;

  // Enhanced debugging
  console.log('Full location object:', location);
  console.log('Location state:', location.state);
  console.log('Student ID:', studentId);
  console.log('Student ID type:', typeof studentId);
  console.log('Student ID is falsy?', !studentId);

  useEffect(() => {
    // Check if we already have student data from the previous page
    if (initialStudentData && initialStudentData.student) {
      console.log("Using existing student data from location state");
      setStudent(initialStudentData.student);
      setLoading(false);
      return;
    }

    // More flexible check - also handle empty string, 0, etc.
    if (!studentId && studentId !== 0) {
      console.log('No valid student ID found');
      setError("No student ID provided. Please log in again.");
      setLoading(false);
      return;
    }

    // If we don't have student data, fetch it from API
    const url = `http://127.0.0.1:8000/api/studentexam/${studentId}/data/`;
    
    console.log('Fetching:', url);

    fetch(url)
      .then(res => {
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        if (!res.ok) {
          throw new Error(`Fetch failed. Status: ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Student data from API:", data);
        setStudent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Detailed error:", err);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        setError(`Could not load student data. Error: ${err.message}`);
        setLoading(false);
      });
  }, [studentId, initialStudentData]);

  const handleStartExam = () => {
    navigate('/exam-session', { state: { studentId: student.student_id } });
  };

  // Add debug info to the UI temporarily
  if (!studentId && studentId !== 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="alert alert-danger">
          <h4>Debug Info:</h4>
          <p>Location state: {JSON.stringify(location.state)}</p>
          <p>Student ID: {JSON.stringify(studentId)}</p>
          <p>Error: No student ID provided. Please log in again.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const fullName = `${student.first_name} ${student.last_name}`;
  const avatar = student.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;

  return (
    <div className="position-relative vh-100 bg-light">
      <div className="d-flex flex-column align-items-center justify-content-center h-100 px-3">
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
            Welcome, {fullName}
          </h1>
          <p className="lead mb-2">
            This is your CBT dashboard. Please verify your details below before starting the exam.
          </p>
        </div>

        <div className="card p-4 shadow" style={{ maxWidth: 500, width: '100%' }}>
          <div className="d-flex flex-column align-items-center mb-3">
            <img
              src={avatar}
              alt="Student Avatar"
              className="rounded-circle mb-2"
              style={{ width: 100, height: 100, objectFit: 'cover' }}
            />
            <h4 className="mb-1">{fullName}</h4>
            <small className="text-muted">ID: {student.student_id}</small>
          </div>

          <hr />

          <div className="text-start">
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone || 'Not Provided'}</p>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Institution:</strong> {student.institution}</p>
            <p><strong>Gender:</strong> {student.gender || 'N/A'}</p>
            <p><strong>Date of Birth:</strong> {student.date_of_birth || 'N/A'}</p>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary position-absolute"
        style={{
          bottom: 40,
          right: 40,
          minWidth: 180,
          minHeight: 50,
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
        }}
        onClick={handleStartExam}
      >
        Start Exam
      </button>
    </div>
  );
};

export default Dashboard;