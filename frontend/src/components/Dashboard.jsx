import React from 'react';
import {
  Users,
  Building2,
  Calendar,
  Database,
  UserPlus,
  FileSpreadsheet,
  ArrowRight,
  Eye,
  Edit,
  GraduationCap,
} from 'lucide-react';
import { DEPARTMENT_COLORS, exportStudentsToCSV } from '../constants';

export default function Dashboard({
  stats,
  allStudents,
  loading,
  onNavigateToStudents,
  onFilterDepartment,
  onOpenAddModal,
  onViewStudent,
  onEditStudent,
  systemStatus,
}) {
  const totalStudents = stats?.totalStudents ?? allStudents?.length ?? 0;
  const departmentStats = stats?.departmentStats || [];
  const semesterStats = stats?.semesterStats || [];
  const recentStudents = stats?.recentStudents || allStudents?.slice(0, 5) || [];

  const isConnected = systemStatus?.database?.connected;

  // Compute highest department count for relative bar widths
  const maxDeptCount = Math.max(...departmentStats.map((d) => d.count), 1);

  return (
    <div>
      {/* 4 Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card" style={{ '--card-accent': '#2563eb' }}>
          <div
            className="metric-icon-box"
            style={{ '--icon-bg': '#eff6ff', '--icon-color': '#2563eb' }}
          >
            <Users size={26} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Students</span>
            <span className="metric-value">{loading ? '...' : totalStudents}</span>
            <span className="metric-sub">Registered across all departments</span>
          </div>
        </div>

        <div className="metric-card" style={{ '--card-accent': '#0284c7' }}>
          <div
            className="metric-icon-box"
            style={{ '--icon-bg': '#f0f9ff', '--icon-color': '#0284c7' }}
          >
            <Building2 size={26} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Departments</span>
            <span className="metric-value">
              {loading ? '...' : departmentStats.length || 8}
            </span>
            <span className="metric-sub">Active academic programs</span>
          </div>
        </div>

        <div className="metric-card" style={{ '--card-accent': '#7c3aed' }}>
          <div
            className="metric-icon-box"
            style={{ '--icon-bg': '#f5f3ff', '--icon-color': '#7c3aed' }}
          >
            <Calendar size={26} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Semesters</span>
            <span className="metric-value">8</span>
            <span className="metric-sub">Undergraduate program levels</span>
          </div>
        </div>

        <div className="metric-card" style={{ '--card-accent': isConnected ? '#16a34a' : '#d97706' }}>
          <div
            className="metric-icon-box"
            style={{
              '--icon-bg': isConnected ? '#f0fdf4' : '#fffbeb',
              '--icon-color': isConnected ? '#16a34a' : '#d97706',
            }}
          >
            <Database size={26} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Database Status</span>
            <span
              className="metric-value"
              style={{ fontSize: '1.2rem', color: isConnected ? '#16a34a' : '#d97706' }}
            >
              {isConnected ? 'Atlas Online' : 'Check Conn.'}
            </span>
            <span className="metric-sub">
              {isConnected ? 'Mongoose cluster linked' : 'Verify backend .env'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Department Breakdown & Quick Actions / Semester */}
      <div className="dashboard-split-grid">
        {/* Left Column: Department Distribution */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Department Enrollment Breakdown
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Student distribution by major academic division
              </p>
            </div>
            <button
              onClick={onNavigateToStudents}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '5px 10px' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {departmentStats.length === 0 ? (
            <div style={{ padding: '30px 10px', textAlign: 'center', color: '#64748b' }}>
              <p>No department data yet. Add students to see enrollment analytics.</p>
            </div>
          ) : (
            <div className="dept-bar-list">
              {departmentStats.map((item) => {
                const colors = DEPARTMENT_COLORS[item.department] || {
                  bg: '#e2e8f0',
                  text: '#334155',
                  border: '#cbd5e1',
                };
                const percentage = Math.round((item.count / totalStudents) * 100) || 0;
                const barWidth = Math.round((item.count / maxDeptCount) * 100);

                return (
                  <div
                    key={item.department}
                    className="dept-bar-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onFilterDepartment(item.department)}
                    title={`Click to filter students in ${item.department}`}
                  >
                    <div className="dept-bar-header">
                      <span style={{ color: '#1e293b' }}>{item.department}</span>
                      <span style={{ color: '#64748b', fontSize: '0.82rem' }}>
                        <strong>{item.count}</strong> students ({percentage}%)
                      </span>
                    </div>
                    <div className="dept-bar-track">
                      <div
                        className="dept-bar-fill"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: colors.text,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions + Semester Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Quick Actions Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>
              Quick Actions
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              Common administrative tasks
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn btn-primary"
                onClick={onOpenAddModal}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <UserPlus size={16} />
                <span>Register New Student</span>
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => exportStudentsToCSV(allStudents)}
                disabled={!allStudents || allStudents.length === 0}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <FileSpreadsheet size={16} />
                <span>Export Students CSV</span>
              </button>
              <button
                className="btn btn-secondary"
                onClick={onNavigateToStudents}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <Users size={16} />
                <span>Search & Filter Directory</span>
              </button>
            </div>
          </div>

          {/* Semester Distribution */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>
              Semester Distribution
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10 }}>
              Students active per semester
            </p>
            <div className="semester-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                const found = semesterStats.find((s) => s.semester === sem);
                const count = found ? found.count : 0;
                return (
                  <div key={sem} className="semester-box">
                    <span className="semester-box-title">Sem {sem}</span>
                    <span className="semester-box-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admissions Section */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Recent Student Registrations
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Latest students added to the college registry
            </p>
          </div>
          <button
            onClick={onNavigateToStudents}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <span>View All Records</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {recentStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b' }}>
            <GraduationCap size={40} color="#cbd5e1" style={{ marginBottom: 8 }} />
            <p>No students enrolled yet. Click "Register New Student" to get started.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Registered On</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => {
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
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {student.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {student.email}
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
                        <span className="semester-pill">Sem {student.semester}</span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.82rem' }}>
                        {student.createdAt
                          ? new Date(student.createdAt).toLocaleDateString()
                          : 'Recently'}
                      </td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn-action view"
                            onClick={() => onViewStudent(student)}
                            title="View student details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="btn-action edit"
                            onClick={() => onEditStudent(student)}
                            title="Edit student details"
                          >
                            <Edit size={15} />
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
