# Interface API Reference

## Summary
The Interface class is the main entry point for the katharos framework. It manages the application lifecycle, plugin registration, and provides core utilities for building enterprise applications.

## Constructor

```javascript
new Interface(system)
```

### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| system | Object | System configuration object | no |

### Returns
Returns a new Interface instance with initialized system, user, and store properties.

### Usage Example
```javascript
import Interface from 'katharos';

const app = new Interface();
```

## Methods

### configure(config)
Configures the katharos application with specified options.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| config | Object | Configuration object | yes |
| config.initialize | boolean | Whether to initialize modules on configuration | no |

#### Returns
void

#### Usage Example
```javascript
app.configure({
  initialize: true,
  name: 'MyApp',
  version: '1.0.0'
});
```

### initialization()
Initializes all registered modules. Called automatically if `initialize: true` is passed to configure().

#### Parameters
None

#### Returns
Returns string: "Initialization Complete"

#### Usage Example
```javascript
const status = app.initialization();
console.log(status); // "Initialization Complete"
```

### create()
Creates and initializes all registered system modules and their plugins.

#### Parameters
None

#### Returns
Returns Promise<void>

#### Usage Example
```javascript
await app.create();
```

### register(plugin)
Registers a new plugin with the system.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| plugin | Object | Plugin configuration object | yes |

#### Returns
Returns Promise<void>

#### Usage Example
```javascript
await app.register({
  name: 'my-plugin',
  handler: async (context) => {
    // Plugin logic
  }
});
```

### assign(modules)
Assigns custom modules to the framework.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| modules | Function/Array | Class constructor(s) to register as modules | yes |

#### Returns
void

#### Usage Example
```javascript
class MyHelper {
  constructor(api) {
    this.api = api;
  }
  
  helper() {
    return 'Helper method';
  }
}

app.assign(MyHelper);
```

### loadPage(pageName)
Loads a registered page by name.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| pageName | string | Name of the page to load | yes |

#### Returns
Returns Promise<void>

#### Usage Example
```javascript
await app.loadPage('home');
```

### addEvent(name, data)
Adds a custom event to the global event log.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| name | string | Event identifier name | yes |
| data | any | Event data to log | yes |

#### Returns
Returns boolean: true if successful

#### Usage Example
```javascript
app.addEvent('user-login', { 
  userId: 123, 
  timestamp: Date.now() 
});
```

### formLoaderInvoke(selector, options)
Toggles loading state for form elements.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| selector | string | CSS selector for the form | yes |
| options | Object | Loader configuration | yes |
| options.loader | string | CSS selector for loader element | no |
| options.button | string | CSS selector for button element | no |
| options.text | string | Text to display when loading | yes |

#### Returns
Returns Promise<boolean> - true if loader activated, false if deactivated

#### Usage Example
```javascript
const isLoading = await app.formLoaderInvoke('#login-form', {
  loader: '.spinner',
  button: '.submit-btn',
  text: 'Logging in...'
});
```

### getLoaderStatus(selector)
Gets the current loader status for a form.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| selector | string | CSS selector for the form | yes |

#### Returns
Returns boolean - current loader status

#### Usage Example
```javascript
const isLoading = app.getLoaderStatus('#login-form');
```

### displayFormMessage(selector, options)
Displays a message in a form with auto-clear after 5 seconds.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| selector | string | CSS selector for the form | yes |
| options | Object | Message configuration | yes |
| options.wrapper | string | CSS selector for message wrapper | yes |
| options.element | string | CSS selector for message element | yes |
| options.text | string | Message text to display | yes |

#### Returns
Returns Promise<void>

#### Usage Example
```javascript
await app.displayFormMessage('#login-form', {
  wrapper: '.message-wrapper',
  element: '.message-text',
  text: 'Login successful!'
});
```

### clearFormMessage(selector, options)
Immediately clears a form message.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| selector | string | CSS selector for the form | yes |
| options | Object | Message configuration | yes |
| options.wrapper | string | CSS selector for message wrapper | yes |
| options.element | string | CSS selector for message element | yes |

#### Returns
Returns Promise<void>

#### Usage Example
```javascript
await app.clearFormMessage('#login-form', {
  wrapper: '.message-wrapper',
  element: '.message-text'
});
```

### whoami()
Returns framework identification information.

#### Parameters
None

#### Returns
Returns Object: `{ name: 'katharos', version: '1.0.4' }`

#### Usage Example
```javascript
const info = app.whoami();
console.log(info); // { name: 'katharos', version: '1.0.4' }
```

### timeout(ms)
Utility method for creating delays.

#### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| ms | number | Milliseconds to wait | yes |

#### Returns
Returns Promise<void>

#### Usage Example
```javascript
await app.timeout(1000); // Wait 1 second
```

### getDeviceType()
Gets the current device type.

#### Parameters
None

#### Returns
Returns string - Device type identifier

#### Usage Example
```javascript
const deviceType = app.getDeviceType();
console.log(deviceType); // 'desktop', 'mobile', etc.
```

## Properties

### system
The System instance managing internal state and modules.

```javascript
const modules = app.system.getModules();
```

### store
The Store instance for centralized state management.

```javascript
app.store.set('key', 'value');
```

### user
The User instance for user management.

```javascript
const currentUser = app.user.getCurrent();
```

### pageAnimations
Object containing page animation utilities.

```javascript
app.pageAnimations.fadeIn('#content', 500);
```

## Edge Cases

- Calling `create()` before `configure()` may result in incomplete initialization
- Form loader methods require DOM elements to exist
- Multiple `register()` calls with the same plugin name will override previous registrations
- The `timeout()` method is a Promise-based alternative to setTimeout

## Related

- [System API](./System.md) - Internal system management
- [Store API](./Store.md) - State management documentation
- [Plugin Development](../Guides/Plugin-Development.md) - Creating custom plugins