# Database Management Guide

## 🗄️ Database Overview

This project uses **SQLite**, a lightweight, file-based database system. Unlike MySQL (which requires phpMyAdmin), SQLite stores everything in a single file that you can easily open and manage.

---

## 📁 Database File Location

**File**: `server/database.sqlite`
**Size**: 32,768 bytes (32 KB)

You can open this file with:
1. **DB Browser for SQLite** (recommended - free download)
2. **SQLite command-line tool**
3. **Built-in Admin Dashboard** (web-based - easiest!)

---

## 🔗 Database Tables

### 1. **users** - Website Users
Stores users who register through the website.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | User ID (auto-increment) |
| username | TEXT | User's name |
| email | TEXT | User's email (unique) |
| password | TEXT | Hashed password |

### 2. **admins** - Admin Accounts
Stores admin accounts for the dashboard.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Admin ID (auto-increment) |
| username | TEXT | Admin's name |
| email | TEXT | Admin's email (unique) |
| password | TEXT | Hashed password |
| created_at | DATETIME | Account creation time |

### 3. **page_content** - Website Content
Stores all website content (text, images, links).

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Content ID (auto-increment) |
| page_name | TEXT | Page name (home, team, about, etc.) |
| section_name | TEXT | Section (hero, cards, header, etc.) |
| content_key | TEXT | Content identifier (title, image, text, etc.) |
| content_value | TEXT | Actual content (text, URLs, or JSON) |

---

## 🎯 Easy Ways to View Database

### Option 1: Built-in Admin Dashboard (RECOMMENDED)

**No installation needed!**

1. Open browser: http://localhost:3000/admin/login
2. Login with:
   - Email: admin@gardentss.edu.zm
   - Password: admin123
3. Use the dashboard to:
   - View all users
   - Manage content
   - See statistics
   - Add/edit/delete content

✅ **Pros**: Easy, no installation, web-based
❌ **Cons**: Limited to admin features

---

### Option 2: DB Browser for SQLite (Like phpMyAdmin)

**Visual interface similar to phpMyAdmin**

1. Download: https://sqlitebrowser.org/
2. Install and open
3. Click "Open Database"
4. Select: `server/database.sqlite`
5. Browse tables and data!

**Features**:
- ✅ View all tables
- ✅ Browse data
- ✅ Run SQL queries
- ✅ Edit records
- ✅ Export data

✅ **Pros**: Visual interface, full control
❌ **Cons**: Requires installation

---

### Option 3: Command Line

**For developers who prefer terminal**

1. Install SQLite command-line tool:
   - Download: https://www.sqlite.org/download.html
   - Or use: `winget install SQLite.SQLite`

2. Open database:
   ```bash
   cd server
   sqlite3 database.sqlite
   ```

3. Run commands:
   ```sql
   -- List all tables
   .tables
   
   -- View all users
   SELECT * FROM users;
   
   -- View all content
   SELECT * FROM page_content;
   
   -- View admins
   SELECT * FROM admins;
   
   -- View schema
   .schema users
   
   -- Exit
   .exit
   ```

✅ **Pros**: Powerful, fast
❌ **Cons**: Learning curve

---

## 📊 Current Database Status

**Statistics (as of now)**:
- Total Users: 0 (no website users yet)
- Total Content: 18 entries
- Total Pages: 5 (home, team, about, contact, footer)
- Admin Accounts: 1 (default admin)

---

## 🔍 View Content by Page

### Home Page Content
```sql
SELECT * FROM page_content WHERE page_name = 'home';
```

**Current Content**:
- Hero text
- Background image
- User list (3 users)
- Card images (2 images)

### Team Page Content
```sql
SELECT * FROM page_content WHERE page_name = 'team';
```

**Current Content**:
- Team header: "Our Team"
- 4 team members with roles

### About Page Content
```sql
SELECT * FROM page_content WHERE page_name = 'about';
```

**Current Content**:
- About header: "About GARDEN TSS"
- Mission statement
- Vision statement

### Contact Page Content
```sql
SELECT * FROM page_content WHERE page_name = 'contact';
```

**Current Content**:
- Contact header: "Contact Us"
- Address
- Phone
- Email

### Footer Content
```sql
SELECT * FROM page_content WHERE page_name = 'footer';
```

**Current Content**:
- Social media links (Facebook, Twitter, LinkedIn)
- Copyright text

---

## 🛠️ Database Management Tools

### Built-in CLI Tools

We've created easy commands to manage the database:

```bash
cd server

# View statistics
node manage-db.js stats

# View all users
node manage-db.js users

# View all pages
node manage-db.js pages

# View content for a page
node manage-db.js content home
node manage-db.js content team
node manage-db.js content about
node manage-db.js content contact
node manage-db.js content footer

# View all content
node manage-db.js all-content

# Add new content
node manage-db.js add-content [page] [section] [key] [value]

# Update content
node manage-db.js update-content [page] [section] [key] [new-value]

# Delete content
node manage-db.js delete-content [page] [section] [key]

# Reset database (WARNING: Deletes all data!)
node manage-db.js reset confirm
```

---

## 📝 Example Commands

### View All Users
```bash
node manage-db.js users
```

### View Home Page Content
```bash
node manage-db.js content home
```

### Update Homepage Welcome Text
```bash
node manage-db.js update-content home hero fullText "YOUR NEW TEXT HERE"
```

### Change Footer Copyright
```bash
node manage-db.js update-content footer copyright text "© 2026 Your Name"
```

### Add New Team Member
```bash
# First get current list
node manage-db.js content team

# Then update with new JSON
node manage-db.js update-content team members list '[{"role":"Principal","name":"Mr. Eric M."},{"role":"New Role","name":"New Person"}]'
```

---

## 🎨 Database Structure Example

### Sample Home Page Content
```json
{
  "hero": {
    "fullText": "WELCOME TO THE GARDEN TSS...",
    "bgImage": "https://example.com/image.jpg"
  },
  "users": {
    "list": ["User 1", "User 2", "User 3"]
  },
  "cards": {
    "image1": "https://example.com/image1.jpg",
    "image2": "/IMAGES/image2.png"
  }
}
```

### Sample Team Content
```json
{
  "header": {
    "title": "Our Team"
  },
  "members": {
    "list": [
      {"role": "Principal", "name": "Mr. Eric M."},
      {"role": "Vice Principal", "name": "Ms. Sarah K."}
    ]
  }
}
```

---

## 🔐 Admin Account

**Default Admin**:
- Email: admin@gardentss.edu.zm
- Password: admin123
- Created: Automatically on first server run

**To create additional admins**, use the Admin Dashboard or database tools.

---

## 📈 Monitoring Users

When users register through the website, they appear in the `users` table. You can:

1. **View users**: `node manage-db.js users`
2. **In Admin Dashboard**: http://localhost:3000/admin/login
3. **In DB Browser**: Open the database file

---

## 💾 Database Maintenance

### Backup Database
Simply copy the file:
```bash
copy server/database.sqlite database-backup.sqlite
```

### Reset Database (WARNING!)
This deletes ALL data:
```bash
cd server
node manage-db.js reset confirm
```

### View Database Size
```bash
dir server\database.sqlite
```

---

## 🚀 Quick Start for Viewing Database

### For Beginners (Use Admin Dashboard)
1. Go to: http://localhost:3000/admin/login
2. Login: admin@gardentss.edu.zm / admin123
3. Use the web interface!

### For Intermediate Users (DB Browser)
1. Download DB Browser: https://sqlitebrowser.org/
2. Open: server/database.sqlite
3. Browse and manage!

### For Developers (Command Line)
1. Install SQLite CLI
2. Run: `sqlite3 server/database.sqlite`
3. Use SQL commands

---

## 🔗 Integration with Your Application

The database automatically works with:
- **Frontend**: React components fetch data
- **Backend**: Express API serves content
- **Admin Dashboard**: Web-based management

No configuration needed - everything is connected!

---

## 📚 Additional Resources

- **SQLite Tutorial**: https://www.sqlite.org/tutorial.html
- **DB Browser Guide**: https://github.com/sqlitebrowser/sqlitebrowser/wiki
- **SQL Commands**: https://www.w3schools.com/sql/

---

## ✅ Summary

**Database**: SQLite (file-based)
**Location**: `server/database.sqlite`
**Tables**: users, admins, page_content
**Easiest Access**: Admin Dashboard at http://localhost:3000/admin/login

**You have 3 ways to view/manage the database**:
1. 🌐 **Web Dashboard** (easiest) - http://localhost:3000/admin/login
2. 🖥️ **DB Browser** (visual) - Download from sqlitebrowser.org
3. 💻 **Command Line** (powerful) - Use sqlite3 command

All methods work perfectly with the running server!
