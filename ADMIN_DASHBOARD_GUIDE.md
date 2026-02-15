# Admin Dashboard Guide

## 🎯 Overview

The Admin Dashboard is a comprehensive content management system that allows administrators to manage all website content, users, and system settings through an intuitive web interface.

---

## 🔐 Access Credentials

### Default Admin Login
- **URL**: http://localhost:3000/admin/login
- **Email**: `admin@gardentss.edu.zm`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login in production!

---

## 📊 Dashboard Features

### 1. Dashboard Overview
- **Total Users**: View count of registered users
- **Content Entries**: Total number of content items
- **Total Pages**: Number of managed pages
- **System Status**: Real-time system health

### 2. Content Manager
Manage all website content including:
- Home page content (hero text, images, user lists)
- Team page content (member information)
- About page content (mission, vision)
- Contact page content (address, phone, email)
- Footer content (social links, copyright)

**Features**:
- ✅ View all content entries
- ✅ Add new content
- ✅ Edit existing content inline
- ✅ Delete content
- ✅ Search and filter

### 3. User Manager
Manage registered users:
- View all registered users
- See user details (username, email)
- Delete users
- View user statistics

---

## 🚀 Getting Started

### Step 1: Start the Backend Server
```bash
cd server
npm start
```
Server runs on: `http://localhost:5000`

### Step 2: Start the Frontend
```bash
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Step 3: Access Admin Dashboard
1. Navigate to: `http://localhost:3000/admin/login`
2. Enter credentials:
   - Email: `admin@gardentss.edu.zm`
   - Password: `admin123`
3. Click "Login to Dashboard"

---

## 📝 How to Use

### Managing Content

#### View All Content
1. Click "Content Manager" in the sidebar
2. Browse all content entries in the table
3. Content is organized by:
   - **Page Name**: home, team, about, contact, footer
   - **Section Name**: hero, cards, members, etc.
   - **Content Key**: title, text, image, etc.
   - **Content Value**: The actual content

#### Add New Content
1. Click "Add New Content" button
2. Fill in the form:
   - **Page Name**: e.g., `home`, `team`, `about`
   - **Section Name**: e.g., `hero`, `cards`, `members`
   - **Content Key**: e.g., `title`, `subtitle`, `image`
   - **Content Value**: The actual content (text, URL, or JSON)
3. Click "Add Content"

**Example - Adding a new hero subtitle**:
```
Page Name: home
Section Name: hero
Content Key: subtitle
Content Value: Excellence in Technical Education
```

#### Edit Content
1. Click the "Edit" button (pencil icon) on any content row
2. Modify the fields inline
3. Click "Save" (checkmark icon) to save changes
4. Click "Cancel" (X icon) to discard changes

#### Delete Content
1. Click the "Delete" button (trash icon) on any content row
2. Confirm the deletion
3. Content will be removed immediately

---

### Managing Users

#### View All Users
1. Click "User Manager" in the sidebar
2. See all registered users with:
   - User ID
   - Username
   - Email address

#### Delete a User
1. Find the user in the list
2. Click "Delete" button
3. Confirm the deletion
4. User will be removed from the database

---

## 🎨 Content Structure

### Home Page Content
```
page_name: home
├── hero
│   ├── fullText: "WELCOME TO THE GARDEN TSS..."
│   └── bgImage: "https://..."
├── users
│   └── list: ["User 1", "User 2", "User 3"]
└── cards
    ├── image1: "https://..."
    └── image2: "/IMAGES/..."
```

### Team Page Content
```
page_name: team
├── header
│   └── title: "Our Team"
└── members
    └── list: [
        {"role": "Principal", "name": "Mr. Eric M."},
        {"role": "Vice Principal", "name": "Ms. Sarah K."}
    ]
```

### About Page Content
```
page_name: about
├── header
│   └── title: "About GARDEN TSS"
├── mission
│   └── text: "To provide high-quality..."
└── vision
    └── text: "To be a center of excellence..."
```

### Contact Page Content
```
page_name: contact
├── header
│   └── title: "Contact Us"
└── details
    ├── address: "123 Garden Avenue, Tech City"
    ├── phone: "+260 977 123456"
    └── email: "info@gardentss.edu.zm"
```

### Footer Content
```
page_name: footer
├── social
│   ├── facebook: "https://facebook.com"
│   ├── twitter: "https://twitter.com"
│   └── linkedin: "https://linkedin.com"
└── copyright
    └── text: "© 2026 NSENGIYUMVA Eric"
```

---

## 🔧 Common Tasks

### Update Homepage Welcome Text
1. Go to Content Manager
2. Find: `page_name = home`, `section_name = hero`, `content_key = fullText`
3. Click Edit
4. Update the text
5. Click Save

### Change Footer Copyright
1. Go to Content Manager
2. Find: `page_name = footer`, `section_name = copyright`, `content_key = text`
3. Click Edit
4. Update the copyright text
5. Click Save

### Add New Team Member
1. Go to Content Manager
2. Find: `page_name = team`, `section_name = members`, `content_key = list`
3. Click Edit
4. Update the JSON array to include new member:
```json
[
  {"role": "Principal", "name": "Mr. Eric M."},
  {"role": "Vice Principal", "name": "Ms. Sarah K."},
  {"role": "New Role", "name": "New Person"}
]
```
5. Click Save

### Update Contact Information
1. Go to Content Manager
2. Find the contact details you want to update:
   - `page_name = contact`, `section_name = details`, `content_key = phone`
   - `page_name = contact`, `section_name = details`, `content_key = email`
   - `page_name = contact`, `section_name = details`, `content_key = address`
3. Click Edit on the desired field
4. Update the value
5. Click Save

### Change Social Media Links
1. Go to Content Manager
2. Find: `page_name = footer`, `section_name = social`
3. Edit the desired social media link:
   - `content_key = facebook`
   - `content_key = twitter`
   - `content_key = linkedin`
4. Update the URL
5. Click Save

---

## 🔒 Security Features

### Authentication
- JWT token-based authentication
- 8-hour session expiration
- Automatic logout on token expiry
- Protected admin routes

### Authorization
- All admin endpoints require valid admin token
- Token verification middleware
- Role-based access control

### Data Protection
- Password hashing with bcrypt
- SQL injection protection
- CORS configuration
- Input validation

---

## 📱 Responsive Design

The admin dashboard is fully responsive:
- **Desktop**: Full sidebar with labels
- **Tablet**: Compact sidebar with icons
- **Mobile**: Hidden sidebar, mobile-optimized layout

---

## 🎨 User Interface

### Color Scheme
- **Primary**: Blue (#3498db)
- **Success**: Green (#27ae60)
- **Danger**: Red (#e74c3c)
- **Secondary**: Gray (#95a5a6)

### Components
- **Sidebar Navigation**: Fixed left sidebar with menu items
- **Header**: Page title and description
- **Cards**: Content containers with shadows
- **Tables**: Responsive data tables
- **Forms**: Inline editing and modal forms
- **Buttons**: Icon + text buttons with hover effects

---

## 🐛 Troubleshooting

### Cannot Login
- Check server is running on port 5000
- Verify credentials: `admin@gardentss.edu.zm` / `admin123`
- Check browser console for errors
- Clear browser cache and cookies

### Content Not Updating
- Refresh the page
- Check server logs for errors
- Verify database connection
- Check network tab in browser dev tools

### Users Not Showing
- Ensure users have registered through the website
- Check database: `cd server && node manage-db.js users`
- Verify API endpoint is working

### Dashboard Not Loading
- Check frontend is running on port 3000
- Verify backend is running on port 5000
- Check browser console for errors
- Ensure admin token is valid

---

## 🔄 API Endpoints Used

### Admin Authentication
```
POST /api/admin/login
```

### Content Management
```
GET    /api/admin/content          - Get all content
GET    /api/admin/content/:page    - Get content by page
POST   /api/admin/content          - Add new content
PUT    /api/admin/content/:id      - Update content
DELETE /api/admin/content/:id      - Delete content
```

### User Management
```
GET    /api/admin/users            - Get all users
DELETE /api/admin/users/:id        - Delete user
```

### Dashboard Stats
```
GET    /api/admin/stats            - Get statistics
GET    /api/admin/pages            - Get all pages
```

---

## 📊 Database Schema

### Admins Table
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Page Content Table
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

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

---

## 🚀 Best Practices

### Content Management
1. **Use Consistent Naming**: Keep page names, section names, and keys consistent
2. **JSON for Arrays**: Use JSON format for lists and complex data
3. **Backup Before Changes**: Always backup database before major changes
4. **Test Changes**: Preview changes on the website after updating

### User Management
1. **Regular Cleanup**: Remove inactive or test users
2. **Monitor Growth**: Track user registration trends
3. **Data Privacy**: Handle user data responsibly

### Security
1. **Change Default Password**: Update admin password immediately
2. **Regular Updates**: Keep dependencies updated
3. **Monitor Access**: Review admin access logs
4. **Secure Tokens**: Never share admin tokens

---

## 📚 Additional Resources

- **Backend Documentation**: [`BACKEND_DOCUMENTATION.md`](BACKEND_DOCUMENTATION.md)
- **API Testing Guide**: [`server/API_TESTING_GUIDE.md`](server/API_TESTING_GUIDE.md)
- **Architecture Overview**: [`ARCHITECTURE.md`](ARCHITECTURE.md)
- **Quick Start Guide**: [`QUICK_START.md`](QUICK_START.md)

---

## ✅ Features Checklist

✅ **Authentication System**
- Admin login with JWT tokens
- Session management
- Automatic logout

✅ **Dashboard Overview**
- Real-time statistics
- System status
- Quick actions

✅ **Content Management**
- View all content
- Add new content
- Edit content inline
- Delete content
- Search and filter

✅ **User Management**
- View all users
- User details
- Delete users
- User statistics

✅ **Responsive Design**
- Desktop optimized
- Tablet friendly
- Mobile compatible

✅ **Security**
- JWT authentication
- Protected routes
- Token verification
- Role-based access

---

## 🎉 Success!

Your admin dashboard is fully functional and ready to use. You can now:
- ✅ Manage all website content
- ✅ Control user accounts
- ✅ Monitor system statistics
- ✅ Update content in real-time

**Access the dashboard at**: http://localhost:3000/admin/login

---

## 👨‍💻 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the documentation
3. Check server logs
4. Inspect browser console

---

*Last Updated: 2026-02-11*
