import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserPlus,
  Server,
  Activity,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  totalStudents,
  systemStatus,
  onOpenStatusModal,
  mobileOpen,
  setMobileOpen,
  onOpenAddModal,
}) {
  const handleNavClick = (tab) => {
    if (tab === 'add-modal') {
      onOpenAddModal();
    } else {
      setActiveTab(tab);
    }
    if (setMobileOpen) setMobileOpen(false);
  };

  const getStatusClass = () => {
    if (systemStatus?.database?.connected) return 'online';
    if (systemStatus?.status === 'ok') return 'degraded';
    return 'offline';
  };

  const getStatusLabel = () => {
    if (systemStatus?.database?.connected) return 'System Online';
    if (systemStatus?.status === 'ok') return 'DB Connecting...';
    return 'Backend Offline';
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 35 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-badge">
            <GraduationCap size={24} />
          </div>
          <div className="brand-details">
            <h1>EduPulse SIS</h1>
            <p>Admin Portal</p>
          </div>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="mobile-menu-btn"
              style={{ marginLeft: 'auto', display: mobileOpen ? 'block' : 'none' }}
              aria-label="Close Menu"
            >
              <X size={20} color="#cbd5e1" />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Main Navigation</span>

          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="nav-item-left">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
          </button>

          <button
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => handleNavClick('students')}
          >
            <div className="nav-item-left">
              <Users size={18} />
              <span>Students Directory</span>
            </div>
            {totalStudents !== null && totalStudents !== undefined && (
              <span className="nav-badge">{totalStudents}</span>
            )}
          </button>

          <span className="nav-section-label" style={{ marginTop: 14 }}>
            Quick Actions
          </span>

          <button
            className="nav-item"
            onClick={() => handleNavClick('add-modal')}
          >
            <div className="nav-item-left">
              <UserPlus size={18} />
              <span>Add New Student</span>
            </div>
          </button>

          <span className="nav-section-label" style={{ marginTop: 14 }}>
            System
          </span>

          <button
            className="nav-item"
            onClick={onOpenStatusModal}
          >
            <div className="nav-item-left">
              <Server size={18} />
              <span>Server & Database</span>
            </div>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div
            className="system-status-indicator"
            onClick={onOpenStatusModal}
            title="Click to view detailed system & database diagnostics"
          >
            <span className={`status-dot ${getStatusClass()}`} />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.8rem' }}>
                {getStatusLabel()}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                MongoDB Atlas • Node.js
              </span>
            </div>
            <Activity size={14} color="#94a3b8" />
          </div>
        </div>
      </aside>
    </>
  );
}
