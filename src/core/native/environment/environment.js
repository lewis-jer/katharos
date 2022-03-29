const pluginLoader = async function (_api, pageInfo) {
  for (var j in pageInfo.plugins) {
    if (pageInfo.plugins[j].includes('js')) {
      try {
        if (
          !Object.keys(_api.system.data.pluginLib).includes(
            _api.system.stringToHash(pageInfo.plugins[j])
          )
        ) {
          await $.getScript(pageInfo.plugins[j]);
          console.log(
            `${_api.system.getPluginIndex()} => ${pageInfo.plugins[j]}`
          );
          _api.system.updatePlugin(pageInfo.plugins[j]);
        }
      } catch (e) {}
    } else if (pageInfo.plugins[j].includes('css')) {
      try {
        if (
          !Object.keys(_api.system.data.pluginLib).includes(
            _api.system.stringToHash(pageInfo.plugins[j])
          )
        ) {
          document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${
            pageInfo.plugins[j]
          }?update=${Date.now()}>`;
          console.log(
            `${_api.system.getPluginIndex()} => ${pageInfo.plugins[j]}`
          );
          _api.system.updatePlugin(pageInfo.plugins[j]);
        }
      } catch (e) {}
    }
  }
};
const controllerLoader = async function (_api, pageInfo) {
  controller.push(
    pageInfo.controller
      ? await controllerConfig[pageInfo.arrayExpression]
      : false
  );
};
const middlewareLoader = async function (_api, pageInfo) {
  middleware.push(
    pageInfo.middleware
      ? await middlewareConfig[pageInfo.arrayExpression]
      : false
  );
};

export { pluginLoader, controllerLoader, middlewareLoader };
