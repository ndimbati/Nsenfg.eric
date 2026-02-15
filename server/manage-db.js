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

// Helper function to display results in a formatted way
function displayResults(title, results) {
  console.log('\n' + '='.repeat(60));
  console.log(title);
  console.log('='.repeat(60));
  if (Array.isArray(results)) {
    if (results.length === 0) {
      console.log('No results found.');
    } else {
      console.table(results);
    }
  } else {
    console.log(results);
  }
  console.log('='.repeat(60) + '\n');
}

// Get command line arguments
const command = process.argv[2];
const args = process.argv.slice(3);

async function runCommand() {
  try {
    switch (command) {
      case 'users':
        // Display all users (without passwords)
        const [users] = await pool.query('SELECT id, userName, email FROM users');
        displayResults('ALL USERS', users);
        break;

      case 'content':
        // Display content for a specific page
        const pageName = args[0];
        if (!pageName) {
          console.log('Usage: node manage-db.js content <page_name>');
          console.log('Example: node manage-db.js content home');
          break;
        }
        const [content] = await pool.query('SELECT * FROM page_content WHERE page_name = ?', [pageName]);
        displayResults(`CONTENT FOR PAGE: ${pageName.toUpperCase()}`, content);
        break;

      case 'all-content':
        // Display all content
        const [allContent] = await pool.query('SELECT * FROM page_content ORDER BY page_name, section_name');
        displayResults('ALL PAGE CONTENT', allContent);
        break;

      case 'pages':
        // List all available pages
        const [pages] = await pool.query('SELECT DISTINCT page_name FROM page_content');
        displayResults('AVAILABLE PAGES', pages);
        break;

      case 'add-content':
        // Add new content
        if (args.length < 4) {
          console.log('Usage: node manage-db.js add-content <page_name> <section_name> <content_key> <content_value>');
          console.log('Example: node manage-db.js add-content home hero subtitle "Excellence in Education"');
          break;
        }
        try {
          const [result] = await pool.query(
            'INSERT INTO page_content (page_name, section_name, content_key, content_value) VALUES (?, ?, ?, ?)',
            [args[0], args[1], args[2], args[3]]
          );
          console.log('✅ Content added successfully!');
          
          // Show the added content
          const [added] = await pool.query(
            'SELECT * FROM page_content WHERE page_name = ? AND section_name = ? AND content_key = ?',
            [args[0], args[1], args[2]]
          );
          displayResults('ADDED CONTENT', added);
        } catch (error) {
          console.error('❌ Error adding content:', error.message);
        }
        break;

      case 'update-content':
        // Update existing content
        if (args.length < 4) {
          console.log('Usage: node manage-db.js update-content <page_name> <section_name> <content_key> <new_value>');
          console.log('Example: node manage-db.js update-content home hero title "New Title"');
          break;
        }
        try {
          const [result] = await pool.query(
            'UPDATE page_content SET content_value = ? WHERE page_name = ? AND section_name = ? AND content_key = ?',
            [args[3], args[0], args[1], args[2]]
          );
          
          if (result.affectedRows > 0) {
            console.log('✅ Content updated successfully!');
            
            // Show the updated content
            const [updated] = await pool.query(
              'SELECT * FROM page_content WHERE page_name = ? AND section_name = ? AND content_key = ?',
              [args[0], args[1], args[2]]
            );
            displayResults('UPDATED CONTENT', updated);
          } else {
            console.log('❌ No content found to update. Check your parameters.');
          }
        } catch (error) {
          console.error('❌ Error updating content:', error.message);
        }
        break;

      case 'delete-content':
        // Delete content
        if (args.length < 3) {
          console.log('Usage: node manage-db.js delete-content <page_name> <section_name> <content_key>');
          console.log('Example: node manage-db.js delete-content home hero subtitle');
          break;
        }
        try {
          // Show what will be deleted
          const [toDelete] = await pool.query(
            'SELECT * FROM page_content WHERE page_name = ? AND section_name = ? AND content_key = ?',
            [args[0], args[1], args[2]]
          );
          
          if (toDelete.length > 0) {
            displayResults('CONTENT TO BE DELETED', toDelete);
            
            await pool.query(
              'DELETE FROM page_content WHERE page_name = ? AND section_name = ? AND content_key = ?',
              [args[0], args[1], args[2]]
            );
            console.log('✅ Content deleted successfully!');
          } else {
            console.log('❌ No content found to delete.');
          }
        } catch (error) {
          console.error('❌ Error deleting content:', error.message);
        }
        break;

      case 'delete-user':
        // Delete user by email
        if (args.length < 1) {
          console.log('Usage: node manage-db.js delete-user <email>');
          console.log('Example: node manage-db.js delete-user test@example.com');
          break;
        }
        try {
          const [toDelete] = await pool.query(
            'SELECT id, userName, email FROM users WHERE email = ?',
            [args[0]]
          );
          
          if (toDelete.length > 0) {
            displayResults('USER TO BE DELETED', toDelete);
            
            await pool.query('DELETE FROM users WHERE email = ?', [args[0]]);
            console.log('✅ User deleted successfully!');
          } else {
            console.log('❌ No user found with that email.');
          }
        } catch (error) {
          console.error('❌ Error deleting user:', error.message);
        }
        break;

      case 'reset':
        // Reset database (delete all data but keep tables)
        console.log('⚠️  WARNING: This will delete ALL data from the database!');
        console.log('Tables will be kept but all content will be removed.');
        console.log('To proceed, run: node manage-db.js reset confirm');
        
        if (args[0] === 'confirm') {
          try {
            await pool.query('DELETE FROM users');
            await pool.query('DELETE FROM page_content');
            await pool.query('DELETE FROM login');
            console.log('✅ Database reset successfully!');
            console.log('Run the server to re-seed initial data.');
          } catch (error) {
            console.error('❌ Error resetting database:', error.message);
          }
        }
        break;

      case 'stats':
        // Show database statistics
        const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
        const [contentCount] = await pool.query('SELECT COUNT(*) as count FROM page_content');
        const [pageCount] = await pool.query('SELECT COUNT(DISTINCT page_name) as count FROM page_content');
        const [loginCount] = await pool.query('SELECT COUNT(*) as count FROM login');
        
        console.log('\n' + '='.repeat(60));
        console.log('DATABASE STATISTICS');
        console.log('='.repeat(60));
        console.log(`Total Users: ${userCount[0].count}`);
        console.log(`Total Content Entries: ${contentCount[0].count}`);
        console.log(`Total Pages: ${pageCount[0].count}`);
        console.log(`Total Login Records: ${loginCount[0].count}`);
        console.log('='.repeat(60) + '\n');
        break;

      case 'tables':
        // Show all tables
        const [tables] = await pool.query('SHOW TABLES');
        displayResults('DATABASE TABLES', tables);
        break;

      case 'help':
      default:
        console.log('\n' + '='.repeat(60));
        console.log('DATABASE MANAGEMENT TOOL');
        console.log('='.repeat(60));
        console.log('\nAvailable Commands:\n');
        console.log('  users                    - List all users');
        console.log('  content <page>           - Show content for a specific page');
        console.log('  all-content              - Show all content');
        console.log('  pages                    - List all available pages');
        console.log('  stats                    - Show database statistics');
        console.log('  tables                   - Show all database tables');
        console.log('\n  add-content <page> <section> <key> <value>');
        console.log('                           - Add new content');
        console.log('\n  update-content <page> <section> <key> <value>');
        console.log('                           - Update existing content');
        console.log('\n  delete-content <page> <section> <key>');
        console.log('                           - Delete content');
        console.log('\n  delete-user <email>      - Delete user by email');
        console.log('  reset confirm            - Reset database (delete all data)');
        console.log('  help                     - Show this help message');
        console.log('\nExamples:\n');
        console.log('  node manage-db.js users');
        console.log('  node manage-db.js content home');
        console.log('  node manage-db.js add-content home hero subtitle "Excellence"');
        console.log('  node manage-db.js update-content home hero title "New Title"');
        console.log('  node manage-db.js delete-user test@example.com');
        console.log('='.repeat(60) + '\n');
        break;
    }
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await pool.end();
  }
}

runCommand();
