let plugins = [];
try {
  plugins.push('katharos-router');
} catch (e) {
  console.error('katharos-router is not found');
}

const jsAssembler = async (_api, modulePlugin) => {
  await $.getScript(modulePlugin);
  _api.system.updatePlugin(modulePlugin);
};

const cssAssembler = async (_api, modulePlugin) => {
  document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${modulePlugin}?update=${Date.now()}>`;
  _api.system.updatePlugin(modulePlugin);
};

const assembler = async (_api) => {
  return async (modulePlugin) => {
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
