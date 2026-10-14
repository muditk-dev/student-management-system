import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS, validateStudentForm } from '../constants';

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode,
}) {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    department: '',
    semester: 1,
    contactNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        studentId: initialData.studentId || '',
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || '',
        semester: initialData.semester || 1,
        contactNumber: initialData.contactNumber || '',
      });
    } else {
      setFormData({
        studentId: '',
        name: '',
        email: '',
        department: DEPARTMENTS[0],
        semester: 1,
        contactNumber: '',
      });
    }
    setErrors({});
    setServerError('');
  }, [initialData, isEditMode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'studentId' ? value.toUpperCase() : value,
    }));

    // Clear inline error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateStudentForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError('');
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to save student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
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
              {isEditMode ? <Save size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3>{isEditMode ? 'Edit Student Details' : 'Register New Student'}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {isEditMode
                  ? 'Update academic information and contact details'
                  : 'Enter student enrollment details to register in database'}
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && (
              <div className="alert alert-danger">
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            <div className="form-grid-2">
              {/* Student ID */}
              <div className="form-group">
                <label className="form-label">
                  Student ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  className={`form-control ${errors.studentId ? 'is-invalid' : ''}`}
                  placeholder="e.g., CS2026-001"
                  value={formData.studentId}
                  onChange={handleChange}
                  autoFocus
                  style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                />
                {errors.studentId && (
                  <div className="form-error">{errors.studentId}</div>
                )}
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g., Aarav Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
            </div>

            <div className="form-grid-2">
              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="e.g., student@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              {/* Contact Number */}
              <div className="form-group">
                <label className="form-label">
                  Contact Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                  placeholder="e.g., +91 98765 43210"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
                {errors.contactNumber && (
                  <div className="form-error">{errors.contactNumber}</div>
                )}
              </div>
            </div>

            <div className="form-grid-2">
              {/* Department */}
              <div className="form-group">
                <label className="form-label">
                  Academic Department <span className="required">*</span>
                </label>
                <select
                  name="department"
                  className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <div className="form-error">{errors.department}</div>
                )}
              </div>

              {/* Semester */}
              <div className="form-group">
                <label className="form-label">
                  Semester <span className="required">*</span>
                </label>
                <select
                  name="semester"
                  className={`form-control ${errors.semester ? 'is-invalid' : ''}`}
                  value={formData.semester}
                  onChange={handleChange}
                >
                  {SEMESTERS.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <div className="form-error">{errors.semester}</div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  <span>Saving to DB...</span>
                </>
              ) : (
                <>
                  {isEditMode ? <Save size={16} /> : <UserPlus size={16} />}
                  <span>{isEditMode ? 'Update Student' : 'Save Student'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
