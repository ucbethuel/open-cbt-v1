// import React, { useState, useEffect } from 'react';

// const LiveMonitoring = () => {
//   const [examStatus, setExamStatus] = useState('not-started');
//   const [examStartTime, setExamStartTime] = useState(null);
//   const [timer, setTimer] = useState('00:00:00');
//   const [candidates, setCandidates] = useState([
//     {
//       id: 'STU001',
//       name: 'John Doe',
//       status: 'not-started',
//       startTime: null
//     },
//     {
//       id: 'STU002',
//       name: 'Jane Smith',
//       status: 'not-started',
//       startTime: null
//     }
//   ]);

//   // Timer countdown
//   useEffect(() => {
//     if (examStatus !== 'active' || !examStartTime) return;

//     const interval = setInterval(() => {
//       const now = Date.now();
//       const elapsed = Math.floor((now - new Date(examStartTime)) / 1000);
//       const hrs = String(Math.floor(elapsed / 3600)).padStart(2, '0');
//       const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
//       const secs = String(elapsed % 60).padStart(2, '0');
//       setTimer(`${hrs}:${mins}:${secs}`);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [examStatus, examStartTime]);

//   // Start Exam
// //   const handleStartExam = () => {
// //     const startTime = new Date().toISOString();
// //     setExamStatus('active');
// //     setExamStartTime(startTime);

// //     const updated = candidates.map(c =>
// //       c.status === 'not-started'
// //         ? { ...c, status: 'started', startTime }
// //         : c
// //     );
// //     setCandidates(updated);
// //   };
//     const handleStartExam = () => {
//     setConfirmAction({
//       type: 'start',
//       title: 'Start Exam',
//       message: 'Are you sure you want to start the exam? This will allow all registered candidates to begin.',
//       action: () => {
//         setExamStatus('active');
//         setExamStartTime(new Date().toISOString());
//         // Update all candidates to 'started' status if they were 'not-started'
//         setCandidates(prev => prev.map(candidate => ({
//           ...candidate,
//           status: candidate.status === 'not-started' ? 'started' : candidate.status,
//           startTime: candidate.status === 'not-started' ? new Date().toISOString() : candidate.startTime
//         })));
//         setSuccess('Exam started successfully! All candidates can now begin.');
//         setTimeout(() => setSuccess(null), 5000);
//       }
//     });
//     setShowConfirmModal(true);
//   };

//   const handleEndExam = () => {
//     setConfirmAction({
//       type: 'end',
//       title: 'End Exam',
//       message: 'Are you sure you want to end the exam? This will immediately stop all ongoing exams and mark them as completed.',
//       action: () => {
//         setExamStatus('ended');
//         setExamEndTime(new Date().toISOString());
//         // Update all ongoing candidates to 'completed' status
//         setCandidates(prev => prev.map(candidate => ({
//           ...candidate,
//           status: candidate.status === 'ongoing' || candidate.status === 'started' ? 'completed' : candidate.status,
//           endTime: candidate.status === 'ongoing' || candidate.status === 'started' ? new Date().toISOString() : candidate.endTime,
//           timeUsed: candidate.status === 'ongoing' ? candidate.totalTime - candidate.timeRemaining : candidate.timeUsed
//         })));
//         setSuccess('Exam ended successfully! All ongoing exams have been completed.');
//         setTimeout(() => setSuccess(null), 5000);
//       }
//     });
//     setShowConfirmModal(true);
//   };

//   const handleForceEndCandidate = (id) => {
//     setConfirmAction({
//       type: 'force-end',
//       title: 'Force End Candidate',
//       message: 'Are you sure you want to force end this candidate\'s exam?',
//       action: () => {
//         setCandidates(prev => prev.map(candidate => 
//           candidate.id === candidateId 
//             ? {
//                 ...candidate,
//                 status: 'completed',
//                 endTime: new Date().toISOString(),
//                 timeUsed: candidate.totalTime - candidate.timeRemaining
//               }
//             : candidate
//         ));
//         setSuccess('Candidate exam ended successfully.');
//         setTimeout(() => setSuccess(null), 3000);
//       }
//     });
//     setShowConfirmModal(true);
//   };

//   const confirmModalAction = () => {
//     if (confirmAction && confirmAction.action) {
//       confirmAction.action();
//     }
//     setShowConfirmModal(false);
//     setConfirmAction(null);
//   };


//   // End Exam
// //   const handleEndExam = () => {
// //     setExamStatus('ended');

//     const updated = candidates.map(c =>
//       c.status === 'started'
//         ? { ...c, status: 'completed' }
//         : c
//     );
//     setCandidates(updated);
//   };

//   const startedCount = candidates.filter(
//     c => c.status === 'started' || c.status === 'completed'
//   ).length;

//   return (
//     <div className="container my-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h5>
//             Exam Status:
//             <span className={`badge ms-2 ${
//               examStatus === 'active' ? 'bg-success'
//               : examStatus === 'ended' ? 'bg-secondary'
//               : 'bg-warning'
//             }`}>
//               {examStatus.toUpperCase()}
//             </span>
//           </h5>
//           {examStatus === 'active' && (
//             <p className="mb-0">Timer: <strong>{timer}</strong></p>
//           )}
//         </div>

//         <div className="text-end">
//           <p className="mb-1">Students Started: <strong>{startedCount}</strong></p>
//           {examStatus === 'not-started' && (
//             <button className="btn btn-success" onClick={handleStartExam}>
//               Start Exam
//             </button>
//           )}
//           {examStatus === 'active' && (
//             <button className="btn btn-danger" onClick={handleEndExam}>
//               End Exam
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header">Live Candidates</div>
//         <div className="table-responsive">
//           <table className="table mb-0">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Status</th>
//                 <th>Start Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {candidates.map((c, i) => (
//                 <tr key={i}>
//                   <td>{c.id}</td>
//                   <td>{c.name}</td>
//                   <td>
//                     <span className={`badge ${
//                       c.status === 'started' ? 'bg-info' :
//                       c.status === 'completed' ? 'bg-success' : 'bg-secondary'
//                     }`}>
//                       {c.status}
//                     </span>
//                   </td>
//                   <td>{c.startTime ? new Date(c.startTime).toLocaleTimeString() : '---'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveMonitoring;
import React, { useState, useEffect } from 'react';

const LiveMonitoring = () => {
  const [examStatus, setExamStatus] = useState('not-started');
  const [examStartTime, setExamStartTime] = useState(null);
  const [examEndTime, setExamEndTime] = useState(null);
  const [timer, setTimer] = useState('00:00:00');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [success, setSuccess] = useState(null);
  const [candidates, setCandidates] = useState([
    {
      id: 'STU001',
      name: 'John Doe',
      status: 'not-started',
      startTime: null,
      endTime: null,
      totalTime: 7200, // 2 hours in seconds
      timeRemaining: 7200,
      timeUsed: 0
    },
    {
      id: 'STU002',
      name: 'Jane Smith',
      status: 'not-started',
      startTime: null,
      endTime: null,
      totalTime: 7200,
      timeRemaining: 7200,
      timeUsed: 0
    }
  ]);

  // Timer countdown
  useEffect(() => {
    if (examStatus !== 'active' || !examStartTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - new Date(examStartTime)) / 1000);
      const hrs = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      setTimer(`${hrs}:${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [examStatus, examStartTime]);

  // Start Exam
  const handleStartExam = () => {
    setConfirmAction({
      type: 'start',
      title: 'Start Exam',
      message: 'Are you sure you want to start the exam? This will allow all registered candidates to begin.',
      action: () => {
        const startTime = new Date().toISOString();
        setExamStatus('active');
        setExamStartTime(startTime);
        // Update all candidates to 'started' status if they were 'not-started'
        setCandidates(prev => prev.map(candidate => ({
          ...candidate,
          status: candidate.status === 'not-started' ? 'started' : candidate.status,
          startTime: candidate.status === 'not-started' ? startTime : candidate.startTime
        })));
        setSuccess('Exam started successfully! All candidates can now begin.');
        setTimeout(() => setSuccess(null), 5000);
      }
    });
    setShowConfirmModal(true);
  };

  // End Exam
  const handleEndExam = () => {
    setConfirmAction({
      type: 'end',
      title: 'End Exam',
      message: 'Are you sure you want to end the exam? This will immediately stop all ongoing exams and mark them as completed.',
      action: () => {
        const endTime = new Date().toISOString();
        setExamStatus('ended');
        setExamEndTime(endTime);
        // Update all ongoing candidates to 'completed' status
        setCandidates(prev => prev.map(candidate => ({
          ...candidate,
          status: candidate.status === 'ongoing' || candidate.status === 'started' ? 'completed' : candidate.status,
          endTime: candidate.status === 'ongoing' || candidate.status === 'started' ? endTime : candidate.endTime,
          timeUsed: candidate.status === 'ongoing' ? candidate.totalTime - candidate.timeRemaining : candidate.timeUsed
        })));
        setSuccess('Exam ended successfully! All ongoing exams have been completed.');
        setTimeout(() => setSuccess(null), 5000);
      }
    });
    setShowConfirmModal(true);
  };

  // Force end individual candidate
  const handleForceEndCandidate = (candidateId) => {
    setConfirmAction({
      type: 'force-end',
      title: 'Force End Candidate',
      message: 'Are you sure you want to force end this candidate\'s exam?',
      action: () => {
        setCandidates(prev => prev.map(candidate => 
          candidate.id === candidateId 
            ? {
                ...candidate,
                status: 'completed',
                endTime: new Date().toISOString(),
                timeUsed: candidate.totalTime - candidate.timeRemaining
              }
            : candidate
        ));
        setSuccess('Candidate exam ended successfully.');
        setTimeout(() => setSuccess(null), 3000);
      }
    });
    setShowConfirmModal(true);
  };

  // Confirm modal action
  const confirmModalAction = () => {
    if (confirmAction && confirmAction.action) {
      confirmAction.action();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // Cancel modal action
  const cancelModalAction = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const startedCount = candidates.filter(
    c => c.status === 'started' || c.status === 'completed'
  ).length;

  return (
    <div className="container my-4">
      {/* Success Message */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close"
            onClick={() => setSuccess(null)}
          ></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5>
            Exam Status:
            <span className={`badge ms-2 ${
              examStatus === 'active' ? 'bg-success'
              : examStatus === 'ended' ? 'bg-secondary'
              : 'bg-warning'
            }`}>
              {examStatus.toUpperCase()}
            </span>
          </h5>
          {examStatus === 'active' && (
            <p className="mb-0">Timer: <strong>{timer}</strong></p>
          )}
        </div>

        <div className="text-end">
          <p className="mb-1">Students Started: <strong>{startedCount}</strong></p>
          {examStatus === 'not-started' && (
            <button className="btn btn-success" onClick={handleStartExam}>
              Start Exam
            </button>
          )}
          {examStatus === 'active' && (
            <button className="btn btn-danger" onClick={handleEndExam}>
              End Exam
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">Live Candidates</div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, i) => (
                <tr key={i}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>
                    <span className={`badge ${
                      c.status === 'started' ? 'bg-info' :
                      c.status === 'completed' ? 'bg-success' : 'bg-secondary'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td>{c.startTime ? new Date(c.startTime).toLocaleTimeString() : '---'}</td>
                  <td>
                    {c.status === 'started' && (
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => handleForceEndCandidate(c.id)}
                      >
                        Force End
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{confirmAction.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={cancelModalAction}
                ></button>
              </div>
              <div className="modal-body">
                <p>{confirmAction.message}</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={cancelModalAction}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={confirmModalAction}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMonitoring;