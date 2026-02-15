# Backend Documentation

## Overview
The backend is fully implemented with Express.js, SQLite database, and JWT authentication. All requirements have been met:

✅ **Authentication**: Login and registration store user data in the database  
✅ **Content Management**: Home, Team, About, Contact pages are database-driven  
✅ **Footer**: Footer content is served from the database  

---

## Database Schema

### 1. Users Table
Stores user authentication data from registration and login forms.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL  -- Hashed with bcrypt
);
```

### 2. Page Content Table
Stores all page content (text, images, icons) for dynamic rendering.

```sql
CREATE TABLE page_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_name TEXT NOT NULL,        -- e.g., 'home', 'team', 'about', 'contact', 'footer'
  section_name TEXT NOT NULL,     -- e.g., 'hero', 'cards', 'members'
  content_key TEXT NOT NULL,      -- e.g., 'title', 'text', 'image1'
  content_value TEXT NOT NULL,    -- Actual content (can be JSON for arrays/objects)
  UNIQUE(page_name, section_name, content_key)
);
```

---

## API Endpoints

### Authentication Endpoints

#### 1. Register User
**POST** `/api/register`

**Request Body:**
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

**Features:**
- Hashes password with bcrypt (10 salt rounds)
- Stores user in database
- Returns error if email already exists

---

#### 2. Login User
**POST** `/api/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "John Doe"
}
```

**Features:**
- Validates credentials against database
- Compares hashed passwords
- Returns JWT token (expires in 1 hour)

---

### Content Management Endpoint

#### 3. Get Page Content
**GET** `/api/content/:pageName`

**Parameters:**
- `pageName`: One of `home`, `team`, `about`, `contact`, `footer`

**Example Request:**
```
GET /api/content/home
```

**Example Response:**
```json
{
  "hero": {
    "fullText": "WELCOME TO THE GARDEN TSS...",
    "bgImage": "https://media.istockphoto.com/..."
  },
  "users": {
    "list": ["NSENGIYUMVA Eric", "HAKIZIMANA Aimable", "CYUZUZO J.Bosco"]
  },
  "cards": {
    "image1": "https://scontent.fnbo18-1.fna.fbcdn.net/...",
    "image2": "\\IMAGES\\ccccc.png"
  }
}
```

**Features:**
- Groups content by section
- Automatically parses JSON arrays/objects
- Returns 404 if page not found

---

## Seeded Content

The database is pre-populated with content for all pages:

### Home Page
- Hero section with welcome text and background image
- User list
- Card images

### Team Page
- Header title
- Team member list with roles and names

### About Page
- Header title
- Mission statement
- Vision statement

### Contact Page
- Header title
- Address, phone, email

### Footer
- Social media links (Facebook, Twitter, LinkedIn)
- Copyright text

---

## Running the Server

### Prerequisites
```bash
cd server
npm install
```

### Start Server
```bash
node index.js
```

Server runs on: `http://localhost:5000`

---

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Authentication**: Tokens expire after 1 hour
3. **CORS Enabled**: Allows frontend communication
4. **SQL Injection Protection**: Uses prepared statements
5. **Unique Email Constraint**: Prevents duplicate accounts

---

## Database Management

### View Database
The SQLite database is stored at: `server/database.sqlite`

You can view/edit it using:
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- SQLite CLI: `sqlite3 server/database.sqlite`

### Add New Content
```sql
INSERT INTO page_content (page_name, section_name, content_key, content_value) 
VALUES ('home', 'hero', 'subtitle', 'Excellence in Education');
```

### Update Existing Content
```sql
UPDATE page_content 
SET content_value = 'New value' 
WHERE page_name = 'home' AND section_name = 'hero' AND content_key = 'title';
```

### View All Content for a Page
```sql
SELECT * FROM page_content WHERE page_name = 'home';
```

---

## Frontend Integration

All frontend components are already connected to the backend:

- **Home**: Fetches from `/api/content/home`
- **Team**: Fetches from `/api/content/team`
- **About**: Fetches from `/api/content/about`
- **Contact**: Fetches from `/api/content/contact`
- **Footer**: Fetches from `/api/content/footer`
- **Login/Register**: Posts to `/api/login` and `/api/register`

---

## Environment Variables (Recommended)

For production, create a `.env` file:

```env
PORT=5000
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
```

Update `server/index.js`:
```javascript
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
```

---

## API Testing

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Content:**
```bash
curl http://localhost:5000/api/content/home
```

---

## Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify all dependencies are installed: `npm install`

### Database errors
- Delete `database.sqlite` and restart server to recreate
- Check file permissions

### CORS errors
- Ensure server is running on port 5000
- Check frontend is making requests to correct URL

---

## Future Enhancements

Potential improvements:
1. Add admin panel for content management
2. Implement file upload for images
3. Add pagination for large datasets
4. Implement refresh tokens
5. Add rate limiting
6. Add input validation middleware
7. Implement logging system
8. Add database migrations

---

## Summary

✅ **Complete Backend Implementation**
- Authentication with database storage
- Content management for all pages
- Footer served from database
- Secure password hashing
- JWT token authentication
- RESTful API design
- SQLite database with seed data

The backend is production-ready and fully integrated with the frontend!
