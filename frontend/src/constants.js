export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics',
  'Business Administration',
  'Data Science & AI',
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Color mapping for department badges
export const DEPARTMENT_COLORS = {
  'Computer Science & Engineering': { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
  'Information Technology': { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  'Electronics & Communication': { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  'Mechanical Engineering': { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  'Civil Engineering': { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' },
  'Electrical & Electronics': { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' },
  'Business Administration': { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
  'Data Science & AI': { bg: '#f1f5f9', text: '#0f172a', border: '#cbd5e1' },
};

// Form validation helper
export const validateStudentForm = (form) => {
  const errors = {};

  if (!form.studentId || !form.studentId.trim()) {
    errors.studentId = 'Student ID is required';
  } else if (!/^[A-Za-z0-9\-_/]{2,20}$/.test(form.studentId.trim())) {
    errors.studentId = 'Student ID must be 2-20 alphanumeric characters (hyphens allowed)';
  }

  if (!form.name || !form.name.trim()) {
    errors.name = 'Full name is required';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!form.email || !form.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!form.department) {
    errors.department = 'Please select an academic department';
  }

  if (!form.semester) {
    errors.semester = 'Please select a current semester';
  }

  const phoneRegex = /^[+]?[0-9\s\-()]{7,16}$/;
  if (!form.contactNumber || !form.contactNumber.trim()) {
    errors.contactNumber = 'Contact number is required';
  } else if (!phoneRegex.test(form.contactNumber.trim())) {
    errors.contactNumber = 'Please enter a valid contact number (7-15 digits)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const exportStudentsToCSV = (students) => {
  if (!students || students.length === 0) return;

  const headers = ['Student ID', 'Full Name', 'Email', 'Department', 'Semester', 'Contact Number', 'Enrolled Date'];
  const rows = students.map((s) => [
    `"${s.studentId}"`,
    `"${s.name}"`,
    `"${s.email}"`,
    `"${s.department}"`,
    `"Semester ${s.semester}"`,
    `"${s.contactNumber}"`,
    `"${new Date(s.createdAt).toLocaleDateString()}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Students_Export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
