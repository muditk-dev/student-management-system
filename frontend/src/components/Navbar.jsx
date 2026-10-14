import React from 'react';
import { Menu, Plus, ShieldCheck } from 'lucide-react';

export default function Navbar({
  activeTab,
  onOpenAddModal,
  setMobileOpen,
  systemStatus,
  onOpenStatusModal,
}) {
  const titles = {
    dashboard: {
      title: 'Administrative Dashboard',
      subtitle: 'Overview of student enrollments, departments, and system status',
    },
    students: {
      title: 'Student Directory',
      subtitle: 'Search, filter, view, edit, and manage registered students',
    },
  };

  const currentMeta = titles[activeTab] || titles.dashboard;

  const isConnected = systemStatus?.database?.connected;

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="view-title-container">
          <h2>{currentMeta.title}</h2>
          <p>{currentMeta.subtitle}</p>
        </div>
      </div>

      <div className="navbar-right">
        {/* Connection status pill */}
        <button
          onClick={onOpenStatusModal}
          className="btn btn-secondary"
          style={{
            fontSize: '0.8rem',
            padding: '6px 12px',
            borderColor: isConnected ? '#86efac' : '#fcd34d',
            backgroundColor: isConnected ? '#f0fdf4' : '#fffbeb',
            color: isConnected ? '#166534' : '#92400e',
          }}
          title="Click to check database & API status"
        >
          <span
            className={`status-dot ${isConnected ? 'online' : 'degraded'}`}
            style={{ width: 7, height: 7 }}
          />
          <span>{isConnected ? 'Atlas Connected' : 'DB Check'}</span>
        </button>

        {/* Quick Add Student Button */}
        <button
          className="btn btn-primary"
          onClick={onOpenAddModal}
        >
          <Plus size={16} />
          <span>Add Student</span>
        </button>

        {/* Administrator Profile Pill */}
        <div className="admin-pill">
          <div className="admin-avatar">
            <ShieldCheck size={18} />
          </div>
          <div className="admin-info">
            <span className="admin-name">Dean's Office</span>
            <span className="admin-role">System Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
