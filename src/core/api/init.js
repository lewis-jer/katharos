const initialization = (_api) => {
  return async function (url) {
    for (var i in modulePath) {
      modulePath[i].arrayExpression = modulePath[i].endpoint;
      if (modulePath[i].endpoint == 'system') {
        modulePath[i].loaded = true;
        modulePath[i].loadIndex = 0;
        controller.push('system reserved');
        middleware.push('system reserved');
        for (var j in modulePath[i].plugins) {
          if (modulePath[i].plugins[j].includes('js')) {
            try {
              await $.getScript(modulePath[i].plugins[j]);
              console.log(`${pluginIndex} => ${modulePath[i].plugins[j]}`);
              pluginIndex++;
              pluginLib[_api.stringToHash(modulePath[i].plugins[j])] =
                modulePath[i].plugins[j];
            } catch (e) {
              console.log(
                `${pluginIndex} => Failed To Load: ${modulePath[i].plugins[j]}`
              );
              pluginIndex++;
            }
          } else if (modulePath[i].plugins[j].includes('css')) {
            try {
              document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${
                modulePath[i].plugins[j]
              }?update=${Date.now()}>`;
              console.log(`${pluginIndex} => ${modulePath[i].plugins[j]}`);
              pluginIndex++;
              pluginLib[_api.stringToHash(modulePath[i].plugins[j])] =
                modulePath[i].plugins[j];
            } catch (e) {
              console.log(
                `${pluginIndex} => Failed To Load: ${modulePath[i].plugins[j]}`
              );
              pluginIndex++;
            }
          }
        }
      }
    }
  };
};

export { initialization };
