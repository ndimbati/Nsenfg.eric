import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  BarChart3,
  Settings,
  Database,
  CheckSquare,
  Shield,
  FileBarChart
} from 'lucide-react';
import ContentManager from './ContentManager';
import UserManager from './UserManager';
import DashboardStats from './DashboardStats';
import DatabaseManager from './DatabaseManager';
import TaskManager from './TaskManager';
import AdminSettings from './AdminSettings';
import Reports from './Reports';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [adminUsername, setAdminUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const username = localStorage.getItem('adminUsername');
    
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    setAdminUsername(username || 'Admin');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Settings size={32} className="admin-logo" />
          <h2>Admin Panel</h2>
          <p className="admin-username">{adminUsername}</p>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <CheckSquare size={20} />
            <span>Task Manager</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText size={20} />
            <span>Content Manager</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            <span>User Manager</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            <Database size={20} />
            <span>Database Manager</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileBarChart size={20} />
            <span>Reports</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Shield size={20} />
            <span>Admin Settings</span>
          </button>
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-content">
            <LayoutDashboard size={28} />
            <div>
              <h1>
                {activeTab === 'stats' && 'Dashboard Overview'}
                {activeTab === 'tasks' && 'Task Manager'}
                {activeTab === 'content' && 'Content Management'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'database' && 'Database Manager'}
                {activeTab === 'reports' && 'System Reports'}
                {activeTab === 'settings' && 'Admin Settings'}
              </h1>
              <p>
                {activeTab === 'stats' && 'Monitor system statistics and performance'}
                {activeTab === 'tasks' && 'Manage and track all tasks'}
                {activeTab === 'content' && 'Manage website content'}
                {activeTab === 'users' && 'Manage registered users'}
                {activeTab === 'database' && 'Manage login table'}
                {activeTab === 'reports' && 'View comprehensive system reports'}
                {activeTab === 'settings' && 'Manage admin accounts'}
              </p>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {activeTab === 'stats' && <DashboardStats onNavigate={setActiveTab} />}
          {activeTab === 'tasks' && <TaskManager />}
          {activeTab === 'content' && <ContentManager />}
          {activeTab === 'users' && <UserManager />}
          {activeTab === 'database' && <DatabaseManager />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
