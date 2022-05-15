import { v4 as uuidv4 } from 'uuid';

class System {
  constructor(data) {
    this.data = {
      exclusions: {},
      processName: data.name,
      pluginIndex: 0,
      pluginLib: {},
      controller: [],
      controllerConfig: {},
      middleware: [],
      middlewareConfig: {},
      componentLib: { navigationBar: { status: false } },
      modals: {},
      forms: {},
      charts: {},
      tables: {}
    };
    this.next = null;
  }

  configure = (config) => {
    for (const [key, value] of Object.entries(config)) {
      key.includes('controller') &&
        Object.assign(this.data.controllerConfig, { ...value });

      key.includes('middleware') &&
        Object.assign(this.data.middlewareConfig, { ...value });

      key.includes('excludes') && this.setExclusions(value);

      key.includes('secret') && this.setSecureContainer(value);

      if (key.includes('modals')) {
        for (const [module, modals] of Object.entries(value)) {
          modals.forEach((modal) => {
            this.data.modals[modal.arrayExpression] = modal;
          });
        }
      }

      if (key.includes('forms')) {
        for (const [module, forms] of Object.entries(value)) {
          forms.forEach((form) => {
            this.data.forms[form.arrayExpression] = form;
          });
        }
      }

      if (key.includes('charts')) {
        for (const [module, charts] of Object.entries(value)) {
          charts.forEach((chart) => {
            this.data.charts[chart.arrayExpression] = chart;
          });
        }
      }

      if (key.includes('tables')) {
        for (const [module, tables] of Object.entries(value)) {
          tables.forEach((table) => {
            this.data.tables[table.arrayExpression] = table;
          });
        }
      }
    }
  };

  getModal(name) {
    return this.data.modals[name];
  }

  getForm(name) {
    return this.data.forms[name];
  }

  getChart(name) {
    return this.data.charts[name];
  }

  getTable(name) {
    return this.data.tables[name];
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
    if (!Object.keys(this.data.componentLib).includes(component))
      this.data.componentLib[component] = {};
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

  setNextNode(node) {
    if (node instanceof System || node === null) {
      this.next = node;
    } else {
      throw new Error('Next node must be a member of the Node class.');
    }
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

  getNextNode() {
    return this.next;
  }

  getController(index) {
    return this.data.controller[index];
  }

  getMiddleware(index) {
    return this.data.middleware[index];
  }

  async initializeController(pageInfo) {
    pageInfo.controller
      ? await this.data.controller.push(
          this.data.controllerConfig[pageInfo.arrayExpression]
        )
      : this.data.controller.push(false);
    return true;
  }

  async initializeMiddleware(pageInfo) {
    pageInfo.middleware
      ? await this.data.middleware.push(
          this.data.middlewareConfig[pageInfo.arrayExpression]
        )
      : this.data.middleware.push(false);
    return true;
  }

  async instantiateMiddleware(_api, pageInfo) {
    this.data.middleware[pageInfo.loadIndex]
      ? await this.getMiddleware(pageInfo.loadIndex)(_api)
      : false;
    return true;
  }

  createUniqueId() {
    return uuidv4();
  }

  getExclusions(index) {
    return this.data.exclusions[index];
  }

  setExclusions(exclusionList) {
    for (const [key, value] of Object.entries(exclusionList)) {
      !(key in this.data.exclusions) && (this.data.exclusions[key] = []);
      this.data.exclusions[key].push(...value);
    }
    return true;
  }
}

class User {
  constructor(data) {
    this.data = {
      userLocalSession: {},
      userProfile: {}
    };
    this.next = null;
  }

  getLocalStorageItem() {
    return localStorage.getItem('user') || null;
  }

  getUsername() {
    return this.data.username;
  }

  setLocalStorageItem(user) {
    localStorage.setItem('user', user);
  }

  parseUserObject(user) {
    for (const [key, value] of Object.entries(user)) {
      Object.assign(this.data.userLocalSession, { ...value });
    }
    setLocalStorageItem(user);
  }

  initializeUser(user) {
    typeof user == 'object' ? parseUserObject(user) : setLocalStorageItem(user);
  }

  setUserProfile(data) {
    Object.assign(this.data.userProfile, { ...data });
    this.data.username = data.username;
  }

  setUsername(username) {
    this.data.username = username;
  }

  getUserProfileData(key) {
    return this.data.userProfile[key];
  }

  getUserItem(item, lookupValue) {
    const object = this.data.userProfile[item.target];
    var response;
    object.forEach((element) => {
      element[item.lookupIndex];
      if (element[item.lookupIndex] == lookupValue) {
        response = element.Category;
      }
    });
    return response;
  }

  getUserItems(item, lookupValue) {
    const object = this.data.userProfile[item.target];
    var response;
    object.forEach((element) => {
      if (element[item.lookupIndex] == lookupValue) {
        response = element;
      }
    });
    return response;
  }
  getRandomUserItem(key) {
    var randomNumber =
      Math.floor(Math.random() * (this.data.userProfile[key].length - 1 - 0)) +
      0;
    return this.data.userProfile[key][randomNumber];
  }
}

export { System, User };
