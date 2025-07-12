
import React, { useState, useEffect, useRef } from 'react';
// import StudentImport from './Student/StudentImport';
import StudentRegister from '../Student/StudentRegister';
import StudentReport from '../Student/StudentReport';
import StudentImport from '../Student/StudentImport';
import LiveMonitoring from './LiveMonitoring'
import StudentReportPage from '../Student/Mockdata';  

const CctAdminDashboard = () => {
  // Configuration
  const CONFIG = {
    API_BASE_URL: 'https://api.example.com',
    SUBJECTS: [
      { id: 'math', name: 'Mathematics', code: 'MTH' },
      { id: 'english', name: 'English Language', code: 'ENG' },
      { id: 'physics', name: 'Physics', code: 'PHY' },
      { id: 'chemistry', name: 'Chemistry', code: 'CHM' }
    ],
    SUPPORTED_FILE_TYPES: ['.xlsx', '.csv', '.json'],
    MAX_FILE_SIZE: 5 * 1024 * 1024 // 5MB
  };

  // States
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [examStatus, setExamStatus] = useState('not-started'); // not-started, active, ended
  const [examStartTime, setExamStartTime] = useState(null);
  const [examEndTime, setExamEndTime] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Question Management States
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // Import States
  const [uploadFile, setUploadFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Form States
  const [questionForm, setQuestionForm] = useState({
    subject: '',
    text: '',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' }
    ],
    correctAnswer: ''
  });

  const fileInputRef = useRef();

  // Mock Data - Initialize candidates
  const mockCandidates = [
    {
      id: 'STU001',
      name: 'John Doe',
      email: 'john@example.com',
      status: examStatus === 'not-started' ? 'not-started' : 'ongoing',
      startTime: examStatus !== 'not-started' ? new Date(Date.now() - 3600000).toISOString() : null,
      timeRemaining: 5400,
      totalTime: 7200,
      progress: {
        answered: 15,
        flagged: 3,
        total: 40
      },
      currentSubject: 'Mathematics'
    },
    {
      id: 'STU002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'completed',
      startTime: new Date(Date.now() - 7200000).toISOString(),
      endTime: new Date(Date.now() - 1800000).toISOString(),
      timeUsed: 5400,
      totalTime: 7200,
      progress: {
        answered: 38,
        flagged: 0,
        total: 40
      },
      score: 85
    },
    {
      id: 'STU003',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: examStatus === 'not-started' ? 'not-started' : 'started',
      startTime: examStatus !== 'not-started' ? new Date().toISOString() : null,
      timeRemaining: 7200,
      totalTime: 7200,
      progress: {
        answered: 0,
        flagged: 0,
        total: 40
      },
      currentSubject: 'English Language'
    }
  ];

  // Initialize candidates on component mount
  useEffect(() => {
    setCandidates(mockCandidates);
  }, []);

  const handleStartExam = () => {
    setConfirmAction({
      type: 'start',
      title: 'Start Exam',
      message: 'Are you sure you want to start the exam? This will allow all registered candidates to begin.',
      action: () => {
        setExamStatus('active');
        setExamStartTime(new Date().toISOString());
        // Update all candidates to 'started' status if they were 'not-started'
        setCandidates(prev => prev.map(candidate => ({
          ...candidate,
          status: candidate.status === 'not-started' ? 'started' : candidate.status,
          startTime: candidate.status === 'not-started' ? new Date().toISOString() : candidate.startTime
        })));
        setSuccess('Exam started successfully! All candidates can now begin.');
        setTimeout(() => setSuccess(null), 5000);
      }
    });
    setShowConfirmModal(true);
  };

  const handleEndExam = () => {
    setConfirmAction({
      type: 'end',
      title: 'End Exam',
      message: 'Are you sure you want to end the exam? This will immediately stop all ongoing exams and mark them as completed.',
      action: () => {
        setExamStatus('ended');
        setExamEndTime(new Date().toISOString());
        // Update all ongoing candidates to 'completed' status
        setCandidates(prev => prev.map(candidate => ({
          ...candidate,
          status: candidate.status === 'ongoing' || candidate.status === 'started' ? 'completed' : candidate.status,
          endTime: candidate.status === 'ongoing' || candidate.status === 'started' ? new Date().toISOString() : candidate.endTime,
          timeUsed: candidate.status === 'ongoing' ? candidate.totalTime - candidate.timeRemaining : candidate.timeUsed
        })));
        setSuccess('Exam ended successfully! All ongoing exams have been completed.');
        setTimeout(() => setSuccess(null), 5000);
      }
    });
    setShowConfirmModal(true);
  };

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

  const confirmModalAction = () => {
    if (confirmAction && confirmAction.action) {
      confirmAction.action();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // Question Management Functions
  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      subject: '',
      text: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' }
      ],
      correctAnswer: ''
    });
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionForm({
      subject: question.subject,
      text: question.text,
      options: [...question.options],
      correctAnswer: question.correctAnswer
    });
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      setSuccess('Question deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleSaveQuestion = () => {
    // Validation
    if (!questionForm.subject || !questionForm.text || !questionForm.correctAnswer) {
      setError('Please fill in all required fields');
      return;
    }

    if (questionForm.options.some(opt => !opt.text.trim())) {
      setError('Please fill in all option texts');
      return;
    }

    if (editingQuestion) {
      // Update existing question
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...questionForm, updatedAt: new Date().toISOString() }
          : q
      ));
      setSuccess('Question updated successfully');
    } else {
      // Add new question
      const newQuestion = {
        id: Date.now(),
        ...questionForm,
        createdAt: new Date().toISOString()
      };
      setQuestions(prev => [...prev, newQuestion]);
      setSuccess('Question added successfully');
    }

    setShowQuestionModal(false);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  // File Import Functions
  const downloadTemplate = () => {
    const template = [
      {
        subject: 'math',
        question: 'What is 2 + 2?',
        optionA: '3',
        optionB: '4',
        optionC: '5',
        optionD: '6',
        correctAnswer: 'B'
      },
      {
        subject: 'english',
        question: 'Choose the correct verb: She ___ every day.',
        optionA: 'run',
        optionB: 'runs',
        optionC: 'running',
        optionD: 'ran',
        correctAnswer: 'B'
      }
    ];

    const csvContent = [
      'subject,question,optionA,optionB,optionC,optionD,correctAnswer',
      ...template.map(row => 
        `"${row.subject}","${row.question}","${row.optionA}","${row.optionB}","${row.optionC}","${row.optionD}","${row.correctAnswer}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!CONFIG.SUPPORTED_FILE_TYPES.includes(fileExtension)) {
      setError(`Unsupported file type. Please upload ${CONFIG.SUPPORTED_FILE_TYPES.join(', ')} files only.`);
      return;
    }

    // Validate file size
    if (file.size > CONFIG.MAX_FILE_SIZE) {
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

    if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
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
      row._rowIndex = index + 2; // +2 because we start from row 2 in CSV
      return row;
    });
  };

  const validateAndPreviewData = (data) => {
    const errors = [];
    const validQuestions = [];

    data.forEach((row, index) => {
      const rowErrors = [];
      
      // Check required fields
      if (!row.subject) rowErrors.push('Subject is required');
      if (!row.question) rowErrors.push('Question text is required');
      if (!row.optionA) rowErrors.push('Option A is required');
      if (!row.optionB) rowErrors.push('Option B is required');
      if (!row.optionC) rowErrors.push('Option C is required');
      if (!row.optionD) rowErrors.push('Option D is required');
      if (!row.correctAnswer) rowErrors.push('Correct answer is required');

      // Validate subject
      if (row.subject && !CONFIG.SUBJECTS.find(s => s.id === row.subject)) {
        rowErrors.push(`Invalid subject. Must be one of: ${CONFIG.SUBJECTS.map(s => s.id).join(', ')}`);
      }

      // Validate correct answer
      if (row.correctAnswer && !['A', 'B', 'C', 'D'].includes(row.correctAnswer.toUpperCase())) {
        rowErrors.push('Correct answer must be A, B, C, or D');
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: row._rowIndex || index + 1,
          errors: rowErrors,
          data: row
        });
      } else {
        validQuestions.push({
          subject: row.subject,
          text: row.question,
          options: [
            { id: 'A', text: row.optionA },
            { id: 'B', text: row.optionB },
            { id: 'C', text: row.optionC },
            { id: 'D', text: row.optionD }
          ],
          correctAnswer: row.correctAnswer.toUpperCase()
        });
      }
    });

    setPreviewData(validQuestions);
    setImportErrors(errors);
    setShowPreviewModal(true);
    setLoading(false);
  };

  const handleImportQuestions = () => {
    const newQuestions = previewData.map(q => ({
      ...q,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    }));

    setQuestions(prev => [...prev, ...newQuestions]);
    setSuccess(`${newQuestions.length} questions imported successfully!`);
    setShowPreviewModal(false);
    setUploadFile(null);
    setPreviewData([]);
    setImportErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setSuccess(null), 5000);
  };

  // Utility Functions
  const getSubjectName = (subjectId) => {
    const subject = CONFIG.SUBJECTS.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'not-started': { class: 'bg-secondary', icon: 'fa-pause-circle', text: 'Not Started' },
      ongoing: { class: 'bg-warning text-dark', icon: 'fa-clock', text: 'Ongoing' },
      completed: { class: 'bg-success', icon: 'fa-check-circle', text: 'Completed' },
      started: { class: 'bg-info', icon: 'fa-play-circle', text: 'Started' }
    };
    const config = statusConfig[status] || statusConfig.started;
    return (
      <span className={`badge ${config.class}`}>
        <i className={`fas ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const bootstrapStyle = `
    .admin-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .sidebar {
      background: linear-gradient(135deg,rgb(7, 7, 7) 0%,rgb(11, 1, 22) 100%);
      min-height: 100vh;
    }
    
    .nav-link {
      color: rgba(255, 255, 255, 0.8);
      border-radius: 0.375rem;
      margin-bottom: 0.25rem;
      transition: all 0.3s ease;
    }
    
    .nav-link:hover, .nav-link.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      transition: box-shadow 0.15s ease-in-out;
    }
    
    .card:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .table th {
      border-bottom: 2px solid #dee2e6;
      font-weight: 600;
    }
    
    .btn-group-sm > .btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    
    .progress {
      height: 0.5rem;
    }
    
    .modal-lg {
      max-width: 900px;
    }
    
    .file-upload-area {
      border: 2px dashed #dee2e6;
      border-radius: 0.375rem;
      padding: 2rem;
      text-align: center;
      transition: border-color 0.15s ease-in-out;
    }
    
    .file-upload-area:hover {
      border-color: #0d6efd;
    }
    
    .file-upload-area.dragover {
      border-color: #0d6efd;
      background-color: rgba(13, 110, 253, 0.1);
    }
    
    .error-row {
      background-color: #f8d7da;
    }
    
    .success-row {
      background-color: #d1e7dd;
    }
  `;

  return (
    <>
      {/* Fixed conditional rendering */}
      {/* {activeTab === 'student-import' && (
        // <div><StudentImport /></div>
      )} */}
      
     
      
      <style>{bootstrapStyle}</style>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />

      <div className="admin-container">
        <div className="row g-0">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2">
            <div className="sidebar p-3">
              <div className="text-center mb-4">
                <h4 className="text-white mb-0">CCT Admin</h4>
                <small className="text-white-50">Dashboard</small>
              </div>

              <nav className="nav flex-column">
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === 'questions' ? 'active' : ''}`}
                >
                  <i className="fas fa-question-circle me-2"></i>
                  Question Bank
                </button>

                <button
                  onClick={() => setActiveTab('candidates')}
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === 'candidates' ? 'active' : ''}`}
                >
                  <i className="fas fa-users me-2"></i>
                  Live Monitoring
                </button>

                <button
                  onClick={() => setActiveTab('import')}
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === 'import' ? 'active' : ''}`}
                >
                  <i className="fas fa-file-import me-2"></i>
                  Import Questions
                </button>

                <hr className="border-light" />

                <button
                  onClick={() => setActiveTab('student-import')}
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === 'student-import' ? 'active' : ''}`}
                >
                  <i className="fas fa-user-upload me-2"></i>
                  Import Students
                </button>

                <button
                  onClick={() => setActiveTab('studentregister')}
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === 'studentregister' ? 'active' : ''}`}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Register Student
                </button>

                <button
                  onClick={() => setActiveTab('student-report')}
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === 'student-report' ? 'active' : ''}`}
                >
                  <i className="fas fa-file-alt me-2"></i>
                  Student Report
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10">
            <div className="p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="mb-1">
                    {activeTab === 'questions' && 'Question Management'}
                    {activeTab === 'candidates' && 
                      < LiveMonitoring />
                    }
                    {activeTab === 'import' && 'Import Questions'}
                    {activeTab === 'student-import' && < StudentImport />}
                    {/* Register Student  */}
                    {activeTab === 'studentregister' && <StudentRegister />}
                    {/* Student Report  */}
                     {activeTab === 'student-report' && (
                        <StudentReport
                          student={{
                            fullName: 'Jane Doe',
                            className: 'SS3',
                            scores: [
                              { subject: 'Mathematics', score: 85, max: 100 },
                              { subject: 'English', score: 78, max: 100 },
                              { subject: 'Physics', score: 90, max: 100 },
                              { subject: 'Chemistry', score: 88, max: 100 }
                            ],
                            total: 341,
                            percentage: 85.25,
                            status: 'Pass'
                          }}
                        />
                     )}
                  </h2>
                  <p className="text-muted mb-0">
                    {activeTab === 'questions' && 'Manage exam questions by subject'}
                    {activeTab === 'candidates' && 'Monitor candidate progress in real-time'}
                    {/* Import Question */}
                    {activeTab === 'import' && (
                      <div>
                        <div className="card">
                          <div className="card-body">
                            <div className="mb-3">
                              <button className="btn btn-outline-primary" onClick={downloadTemplate}>
                                <i className="fas fa-download me-2"></i>
                                Download Template
                              </button>
                            </div>
                            <div className="file-upload-area" onClick={() => fileInputRef.current.click()}>
                              <p className="mb-2">Click or drag a file to upload</p>
                              <p className="text-muted small">Supported formats: {CONFIG.SUPPORTED_FILE_TYPES.join(', ')}</p>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                hidden
                                accept={CONFIG.SUPPORTED_FILE_TYPES.join(',')}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Preview Modal */}
                        {showPreviewModal && (
                          <div className="modal show d-block" tabIndex="-1">
                            <div className="modal-dialog modal-lg">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">Preview Import</h5>
                                  <button type="button" className="btn-close" onClick={() => setShowPreviewModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                  {importErrors.length > 0 && (
                                    <div className="alert alert-danger">
                                      <strong>{importErrors.length}</strong> rows with errors. Please fix them and re-upload.
                                    </div>
                                  )}
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          <th>Subject</th>
                                          <th>Question</th>
                                          <th>Correct</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {previewData.map((q, i) => (
                                          <tr key={i} className="success-row">
                                            <td>{i + 1}</td>
                                            <td>{getSubjectName(q.subject)}</td>
                                            <td>{q.text}</td>
                                            <td>{q.correctAnswer}</td>
                                            <td><span className="badge bg-success">Valid</span></td>
                                          </tr>
                                        ))}
                                        {importErrors.map((e, i) => (
                                          <tr key={`err-${i}`} className="error-row">
                                            <td>{e.row}</td>
                                            <td colSpan="3">{e.data.question}</td>
                                            <td>
                                              <span className="badge bg-danger">{e.errors.join(', ')}</span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button className="btn btn-secondary" onClick={() => setShowPreviewModal(false)}>Cancel</button>
                                  {previewData.length > 0 && (
                                    <button className="btn btn-primary" onClick={handleImportQuestions}>Import {previewData.length} Questions</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      )}

                    {activeTab === 'student-import' && 'Bulk import students from files'}
                    {activeTab === 'studentregister' && 'Register individual students'}
                    {activeTab === 'student-report' && 'View student performance reports'}
                  </p>
                </div>
                
                {/* Control buttons for exam management */}
                {activeTab === 'candidates' && (
                  <div className="btn-group">
                    {examStatus === 'not-started' && (
                      <button onClick={handleStartExam} className="btn btn-success">
                        <i className="fas fa-play me-2"></i>Start Exam
                      </button>
                    )}
                    {examStatus === 'active' && (
                      <button onClick={handleEndExam} className="btn btn-danger">
                        <i className="fas fa-stop me-2"></i>End Exam
                      </button>
                    )}
                    {examStatus === 'ended' && (
                      <span className="badge bg-secondary fs-6">Exam Ended</span>
                    )}
                  </div>
                )}
              </div>

              {/* Alerts */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}

              {success && (
                <div className="alert alert-success alert-dismissible fade show">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setSuccess(null)}
                  ></button>
                </div>
              )}

              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <div>
                  {/* Controls */}
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <select
                        className="form-select"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        <option value="all">All Subjects</option>
                        {CONFIG.SUBJECTS.map(subject => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-5">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search questions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button
                        onClick={handleAddQuestion}
                        className="btn btn-primary w-100"
                      >
                        <i className="fas fa-plus me-2"></i>Add Question
                      </button>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <div className="card bg-primary text-white">
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h3 className="mb-0">{questions.length}</h3>
                              <p className="mb-0 small">Total Questions</p>
                            </div>
                            <i className="fas fa-question-circle fa-2x opacity-50"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    {CONFIG.SUBJECTS.map(subject => (
                      <div key={subject.id} className="col-md-2">
                        <div className="card bg-light">
                          <div className="card-body p-3">
                            <h4 className="mb-0">{questions.filter(q => q.subject === subject.id).length}</h4>
                            <small className="text-muted">{subject.code}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Questions Table */}
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Subject</th>
                              <th>Question</th>
                              <th>Correct Answer</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredQuestions.map(question => (
                              <tr key={question.id}>
                                                                <td>{question.id}</td>
                                <td>{getSubjectName(question.subject)}</td>
                                <td>{question.text}</td>
                                <td>{question.correctAnswer}</td>
                                <td>{question.createdAt ? new Date(question.createdAt).toLocaleDateString() : '-'}</td>
                                <td>
                                  <div className="btn-group btn-group-sm">
                                    <button
                                      className="btn btn-outline-primary"
                                      onClick={() => handleEditQuestion(question)}
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-danger"
                                      onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {filteredQuestions.length === 0 && (
                              <tr>
                                <td colSpan="6" className="text-center text-muted">
                                  No questions found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* You can insert other tabs' content here in the same pattern */}

              {/* Confirm Modal */}
              {showConfirmModal && (
                <div className="modal show d-block" tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">{confirmAction?.title}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        <p>{confirmAction?.message}</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                          Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={confirmModalAction}>
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CctAdminDashboard;
