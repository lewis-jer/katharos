# Getting Started

## Summary
This guide will walk you through creating your first katharos application, from installation to deploying a basic interactive page.

## Prerequisites

Before you begin, ensure you have:
- Node.js version 14.0 or higher
- npm or yarn package manager
- Basic knowledge of JavaScript and ES6 modules

## Installation

### Step 1: Create a New Project

```bash
mkdir my-katharos-app
cd my-katharos-app
npm init -y
```

### Step 2: Install Katharos

```bash
npm install katharos
```

### Step 3: Install Development Dependencies (Optional)

```bash
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-env
```

## Basic Application Setup

### Step 1: Create Your Main Application File

Create a file named `app.js`:

```javascript
import Interface from 'katharos';

// Initialize the katharos interface
const app = new Interface();

// Configure the application
app.configure({
  initialize: true,
  name: 'MyApp',
  version: '1.0.0'
});

// Register a simple page
app.system.registerModule('home', {
  endpoint: '/',
  system: true,
  plugins: [
    {
      name: 'welcome-message',
      handler: async () => {
        document.body.innerHTML = `
          <div style="text-align: center; margin-top: 50px;">
            <h1>Welcome to Katharos!</h1>
            <p>Your application is running successfully.</p>
          </div>
        `;
      }
    }
  ]
});

// Initialize the application
app.create().then(() => {
  console.log('Application initialized successfully');
});

// Export for use in other modules
export default app;
```

### Step 2: Create an HTML Entry Point

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Katharos App</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="app.js"></script>
</body>
</html>
```

## Working with Plugins

### Creating a Custom Plugin

```javascript
// plugins/my-plugin.js
export const myPlugin = {
  name: 'my-custom-plugin',
  version: '1.0.0',
  handler: async (context) => {
    // Access the katharos interface
    const { system, store, user } = context;
    
    // Plugin logic here
    console.log('My plugin is running!');
    
    // Return any data or functions you want to expose
    return {
      greet: (name) => `Hello, ${name}!`
    };
  }
};

// Register the plugin in your app
import { myPlugin } from './plugins/my-plugin.js';
app.register(myPlugin);
```

## Using the Store

Katharos includes a built-in store for state management:

```javascript
// Set data in the store
app.store.set('user', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Get data from the store
const user = app.store.get('user');
console.log(user); // { name: 'John Doe', email: 'john@example.com' }

// Update specific properties
app.store.update('user', { email: 'newemail@example.com' });

// Listen for store changes
app.store.subscribe('user', (newValue, oldValue) => {
  console.log('User data changed:', newValue);
});
```

## Page Navigation with loadPage

```javascript
// Load a different page
await app.loadPage('about');

// Load a page with parameters
await app.loadPage('product', { id: 123 });

// Handle page animations
app.pageAnimations.fadeIn('#content', 500);
```

## Form Handling

Katharos provides utilities for form management:

```javascript
// Show a loading state on form submission
await app.formLoaderInvoke('#login-form', {
  loader: '.spinner',
  button: '.submit-btn',
  text: 'Loading...'
});

// Display form messages
await app.displayFormMessage('#login-form', {
  wrapper: '.message-wrapper',
  element: '.message-text',
  text: 'Login successful!'
});
```

## Development Server Setup

For local development, you can use any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using live-server for auto-reload
npx live-server --port=8000
```

## Next Steps

- Explore the [API Reference](./API-Reference/Interface.md) for detailed documentation
- Learn about [Advanced Plugins](./Guides/Advanced-Plugins.md)
- Set up [katharos-router](https://github.com/cnsdetroit/katharos-router) for routing

## Common Issues

### Module Loading Errors
Ensure your HTML includes `type="module"` in the script tag.

### Browser Compatibility
Check that your browser supports ES6 modules. Use a bundler like Webpack for older browsers.

## Related

- [API Reference](./API-Reference/Interface.md) - Complete API documentation
- [Plugin Development](./Guides/Plugin-Development.md) - Advanced plugin creation
- [State Management](./Guides/State-Management.md) - Working with the store