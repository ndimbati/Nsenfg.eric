import { useState, useEffect } from 'react';
import { Users, Trash2, Mail, User as UserIcon, Edit, Save, X } from 'lucide-react';

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ userName: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('Fetching users...');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Users data:', data);
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ userName: user.userName, email: user.email, password: '', role: user.role || 'user' });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchUsers();
        setEditingId(null);
        alert('User updated successfully!');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleDelete = async (id, email) => {
    if (!confirm(`Are you sure you want to delete user: ${email}?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchUsers();
        alert('User deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading users...</div>;
  }

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3><Users size={20} /> Registered Users ({users.length})</h3>
        </div>

        {users.length === 0 ? (
          <div className="admin-empty-state">
            <Users size={64} />
            <h3>No Users Yet</h3>
            <p>Users who register through the website will appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span style={{ 
                        background: '#3498db', 
                        color: 'white', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        #{user.id}
                      </span>
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <input
                          type="text"
                          value={editForm.userName}
                          onChange={(e) => setEditForm({...editForm, userName: e.target.value})}
                          style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600'
                          }}>
                            {user.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                              {user.userName}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7f8c8d' }}>
                          <Mail size={16} />
                          {user.email}
                        </div>
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
                        <select
                          value={editForm.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          fontWeight: '600',
                          background: user.role === 'admin' ? '#e74c3c' : user.role === 'moderator' ? '#f39c12' : '#3498db',
                          color: 'white'
                        }}>
                          {user.role || 'user'}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === user.id ? (
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
                            onClick={() => handleEdit(user)}
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button 
                            className="admin-btn admin-btn-danger"
                            onClick={() => handleDelete(user.id, user.email)}
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
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>User Statistics</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '20px', background: '#ebf5fb', borderRadius: '8px', textAlign: 'center' }}>
            <UserIcon size={32} style={{ color: '#3498db', marginBottom: '10px' }} />
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#3498db', marginBottom: '5px' }}>
              {users.length}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Total Users</div>
          </div>
          <div style={{ padding: '20px', background: '#eafaf1', borderRadius: '8px', textAlign: 'center' }}>
            <Mail size={32} style={{ color: '#27ae60', marginBottom: '10px' }} />
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#27ae60', marginBottom: '5px' }}>
              {users.length}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Verified Emails</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManager;
