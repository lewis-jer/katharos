import {
  pluginLoader,
  controllerLoader,
  middlewareLoader,
} from "./environment";

const pageLoader = async function (pageInfo) {
  pageInfo.loadIndex = pageActions.loadIndex;
  await pluginLoader(pageInfo);
  await controllerLoader(pageInfo);
  await middlewareLoader(pageInfo);
  middleware[pageActions.loadIndex]
    ? middleware[pageActions.loadIndex]()
    : false;
  pageInfo.loaded = true;
  pageActions.loadIndex++;
};
const pageReloader = async function (pageInfo) {
  middleware[pageInfo.loadIndex]
    ? await middleware[pageInfo.loadIndex]()
    : false;
};
const dynamicChartLoader = async function () {
  if (!Object.keys(pluginLib).includes(dataWorker.stringToHash(verb.src))) {
    // Generate Page Charts
    window.verbAsyncInit = function () {
      Verb.init({
        apiKey: "c2d55c3e-124b-478a-870b-171e861718ff",
        version: "v1.0",
        authParams: {
          userToken: `${JSON.parse(localStorage.getItem("user")).accessToken}`,
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
};
const componentLoader = async function (pageInfo) {
  var systemComponents = arrayFunctions.arrayToObject(components.system);

  //Clear Page
  document.getElementById("wrapper").innerHTML = "";

  //Generate Page Navigation Bar
  document.getElementById("wrapper").innerHTML += systemComponents.navbar.html;

  componentLib.navigationBar.status = true;
  componentLib.navigationBar.id = uuid();

  arrayFunctions.arrayToObject(modulePath)[
    arrayFunctions.arrayToObject(components.system).navbar.arrayExpression
  ].loaded
    ? await pageReloader(
        arrayFunctions.arrayToObject(modulePath)[
          arrayFunctions.arrayToObject(components.system).navbar.arrayExpression
        ]
      )
    : await pageLoader(
        arrayFunctions.arrayToObject(modulePath)[
          arrayFunctions.arrayToObject(components.system).navbar.arrayExpression
        ]
      );

  eventMiddleware.addEvent("loadComponent", {
    componentId: componentLib.navigationBar.id,
    userIdentifier: JSON.parse(localStorage.getItem("user")).email,
    location: window.endpoint,
  });

  //Generate Page Body
  document.getElementById("content").innerHTML += systemComponents.loader.html;

  componentLib.pageLoader = {};
  componentLib.pageLoader.status = true;
  componentLib.pageLoader.id = uuid();

  eventMiddleware.addEvent("loadComponent", {
    componentId: componentLib.pageLoader.id,
    userIdentifier: JSON.parse(localStorage.getItem("user")).email,
    location: window.endpoint,
  });

  //Generate Page Footer
  document.getElementById("content").innerHTML += systemComponents.footer.html;

  componentLib.footer = {};
  componentLib.footer.status = true;
  componentLib.footer.id = uuid();

  eventMiddleware.addEvent("loadComponent", {
    componentId: componentLib.footer.id,
    userIdentifier: JSON.parse(localStorage.getItem("user")).email,
    location: window.endpoint,
  });
};

export { pageLoader, pageReloader, dynamicChartLoader, componentLoader };
