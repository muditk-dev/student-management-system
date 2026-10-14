import React from 'react';
import {
  X,
  Edit,
  Mail,
  Phone,
  Building2,
  Calendar,
  Hash,
  Clock,
  UserCheck,
} from 'lucide-react';
import { DEPARTMENT_COLORS } from '../constants';

export default function ViewStudentModal({
  student,
  isOpen,
  onClose,
  onEdit,
}) {
  if (!isOpen || !student) return null;

  const colors = DEPARTMENT_COLORS[student.department] || {
    bg: '#eff6ff',
    text: '#1e40af',
    border: '#bfdbfe',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 540 }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserCheck size={20} />
            </div>
            <div>
              <h3>Student Profile</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Complete academic record and contact details
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Student Profile Card Top Banner */}
          <div
            style={{
              padding: 20,
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                backgroundColor: '#1e40af',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(30, 64, 175, 0.25)',
              }}
            >
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {student.name}
                </h4>
                <span className="student-id-badge">{student.studentId}</span>
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
                <span className="semester-pill">Semester {student.semester}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #f1f5f9',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <Mail size={18} color="#2563eb" style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  EMAIL ADDRESS
                </span>
                <a
                  href={`mailto:${student.email}`}
                  style={{
                    fontSize: '0.92rem',
                    color: '#1e40af',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {student.email}
                </a>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #f1f5f9',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <Phone size={18} color="#2563eb" style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  CONTACT PHONE
                </span>
                <a
                  href={`tel:${student.contactNumber}`}
                  style={{
                    fontSize: '0.92rem',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {student.contactNumber}
                </a>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #f1f5f9',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <Building2 size={18} color="#2563eb" style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  DEPARTMENT
                </span>
                <span style={{ fontSize: '0.92rem', color: '#0f172a', fontWeight: 500 }}>
                  {student.department}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                border: '1px solid #f1f5f9',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <Clock size={18} color="#2563eb" style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  ENROLLED IN DATABASE
                </span>
                <span style={{ fontSize: '0.92rem', color: '#0f172a', fontWeight: 500 }}>
                  {formatDate(student.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(student);
            }}
          >
            <Edit size={16} />
            <span>Edit Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
