// import React from 'react';

// const StudentReport = ({ student }) => {
//   if (!student) return <div className="text-center my-5">No report available.</div>;

//   const { fullName, className, scores, total, percentage, status } = student;

//   return (
//     <div className="container my-4">
//       <h3 className="mb-4">Student Report</h3>

//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="card-title">{fullName}</h5>
//           <p className="card-text">Class: {className}</p>
//           <p className="card-text">Total Score: <strong>{total}</strong></p>
//           <p className="card-text">Percentage: <strong>{percentage}%</strong></p>
//           <p className="card-text">Status: <span className={`badge ${status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>{status}</span></p>
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-bordered">
//           <thead className="table-light">
//             <tr>
//               <th>Subject</th>
//               <th>Score</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {scores.map((item, idx) => (
//               <tr key={idx}>
//                 <td>{item.subject}</td>
//                 <td>{item.score}</td>
//                 <td>{item.max}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StudentReport;


import React from 'react';

const StudentReport = ({ student }) => {
  if (!student) return <div className="text-center my-5">No report available.</div>;

  const { fullName, className, scores, total, percentage, status } = student;

  const handleExport = () => {
    const headers = ['Subject', 'Score', 'Total'];
    const rows = scores.map(item => [item.subject, item.score, item.max]);
    const csv = [
      ['Full Name', fullName],
      ['Class', className],
      ['Total', total],
      ['Percentage', percentage + '%'],
      ['Status', status],
      [],
      headers,
      ...rows
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fullName.replace(/\s+/g, '_')}_report.csv`;
    link.click();
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Student Report</h3>
        <button className="btn btn-success" onClick={handleExport}>
          <i className="fas fa-file-csv me-2"></i>Export CSV
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{fullName}</h5>
          <p className="card-text">Class: {className}</p>
          <p className="card-text">Total Score: <strong>{total}</strong></p>
          <p className="card-text">Percentage: <strong>{percentage}%</strong></p>
          <p className="card-text">Status: <span className={`badge ${status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>{status}</span></p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Subject</th>
              <th>Score</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((item, idx) => (
              <tr key={idx}>
                <td>{item.subject}</td>
                <td>{item.score}</td>
                <td>{item.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentReport;
