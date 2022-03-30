const initialization = (_api) => {
  return async function (url) {
    for (var i in modulePath) {
      modulePath[i].arrayExpression = modulePath[i].endpoint;
      if (modulePath[i].endpoint == 'system') {
        modulePath[i].loaded = true;
        modulePath[i].loadIndex = 0;
        _api.system.initializeController('system reserved');
        controller.push('system reserved');
        middleware.push('system reserved');
        for (var j in modulePath[i].plugins) {
          _api.assembler(modulePath[i].plugins[j]);
        }
      }
    }
  };
};

export { initialization };
