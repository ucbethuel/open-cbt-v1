


// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Dashboard = () => {
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Handle different possible data structures
//   const studentId = location.state?.studentId || 
//                    location.state?.studentData?.student_id || 
//                    location.state?.studentData?.student?.student_id;
//   const initialStudentData = location.state?.studentData;

//   // Enhanced debugging
//   console.log('Full location object:', location);
//   console.log('Location state:', location.state);
//   console.log('Student ID:', studentId);
//   console.log('Student ID type:', typeof studentId);
//   console.log('Student ID is falsy?', !studentId);

//   useEffect(() => {
//     // Check if we already have student data from the previous page
//     if (initialStudentData && initialStudentData.student) {
//       console.log("Using existing student data from location state");
//       console.log("Full student object:", initialStudentData.student);
//       console.log("Available fields:", Object.keys(initialStudentData.student));
//       setStudent(initialStudentData.student);
//       setLoading(false);
//       return;
//     }

//     // More flexible check - also handle empty string, 0, etc.
//     if (!studentId && studentId !== 0) {
//       console.log('No valid student ID found');
//       setError("No student ID provided. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     // If we don't have student data, fetch it from API
//     const url = `http://127.0.0.1:8000/api/studentexam/${studentId}/data/`;
    
//     console.log('Fetching:', url);

//     fetch(url)
//       .then(res => {
//         console.log('Response status:', res.status);
//         console.log('Response headers:', res.headers);
//         if (!res.ok) {
//           throw new Error(`Fetch failed. Status: ${res.status} - ${res.statusText}`);
//         }
//         return res.json();
//       })
//       .then(data => {
//         console.log("Student data from API:", data);
//         console.log("Available fields:", Object.keys(data));
//         setStudent(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Detailed error:", err);
//         console.error("Error message:", err.message);
//         console.error("Error stack:", err.stack);
//         setError(`Could not load student data. Error: ${err.message}`);
//         setLoading(false);
//       });
//   }, [studentId, initialStudentData]);

//    const handleStartExam = () => {
//      localStorage.setItem("studentID", student.student_id); // ✅ Save ID persistently
//      localStorage.setItem("studentData", JSON.stringify(student)); // ✅ Optional, for user info
// -    navigate('/exam-session');
// +    navigate('/exam-session');
//    };


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
//   // Use the student.photo field directly as returned from the API
//   let avatar = student.photo
//     ? student.photo
//     : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;

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

//         <div className="card shadow-lg border-0" style={{ maxWidth: 900, width: '100%', borderRadius: '20px' }}>
//           <div className="card-body p-5">
//             <div className="row align-items-center">
//               {/* Left side - Avatar */}
//               <div className="col-md-4 text-center mb-4 mb-md-0">
//                 <div className="d-flex flex-column align-items-center">
//                   <img
//                     src={avatar}
//                     alt="Student Avatar"
//                     className="rounded-circle mb-3 border border-3 border-primary"
//                     style={{ width: 200, height: 200, objectFit: 'cover' }}
//                   />
//                   <h4 className="mb-1 fw-bold">{fullName}</h4>
//                   <small className="text-muted">ID: {student.student_id}</small>
//                 </div>
//               </div>

//               {/* Vertical divider */}
//               <div className="col-md-1 d-none d-md-block">
//                 <div className="border-end h-100" style={{ minHeight: '300px' }}></div>
//               </div>

//               {/* Right side - Student Details */}
//               <div className="col-md-7">
//                 <div className="text-start">
//                   <div className="mb-3">
//                     <p className="mb-2"><strong>Email:</strong> {student.email}</p>
//                     <p className="mb-2"><strong>Phone:</strong> {student.phone_number || 'Not Provided'}</p>
//                     <p className="mb-2"><strong>Course:</strong> {student.course}</p>
//                     <p className="mb-2"><strong>Institution:</strong> {student.institution || 'Not Provided'}</p>
//                     <p className="mb-2"><strong>Gender:</strong> {student.gender || 'N/A'}</p>
//                     <p className="mb-2"><strong>Date of Birth:</strong> {student.date_of_birth || 'N/A'}</p>
//                   </div>
                  
//                   {/* Exam Info Box */}
//                   <div className="border border-info rounded p-3 mt-4" style={{ backgroundColor: '#f8f9fa', borderStyle: 'dashed !important' }}>
//                     <div className="d-flex align-items-center mb-2">
//                       <i className="fas fa-info-circle text-info me-2"></i>
//                       <span className="fw-bold text-info">Exam Information</span>
//                     </div>
//                     <p className="mb-1"><strong>Total Subjects:</strong> 1</p>
//                     <p className="mb-0"><strong>Total Questions:</strong> 2</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Start Exam Button */}
//       <div className="position-fixed bottom-0 start-0 w-100 p-4">
//         <div className="container d-flex justify-content-center">
//           <button
//             className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg"
//             style={{
//               fontSize: '1.5rem',
//               fontWeight: 'bold',
//               minWidth: '300px',
//               background: 'linear-gradient(45deg, #007bff, #0056b3)',
//               border: 'none',
//               textTransform: 'uppercase',
//               letterSpacing: '1px'
//             }}
//             onClick={handleStartExam}
//           >
//             START EXAM
//           </button>
//         </div>
//       </div>
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
  const [imageError, setImageError] = useState(false);
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
      console.log("Full student object:", initialStudentData.student);
      console.log("Available fields:", Object.keys(initialStudentData.student));
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
        console.log("Available fields:", Object.keys(data));
        console.log("Photo field:", data.photo);
        console.log("Phone field:", data.phone_number);
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
    localStorage.setItem("studentID", student.student_id); // ✅ Save ID persistently
    localStorage.setItem("studentData", JSON.stringify(student)); // ✅ Optional, for user info
    navigate('/exam-session');
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Get avatar URL with proper fallback
  const getAvatarUrl = (student) => {
    if (!student) return null;
    
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim();
    
    // If image error occurred or no photo, use fallback
    if (imageError || !student.photo) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=200&background=007bff&color=ffffff&bold=true`;
    }
    
    // Handle different photo URL formats
    let photoUrl = student.photo;
    
    // If it's a relative URL, make it absolute
    if (photoUrl && !photoUrl.startsWith('http')) {
      // Remove leading slash if present
      photoUrl = photoUrl.startsWith('/') ? photoUrl.slice(1) : photoUrl;
      photoUrl = `http://127.0.0.1:8000/${photoUrl}`;
    }
    
    return photoUrl;
  };

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Not Provided';
    
    // Remove any non-digit characters for processing
    const cleaned = phone.replace(/\D/g, '');
    
    // If it's a Nigerian number, format it nicely
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('234')) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    
    // Return original if no specific format matches
    return phone;
  };

  // Add debug info to the UI temporarily
  if (!studentId && studentId !== 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        <div className="alert alert-danger">
          <h4>Debug Info:</h4>
          <p>Location state: {JSON.stringify(location.state)}</p>
          <p>Student ID: {JSON.stringify(studentId)}</p>
          <p>Error: No student ID provided. Please log in again.</p>
          <button 
            onClick={() => navigate('/login')}
            className="btn btn-primary mt-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const fullName = `${student.first_name} ${student.last_name}`;
  const avatarUrl = getAvatarUrl(student);

  return (
    <div className="position-relative vh-100 bg-light">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      
      <div className="d-flex flex-column align-items-center justify-content-center h-100 px-3">
        <div className="mb-4 text-center">
          <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>
            Welcome, {fullName}
          </h1>
          <p className="lead mb-2">
            This is your CBT dashboard. Please verify your details below before starting the exam.
          </p>
        </div>

        <div className="card shadow-lg border-0" style={{ maxWidth: 900, width: '100%', borderRadius: '20px' }}>
          <div className="card-body p-5">
            <div className="row align-items-center">
              {/* Left side - Avatar */}
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <div className="d-flex flex-column align-items-center">
                  <div className="position-relative mb-3">
                    <img
                      src={avatarUrl}
                      alt="Student Avatar"
                      className="rounded-circle border border-3 border-primary"
                      style={{ 
                        width: 200, 
                        height: 200, 
                        objectFit: 'cover',
                        backgroundColor: '#f8f9fa'
                      }}
                      onError={handleImageError}
                      onLoad={() => setImageError(false)}
                    />
                    {/* Photo status indicator */}
                    <div className="position-absolute bottom-0 end-0">
                      <div className={`rounded-circle p-2 ${student.photo && !imageError ? 'bg-success' : 'bg-warning'}`}>
                        <i className={`fas ${student.photo && !imageError ? 'fa-camera' : 'fa-user'} text-white`} style={{ fontSize: '12px' }}></i>
                      </div>
                    </div>
                  </div>
                  <h4 className="mb-1 fw-bold">{fullName}</h4>
                  <small className="text-muted">ID: {student.student_id}</small>
                  {!student.photo && (
                    <small className="text-warning mt-1">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      No photo uploaded
                    </small>
                  )}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="col-md-1 d-none d-md-block">
                <div className="border-end h-100" style={{ minHeight: '300px' }}></div>
              </div>

              {/* Right side - Student Details */}
              <div className="col-md-7">
                <div className="text-start">
                  <div className="mb-3">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-envelope text-primary me-2"></i>
                          <strong>Email:</strong>
                          <span className="ms-2">{student.email || 'Not Provided'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-phone text-success me-2"></i>
                          <strong>Phone:</strong>
                          <span className="ms-2">{formatPhoneNumber(student.phone_number)}</span>
                          {!student.phone_number && (
                            <small className="text-warning ms-2">
                              <i className="fas fa-exclamation-triangle"></i>
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-graduation-cap text-info me-2"></i>
                          <strong>Course:</strong>
                          <span className="ms-2">{student.course || 'Not Specified'}</span>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-university text-secondary me-2"></i>
                          <strong>Institution:</strong>
                          <span className="ms-2">{student.institution || 'Not Provided'}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-venus-mars text-purple me-2"></i>
                          <strong>Gender:</strong>
                          <span className="ms-2">{student.gender || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-calendar text-warning me-2"></i>
                          <strong>DOB:</strong>
                          <span className="ms-2">{student.date_of_birth || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Exam Info Box */}
                  <div className="border border-info rounded p-3 mt-4" style={{ backgroundColor: '#f8f9fa', borderStyle: 'dashed !important' }}>
                    <div className="d-flex align-items-center mb-2">
                      <i className="fas fa-info-circle text-info me-2"></i>
                      <span className="fw-bold text-info">Exam Information</span>
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <p className="mb-1"><strong>Total Subjects:</strong> 4</p>
                      </div>
                      <div className="col-6">
                        <p className="mb-1"><strong>Duration:</strong> 2 Hours</p>
                      </div>
                      <div className="col-6">
                        <p className="mb-0"><strong>Questions per Subject:</strong> 40</p>
                      </div>
                      <div className="col-6">
                        <p className="mb-0"><strong>Total Questions:</strong> 160</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Data Completeness Indicator */}
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">Profile Completeness</small>
                      <small className="text-muted">
                        {Math.round(((student.email ? 1 : 0) + 
                                   (student.phone_number ? 1 : 0) + 
                                   (student.photo ? 1 : 0) + 
                                   (student.course ? 1 : 0) + 
                                   (student.institution ? 1 : 0)) / 5 * 100)}%
                      </small>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ 
                          width: `${((student.email ? 1 : 0) + 
                                   (student.phone_number ? 1 : 0) + 
                                   (student.photo ? 1 : 0) + 
                                   (student.course ? 1 : 0) + 
                                   (student.institution ? 1 : 0)) / 5 * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Exam Button */}
      <div className="position-fixed bottom-0 start-0 w-100 p-4">
        <div className="container d-flex justify-content-center">
          <button
            className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg"
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              minWidth: '300px',
              background: 'linear-gradient(45deg, #007bff, #0056b3)',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onClick={handleStartExam}
          >
            <i className="fas fa-play me-2"></i>
            START EXAM
          </button>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        .text-purple {
          color: #6f42c1 !important;
        }
        
        .progress {
          border-radius: 10px;
        }
        
        .progress-bar {
          border-radius: 10px;
          transition: width 0.6s ease;
        }
        
        .card {
          transition: transform 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3) !important;
        }
        
        @media (max-width: 768px) {
          .col-md-4, .col-md-7 {
            text-align: center !important;
          }
          
          .border-end {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;