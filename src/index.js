import { assembler, meta } from './core/plugin.js';
import { getDeviceType } from './core/util.js';
import { System } from './core/helper/system.js';
import { loadPage, pageAnimations } from './core/action-canvas.js';
import { dataHandler } from './core/helper/hook-data.js';

let modules = [
  { data: dataHandler, invoke: false, enabled: true, type: ['spread'] },
  { data: meta, invoke: false, enabled: true, type: ['name', 'meta'] },
  { data: (_api) => (pageName) => _api.system.getModule(pageName), invoke: true, enabled: true, type: ['name', 'gatherPageInfo'] },
  { data: assembler, invoke: true, enabled: true, type: ['name', 'assembler'] },
  { data: (ms) => new Promise((resolve) => setTimeout(resolve, ms)), invoke: false, enabled: true, type: ['name', 'timeout'] },
  { data: getDeviceType, invoke: false, enabled: true, type: ['name', 'getDeviceType'] },
  { data: loadPage, invoke: true, enabled: true, type: ['name', 'loadPage', 'call'] },
  { data: pageAnimations, invoke: false, enabled: true, type: ['name', 'pageAnimations'] }
];

class Interface {
  constructor(system) {
    this.system = new System({ name: 'system-reserved' });
    this.user = this.system.getUser();
    this.store = this.system.getStore();
    this.componentLoaders = [];
  }

  registerComponentLoader(name, loaderFn, options = {}) {
    const loaderConfig = {
      name,
      loader: loaderFn,
      hasMiddleware: options.hasMiddleware || false,
      middlewareModule: options.middlewareModule || name
    };

    if (options.order !== undefined) {
      this.componentLoaders.splice(options.order, 0, loaderConfig);
    } else {
      this.componentLoaders.push(loaderConfig);
    }
  }

  async loadComponents(pageInfo) {
    for (const config of this.componentLoaders) {
      try {
        await config.loader.call(this, pageInfo);
      } catch (error) {
        console.log('loadComponents', error);
      }

      // Automatically load middleware if component needs it
      if (config.hasMiddleware) {
        const module = this.system.getModule(config.middlewareModule);
        if (module) {
          module.loaded ? await this.system.reloadMiddleware(this, module) : await this.system.loadMiddleware(this, module);
        }
      }
    }
  }

  initialization() {
    for (var module of modules) this.initialize(module);
    return 'Initialization Complete';
  }

  initialize(module) {
    // console.log(module);
    let { data, enabled, invoke, type } = module;
    if (!enabled) return;
    let initializer = invoke && !type.includes('call') ? data(this) : type.includes('call') ? data.call(this) : data;
    initializer = type.includes('instance') ? new initializer(this)[module.lib] : initializer;
    if (type.includes('spread')) Object.assign(this, { ...initializer });
    if (type.includes('name')) this[type[1]] = initializer;
    this.formLoaderStatus = {};
  }

  configure(config) {
    if (config.initialize) this.initialization();
    this.system.configure(config);
  }

  assign(_modules) {
    if (!_modules) return;
    if (typeof _modules !== 'object' || (typeof _modules === 'object' && !Array.isArray(_modules))) var $modules = [_modules];

    for (var $module of $modules) {
      if (typeof $module === 'function' && /^class\s/.test(Function.prototype.toString.call($module)) && Reflect.construct(String, [], $module))
        modules.push({ data: $module, lib: 'helper', enabled: true, type: ['name', 'helper', 'instance'] });
    }
  }

  async create() {
    for (const [key, current] of Object.entries(this.system.getModules())) {
      current.arrayExpression = current.endpoint;
      if (!current.system) continue;
      await this.system.loadMiddleware(this, current);
    }
  }

  async register(plugin) {
    this.system.registerPlugin(plugin);
  }

  addEvent(name, data) {
    var id = this.system.createUniqueId();
    let string = JSON.stringify(data);
    let event = { detail: string, arrayExpression: id, id: id, identifier: name, location: document?.location?.href, timestamp: Date.now() };
    window.event_log.push(event);
    return true;
  }

  async _modifyStorageObject(item, { key, value }) {
    const parsedObject = await Promise.resolve(JSON.parse(localStorage.getItem(item)));
    await Promise.resolve((parsedObject[key] = value));
    await Promise.resolve(localStorage.setItem(item, JSON.stringify(parsedObject)));
    return true;
  }

  getLoaderStatus(selector) {
    return this.formLoaderStatus[selector];
  }

  async formLoaderInvoke(selector, { loader, button, text }) {
    if (!(selector in this.formLoaderStatus)) this.formLoaderStatus[selector] = false;
    this.formLoaderStatus[selector] = !this.formLoaderStatus[selector];
    try {
      if (this.formLoaderStatus[selector]) {
        if (button) document.querySelector(`${selector} ${button}`).classList.add('active');
        if (loader) document.querySelector(`${selector} ${loader}`).classList.add('active');
        if (button) document.querySelector(`${selector} ${button}`).innerHTML = text;
        return true;
      } else if (!this.formLoaderStatus[selector]) {
        if (button) document.querySelector(`${selector} ${button}`).classList.remove('active');
        if (loader) document.querySelector(`${selector} ${loader}`).classList.remove('active');
        if (button) document.querySelector(`${selector} ${button}`).innerHTML = text;
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  async clearFormMessage(selector, { wrapper, element }) {
    document.querySelector(`${selector} ${wrapper}`).style.display = 'none';
    document.querySelector(`${selector} ${element}`).innerHTML = '';
  }

  async displayFormMessage(selector, { wrapper, element, text }) {
    document.querySelector(`${selector} ${wrapper}`).style.display = 'grid';
    document.querySelector(`${selector} ${element}`).innerHTML = text;
    setTimeout(this.clearFormMessage, 5000, selector, { wrapper, element });
  }

  whoami() {
    return { name: 'katharos', version: '1.0.4' };
  }
}

export default Interface;
