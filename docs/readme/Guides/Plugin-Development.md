# Plugin Development Guide

## Summary
Plugins are the core extension mechanism in katharos, allowing you to add custom functionality, modify behavior, and integrate third-party services. This guide covers everything you need to know about creating powerful plugins.

## Plugin Structure

A katharos plugin is an object with specific properties:

```javascript
const myPlugin = {
  name: 'my-plugin',         // Required: Unique identifier
  version: '1.0.0',          // Optional: Plugin version
  dependencies: [],          // Optional: Other plugin names this depends on
  handler: async (context) => {  // Required: Main plugin function
    // Plugin logic here
  }
};
```

## Basic Plugin Example

```javascript
// plugins/hello-world.js
export const helloWorldPlugin = {
  name: 'hello-world',
  version: '1.0.0',
  handler: async (context) => {
    // Access the katharos interface through context
    const { system, store, user } = context;
    
    // Add a method to the global scope
    context.sayHello = (name) => {
      console.log(`Hello, ${name}!`);
      return `Greeting sent to ${name}`;
    };
    
    // Plugin initialization logic
    console.log('Hello World plugin loaded!');
    
    // Return any data or methods to expose
    return {
      greet: context.sayHello,
      version: '1.0.0'
    };
  }
};
```

## Plugin Context

The handler function receives a context object with access to:

### Core Properties

```javascript
handler: async (context) => {
  // System instance for internal management
  const { system } = context;
  
  // Store for state management
  const { store } = context;
  
  // User management utilities
  const { user } = context;
  
  // Other katharos methods
  const { 
    loadPage,
    addEvent,
    timeout,
    getDeviceType,
    assembler,
    meta
  } = context;
}
```

## Advanced Plugin Patterns

### Lifecycle Hooks

```javascript
export const lifecyclePlugin = {
  name: 'lifecycle-plugin',
  handler: async (context) => {
    // Initialize hook - runs when plugin loads
    const initialize = async () => {
      console.log('Plugin initializing...');
      await context.store.set('plugin-state', { initialized: true });
    };
    
    // Cleanup hook - for teardown
    const cleanup = async () => {
      console.log('Plugin cleaning up...');
      await context.store.remove('plugin-state');
    };
    
    // Mount hook - when plugin is used
    const mount = async () => {
      console.log('Plugin mounted');
    };
    
    // Run initialization
    await initialize();
    
    return {
      initialize,
      cleanup,
      mount
    };
  }
};
```

### Event-Driven Plugins

```javascript
export const eventPlugin = {
  name: 'event-listener',
  handler: async (context) => {
    // Subscribe to store changes
    context.store.subscribe('user', (newValue, oldValue) => {
      context.addEvent('user-changed', {
        old: oldValue,
        new: newValue,
        timestamp: Date.now()
      });
    });
    
    // Listen for custom events
    window.addEventListener('custom-event', (event) => {
      console.log('Custom event received:', event.detail);
    });
    
    // Emit custom events
    const emit = (eventName, data) => {
      window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    };
    
    return { emit };
  }
};
```

### Middleware Plugin

```javascript
export const middlewarePlugin = {
  name: 'auth-middleware',
  handler: async (context) => {
    // Intercept page loads
    const originalLoadPage = context.loadPage;
    
    context.loadPage = async (pageName, ...args) => {
      // Check authentication before page load
      const user = context.store.get('currentUser');
      
      if (!user && pageName !== 'login') {
        console.log('Unauthorized access, redirecting to login');
        return originalLoadPage.call(context, 'login');
      }
      
      // Call original method
      return originalLoadPage.call(context, pageName, ...args);
    };
    
    return {
      type: 'middleware',
      target: 'loadPage'
    };
  }
};
```

## Plugin Dependencies

### Declaring Dependencies

```javascript
export const dependentPlugin = {
  name: 'analytics-extension',
  dependencies: ['analytics-core'],  // Must be loaded first
  handler: async (context) => {
    // Access the analytics core plugin
    const analytics = context.plugins['analytics-core'];
    
    if (!analytics) {
      throw new Error('Analytics core plugin is required');
    }
    
    // Extend analytics functionality
    analytics.trackCustomEvent = (eventName, data) => {
      analytics.track(eventName, {
        ...data,
        source: 'extension'
      });
    };
    
    return { extended: true };
  }
};
```

## Plugin Communication

### Inter-Plugin Messaging

```javascript
// Plugin A - Message sender
export const senderPlugin = {
  name: 'message-sender',
  handler: async (context) => {
    const sendMessage = (recipientPlugin, message) => {
      // Use custom event system
      window.dispatchEvent(new CustomEvent(`plugin-message-${recipientPlugin}`, {
        detail: { from: 'message-sender', message }
      }));
    };
    
    return { sendMessage };
  }
};

// Plugin B - Message receiver
export const receiverPlugin = {
  name: 'message-receiver',
  handler: async (context) => {
    window.addEventListener('plugin-message-message-receiver', (event) => {
      console.log('Received message:', event.detail);
      // Handle message
    });
    
    return { listening: true };
  }
};
```

## Error Handling

### Robust Error Management

```javascript
export const errorHandlingPlugin = {
  name: 'error-handler',
  handler: async (context) => {
    try {
      // Plugin initialization
      const config = await loadConfig();
      
      if (!config) {
        throw new Error('Configuration not found');
      }
      
      // Setup error boundary
      window.addEventListener('error', (event) => {
        context.addEvent('plugin-error', {
          plugin: 'error-handler',
          error: event.error.message,
          stack: event.error.stack
        });
      });
      
      return { status: 'initialized' };
      
    } catch (error) {
      // Log error and fail gracefully
      console.error(`Plugin ${this.name} failed:`, error);
      
      // Return partial functionality
      return {
        status: 'partial',
        error: error.message
      };
    }
  }
};
```

## Testing Plugins

### Unit Testing Example

```javascript
// test/hello-world.test.js
import { helloWorldPlugin } from '../plugins/hello-world.js';

describe('Hello World Plugin', () => {
  let mockContext;
  
  beforeEach(() => {
    mockContext = {
      system: {},
      store: {
        get: jest.fn(),
        set: jest.fn()
      },
      user: {}
    };
  });
  
  test('should add sayHello method', async () => {
    const result = await helloWorldPlugin.handler(mockContext);
    
    expect(mockContext.sayHello).toBeDefined();
    expect(typeof mockContext.sayHello).toBe('function');
  });
  
  test('should return greet function', async () => {
    const result = await helloWorldPlugin.handler(mockContext);
    
    expect(result.greet).toBeDefined();
    expect(result.version).toBe('1.0.0');
  });
});
```

## Plugin Best Practices

### 1. Namespace Your Plugin

```javascript
export const namespacedPlugin = {
  name: 'company-feature',
  handler: async (context) => {
    // Use namespaced storage keys
    context.store.set('company:feature:config', { enabled: true });
    
    // Use namespaced events
    context.addEvent('company:feature:initialized', {});
    
    // Use namespaced methods
    context.companyFeature = {
      enable: () => {},
      disable: () => {},
      configure: () => {}
    };
  }
};
```

### 2. Provide Configuration Options

```javascript
export const configurablePlugin = {
  name: 'configurable',
  handler: async (context, options = {}) => {
    // Default configuration
    const config = {
      theme: 'light',
      animations: true,
      debug: false,
      ...options  // Allow overrides
    };
    
    // Store configuration
    context.store.set('plugin:configurable:config', config);
    
    // Apply configuration
    if (config.theme === 'dark') {
      document.body.classList.add('dark-theme');
    }
    
    return {
      updateConfig: (newConfig) => {
        Object.assign(config, newConfig);
        context.store.set('plugin:configurable:config', config);
      }
    };
  }
};
```

### 3. Clean Up Resources

```javascript
export const resourcePlugin = {
  name: 'resource-manager',
  handler: async (context) => {
    const intervals = [];
    const listeners = [];
    
    // Track resources
    const addInterval = (callback, delay) => {
      const id = setInterval(callback, delay);
      intervals.push(id);
      return id;
    };
    
    const addEventListener = (element, event, handler) => {
      element.addEventListener(event, handler);
      listeners.push({ element, event, handler });
    };
    
    // Cleanup function
    const cleanup = () => {
      intervals.forEach(id => clearInterval(id));
      listeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    };
    
    // Register cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    
    return {
      addInterval,
      addEventListener,
      cleanup
    };
  }
};
```

## Performance Optimization

### Lazy Loading

```javascript
export const lazyPlugin = {
  name: 'lazy-feature',
  handler: async (context) => {
    let heavyModule = null;
    
    const loadHeavyModule = async () => {
      if (!heavyModule) {
        // Dynamic import for code splitting
        heavyModule = await import('./heavy-module.js');
      }
      return heavyModule;
    };
    
    return {
      // Only load when needed
      useHeavyFeature: async () => {
        const module = await loadHeavyModule();
        return module.processData();
      }
    };
  }
};
```

## Publishing Plugins

### Package Structure

```
my-katharos-plugin/
├── package.json
├── README.md
├── src/
│   └── index.js
├── dist/
│   └── plugin.min.js
└── examples/
    └── basic-usage.js
```

### Package.json Example

```json
{
  "name": "katharos-plugin-example",
  "version": "1.0.0",
  "description": "Example plugin for katharos framework",
  "main": "dist/plugin.min.js",
  "module": "src/index.js",
  "keywords": ["katharos", "plugin"],
  "peerDependencies": {
    "katharos": "^1.0.0"
  }
}
```

## Related

- [API Reference → Interface](../API-Reference/Interface.md) - Core API documentation
- [Advanced Plugins](./Advanced-Plugins.md) - Complex plugin patterns
- [State Management](./State-Management.md) - Working with the store in plugins