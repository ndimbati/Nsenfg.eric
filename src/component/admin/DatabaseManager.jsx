import { useState, useEffect } from 'react';
import { 
  Database, Plus, Edit, Trash2, Save, X, RefreshCw 
} from 'lucide-react';

function DatabaseManager() {
  const [loginData, setLoginData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({ totalLogins: 0 });
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Edit form states
  const [editLoginForm, setEditLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/table-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Fetching login data with token:', token ? 'exists' : 'missing');
      
      const loginRes = await fetch('/api/admin/login', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Login response status:', loginRes.status);
      
      if (loginRes.ok) {
        const data = await loginRes.json();
        console.log('Login data received:', data);
        setLoginData(data);
      } else {
        const errorData = await loginRes.json();
        console.error('Failed to fetch login data:', errorData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login CRUD Operations
  const handleAddLogin = async (e) => {
    e.preventDefault();
    
    console.log('Submitting login form:', loginForm);
    
    if (!loginForm.email || !loginForm.password) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Token exists:', !!token);
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      });

      console.log('Add login response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Login added successfully:', result);
        await fetchData();
        await fetchStats();
        setShowAddForm(false);
        setLoginForm({ email: '', password: '' });
        alert('Login record added successfully!');
      } else {
        const error = await response.json();
        console.error('Add login error:', error);
        alert(error.error || 'Failed to add login record');
      }
    } catch (error) {
      console.error('Error adding login:', error);
      alert('Failed to add login record: ' + error.message);
    }
  };

  const handleEditLogin = (item) => {
    setEditingId(item.id);
    setEditLoginForm({ email: item.email, password: '' });
  };

  const handleSaveLogin = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/login/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editLoginForm)
      });

      if (response.ok) {
        await fetchData();
        await fetchStats();
        setEditingId(null);
        setEditLoginForm({ email: '', password: '' });
        alert('Login record updated successfully!');
      } else {
        alert('Failed to update login record');
      }
    } catch (error) {
      console.error('Error updating login:', error);
      alert('Failed to update login record');
    }
  };

  const handleDeleteLogin = async (id) => {
    if (!confirm('Are you sure you want to delete this login record?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/login/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchData();
        await fetchStats();
        alert('Login record deleted successfully!');
      } else {
        alert('Failed to delete login record');
      }
    } catch (error) {
      console.error('Error deleting login:', error);
      alert('Failed to delete login record');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditLoginForm({ email: '', password: '' });
  };

  return (
    <div>
      {/* Table Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        <div 
          className="admin-card"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transition: 'transform 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Login Records</p>
              <h2 style={{ margin: '5px 0 0', fontSize: '28px' }}>{stats.totalLogins}</h2>
            </div>
            <Database size={40} style={{ opacity: 0.5 }} />
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} />
            Login Table
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="admin-btn admin-btn-secondary"
              onClick={fetchData}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              className="admin-btn admin-btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Plus size={16} />
              Add New Login
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddLogin} 
                style={{ margin: '20px 0', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '15px' }}>
              Add New Login Record
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div className="admin-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="admin-btn admin-btn-success" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Save size={16} />
                Add Record
              </button>
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowAddForm(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Data Table */}
        {loading ? (
          <div className="admin-loading">Loading data...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loginData.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#7f8c8d' }}>
                      No login records found. Add one using the form above.
                    </td>
                  </tr>
                ) : (
                  loginData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span style={{ 
                          background: '#667eea', 
                          color: 'white', 
                          padding: '4px 10px', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          #{item.id}
                        </span>
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="email"
                            value={editLoginForm.email}
                            onChange={(e) => setEditLoginForm({...editLoginForm, email: e.target.value})}
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#3498db' }}>📧</span>
                            {item.email}
                          </div>
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="password"
                            value={editLoginForm.password}
                            onChange={(e) => setEditLoginForm({...editLoginForm, password: e.target.value})}
                            placeholder="Enter new password"
                            style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                        ) : (
                          <span style={{ fontFamily: 'monospace', color: '#95a5a6' }}>••••••••</span>
                        )}
                      </td>
                      <td style={{ color: '#7f8c8d', fontSize: '13px' }}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                              className="admin-btn admin-btn-success"
                              onClick={handleSaveLogin}
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              <Save size={14} />
                            </button>
                            <button 
                              className="admin-btn admin-btn-secondary"
                              onClick={handleCancel}
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                              className="admin-btn admin-btn-primary"
                              onClick={() => handleEditLogin(item)}
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              className="admin-btn admin-btn-danger"
                              onClick={() => handleDeleteLogin(item.id)}
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DatabaseManager;
