import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool, { initializeDatabase } from './db.js';
import adminRoutes from './admin-routes.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key'; // In a real app, use environment variables

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (_, res) => {
  res.json({ message: 'Garden TSS API is running', status: 'ok' });
});

// Admin routes
app.use('/api/admin', adminRoutes);

// Auth Endpoints
app.post('/api/register', async (req, res) => {
  const { userName, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
      [userName, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Record login in login table
    try {
      await pool.query(
        'INSERT INTO login (email, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
        [email, user.password]
      );
    } catch (loginError) {
      console.error('Failed to record login:', loginError);
    }
    
    const token = jwt.sign(
      { id: user.id, userName: user.userName, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, userName: user.userName, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search endpoint
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json([]);
  }
  
  try {
    const searchTerm = `%${q}%`;
    const [rows] = await pool.query(
      `SELECT page_name, section_name, content_key, content_value 
       FROM page_content 
       WHERE content_value LIKE ? OR content_key LIKE ? OR page_name LIKE ?
       ORDER BY page_name, section_name`,
      [searchTerm, searchTerm, searchTerm]
    );
    
    const results = rows.map(row => {
      let value = row.content_value;
      try {
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          value = JSON.parse(value);
        }
      } catch (e) {}
      return { ...row, content_value: value };
    });
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Content Endpoints
app.get('/api/content/:pageName', async (req, res) => {
  const { pageName } = req.params;
  
  try {
    const [rows] = await pool.query(
      'SELECT section_name, content_key, content_value FROM page_content WHERE page_name = ?',
      [pageName]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Group content by section
    const content = {};
    rows.forEach(row => {
      if (!content[row.section_name]) {
        content[row.section_name] = {};
      }
      
      let val = row.content_value;
      try {
        // Try to parse JSON if it looks like JSON
        if (val.startsWith('[') || val.startsWith('{')) {
          val = JSON.parse(val);
        }
      } catch (e) {
        // Not JSON, keep as string
      }
      
      content[row.section_name][row.content_key] = val;
    });
    
    res.json(content);
  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
