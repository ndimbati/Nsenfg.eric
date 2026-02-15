import { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Edit, Trash2, Save, X, Calendar, 
  Flag, User, Clock, Filter, Search, ChevronDown, ChevronUp
} from 'lucide-react';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assigned_to: '',
    due_date: ''
  });

  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        // If tasks endpoint doesn't exist yet, use empty array
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskForm)
      });

      if (response.ok) {
        await fetchTasks();
        setShowAddForm(false);
        setTaskForm({
          title: '',
          description: '',
          priority: 'medium',
          status: 'pending',
          assigned_to: '',
          due_date: ''
        });
        alert('Task added successfully!');
      } else {
        alert('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  const handleEditTask = (task) => {
    setEditingId(task.id);
    setEditForm(task);
  };

  const handleSaveTask = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/tasks/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchTasks();
        setEditingId(null);
        setEditForm({});
        alert('Task updated successfully!');
      } else {
        alert('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchTasks();
        alert('Task deleted successfully!');
      } else {
        alert('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...task, status: newStatus })
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'in_progress': return '#3498db';
      case 'pending': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  if (loading) {
    return <div className="admin-loading">Loading tasks...</div>;
  }

  return (
    <div>
      {/* Task Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>Total Tasks</p>
          <h2 style={{ margin: '5px 0 0', fontSize: '24px' }}>{taskStats.total}</h2>
        </div>
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, #f39c12 0%, #e74c3c 100%)', color: 'white' }}>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>Pending</p>
          <h2 style={{ margin: '5px 0 0', fontSize: '24px' }}>{taskStats.pending}</h2>
        </div>
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', color: 'white' }}>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>In Progress</p>
          <h2 style={{ margin: '5px 0 0', fontSize: '24px' }}>{taskStats.in_progress}</h2>
        </div>
        <div className="admin-card" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', color: 'white' }}>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>Completed</p>
          <h2 style={{ margin: '5px 0 0', fontSize: '24px' }}>{taskStats.completed}</h2>
        </div>
      </div>

      {/* Task List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckSquare size={20} />
            Task Manager
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#95a5a6' }} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '35px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button 
              className="admin-btn admin-btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddTask} style={{ margin: '20px 0', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Add New Task</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div className="admin-form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Assigned To</label>
                <input
                  type="text"
                  value={taskForm.assigned_to}
                  onChange={(e) => setTaskForm({...taskForm, assigned_to: e.target.value})}
                  placeholder="Enter assignee name"
                />
              </div>
              <div className="admin-form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                />
              </div>
            </div>
            <div className="admin-form-group" style={{ marginTop: '15px' }}>
              <label>Description</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                placeholder="Enter task description"
                style={{ minHeight: '80px' }}
              />
            </div>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="admin-btn admin-btn-success" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Save size={16} />
                Save Task
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
            <CheckSquare size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
            <p>No tasks found. Click "Add Task" to create one.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className="admin-card" 
                style={{ 
                  margin: 0,
                  borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                  opacity: task.status === 'completed' ? 0.7 : 1
                }}
              >
                {editingId === task.id ? (
                  <div style={{ padding: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      <div className="admin-form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Priority</label>
                        <select
                          value={editForm.priority}
                          onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Status</label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Assigned To</label>
                        <input
                          type="text"
                          value={editForm.assigned_to || ''}
                          onChange={(e) => setEditForm({...editForm, assigned_to: e.target.value})}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Due Date</label>
                        <input
                          type="date"
                          value={editForm.due_date || ''}
                          onChange={(e) => setEditForm({...editForm, due_date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="admin-form-group" style={{ marginTop: '10px' }}>
                      <label>Description</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        style={{ minHeight: '60px' }}
                      />
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                      <button className="admin-btn admin-btn-success" onClick={handleSaveTask} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Save size={16} />
                        Save
                      </button>
                      <button className="admin-btn admin-btn-secondary" onClick={() => setEditingId(null)}>
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', padding: '15px' }}>
                    <button
                      onClick={() => handleToggleStatus(task)}
                      style={{
                        background: 'none',
                        border: `2px solid ${getStatusColor(task.status)}`,
                        borderRadius: '4px',
                        width: '24px',
                        height: '24px',
                        marginRight: '15px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: task.status === 'completed' ? getStatusColor(task.status) : 'transparent'
                      }}
                    >
                      {task.status === 'completed' && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
                    </button>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p style={{ margin: '0 0 8px', color: '#7f8c8d', fontSize: '14px' }}>{task.description}</p>
                      )}
                      <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#95a5a6' }}>
                        {task.assigned_to && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={12} /> {task.assigned_to}
                          </span>
                        )}
                        {task.due_date && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                        <span style={{ 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          background: getStatusColor(task.status),
                          color: 'white',
                          fontSize: '10px',
                          textTransform: 'uppercase'
                        }}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        className="admin-btn admin-btn-secondary" 
                        onClick={() => handleEditTask(task)}
                        style={{ padding: '8px' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger" 
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ padding: '8px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManager;
