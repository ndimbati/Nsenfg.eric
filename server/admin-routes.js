import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';

const router = express.Router();
const JWT_SECRET = 'your-secret-key';

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    const admin = rows[0];
    
    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username, isAdmin: true }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );
    
    res.json({ token, username: admin.username, isAdmin: true });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Logout
router.post('/logout', verifyAdminToken, (_, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Get all users
router.get('/users', verifyAdminToken, async (_, res) => {
  try {
    const [users] = await pool.query('SELECT id, userName, email, role FROM users');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user
router.put('/users/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { userName, email, password, role } = req.body;
  
  try {
    let query, params;
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET userName = ?, email = ?, password = ?, role = ? WHERE id = ?';
      params = [userName, email, hashedPassword, role, id];
    } else {
      query = 'UPDATE users SET userName = ?, email = ?, role = ? WHERE id = ?';
      params = [userName, email, role, id];
    }
    
    const [result] = await pool.query(query, params);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all content
router.get('/content', verifyAdminToken, async (_, res) => {
  try {
    const [content] = await pool.query('SELECT * FROM page_content ORDER BY page_name, section_name');
    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get content by page
router.get('/content/:pageName', verifyAdminToken, async (req, res) => {
  const { pageName } = req.params;
  
  try {
    const [content] = await pool.query('SELECT * FROM page_content WHERE page_name = ?', [pageName]);
    res.json(content);
  } catch (error) {
    console.error('Get content by page error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new content
router.post('/content', verifyAdminToken, async (req, res) => {
  const { page_name, section_name, content_key, content_value } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO page_content (page_name, section_name, content_key, content_value) VALUES (?, ?, ?, ?)',
      [page_name, section_name, content_key, content_value]
    );
    
    res.status(201).json({ 
      message: 'Content added successfully',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Content already exists' });
    } else {
      console.error('Add content error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Update content
router.put('/content/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { page_name, section_name, content_key, content_value } = req.body;
  
  try {
    const [result] = await pool.query(
      'UPDATE page_content SET page_name = ?, section_name = ?, content_key = ?, content_value = ? WHERE id = ?',
      [page_name, section_name, content_key, content_value, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Content updated successfully' });
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete content
router.delete('/content/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM page_content WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/stats', verifyAdminToken, async (_, res) => {
  try {
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [contentCount] = await pool.query('SELECT COUNT(*) as count FROM page_content');
    const [pageCount] = await pool.query('SELECT COUNT(DISTINCT page_name) as count FROM page_content');
    
    res.json({
      totalUsers: userCount[0].count,
      totalContent: contentCount[0].count,
      totalPages: pageCount[0].count
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all pages
router.get('/pages', verifyAdminToken, async (_, res) => {
  try {
    const [pages] = await pool.query('SELECT DISTINCT page_name FROM page_content ORDER BY page_name');
    res.json(pages.map(p => p.page_name));
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== LOGIN TABLE CRUD ====================

// Get all login records
router.get('/login', verifyAdminToken, async (_, res) => {
  try {
    const [logins] = await pool.query('SELECT * FROM login ORDER BY id ASC');
    res.json(logins);
  } catch (error) {
    console.error('Get logins error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single login record
router.get('/login/:id', verifyAdminToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM login WHERE id = ?', [req.params.id]);
    const login = rows[0];
    
    if (login) {
      res.json(login);
    } else {
      res.status(404).json({ error: 'Login record not found' });
    }
  } catch (error) {
    console.error('Get login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Insert new login record
router.post('/login', verifyAdminToken, async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO login (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    res.status(201).json({
      message: 'Login record created successfully',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Create login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Update login record
router.put('/login/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  
  try {
    let query, params;
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE login SET email = ?, password = ? WHERE id = ?';
      params = [email, hashedPassword, id];
    } else {
      query = 'UPDATE login SET email = ? WHERE id = ?';
      params = [email, id];
    }
    
    const [result] = await pool.query(query, params);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Login record updated successfully' });
    } else {
      res.status(404).json({ error: 'Login record not found' });
    }
  } catch (error) {
    console.error('Update login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete login record
router.delete('/login/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM login WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Login record deleted successfully' });
    } else {
      res.status(404).json({ error: 'Login record not found' });
    }
  } catch (error) {
    console.error('Delete login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get login counts
router.get('/table-stats', verifyAdminToken, async (_, res) => {
  try {
    const [loginCount] = await pool.query('SELECT COUNT(*) as count FROM login');
    
    res.json({
      totalLogins: loginCount[0].count
    });
  } catch (error) {
    console.error('Get table stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== TASKS TABLE CRUD ====================

// Get all tasks
router.get('/tasks', verifyAdminToken, async (_, res) => {
  try {
    const [tasks] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single task
router.get('/tasks/:id', verifyAdminToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    const task = rows[0];
    
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new task
router.post('/tasks', verifyAdminToken, async (req, res) => {
  const { title, description, priority, status, assigned_to, due_date } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, priority, status, assigned_to, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, priority || 'medium', status || 'pending', assigned_to, due_date]
    );
    
    res.status(201).json({
      message: 'Task created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/tasks/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, assigned_to, due_date } = req.body;
  
  try {
    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, assigned_to = ?, due_date = ? WHERE id = ?',
      [title, description, priority, status, assigned_to, due_date, id]
    );
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/tasks/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get task statistics
router.get('/task-stats', verifyAdminToken, async (_, res) => {
  try {
    const [totalTasks] = await pool.query('SELECT COUNT(*) as count FROM tasks');
    const [pendingTasks] = await pool.query("SELECT COUNT(*) as count FROM tasks WHERE status = 'pending'");
    const [inProgressTasks] = await pool.query("SELECT COUNT(*) as count FROM tasks WHERE status = 'in_progress'");
    const [completedTasks] = await pool.query("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed'");
    
    res.json({
      total: totalTasks[0].count,
      pending: pendingTasks[0].count,
      inProgress: inProgressTasks[0].count,
      completed: completedTasks[0].count
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ADMIN MANAGEMENT ====================

// Get all admins
router.get('/admins', verifyAdminToken, async (_, res) => {
  try {
    const [admins] = await pool.query('SELECT id, username, email, created_at FROM admins');
    res.json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new admin
router.post('/admins', verifyAdminToken, async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({
      message: 'Admin created successfully',
      id: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Create admin error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Update admin
router.put('/admins/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  
  try {
    let query, params;
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE admins SET username = ?, email = ?, password = ? WHERE id = ?';
      params = [username, email, hashedPassword, id];
    } else {
      query = 'UPDATE admins SET username = ?, email = ? WHERE id = ?';
      params = [username, email, id];
    }
    
    const [result] = await pool.query(query, params);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Admin updated successfully' });
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete admin
router.delete('/admins/:id', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM admins WHERE id = ?', [id]);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Admin deleted successfully' });
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
