import { useState, useEffect } from 'react';
import { FileText, Users, Database, FileEdit, CheckCircle, Download, Shield } from 'lucide-react';

function Reports() {
  const [data, setData] = useState({ users: [], content: [], logins: [], tasks: [], admins: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const [users, content, logins, tasks, admins] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
        fetch('/api/admin/content', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
        fetch('/api/admin/login', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
        fetch('/api/admin/tasks', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
        fetch('/api/admin/admins', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : [])
      ]);
      setData({ users, content, logins, tasks, admins });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading">Generating report...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>System Report</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => window.print()}>
          <Download size={18} /> Export
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Users size={32} style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '10px 0', fontSize: '32px' }}>{data.users.length}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Total Users</p>
        </div>
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <FileEdit size={32} style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '10px 0', fontSize: '32px' }}>{data.content.length}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Content Items</p>
        </div>
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <Database size={32} style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '10px 0', fontSize: '32px' }}>{data.logins.length}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Login Records</p>
        </div>
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <CheckCircle size={32} style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '10px 0', fontSize: '32px' }}>{data.tasks.length}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Total Tasks</p>
        </div>
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
          <Shield size={32} style={{ marginBottom: '10px' }} />
          <h3 style={{ margin: '10px 0', fontSize: '32px' }}>{data.admins.length}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Administrators</p>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Users size={20} /> User Management Report
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.userName}</td>
                <td>{u.email}</td>
                <td>{u.role || 'user'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <FileEdit size={20} /> Content Management Report
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Page</th>
              <th>Section</th>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.page_name}</td>
                <td>{c.section_name}</td>
                <td>{c.content_key}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.content_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <CheckCircle size={20} /> Task Manager Report
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {data.tasks.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>
                <td>{t.status}</td>
                <td>{t.priority}</td>
                <td>{t.assigned_to || 'N/A'}</td>
                <td>{t.due_date || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Database size={20} /> Database Manager Report
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.logins.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.email}</td>
                <td>{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Shield size={20} /> Admin Settings Report
        </h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.admins.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.username}</td>
                <td>{a.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card" style={{ background: '#ecf0f1', textAlign: 'center', padding: '30px' }}>
        <FileText size={48} style={{ color: '#95a5a6', marginBottom: '15px' }} />
        <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Report Summary</h3>
        <p style={{ color: '#7f8c8d', margin: 0 }}>
          Generated on {new Date().toLocaleString()} | {data.users.length} users, {data.content.length} content items, {data.tasks.length} tasks, {data.logins.length} logins, {data.admins.length} admins
        </p>
      </div>
    </div>
  );
}

export default Reports;
