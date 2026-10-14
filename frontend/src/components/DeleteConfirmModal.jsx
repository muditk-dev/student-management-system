import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  student,
  onClose,
  onConfirm,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !student) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(student);
      onClose();
    } catch {
      // error handled in parent via toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440 }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ color: '#991b1b' }}>Confirm Student Deletion</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
            Are you sure you want to delete the record for student{' '}
            <strong style={{ color: '#0f172a' }}>{student.name}</strong> with Student ID{' '}
            <code
              style={{
                backgroundColor: '#f1f5f9',
                padding: '2px 6px',
                borderRadius: 4,
                fontFamily: 'var(--font-mono)',
                color: '#0f172a',
                fontWeight: 600,
              }}
            >
              {student.studentId}
            </code>
            ?
          </p>

          <div
            style={{
              marginTop: 16,
              padding: '12px 14px',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              fontSize: '0.82rem',
              color: '#9f1239',
            }}
          >
            <strong>Warning:</strong> All enrolled course records, contact details, and department linkages for this student will be permanently removed from MongoDB Atlas.
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="spinner" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Student</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
