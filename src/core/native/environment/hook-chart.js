const dynamicChartLoader = async function (_api) {
  if (!Object.keys(pluginLib).includes(_api.stringToHash(verb.src))) {
    // Generate Page Charts
    window.verbAsyncInit = function () {
      Verb.init({
        apiKey: 'c2d55c3e-124b-478a-870b-171e861718ff',
        version: 'v1.0',
        authParams: {
          userToken: `${JSON.parse(localStorage.getItem('user')).accessToken}`
        }
      });
    };

    await document.getElementsByTagName('head')[0].appendChild(verb);

    pluginLib[_api.stringToHash(verb.src)] = verb.src;
  } else {
    window.Verb.init({
      apiKey: 'c2d55c3e-124b-478a-870b-171e861718ff',
      version: 'v1.0',
      authParams: {
        userToken: `${JSON.parse(localStorage.getItem('user')).accessToken}`
      }
    });
  }
};

export { dynamicChartLoader };
