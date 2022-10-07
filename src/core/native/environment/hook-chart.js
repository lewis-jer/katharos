async function dynamicChartLoader() {
  if (
    !Object.keys(this.system.data.pluginLib).includes(
      this.system.stringToHash(verb.src)
    )
  ) {
    // Generate Page Charts
    window.verbAsyncInit = function () {
      Verb.init({
        apiKey: configs.chart,
        version: 'v1.0',
        authParams: {
          userToken: `${JSON.parse(localStorage.getItem('user')).accessToken}`
        }
      });
    };

    await document.getElementsByTagName('head')[0].appendChild(verb);
    this.system.updatePlugin(verb.src);
  } else {
    window.Verb.init({
      apiKey: configs.chart,
      version: 'v1.0',
      authParams: {
        userToken: `${JSON.parse(localStorage.getItem('user')).accessToken}`
      }
    });
  }
}

export { dynamicChartLoader };
