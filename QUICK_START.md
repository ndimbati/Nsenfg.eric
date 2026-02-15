# Quick Start Guide

## 🚀 Start the Backend Server

```bash
cd server
npm start
```

Server runs on: **http://localhost:5000**

---

## 🧪 Test the Backend

### Test Footer Content
```bash
curl http://localhost:5000/api/content/footer
```

### Test Team Content
```bash
curl http://localhost:5000/api/content/team
```

### Test Home Content
```bash
curl http://localhost:5000/api/content/home
```

---

## 🗄️ View Database Content

```bash
cd server

# Show statistics
node manage-db.js stats

# View all pages
node manage-db.js pages

# View content for a page
node manage-db.js content home
node manage-db.js content team
node manage-db.js content about
node manage-db.js content contact
node manage-db.js content footer

# View all users
node manage-db.js users
```

---

## ✏️ Modify Content

### Update Homepage Welcome Text
```bash
cd server
node manage-db.js update-content home hero fullText "YOUR NEW WELCOME MESSAGE"
```

### Update Footer Copyright
```bash
node manage-db.js update-content footer copyright text "© 2026 Your Name"
```

### Update Contact Email
```bash
node manage-db.js update-content contact details email "newemail@example.com"
```

### Update Contact Phone
```bash
node manage-db.js update-content contact details phone "+1234567890"
```

---

## 🔐 Test Authentication

### Register a User
```bash
curl -X POST http://localhost:5000/api/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

### View Registered Users
```bash
cd server
node manage-db.js users
```

---

## 📊 Database Management

### View Statistics
```bash
cd server
npm run db:stats
```

### View All Content
```bash
npm run db:content
```

### View All Pages
```bash
npm run db:pages
```

### View All Users
```bash
npm run db:users
```

---

## 🌐 Test in Browser

Open these URLs in your browser:
- http://localhost:5000/api/content/home
- http://localhost:5000/api/content/team
- http://localhost:5000/api/content/about
- http://localhost:5000/api/content/contact
- http://localhost:5000/api/content/footer

---

## 📚 Documentation

- [`BACKEND_SUMMARY.md`](BACKEND_SUMMARY.md) - Complete overview
- [`BACKEND_DOCUMENTATION.md`](BACKEND_DOCUMENTATION.md) - Detailed documentation
- [`server/README.md`](server/README.md) - Server documentation
- [`server/API_TESTING_GUIDE.md`](server/API_TESTING_GUIDE.md) - API testing guide

---

## ✅ What's Implemented

✅ **Authentication**
- User registration with database storage
- User login with JWT tokens
- Password hashing with bcrypt

✅ **Content Management**
- Home page content from database
- Team page content from database
- About page content from database
- Contact page content from database
- Footer content from database

✅ **Database Tools**
- CLI tool for database management
- NPM scripts for quick access
- View, add, update, delete operations

---

## 🎯 Common Tasks

### Change Homepage Background Image
```bash
cd server
node manage-db.js update-content home hero bgImage "https://your-new-image-url.com/image.jpg"
```

### Add New Team Member
```bash
# First view current team
node manage-db.js content team

# Update with new member (modify the JSON array)
node manage-db.js update-content team members list '[{"role":"Principal","name":"Mr. Eric M."},{"role":"Vice Principal","name":"Ms. Sarah K."},{"role":"New Role","name":"New Person"}]'
```

### Update About Page Mission
```bash
node manage-db.js update-content about mission text "Your new mission statement"
```

### Update Social Media Links
```bash
node manage-db.js update-content footer social facebook "https://facebook.com/yourpage"
node manage-db.js update-content footer social twitter "https://twitter.com/yourhandle"
node manage-db.js update-content footer social linkedin "https://linkedin.com/in/yourprofile"
```

---

## 🔧 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
# Kill any process using port 5000
# Then restart: npm start
```

### Database errors
```bash
# View database statistics
cd server
node manage-db.js stats

# If needed, reset database (WARNING: Deletes all data)
node manage-db.js reset confirm
```

### Can't see changes
```bash
# Restart the server
# Clear browser cache
# Check database content: node manage-db.js content home
```

---

## 🎉 Success!

Your backend is fully operational with:
- ✅ Authentication system
- ✅ Content management for all pages
- ✅ Database-driven rendering
- ✅ Easy content updates
- ✅ Comprehensive tools

**Everything is working perfectly!**
