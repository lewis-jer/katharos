let plugins = [];
try {
  console.log(require.resolve('katharos-router'));
  plugins.push('katharos-router');
} catch (e) {
  console.error('katharos-router is not found');
}

const jsAssembler = async (_api, modulePlugin) => {
  await $.getScript(modulePlugin);
  console.log(`${pluginIndex} => ${modulePlugin}`);
  pluginIndex++;
  pluginLib[_api.stringToHash(modulePlugin)] = modulePlugin;
};

const cssAssembler = async (_api, modulePlugin) => {
  document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${modulePlugin}?update=${Date.now()}>`;
  console.log(`${pluginIndex} => ${modulePlugin}`);
  pluginIndex++;
  pluginLib[_api.stringToHash(modulePlugin)] = modulePlugin;
};

const assembler = (_api) => {
  return async (modulePlugin) => {
    if (modulePlugin.includes('js')) {
      try {
        await jsAssembler(_api, modulePlugin);
      } catch (e) {
        console.log(`${pluginIndex} => Failed To Load: ${modulePlugin}`);
        pluginIndex++;
      }
    } else if (modulePlugin.includes('css')) {
      try {
        await cssAssembler(_api, modulePlugin);
      } catch (e) {
        console.log(`${pluginIndex} => Failed To Load: ${modulePlugin}`);
        pluginIndex++;
      }
    }
  };
};

export { plugins, assembler };
