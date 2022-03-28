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
          _api.assembler(modulePath[i].plugins[j]);
        }
        console.log(_api.pluginIndex);
      }
    }
  };
};

export { initialization };
