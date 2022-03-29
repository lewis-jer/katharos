class System {
  constructor(data) {
    this.data = {
      processName: data.name,
      pluginIndex: 0,
      pluginLib: {},
      componentLib: { navigationBar: { status: false } }
    };
    this.next = null;
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

  updatePlugin(plugin) {
    this.data.pluginLib[this.stringToHash(plugin)] = plugin;
    this.data.pluginIndex++;
    return this.data;
  }

  componentLoader(component, toggle) {
    //console.log(uuid());
    this.data.componentLib[component].status = toggle;
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
}

export { System };
