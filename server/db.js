import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// MySQL connection pool configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // Change this to your MySQL username
  password: '',        // Change this to your MySQL password
  database: 'garden_tss',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create database if not exists
async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Change this to your MySQL username
    password: ''       // Change this to your MySQL password
  });
  
  await connection.query('CREATE DATABASE IF NOT EXISTS garden_tss');
  await connection.end();
  console.log('✅ Database garden_tss ensured');
}

// Create all tables
async function createTables() {
  const connection = await pool.getConnection();
  
  try {
    await connection.query(`
      -- Users table for authentication
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      -- Admins table
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      -- Page content table
      CREATE TABLE IF NOT EXISTS page_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_name VARCHAR(255) NOT NULL,
        section_name VARCHAR(255) NOT NULL,
        content_key VARCHAR(255) NOT NULL,
        content_value TEXT NOT NULL,
        UNIQUE KEY unique_content (page_name, section_name, content_key)
      )
    `);

    await connection.query(`
      -- Login table for admin management
      CREATE TABLE IF NOT EXISTS login (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      -- Tasks table for task management
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
        assigned_to VARCHAR(255),
        due_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All tables created successfully');
  } finally {
    connection.release();
  }
}

// Seed default admin if empty
async function seedAdmin() {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM admins');
  
  if (rows[0].count === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
      ['Admin', 'admin@gardentss.edu.zm', hashedPassword]
    );
    console.log('✅ Default admin created: admin@gardentss.edu.zm / admin123');
  }
}

// Seed initial content if empty
async function seedContent() {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM page_content');
  
  if (rows[0].count === 0) {
    const seedData = [
      // Home Page
      ['home', 'hero', 'fullText', 'WELCOME TO THE GARDEN TSS TO GET THE BEST TECHNICAL EDUCATIONAL EXPERIENCE AND ACADEMIC INNOVATION BECAUSE WE ARE THE BEST FOR CAREER DEVELOPMENT AND FUTURE SUCCESS'],
      ['home', 'hero', 'bgImage', 'https://media.istockphoto.com/id/1830042746/photo/document-management-system-dms-with-arrange-folder-and-files-icons-man-setup-storage-backup.jpg?s=612x612&w=0&k=20&c=t8oAAO16j6fMhleAYJEXm5pSXFIDZrEG6sYJkv_Sdos='],
      ['home', 'users', 'list', JSON.stringify(['NSENGIYUMVA Eric', 'HAKIZIMANA Aimable', 'CYUZUZO J.Bosco'])],
      ['home', 'cards', 'image1', 'https://scontent.fnbo18-1.fna.fbcdn.net/v/t39.30808-6/577017538_122203495460430213_338196711157474203_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_9QDa13EM2gQ7kNvwGl21ht&_nc_oc=AdmxJKtHk1VSSq-bmtbX14qO5CqQRVaxIMlnXgEZKNO8E6XMUh8mbpnZZ8X20HIMHZw&_nc_zt=23&_nc_ht=scontent.fnbo18-1.fna&_nc_gid=zwUam4vHrDO1Rug8pyK-Rw&oh=00_AfsY_0eFVZKbuewuSJciF6Vqjh5jiElZvxhQ4T6UjMTv7g&oe=698B4FDA'],
      ['home', 'cards', 'image2', '\\IMAGES\\ccccc.png'],
      
      // Team Page
      ['team', 'header', 'title', 'Our Team'],
      ['team', 'members', 'list', JSON.stringify([
        { role: 'Principal', name: 'Mr. Eric M.' },
        { role: 'Vice Principal', name: 'Ms. Sarah K.' },
        { role: 'Head of Technical Dept', name: 'Mr. John D.' },
        { role: 'Head of Science Dept', name: 'Mrs. Jane S.' }
      ])],
      
      // About Page
      ['about', 'header', 'title', 'About GARDEN TSS'],
      ['about', 'mission', 'text', 'To provide high-quality technical and vocational education that equips students with practical skills and ethical values.'],
      ['about', 'vision', 'text', 'To be a center of excellence in technical education, producing innovative leaders who contribute to national development.'],
      
      // Contact Page
      ['contact', 'header', 'title', 'Contact Us'],
      ['contact', 'details', 'address', '123 Garden Avenue, Tech City'],
      ['contact', 'details', 'phone', '+260 977 123456'],
      ['contact', 'details', 'email', 'info@gardentss.edu.zm'],
      
      // Footer
      ['footer', 'social', 'facebook', 'https://facebook.com'],
      ['footer', 'social', 'twitter', 'https://twitter.com'],
      ['footer', 'social', 'linkedin', 'https://linkedin.com'],
      ['footer', 'copyright', 'text', '© 2026 NSENGIYUMVA Eric'],
      
      // Not Found Page
      ['notfound', 'header', 'title', '404 - Page Not Found'],
      ['notfound', 'message', 'text', 'Sorry, the page you are looking for does not exist.'],
      ['notfound', 'link', 'text', 'Go back to Home']
    ];

    for (const row of seedData) {
      await pool.query(
        'INSERT INTO page_content (page_name, section_name, content_key, content_value) VALUES (?, ?, ?, ?)',
        row
      );
    }
    console.log('✅ Initial content seeded');
  }
}

// Initialize database
async function initializeDatabase() {
  try {
    await createDatabase();
    await createTables();
    await seedAdmin();
    await seedContent();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

// Export pool and initialization function
export default pool;
export { initializeDatabase };
