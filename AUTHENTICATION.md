# Authentication System

## Overview

This project now requires authentication for all users. Anyone who wants to work on or access this project must log in first.

## How It Works

### Protected Routes

All routes in the application are now protected and require authentication:
- `/` - Home page
- `/about` - About page
- `/team` - Team page
- `/contact` - Contact page
- `/logout` - Logout page
- All other routes (404 pages)

The only public route is `/login`.

### Authentication Flow

1. **Initial Access**: When a user tries to access any page without being authenticated, they are automatically redirected to the login page.

2. **Login**: Users must enter credentials on the login page. Currently, the system accepts any username and password (you can add validation logic later).

3. **Session Management**: After successful login, the authentication state is stored in `localStorage` and managed through React Context.

4. **Protected Access**: Once authenticated, users can access all pages in the application.

5. **Logout**: Users can log out by visiting the `/logout` page and confirming the logout action.

## Technical Implementation

### Components

#### [`AuthContext.jsx`](src/context/AuthContext.jsx)

- Manages global authentication state
- Provides `login()` and `logout()` functions
- Persists authentication state in localStorage
- Exports `useAuth()` hook for accessing auth state

#### [`ProtectedRoute.jsx`](src/component/ProtectedRoute.jsx)

- Wrapper component for protected routes
- Automatically redirects unauthenticated users to login
- Simplifies route protection in App.jsx

#### [`Login.jsx`](src/component/Login.jsx)

- Login form component
- Uses `useAuth()` hook to call `login()` function
- Redirects to home page after successful login

#### [`Logout.jsx`](src/component/Logout.jsx)

- Logout confirmation page
- Uses `useAuth()` hook to call `logout()` function
- Redirects to login page after logout

### Usage in Code

```jsx
// Access authentication state in any component
import { useAuth } from '../context/AuthContext';

function MyComponent() {
    const { isAuthenticated, login, logout } = useAuth();
    
    // Use isAuthenticated to conditionally render content
    // Call login() to authenticate user
    // Call logout() to log out user
}
```

## Adding Real Authentication

To implement real authentication with a backend:

1. **Update [`Login.jsx`](src/component/Login.jsx)**:
   ```jsx
   const handleSubmit = async (e) => {
       e.preventDefault();
       try {
           const response = await fetch('/api/login', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ username, password })
           });
           
           if (response.ok) {
               const data = await response.json();
               // Store token if using JWT
               localStorage.setItem('token', data.token);
               login();
               navigate('/');
           } else {
               // Handle login error
               alert('Invalid credentials');
           }
       } catch (error) {
           console.error('Login error:', error);
       }
   };
   ```

2. **Update [`AuthContext.jsx`](src/context/AuthContext.jsx)**:
   - Add token validation
   - Add API calls to verify token on app load
   - Add token refresh logic

3. **Add API interceptors**:
   - Attach authentication token to all API requests
   - Handle token expiration
   - Redirect to login on 401 errors

## Security Notes

⚠️ **Current Implementation**: The current authentication is client-side only and stores state in localStorage. This is suitable for development but NOT secure for production.

For production, you should:
- Implement server-side authentication
- Use secure HTTP-only cookies or JWT tokens
- Add CSRF protection
- Implement rate limiting
- Add password hashing and validation
- Use HTTPS
- Add session timeout
- Implement refresh tokens

## Testing

To test the authentication:

1. Start the development server: `npm run dev`
2. Navigate to any page - you'll be redirected to `/login`
3. Enter any username and password
4. You'll be logged in and redirected to the home page
5. Navigate to `/logout` to log out
6. After logout, you'll be redirected back to login

## Future Enhancements

- [ ] Add user registration
- [ ] Implement password reset functionality
- [ ] Add "Remember Me" option
- [ ] Implement role-based access control (RBAC)
- [ ] Add multi-factor authentication (MFA)
- [ ] Add social login (Google, GitHub, etc.)
- [ ] Add session timeout with warning
- [ ] Implement account lockout after failed attempts
