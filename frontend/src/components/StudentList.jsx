import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  FileSpreadsheet,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  Users,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, DEPARTMENT_COLORS, exportStudentsToCSV } from '../constants';

export default function StudentList({
  students,
  loading,
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  selectedSemester,
  setSelectedSemester,
  onRefresh,
  onOpenAddModal,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
}) {
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Client-side filtering & sorting for instant snappy response
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Search filter: Student ID, Name, or Email
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (s) =>
          (s.studentId && s.studentId.toLowerCase().includes(term)) ||
          (s.name && s.name.toLowerCase().includes(term)) ||
          (s.email && s.email.toLowerCase().includes(term))
      );
    }

    // Department filter
    if (selectedDepartment && selectedDepartment !== 'All') {
      result = result.filter((s) => s.department === selectedDepartment);
    }

    // Semester filter
    if (selectedSemester && selectedSemester !== 'All') {
      result = result.filter((s) => String(s.semester) === String(selectedSemester));
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'semester') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortField === 'createdAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, selectedDepartment, selectedSemester, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    (selectedDepartment && selectedDepartment !== 'All') ||
    (selectedSemester && selectedSemester !== 'All');

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All');
    setSelectedSemester('All');
  };

  return (
    <div>
      {/* Top Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Student ID, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          aria-label="Filter by semester"
        >
          <option value="All">All Semesters</option>
          {SEMESTERS.map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="btn btn-secondary"
            title="Reset active search and filters"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button
            onClick={() => exportStudentsToCSV(filteredStudents)}
            className="btn btn-secondary"
            disabled={filteredStudents.length === 0}
            title="Export currently visible students to CSV"
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        {/* Table Header Bar with counts and refresh */}
        <div className="table-header-row-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
              Student Records
            </span>
            <span
              style={{
                fontSize: '0.8rem',
                backgroundColor: '#f1f5f9',
                padding: '2px 8px',
                borderRadius: '9999px',
                color: '#475569',
                fontWeight: 600,
              }}
            >
              Showing {filteredStudents.length} of {students.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Sort by:
            </span>
            <select
              className="filter-select"
              style={{ padding: '4px 10px', fontSize: '0.8rem' }}
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('-');
                setSortField(f);
                setSortOrder(o);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="studentId-asc">Student ID (Asc)</option>
              <option value="semester-asc">Semester (Asc)</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div className="spinner-primary" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Loading student records from database...
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={32} />
            </div>
            <h3>No Students Found</h3>
            <p>
              {hasActiveFilters
                ? 'No students match your active search and filter criteria. Try adjusting or clearing your filters.'
                : 'There are currently no students registered in the database. Add your first student to begin!'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="btn btn-secondary"
                style={{ marginTop: 10 }}
              >
                Clear All Filters
              </button>
            ) : (
              <button
                onClick={onOpenAddModal}
                className="btn btn-primary"
                style={{ marginTop: 10 }}
              >
                <Plus size={16} />
                <span>Register First Student</span>
              </button>
            )}
          </div>
        ) : (
          /* Data Table */
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('studentId')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Student ID</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('name')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Full Name & Email</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th>Department</th>
                  <th
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSort('semester')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Semester</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th>Contact Number</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const colors =
                    DEPARTMENT_COLORS[student.department] || {
                      bg: '#f1f5f9',
                      text: '#334155',
                      border: '#cbd5e1',
                    };

                  return (
                    <tr key={student._id || student.studentId}>
                      <td>
                        <span className="student-id-badge">{student.studentId}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              flexShrink: 0,
                            }}
                          >
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                              {student.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="department-badge"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {student.department}
                        </span>
                      </td>
                      <td>
                        <span className="semester-pill">Semester {student.semester}</span>
                      </td>
                      <td style={{ fontSize: '0.84rem', color: '#475569' }}>
                        {student.contactNumber}
                      </td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn-action view"
                            onClick={() => onViewStudent(student)}
                            title="View student profile"
                            aria-label={`View ${student.name}`}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn-action edit"
                            onClick={() => onEditStudent(student)}
                            title="Edit student record"
                            aria-label={`Edit ${student.name}`}
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => onDeleteStudent(student)}
                            title="Delete student record"
                            aria-label={`Delete ${student.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
