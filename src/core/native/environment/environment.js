const pluginLoader = async function (pageInfo) {
  for (var j in pageInfo.plugins) {
    if (pageInfo.plugins[j].includes("js")) {
      try {
        if (
          !Object.keys(pluginLib).includes(
            dataWorker.stringToHash(pageInfo.plugins[j])
          )
        ) {
          await $.getScript(pageInfo.plugins[j]);
          console.log(`${window.pluginIndex} => ${pageInfo.plugins[j]}`);
          window.pluginIndex++;
          pluginLib[dataWorker.stringToHash(pageInfo.plugins[j])] =
            pageInfo.plugins[j];
        }
      } catch (e) {}
    } else if (pageInfo.plugins[j].includes("css")) {
      try {
        if (
          !Object.keys(pluginLib).includes(
            dataWorker.stringToHash(pageInfo.plugins[j])
          )
        ) {
          document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${
            pageInfo.plugins[j]
          }?update=${Date.now()}>`;
          console.log(`${window.pluginIndex} => ${pageInfo.plugins[j]}`);
          window.pluginIndex++;
          pluginLib[dataWorker.stringToHash(pageInfo.plugins[j])] =
            pageInfo.plugins[j];
        }
      } catch (e) {}
    }
  }
};
const controllerLoader = async function (pageInfo) {
  controller.push(
    pageInfo.controller
      ? await controllerConfig[pageInfo.arrayExpression]
      : false
  );
};
const middlewareLoader = async function (pageInfo) {
  middleware.push(
    pageInfo.middleware
      ? await middlewareConfig[pageInfo.arrayExpression]
      : false
  );
  console.log(middleware);
};

export { pluginLoader, controllerLoader, middlewareLoader };
