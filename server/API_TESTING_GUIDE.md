# API Testing Guide

## Quick Start

The server is running on `http://localhost:5000`

---

## Test Authentication Endpoints

### 1. Test User Registration

**Endpoint:** `POST /api/register`

**Test with cURL:**
```bash
curl -X POST http://localhost:5000/api/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"Eric Test\",\"email\":\"eric@test.com\",\"password\":\"test123\"}"
```

**Expected Response:**
```json
{
  "message": "User registered successfully"
}
```

**Test Duplicate Email:**
```bash
curl -X POST http://localhost:5000/api/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"Another User\",\"email\":\"eric@test.com\",\"password\":\"test456\"}"
```

**Expected Response:**
```json
{
  "error": "Email already exists"
}
```

---

### 2. Test User Login

**Endpoint:** `POST /api/login`

**Test with cURL:**
```bash
curl -X POST http://localhost:5000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"eric@test.com\",\"password\":\"test123\"}"
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "Eric Test"
}
```

**Test Invalid Credentials:**
```bash
curl -X POST http://localhost:5000/api/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"eric@test.com\",\"password\":\"wrongpassword\"}"
```

**Expected Response:**
```json
{
  "error": "Invalid credentials"
}
```

---

## Test Content Endpoints

### 3. Test Home Page Content

**Endpoint:** `GET /api/content/home`

**Test with cURL:**
```bash
curl http://localhost:5000/api/content/home
```

**Expected Response:**
```json
{
  "hero": {
    "fullText": "WELCOME TO THE GARDEN TSS TO GET THE BEST TECHNICAL EDUCATIONAL EXPERIENCE...",
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

---

### 4. Test Team Page Content

**Endpoint:** `GET /api/content/team`

**Test with cURL:**
```bash
curl http://localhost:5000/api/content/team
```

**Expected Response:**
```json
{
  "header": {
    "title": "Our Team"
  },
  "members": {
    "list": [
      { "role": "Principal", "name": "Mr. Eric M." },
      { "role": "Vice Principal", "name": "Ms. Sarah K." },
      { "role": "Head of Technical Dept", "name": "Mr. John D." },
      { "role": "Head of Science Dept", "name": "Mrs. Jane S." }
    ]
  }
}
```

---

### 5. Test About Page Content

**Endpoint:** `GET /api/content/about`

**Test with cURL:**
```bash
curl http://localhost:5000/api/content/about
```

**Expected Response:**
```json
{
  "header": {
    "title": "About GARDEN TSS"
  },
  "mission": {
    "text": "To provide high-quality technical and vocational education..."
  },
  "vision": {
    "text": "To be a center of excellence in technical education..."
  }
}
```

---

### 6. Test Contact Page Content

**Endpoint:** `GET /api/content/contact`

**Test with cURL:**
```bash
curl http://localhost:5000/api/content/contact
```

**Expected Response:**
```json
{
  "header": {
    "title": "Contact Us"
  },
  "details": {
    "address": "123 Garden Avenue, Tech City",
    "phone": "+260 977 123456",
    "email": "info@gardentss.edu.zm"
  }
}
```

---

### 7. Test Footer Content

**Endpoint:** `GET /api/content/footer`

**Test with cURL:**
```bash
curl http://localhost:5000/api/content/footer
```

**Expected Response:**
```json
{
  "social": {
    "facebook": "https://facebook.com",
    "twitter": "https://twitter.com",
    "linkedin": "https://linkedin.com"
  },
  "copyright": {
    "text": "© 2026 NSENGIYUMVA Eric"
  }
}
```

---

### 8. Test Invalid Page

**Endpoint:** `GET /api/content/invalid`

**Test with cURL:**
```bash
curl http://localhost:5000/api/content/invalid
```

**Expected Response:**
```json
{
  "error": "Page not found"
}
```

---

## Testing with Browser

### Using Browser Console

Open your browser console (F12) and run:

```javascript
// Test Registration
fetch('http://localhost:5000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'Browser Test',
    email: 'browser@test.com',
    password: 'test123'
  })
})
.then(res => res.json())
.then(data => console.log('Register:', data));

// Test Login
fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'browser@test.com',
    password: 'test123'
  })
})
.then(res => res.json())
.then(data => console.log('Login:', data));

// Test Home Content
fetch('http://localhost:5000/api/content/home')
.then(res => res.json())
.then(data => console.log('Home:', data));
```

### Direct Browser Access

You can also visit these URLs directly in your browser:
- http://localhost:5000/api/content/home
- http://localhost:5000/api/content/team
- http://localhost:5000/api/content/about
- http://localhost:5000/api/content/contact
- http://localhost:5000/api/content/footer

---

## Testing with Postman

### Import Collection

Create a new Postman collection with these requests:

1. **Register User**
   - Method: POST
   - URL: `http://localhost:5000/api/register`
   - Body (JSON):
     ```json
     {
       "username": "Postman Test",
       "email": "postman@test.com",
       "password": "test123"
     }
     ```

2. **Login User**
   - Method: POST
   - URL: `http://localhost:5000/api/login`
   - Body (JSON):
     ```json
     {
       "email": "postman@test.com",
       "password": "test123"
     }
     ```

3. **Get Home Content**
   - Method: GET
   - URL: `http://localhost:5000/api/content/home`

4. **Get Team Content**
   - Method: GET
   - URL: `http://localhost:5000/api/content/team`

5. **Get About Content**
   - Method: GET
   - URL: `http://localhost:5000/api/content/about`

6. **Get Contact Content**
   - Method: GET
   - URL: `http://localhost:5000/api/content/contact`

7. **Get Footer Content**
   - Method: GET
   - URL: `http://localhost:5000/api/content/footer`

---

## Database Verification

### Check Users Table

```bash
cd server
sqlite3 database.sqlite "SELECT * FROM users;"
```

### Check Page Content Table

```bash
sqlite3 database.sqlite "SELECT * FROM page_content WHERE page_name='home';"
```

### View All Tables

```bash
sqlite3 database.sqlite ".tables"
```

### View Table Schema

```bash
sqlite3 database.sqlite ".schema users"
sqlite3 database.sqlite ".schema page_content"
```

---

## Integration Testing

### Full User Flow Test

1. **Register a new user**
2. **Login with credentials**
3. **Use token to access protected routes** (if implemented)
4. **Fetch all page content**

### Content Management Test

1. **Fetch home page content**
2. **Verify all sections are present**
3. **Check JSON parsing for arrays**
4. **Verify image URLs are correct**

---

## Common Issues

### CORS Errors
- Ensure server is running
- Check CORS is enabled in server
- Verify frontend URL matches

### Database Locked
- Close any SQLite browser tools
- Restart server

### Port Already in Use
- Change PORT in server/index.js
- Or kill process using port 5000

---

## Success Criteria

✅ Registration stores user in database  
✅ Login returns JWT token  
✅ All pages return content from database  
✅ Footer content is database-driven  
✅ JSON arrays are properly parsed  
✅ Error handling works correctly  

---

## Next Steps

After testing, you can:
1. Customize content in database
2. Add more pages
3. Implement admin panel
4. Add image upload functionality
5. Create content management UI
