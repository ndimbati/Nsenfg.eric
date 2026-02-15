import Database from 'better-sqlite3';
import fs from 'fs';
const db = new Database('garden_tss.sqlite');

// MySQL compatible schema
let sql = `
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  confirmpassword VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE page_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_name VARCHAR(255) NOT NULL,
  section_name VARCHAR(255) NOT NULL,
  content_key VARCHAR(255) NOT NULL,
  content_value TEXT NOT NULL,
  UNIQUE(page_name, section_name, content_key)
);
`;

// Dump data
const tables = ['users', 'login', 'admins', 'page_content'];
for (const table of tables) {
  const rows = db.prepare(`SELECT * FROM ${table}`).all();
  if (rows.length > 0) {
    const columns = Object.keys(rows[0]).join(', ');
    sql += `INSERT INTO ${table} (${columns}) VALUES\n`;
    const values = rows.map(row => '(' + Object.values(row).map(v => typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v).join(', ') + ')').join(',\n');
    sql += values + ';\n';
  }
}

fs.writeFileSync('export.sql', sql);
console.log('Exported to export.sql');
