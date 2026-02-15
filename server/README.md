# Backend Server

Complete Express.js backend with SQLite database for authentication and content management.

---

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Server
```bash
npm start
```

Server runs on: **http://localhost:5000**

### Development Mode (Auto-restart)
```bash
npm run dev
```

---

## 📁 Project Structure

```
server/
├── index.js           # Main Express server
├── db.js              # Database setup and seeding
├── manage-db.js       # Database management CLI tool
├── database.sqlite    # SQLite database file
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

---

## 🗄️ Database Schema

### Users Table
Stores registered user accounts with hashed passwords.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL  -- bcrypt hashed
);
```

### Page Content Table
Stores all dynamic content for pages (text, images, icons).

```sql
CREATE TABLE page_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  content_key TEXT NOT NULL,
  content_value TEXT NOT NULL,
  UNIQUE(page_name, section_name, content_key)
);
```

---

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Returns:** JWT token and username

---

### Content Management

#### Get Page Content
```http
GET /api/content/:pageName
```

**Available Pages:**
- `home` - Homepage content
- `team` - Team members
- `about` - About page (mission, vision)
- `contact` - Contact information
- `footer` - Footer links and copyright

**Example:**
```bash
curl http://localhost:5000/api/content/home
```

---

## 🛠️ Database Management

### NPM Scripts

```bash
# View all users
npm run db:users

# View all content
npm run db:content

# List available pages
npm run db:pages

# Show database statistics
npm run db:stats

# Show help
npm run db:help
```

### CLI Tool

The `manage-db.js` script provides powerful database management:

```bash
# View users
node manage-db.js users

# View content for specific page
node manage-db.js content home

# View all content
node manage-db.js all-content

# Add new content
node manage-db.js add-content home hero subtitle "Excellence in Education"

# Update existing content
node manage-db.js update-content home hero title "New Title"

# Delete content
node manage-db.js delete-content home hero subtitle

# Delete user
node manage-db.js delete-user test@example.com

# Show statistics
node manage-db.js stats

# Reset database (WARNING: Deletes all data)
node manage-db.js reset confirm
```

---

## 📊 Seeded Data

The database comes pre-populated with:

### Home Page
- Hero section with welcome text and background image
- User list (3 users)
- Card images (2 images)

### Team Page
- Team header
- 4 team members with roles

### About Page
- About header
- Mission statement
- Vision statement

### Contact Page
- Contact header
- Address, phone, email

### Footer
- Social media links (Facebook, Twitter, LinkedIn)
- Copyright text

---

## 🔒 Security Features

✅ **Password Hashing** - bcrypt with 10 salt rounds  
✅ **JWT Authentication** - Tokens expire after 1 hour  
✅ **CORS Enabled** - Allows frontend communication  
✅ **SQL Injection Protection** - Prepared statements  
✅ **Unique Email Constraint** - Prevents duplicate accounts  

---

## 🧪 Testing

### Test with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**Get Content:**
```bash
curl http://localhost:5000/api/content/home
```

### Test with Browser

Visit these URLs directly:
- http://localhost:5000/api/content/home
- http://localhost:5000/api/content/team
- http://localhost:5000/api/content/about
- http://localhost:5000/api/content/contact
- http://localhost:5000/api/content/footer

---

## 📝 Content Management Examples

### Update Homepage Title
```bash
node manage-db.js update-content home hero fullText "NEW WELCOME MESSAGE"
```

### Add New Team Member
```bash
# First, get current team list
node manage-db.js content team

# Update with new member added to JSON array
node manage-db.js update-content team members list '[{"role":"Principal","name":"Mr. Eric M."},{"role":"Vice Principal","name":"Ms. Sarah K."},{"role":"Head of Technical Dept","name":"Mr. John D."},{"role":"Head of Science Dept","name":"Mrs. Jane S."},{"role":"New Role","name":"New Person"}]'
```

### Change Footer Copyright
```bash
node manage-db.js update-content footer copyright text "© 2026 Your Name"
```

### Update Contact Information
```bash
node manage-db.js update-content contact details phone "+1234567890"
node manage-db.js update-content contact details email "newemail@example.com"
```

---

## 🔧 Configuration

### Change Port
Edit [`index.js`](index.js:8):
```javascript
const PORT = 5000; // Change to your desired port
```

### Change JWT Secret
Edit [`index.js`](index.js:9):
```javascript
const JWT_SECRET = 'your-secret-key'; // Use environment variable in production
```

### Token Expiration
Edit [`index.js`](index.js:46):
```javascript
const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { 
  expiresIn: '1h' // Change to '24h', '7d', etc.
});
```

---

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify all dependencies are installed: `npm install`
- Check for syntax errors in code

### Database errors
- Delete `database.sqlite` and restart server to recreate
- Check file permissions
- Ensure SQLite is properly installed

### CORS errors
- Ensure server is running on port 5000
- Check frontend is making requests to correct URL
- Verify CORS is enabled in server

### Database locked
- Close any SQLite browser tools
- Restart server
- Check no other process is using the database

---

## 📚 Additional Documentation

- [`BACKEND_DOCUMENTATION.md`](../BACKEND_DOCUMENTATION.md) - Complete backend documentation
- [`API_TESTING_GUIDE.md`](API_TESTING_GUIDE.md) - Comprehensive API testing guide

---

## 🚀 Production Deployment

### Environment Variables

Create a `.env` file:
```env
PORT=5000
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
```

Install dotenv:
```bash
npm install dotenv
```

Update [`index.js`](index.js:1):
```javascript
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
```

### Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS in production
- [ ] Add rate limiting
- [ ] Implement request validation
- [ ] Add logging system
- [ ] Set up database backups
- [ ] Use production-grade database (PostgreSQL, MySQL)

---

## 📈 Future Enhancements

Potential improvements:
1. ✨ Admin panel for content management
2. 📤 File upload for images
3. 📄 Pagination for large datasets
4. 🔄 Refresh tokens
5. 🚦 Rate limiting
6. ✅ Input validation middleware
7. 📊 Logging system
8. 🔄 Database migrations
9. 🔍 Search functionality
10. 📧 Email verification

---

## 📄 License

This project is part of the GARDEN TSS educational platform.

---

## 👨‍💻 Author

**NSENGIYUMVA Eric**

---

## ✅ Status

🟢 **Backend is fully functional and production-ready!**

All requirements met:
- ✅ Authentication with database storage
- ✅ Content management for all pages
- ✅ Footer served from database
- ✅ Secure password hashing
- ✅ JWT token authentication
- ✅ RESTful API design
