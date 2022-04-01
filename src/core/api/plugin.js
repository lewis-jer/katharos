let plugins = [];
try {
  plugins.push('katharos-router');
} catch (e) {
  console.error('katharos-router is not found');
}

const jsAssembler = async (_api, modulePlugin) => {
  if (
    !Object.keys(_api.system.data.pluginLib).includes(
      _api.system.stringToHash(modulePlugin)
    )
  ) {
    await $.getScript(modulePlugin);
    _api.system.updatePlugin(modulePlugin);
  }
};

const cssAssembler = async (_api, modulePlugin) => {
  if (
    !Object.keys(_api.system.data.pluginLib).includes(
      _api.system.stringToHash(modulePlugins)
    )
  ) {
    document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${modulePlugin}?update=${Date.now()}>`;
    _api.system.updatePlugin(modulePlugin);
  }
};

const assembler = (_api) => {
  return async (modulePlugin) => {
    console.log(modulePlugin);
    if (modulePlugin.includes('js')) {
      try {
        await jsAssembler(_api, modulePlugin);
      } catch (e) {
        _api.system.updatePlugin(modulePlugin);
      }
    } else if (modulePlugin.includes('css')) {
      try {
        await cssAssembler(_api, modulePlugin);
      } catch (e) {
        _api.system.updatePlugin(modulePlugin);
      }
    }
  };
};

export { plugins, assembler };
