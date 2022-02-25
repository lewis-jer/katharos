const pageMiddleware = {
  pageLoader: async function (pageInfo) {
    pageInfo.loadIndex = pageActions.loadIndex;
    await pageMiddleware.pluginLoader(pageInfo);
    await pageMiddleware.controllerLoader(pageInfo);
    await pageMiddleware.middlewareLoader(pageInfo);
    middleware[pageActions.loadIndex]
      ? middleware[pageActions.loadIndex]()
      : false;
    pageInfo.loaded = true;
    pageActions.loadIndex++;
  },
  pageReloader: async function (pageInfo) {
    middleware[pageInfo.loadIndex]
      ? await middleware[pageInfo.loadIndex]()
      : false;
  },
  dynamicChartLoader: async function () {
    if (!Object.keys(pluginLib).includes(dataWorker.stringToHash(verb.src))) {
      // Generate Page Charts
      window.verbAsyncInit = function () {
        Verb.init({
          apiKey: "c2d55c3e-124b-478a-870b-171e861718ff",
          version: "v1.0",
          authParams: {
            userToken: `${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        });
      };

      await document.getElementsByTagName("head")[0].appendChild(verb);

      pluginLib[dataWorker.stringToHash(verb.src)] = verb.src;
    } else {
      window.Verb.init({
        apiKey: "c2d55c3e-124b-478a-870b-171e861718ff",
        version: "v1.0",
        authParams: {
          userToken: `${JSON.parse(localStorage.getItem("user")).accessToken}`,
        },
      });
    }
  },
  dynamicTableDestructor: async function (pageInfo) {
    if (pageInfo.dynamicTables) {
      if (pageInfo.dynamicTables.status) {
        for (var i in pageInfo.dynamicTables.tables) {
          _dom.emptyTable(pageInfo.dynamicTables.tables[i], true);
        }
      }
    }
  },
  pluginLoader: async function (pageInfo) {
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
  },
  controllerLoader: async function (pageInfo) {
    controller.push(
      pageInfo.controller
        ? await controllerConfig[pageInfo.arrayExpression]
        : false
    );
  },
  middlewareLoader: async function (pageInfo) {
    middleware.push(
      pageInfo.middleware
        ? await middlewareConfig[pageInfo.arrayExpression]
        : false
    );
    console.log(middleware);
  },
  componentLoader: async function (pageInfo) {
    var systemComponents = arrayFunctions.arrayToObject(components.system);

    //Clear Page
    document.getElementById("wrapper").innerHTML = "";

    //Generate Page Navigation Bar
    document.getElementById("wrapper").innerHTML +=
      systemComponents.navbar.html;

    componentLib.navigationBar.status = true;
    componentLib.navigationBar.id = uuid();

    arrayFunctions.arrayToObject(modulePath)[
      arrayFunctions.arrayToObject(components.system).navbar.arrayExpression
    ].loaded
      ? await pageMiddleware.pageReloader(
          arrayFunctions.arrayToObject(modulePath)[
            arrayFunctions.arrayToObject(components.system).navbar
              .arrayExpression
          ]
        )
      : await pageMiddleware.pageLoader(
          arrayFunctions.arrayToObject(modulePath)[
            arrayFunctions.arrayToObject(components.system).navbar
              .arrayExpression
          ]
        );

    eventMiddleware.addEvent("loadComponent", {
      componentId: componentLib.navigationBar.id,
      userIdentifier: JSON.parse(localStorage.getItem("user")).email,
      location: window.endpoint,
    });

    //Generate Page Body
    document.getElementById("content").innerHTML +=
      systemComponents.loader.html;

    componentLib.pageLoader = {};
    componentLib.pageLoader.status = true;
    componentLib.pageLoader.id = uuid();

    eventMiddleware.addEvent("loadComponent", {
      componentId: componentLib.pageLoader.id,
      userIdentifier: JSON.parse(localStorage.getItem("user")).email,
      location: window.endpoint,
    });

    //Generate Page Footer
    document.getElementById("content").innerHTML +=
      systemComponents.footer.html;

    componentLib.footer = {};
    componentLib.footer.status = true;
    componentLib.footer.id = uuid();

    eventMiddleware.addEvent("loadComponent", {
      componentId: componentLib.footer.id,
      userIdentifier: JSON.parse(localStorage.getItem("user")).email,
      location: window.endpoint,
    });
  },
  pageDestructor: async function (pageInfo) {
    document.getElementById(pageInfo.viewport).innerHTML = "";
  },
  drawPage: async function (pageName, pageInfo) {
    var body = documents[pageInfo.arrayExpression].html;
    if (
      pageName == "login" ||
      pageName == "account_verify" ||
      pageName == "eula"
    ) {
      document.body.classList.add("bg-gradient-primary");
      componentLib.navigationBar.status = false;
    } else if (!pageInfo.document && !componentLib.navigationBar.status) {
      await pageMiddleware.componentLoader(pageInfo);
      let loaderStatus = !configuration.katharos.pageLoader.excludes.includes(
        pageName
      )
        ? await configuration.katharos.pageLoader.script(pageInfo.name)
        : "Loader Not Initialized";
    }

    document.getElementById(pageInfo.viewport).innerHTML = body;

    if (!pageInfo.document && pageInfo.dynamicCharts) {
      await pageMiddleware.dynamicChartLoader();
    }

    if (!pageInfo.loaded) {
      await pageMiddleware.pageLoader(pageInfo);
    } else {
      await pageMiddleware.pageReloader(pageInfo);
    }

    history.replaceState({}, null, window.domain + pageName);
  },
  selective: [""],
  excludes: ["r", "login"],
  function: true,
};

export { pageMiddleware };
