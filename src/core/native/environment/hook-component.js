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

export { componentLoader };
