import { v4 as uuidv4 } from 'uuid';
import { User } from './user.js';
import { Store } from './store.js';

class System {
  constructor(data) {
    this.data = {
      baseURL: '',
      user: new User({ name: 'system-reserved' }),
      store: new Store({ name: 'system-reserved' }),
      cards: {},
      charts: {},
      components: {},
      componentLib: { navigationBar: { status: false } },
      http: {},
      httpConfig: {},
      loadIndex: 1,
      middleware: [],
      middlewareConfig: {},
      modules: {},
      packages: {},
      panes: {},
      pluginIndex: 0,
      pluginLib: {},
      pluginRegister: [],
      pluginInternal: [],
      processName: data.name,
      services: {},
      animation: {
        slideUp: async function (element, duration = 500) {
          return await new Promise(async (resolve) => {
            let target = document.querySelector(element);
            if (!target) return;
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.boxSizing = 'border-box';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
              target.style.display = 'none';
              target.style.removeProperty('height');
              target.style.removeProperty('padding-top');
              target.style.removeProperty('padding-bottom');
              target.style.removeProperty('margin-top');
              target.style.removeProperty('margin-bottom');
              target.style.removeProperty('overflow');
              target.style.removeProperty('transition-duration');
              target.style.removeProperty('transition-property');
              return resolve(true);
            }, duration);
          });
        },
        slideDown: async function (element, duration = 500, props = {}) {
          return await new Promise(async (resolve) => {
            let target = document.querySelector(element);
            target.style.removeProperty('display');
            let display = window.getComputedStyle(target).display;
            if (display === 'none') display = props?.display || 'block';
            target.style.display = display;
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.boxSizing = 'border-box';
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout(() => {
              target.style.removeProperty('height');
              target.style.removeProperty('overflow');
              target.style.removeProperty('transition-duration');
              target.style.removeProperty('transition-property');
              return resolve(true);
            }, duration);
          });
        },
        fadeIn: async function (element, speed, props = {}) {
          let elem = document.querySelector(element);
          if (!elem) return;
          elem.style.opacity = 0;
          elem.style.display = props?.display || 'block';

          if (elem.style.opacity <= 0) {
            return await new Promise((resolve) => {
              var inInterval = setInterval(function () {
                elem.style.opacity = Number(elem.style.opacity) + 0.02;
                if (elem.style.opacity >= 1) {
                  clearInterval(inInterval);
                  return resolve(true);
                }
              }, speed / 50);
            });
          }
        },
        fadeOut: async function (element, speed) {
          let elem = document.querySelector(element);
          if (!elem) return;
          if (!elem.style.opacity) elem.style.opacity = 1;

          if (elem.style.opacity <= 1) {
            return await new Promise((resolve) => {
              var outInterval = setInterval(function () {
                elem.style.opacity -= 0.02;
                if (elem.style.opacity <= 0) {
                  clearInterval(outInterval);
                  elem.style.display = 'none';
                  return resolve(true);
                }
              }, speed / 50);
            });
          }
        }
      }
    };
    this.next = null;
  }

  configure(config) {
    for (const [key, value] of Object.entries(config)) {
      key.includes('Router') && (this.router = value);
      key.includes('middleware') && Object.assign(this.data.middlewareConfig, { ...value });
      key.includes('secret') && this.setSecureContainer(value);
      key.match(/^baseURL$/) && (this.data.baseURL = value);
      if (key.includes('components')) for (const item of value) this.data.components[item.arrayExpression] = item;
      if (key.includes('modules_ssr')) {
        this.data.modules_ssr = value;
        continue;
      }
      if (key.includes('modules')) {
        for (const item of value) {
          this.setModule(item);
        }
      }
      if (key.includes('cards')) Object.assign(this.data.cards, { ...value });
      if (key.includes('panes')) Object.assign(this.data.panes, { ...value });
      if (key.includes('charts')) for (const [m, i] of Object.entries(value)) i.forEach((j) => (this.data.charts[j.arrayExpression] = j));

      if (key.includes('preloader') && value) {
        this.data.preloader = true;
        this.componentLoader('preloader', true);
        document.getElementById('preloader').classList.add(this.getComponent('preloader').class);
        document.getElementById('preloader').innerHTML = this.getComponent('preloader').html;
      } else {
        this.data.preloader = false;
        this.componentLoader('preloader', false);
      }

      key.includes('packages') && Object.assign(this.data.packages, { ...value });
      key.includes('services') && Object.assign(this.data.services, { ...value });
    }
  }

  registerPlugin(plugin) {
    this.data.pluginRegister.push(plugin.name);
  }

  getUser() {
    return this.data.user;
  }

  getStore() {
    return this.data.store;
  }

  getBaseURL() {
    return this.data.baseURL;
  }

  setHttp(http) {
    this.data.httpConfig = http;
  }

  getLoadIndex() {
    return this.data.loadIndex;
  }

  incrementLoadIndex() {
    this.data.loadIndex++;
  }

  async setupHttpService(object) {
    this.data.http = await Promise.resolve(this.data.httpConfig.create(object));
  }

  http() {
    return this.data.http;
  }

  getChart(name) {
    return this.data.charts[name];
  }

  getComponent(name) {
    return this.data.components[name];
  }

  getComponents() {
    return this.data.components;
  }

  setModule(item) {
    item.arrayExpression = item.endpoint;
    item.id = uuidv4();
    this.data.modules[item.endpoint] = item;
    return this.data.modules[item.endpoint];
  }

  getModule(name) {
    return this.data.modules[name];
  }

  getModules() {
    return this.data.modules;
  }

  getPackage(name) {
    return this.data.packages[name];
  }

  getPackages() {
    return this.data.packages;
  }

  getService(name) {
    return this.data.services[name];
  }

  setChartActiveElement(name, element) {
    this.data.charts[name].active = element;
  }

  getPlugin(plugin) {
    return this.data.pluginLib[this.stringToHash(plugin)];
  }

  getPluginIndex() {
    return this.data.pluginIndex;
  }

  getComponentStatus(component) {
    return this.data.componentLib[component].status;
  }

  getComponentId(component) {
    return this.data.componentLib[component].id;
  }

  updatePlugin(plugin) {
    this.data.pluginLib[this.stringToHash(plugin)] = plugin;
    this.data.pluginIndex++;
    return this.data;
  }

  componentLoader(component, toggle) {
    if (!Object.keys(this.data.componentLib).includes(component)) this.data.componentLib[component] = {};
    this.data.componentLib[component].status = toggle;
    if (toggle) this.data.componentLib[component].id = uuidv4();
    return toggle;
  }

  stringToHash(string) {
    var hash = 0,
      i,
      char;
    if (string.length == 0) return hash;
    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return 'eyz' + hash;
  }

  getSecureContainer() {
    return this.data[this.data.id];
  }

  setSecureContainer(value) {
    const secureId = uuidv4();
    this.data[secureId] = {};
    this.data.id = secureId;
    Object.assign(this.data[secureId], { ...value });
    return secureId;
  }

  setSecureContainerItem(key, value) {
    this.data[this.data.id][key] = value;
  }

  setSecureURL(value) {
    this.data[this.data.id].url = value;
    return true;
  }

  getMiddleware(index) {
    return this.data.middleware[index];
  }

  async initializeMiddleware(pageInfo) {
    pageInfo.middleware ? await this.data.middleware.push(this.data.middlewareConfig[pageInfo.endpoint]) : this.data.middleware.push(false);
    return true;
  }

  async instantiateMiddleware(_api, pageInfo) {
    async function instantiate() {
      try {
        await this.getMiddleware(pageInfo.loadIndex)(_api);
        // console.log('Awaiting Middleware');
        return 'Middleware Instantiation Success';
      } catch (error) {
        console.log(error);
        return 'Middleware Instantiation Failure';
      }
    }

    var instantiation = this.data.middleware[pageInfo.loadIndex] ? await instantiate.call(this) : 'Middleware Instantiation Fail';
    return instantiation;
  }

  createUniqueId() {
    return uuidv4();
  }
}

export { System };
