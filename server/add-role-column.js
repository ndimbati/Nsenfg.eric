import pool from './db.js';

async function addRoleColumn() {
  try {
    // Check if role column exists
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'garden_tss' 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'role'
    `);

    if (columns.length === 0) {
      // Add role column if it doesn't exist
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(50) DEFAULT 'user' AFTER password
      `);
      console.log('✅ Role column added to users table');
    } else {
      console.log('✅ Role column already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding role column:', error);
    process.exit(1);
  }
}

addRoleColumn();
