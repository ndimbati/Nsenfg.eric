import { useState, useEffect } from 'react';
import { Shield, Edit, Trash2, Save, X, UserCog, Plus } from 'lucide-react';

function AdminSettings() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', password: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/admins', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingId(admin.id);
    setEditForm({ username: admin.username, email: admin.email, password: '' });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/admins/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchAdmins();
        setEditingId(null);
        alert('Admin updated successfully!');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Failed to update admin');
    }
  };

  const handleDelete = async (id, email) => {
    if (!confirm(`Are you sure you want to delete admin: ${email}?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchAdmins();
        alert('Admin deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAdmin)
      });

      if (response.ok) {
        await fetchAdmins();
        setShowAddForm(false);
        setNewAdmin({ username: '', email: '', password: '' });
        alert('Admin added successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add admin');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading admin settings...</div>;
  }

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3><Shield size={20} /> Admin Accounts ({admins.length})</h3>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={18} />
            Add New Admin
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddAdmin} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0 }}>Add New Admin</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div className="admin-form-group">
                <label>Username *</label>
                <input
                  type="text"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="admin-btn admin-btn-success">
                <Save size={18} />
                Add Admin
              </button>
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <span style={{ 
                      background: '#e74c3c', 
                      color: 'white', 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      #{admin.id}
                    </span>
                  </td>
                  <td>
                    {editingId === admin.id ? (
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserCog size={20} style={{ color: '#e74c3c' }} />
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>{admin.username}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingId === admin.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    ) : (
                      admin.email
                    )}
                  </td>
                  <td>
                    {editingId === admin.id ? (
                      <input
                        type="password"
                        value={editForm.password}
                        onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                        placeholder="New password"
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ fontFamily: 'monospace', color: '#95a5a6' }}>••••••••</span>
                    )}
                  </td>
                  <td>
                    {editingId === admin.id ? (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          className="admin-btn admin-btn-success"
                          onClick={handleSave}
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          <Save size={14} />
                          Save
                        </button>
                        <button 
                          className="admin-btn admin-btn-secondary"
                          onClick={() => setEditingId(null)}
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          className="admin-btn admin-btn-primary"
                          onClick={() => handleEdit(admin)}
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button 
                          className="admin-btn admin-btn-danger"
                          onClick={() => handleDelete(admin.id, admin.email)}
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Change Password (Optional)</h3>
          </div>
          <div className="admin-form-group">
            <label>New Password</label>
            <input
              type="password"
              value={editForm.password}
              onChange={(e) => setEditForm({...editForm, password: e.target.value})}
              placeholder="Leave blank to keep current password"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;
