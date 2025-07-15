// Example usage in a parent component or route
import React from 'react';
import StudentReport from './StudentReport';

const mockStudent = {
  fullName: 'Adekunle James',
  className: 'SS3B',
  total: 425,
  percentage: 85,
  status: 'Pass',
  scores: [
    { subject: 'Mathematics', score: 85, max: 100 },
    { subject: 'English', score: 80, max: 100 },
    { subject: 'Biology', score: 90, max: 100 },
    { subject: 'Physics', score: 85, max: 100 },
    { subject: 'Chemistry', score: 85, max: 100 },
  ]
};

const StudentReportPage = () => <StudentReport student={mockStudent} />;

export default StudentReportPage;
