import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // Change this to your MySQL username
  password: '',        // Change this to your MySQL password
  database: 'garden_tss',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function checkTables() {
  try {
    console.log('=== Database Tables ===\n');

    // Get all tables
    const [tables] = await pool.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('No tables found in database garden_tss');
      console.log('Run the server to create tables: node index.js');
    } else {
      const tableNames = tables.map(t => Object.values(t)[0]);
      console.log('Tables:', tableNames);

      console.log('\n=== Table Structures ===\n');

      for (const tableName of tableNames) {
        console.log(`\n${tableName}:`);
        const [columns] = await pool.query(`DESCRIBE ${tableName}`);
        columns.forEach(col => {
          const keyInfo = col.Key === 'PRI' ? ' [PRIMARY KEY]' : col.Key === 'UNI' ? ' [UNIQUE]' : col.Key === 'MUL' ? ' [FOREIGN KEY]' : '';
          console.log(`  - ${col.Field} (${col.Type})${keyInfo} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
        
        // Show row count
        const [countResult] = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`  Rows: ${countResult[0].count}`);
      }
    }
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\nDatabase garden_tss does not exist.');
      console.log('Run the server to create it: node index.js');
    }
  } finally {
    await pool.end();
  }
}

checkTables();
