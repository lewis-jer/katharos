const initialization = (_api) => {
  return async function (url) {
    let modulePath = _api.system.getModules();
    console.log(modulePath);
    for (const [key, current] of Object.entries(modulePath)) {
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
