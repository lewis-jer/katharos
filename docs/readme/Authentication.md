# Authentication

## Summary
Katharos provides built-in user management and authentication utilities through the User module. This guide covers user authentication, session management, and authorization patterns.

## User Management

The User module is automatically available through the Interface instance:

```javascript
const app = new Interface();
const user = app.user;
```

## Basic Authentication Flow

### User Login

```javascript
// Define login handler
async function handleLogin(credentials) {
  try {
    // Validate credentials (implement your own validation)
    const userData = await validateUser(credentials);
    
    // Store user data
    app.store.set('currentUser', userData);
    
    // Set authentication token
    app.user.setToken(userData.token);
    
    // Log the event
    app.addEvent('user-login', {
      userId: userData.id,
      timestamp: Date.now()
    });
    
    // Navigate to dashboard
    await app.loadPage('dashboard');
    
  } catch (error) {
    await app.displayFormMessage('#login-form', {
      wrapper: '.error-wrapper',
      element: '.error-message',
      text: 'Invalid credentials'
    });
  }
}
```

### User Logout

```javascript
async function handleLogout() {
  // Clear user data
  app.store.remove('currentUser');
  
  // Clear authentication token
  app.user.clearToken();
  
  // Log the event
  app.addEvent('user-logout', {
    timestamp: Date.now()
  });
  
  // Navigate to login page
  await app.loadPage('login');
}
```

## Session Management

### Storing Session Data

```javascript
// Store session information
app.user.setSession({
  sessionId: 'unique-session-id',
  expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  permissions: ['read', 'write']
});

// Retrieve session
const session = app.user.getSession();
```

### Session Validation

```javascript
// Create a session validation plugin
const sessionValidator = {
  name: 'session-validator',
  handler: async (context) => {
    const session = context.user.getSession();
    
    // Check if session exists and is valid
    if (!session || Date.now() > session.expiresAt) {
      // Redirect to login
      await context.loadPage('login');
      return false;
    }
    
    return true;
  }
};

// Register the validator
await app.register(sessionValidator);
```

## Protected Routes

### Creating Protected Pages

```javascript
// Register a protected page
app.system.registerModule('admin-dashboard', {
  endpoint: '/admin',
  system: true,
  protected: true,
  plugins: [
    {
      name: 'auth-check',
      handler: async (context) => {
        // Check user permissions
        const user = context.store.get('currentUser');
        if (!user || !user.roles.includes('admin')) {
          await context.loadPage('unauthorized');
          return;
        }
        
        // Render admin dashboard
        document.getElementById('app').innerHTML = `
          <h1>Admin Dashboard</h1>
          <p>Welcome, ${user.name}!</p>
        `;
      }
    }
  ]
});
```

## Token Management

### Storing Authentication Tokens

```javascript
// Store token in localStorage
app.user.setToken = function(token) {
  localStorage.setItem('auth_token', token);
  
  // Also store in memory for quick access
  this.token = token;
};

// Retrieve token
app.user.getToken = function() {
  return this.token || localStorage.getItem('auth_token');
};

// Clear token
app.user.clearToken = function() {
  localStorage.removeItem('auth_token');
  this.token = null;
};
```

### API Request Interceptor

```javascript
// Add authentication headers to API requests
import axios from 'axios';

axios.interceptors.request.use(
  config => {
    const token = app.user.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
```

## Permission-Based Access Control

### Defining User Permissions

```javascript
// Define permission structure
const userPermissions = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: ['read', 'update'],
  viewer: ['read']
};

// Check permissions
function hasPermission(user, action) {
  const role = user.role;
  const permissions = userPermissions[role] || [];
  return permissions.includes(action);
}
```

### Conditional Rendering

```javascript
// Render UI based on permissions
async function renderUserInterface(user) {
  const canEdit = hasPermission(user, 'update');
  const canDelete = hasPermission(user, 'delete');
  
  document.getElementById('app').innerHTML = `
    <div class="user-interface">
      <h2>User Dashboard</h2>
      ${canEdit ? '<button id="edit-btn">Edit</button>' : ''}
      ${canDelete ? '<button id="delete-btn">Delete</button>' : ''}
    </div>
  `;
}
```

## OAuth Integration

### Example OAuth Flow

```javascript
// OAuth login handler
async function handleOAuthLogin(provider) {
  // Show loader
  await app.formLoaderInvoke('#oauth-form', {
    loader: '.oauth-spinner',
    button: `.${provider}-btn`,
    text: `Connecting to ${provider}...`
  });
  
  try {
    // Redirect to OAuth provider
    const authUrl = `https://oauth.${provider}.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    window.location.href = authUrl;
  } catch (error) {
    console.error('OAuth error:', error);
  }
}

// OAuth callback handler
async function handleOAuthCallback(code) {
  // Exchange code for token
  const response = await fetch('/api/oauth/token', {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  const { token, user } = await response.json();
  
  // Store authentication data
  app.user.setToken(token);
  app.store.set('currentUser', user);
  
  // Navigate to dashboard
  await app.loadPage('dashboard');
}
```

## Security Best Practices

1. **Always validate tokens on the server side**
2. **Use HTTPS for all authentication requests**
3. **Implement token expiration and refresh mechanisms**
4. **Store sensitive data securely (never in plain text)**
5. **Implement rate limiting for login attempts**
6. **Use secure session cookies with httpOnly and secure flags**

## Common Patterns

### Remember Me Functionality

```javascript
function handleRememberMe(rememberMe) {
  if (rememberMe) {
    // Store token in persistent storage
    localStorage.setItem('remember_token', generateRememberToken());
  } else {
    // Use session storage for temporary auth
    sessionStorage.setItem('session_token', generateSessionToken());
  }
}
```

### Auto-logout on Inactivity

```javascript
let inactivityTimer;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(async () => {
    await handleLogout();
    alert('You have been logged out due to inactivity');
  }, 30 * 60 * 1000); // 30 minutes
}

// Reset timer on user activity
['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetInactivityTimer, true);
});
```

## Related

- [User API Reference](./API-Reference/User.md) - Complete User module documentation
- [State Management](./Guides/State-Management.md) - Managing user state with the Store
- [Form Handling Tutorial](./Tutorials/Form-Handling.md) - Building login forms