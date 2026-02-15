import { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Save, X } from 'lucide-react';

function ContentManager() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({
    page_name: '',
    section_name: '',
    content_key: '',
    content_value: ''
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/content/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchContent();
        setEditingId(null);
        setEditForm({});
        alert('Content updated successfully!');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Failed to update content');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContent(prevContent => prevContent.filter(item => item.id !== id));
        alert('Content deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newContent)
      });

      if (response.ok) {
        await fetchContent();
        setShowAddForm(false);
        setNewContent({
          page_name: '',
          section_name: '',
          content_key: '',
          content_value: ''
        });
        alert('Content added successfully!');
      }
    } catch (error) {
      console.error('Error adding content:', error);
      alert('Failed to add content');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading content...</div>;
  }

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3><FileText size={20} /> Content Entries ({content.length})</h3>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={18} />
            Add New Content
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddContent} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0 }}>Add New Content</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div className="admin-form-group">
                <label>Page Name</label>
                <select
                  value={newContent.page_name}
                  onChange={(e) => setNewContent({...newContent, page_name: e.target.value})}
                  required
                >
                  <option value="">Select page</option>
                  <option value="global">global</option>
                  <option value="home">home</option>
                  <option value="about">about</option>
                  <option value="team">team</option>
                  <option value="contact">contact</option>
                  <option value="footer">footer</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Section Name</label>
                <select
                  value={newContent.section_name}
                  onChange={(e) => setNewContent({...newContent, section_name: e.target.value})}
                  required
                >
                  <option value="">Select section</option>
                  <option value="background">background</option>
                  <option value="hero">hero</option>
                  <option value="cards">cards</option>
                  <option value="users">users</option>
                  <option value="header">header</option>
                  <option value="members">members</option>
                  <option value="mission">mission</option>
                  <option value="vision">vision</option>
                  <option value="details">details</option>
                  <option value="social">social</option>
                  <option value="copyright">copyright</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Content Key</label>
                <select
                  value={newContent.content_key}
                  onChange={(e) => setNewContent({...newContent, content_key: e.target.value})}
                  required
                >
                  <option value="">Select key</option>
                  <option value="title">title</option>
                  <option value="fullText">fullText</option>
                  <option value="bgImage">bgImage</option>
                  <option value="bgVideo">bgVideo</option>
                  <option value="image1">image1</option>
                  <option value="image2">image2</option>
                  <option value="image3">image3</option>
                  <option value="list">list</option>
                  <option value="text">text</option>
                  <option value="address">address</option>
                  <option value="phone">phone</option>
                  <option value="email">email</option>
                  <option value="facebook">facebook</option>
                  <option value="twitter">twitter</option>
                  <option value="linkedin">linkedin</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label>Content Value</label>
              <textarea
                value={newContent.content_value}
                onChange={(e) => setNewContent({...newContent, content_value: e.target.value})}
                placeholder="Enter content value (can be text, URL, or JSON)"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="admin-btn admin-btn-success">
                <Save size={18} />
                Add Content
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
                <th>Page</th>
                <th>Section</th>
                <th>Key</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editForm.page_name}
                        onChange={(e) => setEditForm({...editForm, page_name: e.target.value})}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: '600', color: '#3498db' }}>{item.page_name}</span>
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editForm.section_name}
                        onChange={(e) => setEditForm({...editForm, section_name: e.target.value})}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    ) : (
                      item.section_name
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editForm.content_key}
                        onChange={(e) => setEditForm({...editForm, content_key: e.target.value})}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    ) : (
                      <code style={{ background: '#f8f9fa', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        {item.content_key}
                      </code>
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <textarea
                        value={editForm.content_value}
                        onChange={(e) => setEditForm({...editForm, content_value: e.target.value})}
                        style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                      />
                    ) : (
                      <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.content_value}
                      </div>
                    )}
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          className="admin-btn admin-btn-success"
                          onClick={handleSaveEdit}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          <Save size={14} />
                        </button>
                        <button 
                          className="admin-btn admin-btn-secondary"
                          onClick={handleCancelEdit}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          className="admin-btn admin-btn-primary"
                          onClick={() => handleEdit(item)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="admin-btn admin-btn-danger"
                          onClick={() => handleDelete(item.id)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          <Trash2 size={14} />
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
    </div>
  );
}

export default ContentManager;
