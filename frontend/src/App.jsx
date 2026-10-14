import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentModal from './components/StudentModal';
import ViewStudentModal from './components/ViewStudentModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import StatusModal from './components/StatusModal';
import Toast from './components/Toast';
import api from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [studentToView, setStudentToView] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // System Health Diagnostic Ping
  const checkHealth = useCallback(async () => {
    try {
      setStatusLoading(true);
      const data = await api.getHealth();
      setSystemStatus(data);
    } catch (err) {
      setSystemStatus({
        status: 'offline',
        database: { connected: false },
        error: err.message,
      });
    } finally {
      setStatusLoading(false);
    }
  }, []);

  // Load Students from Backend
  const loadStudents = useCallback(async (quiet = false) => {
    try {
      if (!quiet) setLoading(true);
      const res = await api.getStudents({ limit: 500 });
      if (res && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      if (!quiet) {
        addToast(
          err.isNetworkError
            ? 'Cannot connect to backend API. Please make sure the Node server is running on port 5000.'
            : (err.message || 'Error fetching students from server'),
          'error',
          6000
        );
      }
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [addToast]);

  // Load Dashboard Statistics
  const loadStats = useCallback(async () => {
    try {
      const res = await api.getDashboardStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Dashboard stats endpoint unavailable, computing locally:', err.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    checkHealth();
    loadStudents();
    loadStats();
  }, [checkHealth, loadStudents, loadStats]);

  // Handlers for Add, Edit, Delete
  const handleCreateStudent = async (formData) => {
    const res = await api.createStudent(formData);
    addToast(res.message || `Student ${formData.name} was successfully registered!`, 'success');
    await Promise.all([loadStudents(true), loadStats(), checkHealth()]);
  };

  const handleUpdateStudent = async (formData) => {
    const targetId = studentToEdit?._id || studentToEdit?.studentId;
    const res = await api.updateStudent(targetId, formData);
    addToast(res.message || `Student ${formData.name} was updated successfully!`, 'success');
    await Promise.all([loadStudents(true), loadStats(), checkHealth()]);
  };

  const handleDeleteStudent = async (student) => {
    const targetId = student?._id || student?.studentId;
    const res = await api.deleteStudent(targetId);
    addToast(res.message || `Student ${student.name} was removed from the registry.`, 'success');
    await Promise.all([loadStudents(true), loadStats(), checkHealth()]);
  };

  // Navigations & modal triggers
  const handleDepartmentFilterClick = (department) => {
    setSelectedDepartment(department);
    setActiveTab('students');
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleViewStudent = (student) => {
    setStudentToView(student);
    setIsViewModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalStudents={students.length}
        systemStatus={systemStatus}
        onOpenStatusModal={() => setIsStatusModalOpen(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <Navbar
          activeTab={activeTab}
          onOpenAddModal={handleOpenAddModal}
          setMobileOpen={setMobileOpen}
          systemStatus={systemStatus}
          onOpenStatusModal={() => setIsStatusModalOpen(true)}
        />

        <main className="page-content">
          {activeTab === 'dashboard' ? (
            <Dashboard
              stats={stats}
              allStudents={students}
              loading={loading}
              onNavigateToStudents={() => setActiveTab('students')}
              onFilterDepartment={handleDepartmentFilterClick}
              onOpenAddModal={handleOpenAddModal}
              onViewStudent={handleViewStudent}
              onEditStudent={handleEditStudent}
              systemStatus={systemStatus}
            />
          ) : (
            <StudentList
              students={students}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
              onRefresh={() => loadStudents(false)}
              onOpenAddModal={handleOpenAddModal}
              onViewStudent={handleViewStudent}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteClick}
            />
          )}
        </main>
      </div>

      {/* Modal: Add Student */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateStudent}
        isEditMode={false}
      />

      {/* Modal: Edit Student */}
      <StudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setStudentToEdit(null);
        }}
        onSubmit={handleUpdateStudent}
        initialData={studentToEdit}
        isEditMode={true}
      />

      {/* Modal: View Single Student Profile */}
      <ViewStudentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setStudentToView(null);
        }}
        student={studentToView}
        onEdit={(student) => {
          setIsViewModalOpen(false);
          handleEditStudent(student);
        }}
      />

      {/* Modal: Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        student={studentToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleDeleteStudent}
      />

      {/* Modal: System Health & Diagnostics */}
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        systemStatus={systemStatus}
        onRefreshStatus={checkHealth}
        statusLoading={statusLoading}
      />
    </div>
  );
}
