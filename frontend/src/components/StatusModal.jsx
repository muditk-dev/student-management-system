import React from 'react';
import {
  X,
  Server,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function StatusModal({
  isOpen,
  onClose,
  systemStatus,
  onRefreshStatus,
  statusLoading,
}) {
  if (!isOpen) return null;

  const isApiOnline = Boolean(systemStatus && systemStatus.status);
  const isDbConnected = Boolean(systemStatus && systemStatus.database?.connected);

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000 (Proxy)';

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 560 }}
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
              <Server size={20} />
            </div>
            <div>
              <h3>System & Database Diagnostics</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Three-tier connectivity verification
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
          {/* Health Summary Box */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: isDbConnected ? '#f0fdf4' : '#fffbeb',
              border: `1px solid ${isDbConnected ? '#86efac' : '#fcd34d'}`,
              borderRadius: '10px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isDbConnected ? (
                <CheckCircle2 size={24} color="#16a34a" />
              ) : (
                <AlertTriangle size={24} color="#d97706" />
              )}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {isDbConnected
                    ? 'All Systems Operational'
                    : isApiOnline
                    ? 'Backend Online • Database Degraded'
                    : 'Backend API Unreachable'}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  {isDbConnected
                    ? 'Frontend, Node/Express API, and MongoDB Atlas are communicating normally.'
                    : 'Check your database connection string and network whitelist.'}
                </p>
              </div>
            </div>

            <button
              onClick={onRefreshStatus}
              className="btn btn-secondary btn-icon-only"
              disabled={statusLoading}
              title="Ping backend API"
            >
              <RefreshCw
                size={16}
                className={statusLoading ? 'spinner' : ''}
              />
            </button>
          </div>

          {/* Diagnostic Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Frontend Tier */}
            <div
              style={{
                padding: '12px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                  TIER 1: FRONTEND (REACT / NETLIFY)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                  Active
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#0f172a' }}>
                Client Origin: <code>{window.location.origin}</code>
              </div>
            </div>

            {/* Backend Tier */}
            <div
              style={{
                padding: '12px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                  TIER 2: BACKEND (NODE / EXPRESS REST API)
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: isApiOnline ? '#16a34a' : '#dc2626',
                    fontWeight: 600,
                  }}
                >
                  {isApiOnline ? 'Responding' : 'Offline'}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#0f172a' }}>
                Target Endpoint: <code>{apiBaseUrl}</code>
              </div>
              {systemStatus?.uptime && (
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                  Server Uptime: {systemStatus.uptime}
                </div>
              )}
            </div>

            {/* Database Tier */}
            <div
              style={{
                padding: '12px 14px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                  TIER 3: DATABASE (MONGODB ATLAS)
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: isDbConnected ? '#16a34a' : '#d97706',
                    fontWeight: 600,
                  }}
                >
                  {isDbConnected ? 'Connected via Mongoose' : 'Not Connected'}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#0f172a' }}>
                Cluster Host:{' '}
                <code>{systemStatus?.database?.host || 'Configure in backend/.env'}</code>
              </div>
              {systemStatus?.database?.database && (
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                  Database Name: {systemStatus.database.database}
                </div>
              )}
            </div>
          </div>

          {/* Beginner Troubleshooting Guide if not connected */}
          {!isDbConnected && (
            <div
              style={{
                marginTop: 18,
                padding: '14px 16px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#1e3a8a',
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldAlert size={16} />
                <span>MongoDB Atlas Setup Checklist for Beginners:</span>
              </div>
              <ol style={{ paddingLeft: 18, margin: 0 }}>
                <li>Log in to <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" style={{ color: '#1d4ed8' }}>MongoDB Atlas</a> and select your cluster.</li>
                <li>Go to <strong>Network Access</strong> → click <strong>Add IP Address</strong> → select <strong>Allow Access From Anywhere (0.0.0.0/0)</strong>.</li>
                <li>Go to <strong>Database Access</strong> → create a user with <strong>Read and Write</strong> privileges and note your password.</li>
                <li>Go to <strong>Clusters</strong> → click <strong>Connect</strong> → select <strong>Drivers</strong> → copy the connection string.</li>
                <li>Paste it into <code>backend/.env</code> as <code>MONGODB_URI=...</code>, then restart the backend!</li>
              </ol>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
