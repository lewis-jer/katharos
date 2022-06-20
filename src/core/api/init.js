const initialization = (_api) => {
  return async function (url) {
    modulePath = _api.system.getModules();
    for (const current in modulePath) {
      current.arrayExpression = current.endpoint;
      if (current.system) {
        current.loaded = true;
        current.loadIndex = 0;
        await _api.system.initializeController('system reserved');
        await _api.system.initializeMiddleware('system reserved');
        for (var j in current.plugins) {
          await _api.assembler(current.plugins[j]);
        }
      }
    }
  };
};

export { initialization };
