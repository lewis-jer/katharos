var meta = [
  { attributes: ['charset'], container: false, name: '', type: 'meta', values: ['utf-8'] },
  { attributes: ['http-equiv', 'content'], container: false, name: '', type: 'meta', values: ['X-UA-Compatible', 'IE=edge'] },
  {
    attributes: ['content'],
    container: false,
    name: 'viewport',
    type: 'meta',
    values: [{ width: 'device-width', 'initial-scale': 1, 'shrink-to-fit': 'no' }]
  },
  { attributes: ['content'], container: false, name: 'description', type: 'meta', values: [''] },
  { attributes: ['content'], container: false, name: 'author', type: 'meta', values: [''] },
  {
    attributes: ['rel', 'href', 'type'],
    container: false,
    name: 'author',
    type: 'link',
    values: ['shortcut icon', 'https://level.blob.core.windows.net/fp-blob/images/level-favicon.png', 'image/x-icon']
  },
  { attributes: [], container: true, innerHTML: 'Level | Official Site', name: '', type: 'title', values: [] }
];

var el = document.createElement('head');

const jsAssembler = async (_api, { modulePlugin, cacheBust }, callback = null) => {
  if (!Object.keys(_api.system.data.pluginLib).includes(_api.system.stringToHash(modulePlugin))) {
    // Node.js path - fetch and execute script
    if (_api.system.data.assemblerType === 'nodejs') {
      try {
        let _src = cacheBust ? modulePlugin + `?update=${Date.now()}` : modulePlugin;
        console.log(`Fetching script: ${_src}`);

        const response = await fetch(_src);
        const scriptContent = await response.text();

        // Fetch library mappings once for the entire script lifecycle
        const libMappings = _api.system.getLibraryMappings();

        // Build list of available libraries to inject as parameters
        const availableLibs = [];
        const params = ['window', 'document'];
        const args = [globalThis.window, globalThis.document];

        for (const lib of libMappings) {
          if (globalThis.window[lib.global] !== undefined) {
            params.push(lib.name);
            args.push(globalThis.window[lib.global]);
            availableLibs.push(lib.name);
          }
        }

        // Inject module/exports/require for CommonJS compatibility
        params.push('module', 'exports', 'require');
        args.push(globalThis.module, globalThis.exports, globalThis.require);

        // Execute script with available libraries as parameters
        const wrapperFn = new Function(...params, scriptContent);
        wrapperFn(...args);

        if (availableLibs.length > 0) {
          console.log(`Injected libraries as parameters:`, availableLibs);
        }

        // Helper to attach to both window AND globalThis for bare identifier access
        const attachGlobal = (name, value) => {
          if (!name || !value) return;
          globalThis.window[name] = value;
          globalThis[name] = value;
        };

        // Handle standard CommonJS exports (generic)
        if (globalThis.module.exports) {
          if (
            typeof globalThis.module.exports === 'function' ||
            (typeof globalThis.module.exports === 'object' && Object.keys(globalThis.module.exports).length > 0)
          ) {
            if (typeof globalThis.module.exports === 'function' && globalThis.module.exports.name) {
              attachGlobal(globalThis.module.exports.name, globalThis.module.exports);
              console.log(`Attached CommonJS export to window.${globalThis.module.exports.name} and global`);
            } else {
              Object.assign(globalThis.window, globalThis.module.exports);
              Object.assign(globalThis, globalThis.module.exports);
              console.log(`Attached CommonJS exports to window/global:`, Object.keys(globalThis.module.exports));
            }
          }
        }

        // Execute user-configured library processing rules
        const rules = _api.system.getLibraryRules();

        for (const rule of rules) {
          try {
            const matches = rule.match?.(modulePlugin, globalThis.module.exports);
            if (matches) {
              const shouldProcess = !rule.when || rule.when(globalThis.module.exports, globalThis);
              if (shouldProcess && rule.process) {
                const result = rule.process(globalThis.module.exports, globalThis, attachGlobal);
                if (result) console.log(result);
              }
            }
          } catch (error) {
            console.error(`Rule processing error for ${modulePlugin}:`, error.message);
          }
        }
        globalThis.module.exports = {};

        // Post-execution: Scan library mappings and expose globally available libraries
        for (const lib of libMappings) {
          // Check if library is available in window but not yet in globalThis
          if (globalThis.window[lib.global] !== undefined && globalThis[lib.name] === undefined) {
            attachGlobal(lib.name, globalThis.window[lib.global]);
            console.log(`Exposed ${lib.name} to global scope`);
          }
        }

        console.log(`Successfully loaded: ${modulePlugin}`);

        // Execute callback if provided
        if (callback) setTimeout(callback, 0);

        _api.system.updatePlugin(modulePlugin);
      } catch (error) {
        console.error(`Failed to load script: ${modulePlugin}`, error.message);
        _api.system.updatePlugin(modulePlugin);
      }
    }
    // Browser path - create script tag
    else {
      await new Promise((resolve, reject) => {
        (function (document, tag) {
          var scriptTag = document.createElement(tag);
          var firstScriptTag = document.getElementsByTagName(tag)[0];
          scriptTag.src = cacheBust ? modulePlugin + `?update=${Date.now()}` : modulePlugin;
          firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

          scriptTag.onload = scriptTag.onreadystatechange = function (_, isAbort) {
            if (isAbort || !scriptTag.readyState || /loaded|complete/.test(scriptTag.readyState)) {
              scriptTag.onload = scriptTag.onreadystatechange = null;
              scriptTag = undefined;
              if (!isAbort && callback) setTimeout(callback, 0);
              resolve();
            }
          };
        })(document, 'script');
      });
      _api.system.updatePlugin(modulePlugin);
    }
  }
};

const cssAssembler = async (_api, { modulePlugin, cacheBust }) => {
  if (!Object.keys(_api.system.data.pluginLib).includes(_api.system.stringToHash(modulePlugin))) {
    let _src = cacheBust ? modulePlugin + `?update=${Date.now()}` : modulePlugin;

    // Node.js path - fetch CSS and inject as inline style
    if (_api.system.data.assemblerType === 'nodejs') {
      try {
        console.log(`Fetching CSS: ${_src}`);

        const response = await fetch(_src);
        const cssContent = await response.text();

        // Create inline style tag with content for full DOM hydration
        const styleTag = document.createElement('style');
        styleTag.setAttribute('data-href', _src); // Track original URL
        styleTag.textContent = cssContent;
        document.head.appendChild(styleTag);

        console.log(`Successfully loaded CSS: ${modulePlugin}`);
        _api.system.updatePlugin(modulePlugin);
      } catch (error) {
        console.error(`Failed to load CSS: ${modulePlugin}`, error.message);
        _api.system.updatePlugin(modulePlugin);
      }
    }
    // Browser path - use link tag
    else {
      await new Promise((resolve, reject) => {
        const linkTag = document.createElement('link');
        linkTag.type = 'text/css';
        linkTag.rel = 'stylesheet';
        linkTag.href = _src;

        linkTag.onload = () => {
          resolve();
        };

        linkTag.onerror = () => {
          console.error(`Failed to load CSS: ${modulePlugin}`);
          resolve(); // Still resolve to continue the flow
        };

        document.head.appendChild(linkTag);
      });
      _api.system.updatePlugin(modulePlugin);
    }
  }
};

const assembler = (_api) => {
  return async (plugin) => {
    if (plugin.modulePlugin.includes('.css')) {
      try {
        await cssAssembler(_api, plugin);
      } catch (e) {
        _api.system.updatePlugin(plugin);
      }
    } else if (plugin.modulePlugin.includes('.js') || plugin?.type === 'script') {
      try {
        await jsAssembler(_api, plugin);
      } catch (e) {
        _api.system.updatePlugin(plugin);
      }
    }
  };
};

for (var i in meta) {
  const child = document.createElement(meta[i].type);
  meta[i].name && child.setAttribute('name', meta[i].name);
  for (var j in meta[i].attributes) {
    typeof meta[i].values[j] == 'object'
      ? child.setAttribute(
          meta[i].attributes[j],
          JSON.stringify(meta[i].values[j]).replace(/[{}]/g, '').replace(/["]/g, '').replace(/[:]/g, '=').replace(/[,p]/g, ', ')
        )
      : meta[i].values[j] && child.setAttribute(meta[i].attributes[j], meta[i].values[j]);
  }
  meta[i].container && (child.innerHTML = meta[i].innerHTML);
  el.appendChild(child);
}

export { assembler, el as meta };
