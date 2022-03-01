const pluginLoader = async function (_api, pageInfo) {
  for (var j in pageInfo.plugins) {
    if (pageInfo.plugins[j].includes('js')) {
      try {
        if (
          !Object.keys(pluginLib).includes(
            _api.stringToHash(pageInfo.plugins[j])
          )
        ) {
          await $.getScript(pageInfo.plugins[j]);
          console.log(`${window.pluginIndex} => ${pageInfo.plugins[j]}`);
          window.pluginIndex++;
          pluginLib[_api.stringToHash(pageInfo.plugins[j])] =
            pageInfo.plugins[j];
        }
      } catch (e) {}
    } else if (pageInfo.plugins[j].includes('css')) {
      try {
        if (
          !Object.keys(pluginLib).includes(
            _api.stringToHash(pageInfo.plugins[j])
          )
        ) {
          document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${
            pageInfo.plugins[j]
          }?update=${Date.now()}>`;
          console.log(`${window.pluginIndex} => ${pageInfo.plugins[j]}`);
          window.pluginIndex++;
          pluginLib[_api.stringToHash(pageInfo.plugins[j])] =
            pageInfo.plugins[j];
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
