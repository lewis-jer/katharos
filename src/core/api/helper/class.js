import { v4 as uuidv4 } from 'uuid';

class System {
  constructor(data) {
    this.data = {
      processName: data.name,
      pluginIndex: 0,
      pluginLib: {},
      controller: [],
      controllerConfig: {},
      middleware: [],
      middlewareConfig: {},
      componentLib: { navigationBar: { status: false } }
    };
    this.next = null;
  }

  configure = (config) => {
    for (const [key, value] of Object.entries(config)) {
      console.log(key, value);
      const entries = Object.fromEntries(new Map([[key, value]]));
      console.log(entries);
      console.log(key.includes('controller'));
      key.includes('controller') &&
        Object.assign(this.data.controllerConfig, { ...value });

      key.includes('middleware') &&
        Object.assign(this.data.middlewareConfig, { ...entries });
    }
  };

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
          controllerConfig[pageInfo.arrayExpression]
        )
      : this.data.controller.push(false);
    return true;
  }

  async initializeMiddleware(pageInfo) {
    pageInfo.middleware
      ? await this.data.middleware.push(
          middlewareConfig[pageInfo.arrayExpression]
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
}

export { System };
