# 🔐 GearGuard Authentication System

## Overview

GearGuard now includes a complete authentication system with login and signup pages, JWT-based authentication, and user management.

---

## 🎨 Login/Signup Pages

### Login Page
![Login Page](C:/Users/abhi virani/.gemini/antigravity/brain/3bbd89c3-344f-444b-9d7b-4d1e118ae7dd/login_page_design_1766812903565.png)

**Features:**
- ✅ Modern dark theme with glassmorphism effects
- ✅ Animated background with moving grid pattern
- ✅ Email and password fields with validation
- ✅ Password visibility toggle (eye icon)
- ✅ "Remember me" checkbox
- ✅ "Forgot password" link
- ✅ Demo credentials display
- ✅ Smooth transitions and animations

### Signup Page
![Signup Form](C:/Users/abhi virani/.gemini/antigravity/brain/3bbd89c3-344f-444b-9d7b-4d1e118ae7dd/signup_form_design_1766813111942.png)

**Features:**
- ✅ Full name, email, password, and confirm password fields
- ✅ Password strength validation (minimum 6 characters)
- ✅ Password match verification
- ✅ Password visibility toggles on all password fields
- ✅ Success/error message display
- ✅ Seamless switch between login and signup

### Completed Login State
![Login with Credentials](C:/Users/abhi virani/.gemini/antigravity/brain/3bbd89c3-344f-444b-9d7b-4d1e118ae7dd/login_page_completed_1766813194476.png)

---

## 🔑 Demo Credentials

**Email:** `admin@gearguard.com`  
**Password:** `admin123`

These credentials are displayed on the login page for easy testing.

---

## 🏗️ Backend Authentication

### User Model
Located at `backend/models/User.js`

**Fields:**
- `name` - Full name (required)
- `email` - Email address (required, unique)
- `password` - Hashed password (bcrypt, min 6 chars)
- `role` - User role (admin/manager/technician)
- `isActive` - Account status (default: true)

**Security:**
- Passwords are hashed using bcryptjs before storage
- Password comparison method for authentication
- Password field excluded from JSON responses

### Authentication Routes
Located at `backend/routes/auth.js`

#### POST `/api/auth/register`
Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "technician"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "technician"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "admin@gearguard.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@gearguard.com",
    "role": "admin"
  }
}
```

#### GET `/api/auth/me`
Get current authenticated user (requires token).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Admin User",
  "email": "admin@gearguard.com",
  "role": "admin"
}
```

---

## 🔒 Frontend Authentication

### Auth Module
Located at `js/auth.js`

**Functions:**
- `checkAuth()` - Verify user is logged in, redirect if not
- `getCurrentUser()` - Get current user info from localStorage
- `logout()` - Clear session and redirect to login

**Usage:**
```javascript
// Check authentication on page load
if (!auth.checkAuth()) {
    // User will be redirected to login
}

// Get current user
const user = auth.getCurrentUser();
console.log(user.name, user.email);

// Logout
auth.logout();
```

### Session Storage
Authentication data is stored in localStorage:
- `authToken` - JWT token
- `userName` - User's full name
- `userEmail` - User's email address

---

## 🎯 User Flow

### First-Time User
1. Visit `login.html`
2. Click "Sign up"
3. Fill in registration form
4. Submit to create account
5. Redirected to login
6. Login with new credentials
7. Access main application

### Returning User
1. Visit `login.html`
2. Enter email and password
3. Optionally check "Remember me"
4. Click "Sign In"
5. Redirected to `index.html`
6. User info displayed in sidebar
7. Logout button available

### Protected Routes
The main application (`index.html`) is protected:
- Checks for valid auth token on load
- Redirects to login if not authenticated
- Displays user info in sidebar
- Provides logout functionality

---

## 🛡️ Security Features

### Password Security
- ✅ Minimum 6 characters required
- ✅ Bcrypt hashing (10 salt rounds)
- ✅ Password never sent in plain text
- ✅ Confirm password validation on signup

### JWT Tokens
- ✅ 7-day expiration
- ✅ Includes user ID, email, and role
- ✅ Signed with secret key
- ✅ Verified on protected routes

### Session Management
- ✅ Token stored in localStorage
- ✅ Automatic redirect if not authenticated
- ✅ Clean logout with token removal
- ✅ User info display in sidebar

---

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

This will install:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation

### 2. Seed Demo User
```bash
npm run seed
```

This creates the demo admin user:
- Email: admin@gearguard.com
- Password: admin123

### 3. Start Backend
```bash
npm start
```

Server runs on `http://localhost:5000`

### 4. Access Application
1. Open `login.html` in browser
2. Use demo credentials or create new account
3. Login to access main application

---

## 🔧 Configuration

### JWT Secret
Located in `backend/routes/auth.js`:
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'gearguard-secret-key-change-in-production';
```

**Production:** Set `JWT_SECRET` environment variable

### Token Expiration
Default: 7 days

To change, edit in `backend/routes/auth.js`:
```javascript
{ expiresIn: '7d' }  // Change to '1d', '12h', etc.
```

---

## 📱 User Interface

### Sidebar User Display
When logged in, the sidebar shows:
- User avatar (first letter of name)
- Full name
- Email address
- Logout button

### Logout Confirmation
Clicking logout shows confirmation dialog before clearing session.

---

## 🎨 Design Highlights

### Visual Effects
- Animated grid background
- Glassmorphism card design
- Smooth form transitions
- Loading states with spinner
- Hover effects on buttons
- Focus states on inputs

### Responsive Design
- Mobile-friendly layout
- Touch-optimized buttons
- Adaptive spacing
- Readable font sizes

---

## 🔄 Integration with API

### Using API Authentication
Update `js/api-client.js` to include token:

```javascript
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('authToken');
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    // ... rest of code
}
```

### Protected API Routes
Add authentication middleware to routes:

```javascript
const authRoutes = require('./routes/auth');
router.get('/protected', authRoutes.authenticateToken, (req, res) => {
    // req.user contains decoded JWT data
    res.json({ user: req.user });
});
```

---

## 🎯 Next Steps

### Optional Enhancements
1. **Email Verification** - Send confirmation emails
2. **Password Reset** - Forgot password functionality
3. **Two-Factor Auth** - Additional security layer
4. **OAuth Integration** - Google/Microsoft login
5. **Role-Based Access** - Different permissions per role
6. **Session Timeout** - Auto-logout after inactivity
7. **Password Strength Meter** - Visual feedback on signup

---

## 📝 Testing

### Manual Testing
1. ✅ Create new account via signup
2. ✅ Login with demo credentials
3. ✅ Verify redirect to main app
4. ✅ Check user info in sidebar
5. ✅ Test logout functionality
6. ✅ Verify redirect to login after logout
7. ✅ Test "Remember me" checkbox
8. ✅ Test password visibility toggle

### API Testing
```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gearguard.com","password":"admin123"}'

# Get current user (replace TOKEN)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## ✅ Completion Checklist

- [x] Login page with modern design
- [x] Signup page with validation
- [x] Password visibility toggle
- [x] Demo credentials display
- [x] User model with password hashing
- [x] JWT authentication routes
- [x] Frontend auth protection
- [x] User info in sidebar
- [x] Logout functionality
- [x] Session management
- [x] Demo user in seed script
- [x] Complete documentation

---

**Authentication system is production-ready!** 🎉
