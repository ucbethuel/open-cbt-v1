import React, { useState, useRef } from 'react';

const StudentImport = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef();

  const SUPPORTED_FILE_TYPES = ['.xlsx', '.csv', '.json'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const downloadTemplate = () => {
    const template = [
      {
        studentId: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@school.com',
        phone: '08012345678',
        class: 'SS3',
        dateOfBirth: '2005-01-15',
        gender: 'male'
      },
      {
        studentId: 'STU002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@school.com',
        phone: '08087654321',
        class: 'SS2',
        dateOfBirth: '2006-03-20',
        gender: 'female'
      }
    ];

    const csvContent = [
      'studentId,firstName,lastName,email,phone,class,dateOfBirth,gender',
      ...template.map(row => 
        `"${row.studentId}","${row.firstName}","${row.lastName}","${row.email}","${row.phone}","${row.class}","${row.dateOfBirth}","${row.gender}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!SUPPORTED_FILE_TYPES.includes(fileExtension)) {
      setError(`Unsupported file type. Please upload ${SUPPORTED_FILE_TYPES.join(', ')} files only.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    setUploadFile(file);
    processFile(file);
  };

  const processFile = (file) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let data = [];
        const content = e.target.result;

        if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          data = parseCSV(content);
        }

        validateAndPreviewData(data);
      } catch (error) {
        setError('Error reading file: ' + error.message);
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const parseCSV = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const row = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      row._rowIndex = index + 2;
      return row;
    });
  };

  const validateAndPreviewData = (data) => {
    const errors = [];
    const validStudents = [];

    data.forEach((row, index) => {
      const rowErrors = [];

      if (!row.studentId) rowErrors.push('Student ID is required');
      if (!row.firstName) rowErrors.push('First name is required');
      if (!row.lastName) rowErrors.push('Last name is required');
      if (!row.email) rowErrors.push('Email is required');
      if (!row.class) rowErrors.push('Class is required');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (row.email && !emailRegex.test(row.email)) {
        rowErrors.push('Invalid email format');
      }

      if (row.gender && !['male', 'female', 'other'].includes(row.gender.toLowerCase())) {
        rowErrors.push('Gender must be male, female, or other');
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: row._rowIndex || index + 1,
          errors: rowErrors,
          data: row
        });
      } else {
        validStudents.push(row);
      }
    });

    setPreviewData(validStudents);
    setImportErrors(errors);
    setShowPreview(true);
    setLoading(false);
  };

  const handleImportStudents = () => {
  // Get existing students if any
  const existing = JSON.parse(localStorage.getItem('students')) || [];

  // Merge with new imported students
  const updatedStudents = [...existing, ...previewData];

  // Save back to localStorage
  localStorage.setItem('students', JSON.stringify(updatedStudents));

  setSuccess(`${previewData.length} students imported successfully!`);
  setShowPreview(false);
  setUploadFile(null);
  setPreviewData([]);
  setImportErrors([]);
  if (fileInputRef.current) fileInputRef.current.value = '';
  setTimeout(() => setSuccess(null), 5000);
};


  return (
    <div className="container py-5">
      <div className="card">
        <div className="card-header">
          <h4>Import Students</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="mb-3">
            <button className="btn btn-success me-3" onClick={downloadTemplate}>
              <i className="fas fa-download me-2"></i>Download Template
            </button>

            <label className="btn btn-primary">
              <i className="fas fa-upload me-2"></i>{loading ? 'Processing...' : 'Choose File'}
              <input
                type="file"
                className="d-none"
                ref={fileInputRef}
                accept=".csv,.json,.xlsx"
                onChange={handleFileUpload}
                disabled={loading}
              />
            </label>
          </div>

          {uploadFile && (
            <div className="alert alert-secondary">
              <strong>Selected:</strong> {uploadFile.name} ({(uploadFile.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Import Preview</h5>
                <button type="button" className="btn-close" onClick={() => setShowPreview(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row text-center mb-4">
                  <div className="col">
                    <div className="alert alert-success">{previewData.length} Valid Students</div>
                  </div>
                  <div className="col">
                    <div className="alert alert-danger">{importErrors.length} Errors Found</div>
                  </div>
                  <div className="col">
                    <div className="alert alert-info">{previewData.length + importErrors.length} Total Rows</div>
                  </div>
                </div>

                {previewData.length > 0 && (
                  <>
                    <h6>Valid Students</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Class</th>
                            <th>Phone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((student, i) => (
                            <tr key={i}>
                              <td>{student.studentId}</td>
                              <td>{student.firstName} {student.lastName}</td>
                              <td>{student.email}</td>
                              <td>{student.class}</td>
                              <td>{student.phone || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {importErrors.length > 0 && (
                  <>
                    <h6 className="mt-4">Errors</h6>
                    {importErrors.map((err, i) => (
                      <div key={i} className="alert alert-danger">
                        <strong>Row {err.row}:</strong>
                        <ul className="mb-0">
                          {err.errors.map((e, ei) => (
                            <li key={ei}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPreview(false)}>Cancel</button>
                {previewData.length > 0 && (
                  <button className="btn btn-success" onClick={handleImportStudents}>
                    Import {previewData.length} Students
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentImport;
