let plugins = [];
try {
  //console.log(require.resolve('katharos-router'));
  plugins.push('katharos-router');
} catch (e) {
  console.error('katharos-router is not found');
}

const jsAssembler = async (_api, modulePlugin) => {
  await $.getScript(modulePlugin);
  //console.log(`${_api.system.getPluginIndex()} => ${modulePlugin}`);
  _api.system.updatePlugin(modulePlugin);
  pluginLib[_api.stringToHash(modulePlugin)] = modulePlugin;
};

const cssAssembler = async (_api, modulePlugin) => {
  document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${modulePlugin}?update=${Date.now()}>`;
  //console.log(`${_api.system.getPluginIndex()} => ${modulePlugin}`);
  _api.system.updatePlugin();
  pluginLib[_api.stringToHash(modulePlugin)] = modulePlugin;
};

const assembler = (_api) => {
  return async (modulePlugin) => {
    if (modulePlugin.includes('js')) {
      try {
        await jsAssembler(_api, modulePlugin);
      } catch (e) {
        console.log(
          `${_api.system.getPluginIndex()} => Failed To Load: ${modulePlugin}`
        );
        _api.system.updatePlugin();
      }
    } else if (modulePlugin.includes('css')) {
      try {
        await cssAssembler(_api, modulePlugin);
      } catch (e) {
        console.log(
          `${_api.system.getPluginIndex()} => Failed To Load: ${modulePlugin}`
        );
        _api.system.updatePlugin();
      }
    }
  };
};

export { plugins, assembler };
