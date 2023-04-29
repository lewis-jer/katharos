import { assembler, meta } from './plugin.js';
import { pageObjects } from './components.js';
import { helper } from './helper/index.js';
import { selectionController, getDeviceType } from './util.js';
import { System } from './helper/system.js';
import { loadPage, pageAnimations } from './action-canvas.js';

let modules = [
  { data: helper.dataHandler, invoke: false, enabled: true, type: ['spread'] },
  { data: meta, invoke: false, enabled: true, type: ['name', 'meta'] },
  { data: pageObjects, invoke: true, enabled: true, type: ['spread'] },
  { data: helper.tableMiddleware, invoke: true, enabled: true, type: ['spread'] },
  { data: selectionController, invoke: true, enabled: true, type: ['name', 'selectionController'] },
  { data: (_api) => (pageName) => _api.system.getModule(pageName), invoke: true, enabled: true, type: ['name', 'gatherPageInfo'] },
  { data: helper.modalSync, invoke: true, enabled: true, type: ['name', 'modalSync'] },
  { data: assembler, invoke: true, enabled: true, type: ['name', 'assembler'] },
  { data: helper.formMiddleware, invoke: false, enabled: true, lib: 'helper', type: ['spread', 'instance'] },
  { data: (ms) => new Promise((resolve) => setTimeout(resolve, ms)), invoke: false, enabled: true, type: ['name', 'timeout'] },
  { data: getDeviceType, invoke: false, enabled: true, type: ['name', 'getDeviceType'] },
  { data: loadPage, invoke: true, enabled: true, type: ['name', 'loadPage', 'call'] },
  { data: pageAnimations, invoke: false, enabled: true, type: ['name', 'pageAnimations'] }
];

class Interface {
  constructor(system) {
    this.system = system;
    this.user = system.getUser();
    this.store = system.getStore();
  }

  initialization(modules) {
    for (var module of modules) this.initialize(module);
    return 'Initialization Complete';
  }

  initialize(module) {
    let { data, enabled, invoke, type } = module;
    if (!enabled) return;
    let initializer = invoke && !type.includes('call') ? data(this) : type.includes('call') ? data.call(this) : data;
    initializer = type.includes('instance') ? new initializer(this)[module.lib] : initializer;
    if (type.includes('spread')) Object.assign(this, { ...initializer });
    if (type.includes('name')) this[type[1]] = initializer;
    this.formLoaderStatus = {};
  }

  async create() {
    for (const [key, current] of Object.entries(this.system.getModules())) {
      current.arrayExpression = current.endpoint;
      if (!current.system) continue;
      current.loaded = true;
      current.loadIndex = 0;
      await this.system.initializeController('system reserved');
      await this.system.initializeMiddleware('system reserved');
      for (var j in current.plugins) await this.assembler(current.plugins[j]);
    }
  }

  addEvent(name, data) {
    var id = this.system.createUniqueId();
    let string = JSON.stringify(data);
    let event = { detail: string, arrayExpression: id, id: id, identifier: name, location: document.location.href, timestamp: Date.now() };
    event_log.push(event);
    return true;
  }

  async _modifyStorageObject(item, { key, value }) {
    const parsedObject = await Promise.resolve(JSON.parse(localStorage.getItem(item)));
    await Promise.resolve((parsedObject[key] = value));
    await Promise.resolve(localStorage.setItem(item, JSON.stringify(parsedObject)));
    return true;
  }

  async formLoaderInvoke(selector, { loader, button, text }) {
    if (!(selector in this.formLoaderStatus)) this.formLoaderStatus[selector] = false;
    this.formLoaderStatus[selector] = !this.formLoaderStatus[selector];
    console.log(`${selector} ${loader}`);
    if (this.formLoaderStatus[selector]) {
      document.querySelector(`${selector} ${button}`).classList.add('active');
      document.querySelector(`${selector} ${loader}`).classList.add('active');
      document.querySelector(`${selector} ${button}`).innerHTML = text;
    } else if (!this.formLoaderStatus[selector]) {
      document.querySelector(`${selector} ${button}`).classList.remove('active');
      document.querySelector(`${selector} ${loader}`).classList.remove('active');
      document.querySelector(`${selector} ${button}`).innerHTML = text;
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
}

let api = new Interface(new System({ name: 'system-reserved' }));
api.initialization(modules);

const event_log = (window.event_log = []);
window._katharos_api_ = api;

export { api as _api };
