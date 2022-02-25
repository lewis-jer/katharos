import {pageActions} from '../core/action.js'

console.log(pageActions)

const initialization = async function (url) {
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
            pluginLib[dataWorker.stringToHash(modulePath[i].plugins[j])] =
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
            pluginLib[dataWorker.stringToHash(modulePath[i].plugins[j])] =
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

    // Match Active Endpoint To Available Module
    if (url == modulePath[i].endpoint) {
      // Audit And Initialize Core Plugins
    }
  }
};

const katharos = {    
    pageActions: {
        loadPage: async function (currPage, pageName) {
          let router = await routerActions.getEndpoint(currPage, pageName);
          console.log(router);
          if (router.sourceRouteInformation.loaded) {
            eventMiddleware.addEvent('clearPage', {
              documentId: documents[currPage].id,
              userIdentifier: router.authentication.userId,
              location: currPage
            });
            await pageActions.clearPage(router.sourceRouteInformation);
          }
  
          window.endpoint = router.route;
          await pageActions.generatePage(router.route, router.routeInformation);
          eventMiddleware.addEvent('generatePage', {
            documentId: documents[router.route].id,
            userIdentifier: router.authentication.userId,
            target: router.route
          });
        },
        clearPage: async function (pageInfo) {
          await pageMiddleware.dynamicTableDestructor(pageInfo);
          await pageMiddleware.pageDestructor(pageInfo);
        },
        gatherPageInfo: function (pageName) {
          return arrayFunctions.arrayToObject(modulePath)[pageName];
        },
        generatePage: async function (pageName, pageInfo) {
          await pageMiddleware.drawPage(pageName, pageInfo);
        },
        selective: [''],
        loadIndex: 1,
        excludes: ['r', 'login'],
        function: true
    },
    pageLoader: {
      script: async function (x) {
        await $(document).ready(function (event) {
          document.querySelector('#loader').style.display = 'none';
          analytics.page(x);
          $('#loaderDiv').fadeIn(750);
          $('#footer').fadeIn(750);
          //console.log('Initialization Complete')
        });
        return 'Module Initialization';
      },
      loginLoader: async function (x = false) {
        if (x) {
        } else {
          document.getElementById('loginAuthBtn').hidden = true;
          document.getElementById('loginAuthSafeBtn').hidden = false;
          document.getElementById('loginAuthSafeBtn').innerHTML =
            'Loading...';
          document.getElementById('loginAuthSafeBtn').style.backgroundColor =
            '#8CA4EA';
          document.getElementById('loginAuthSafeBtn').style.borderColor =
            '#8CA4EA';
          document.getElementsByClassName('loginloader')[0].style.display =
            'block';
          return true;
        }
      },
      formSubmissionLoader: async function (status = '') {
        if (status == '') {
          document.getElementById('formSubmitBtn').style.display = 'none';
          document.getElementById('formLoadBtn').style.display = 'block';
          document.getElementById('formLoadBtn').innerHTML = 'Loading...';
          document.getElementById('formLoadBtn').style.backgroundColor =
            '#8CA4EA';
          document.getElementById('formLoadBtn').style.borderColor =
            '#8CA4EA';
          document.getElementsByClassName(
            'formSubmissionloader'
          )[0].style.display = 'block';
          return true;
        } else {
          document.getElementsByClassName(
            'formSubmissionloader'
          )[0].style.display = 'none';
          document.getElementById('formLoadBtn').style.display = 'none';
          document.getElementById('formSubmitBtn').style.display = 'block';
        }
      },
      selective: ['loginLoader', 'formSubmissionLoader'],
      excludes: ['r', 'login'],
      function: true
    },    
    pageMiddleware: {
        pageLoader: async function (pageInfo) {
          pageInfo.loadIndex = pageActions.loadIndex;
          await pageMiddleware.pluginLoader(pageInfo);
          await pageMiddleware.controllerLoader(pageInfo);
          await pageMiddleware.middlewareLoader(pageInfo);
          console.log(pageInfo)
          console.log(pageActions.loadIndex);
          await middleware[pageActions.loadIndex]();
          pageInfo.loaded = true;
          pageActions.loadIndex++;
        },
        pageReloader: async function (pageInfo) {
          await middleware[pageInfo.loadIndex]();
        },
        dynamicChartLoader: async function () {
          if (
            !Object.keys(pluginLib).includes(dataWorker.stringToHash(verb.src))
          ) {
            // Generate Page Charts
            window.verbAsyncInit = function () {
              Verb.init({
                apiKey: 'c2d55c3e-124b-478a-870b-171e861718ff',
                version: 'v1.0',
                authParams: {
                  userToken: `${
                    JSON.parse(localStorage.getItem('user')).accessToken
                  }`
                }
              });
            };

            await document.getElementsByTagName('head')[0].appendChild(verb);

            pluginLib[dataWorker.stringToHash(verb.src)] = verb.src;
          } else {
            window.Verb.init({
              apiKey: 'c2d55c3e-124b-478a-870b-171e861718ff',
              version: 'v1.0',
              authParams: {
                userToken: `${
                  JSON.parse(localStorage.getItem('user')).accessToken
                }`
              }
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
            if (pageInfo.plugins[j].includes('js')) {
              try {
                if (
                  !Object.keys(pluginLib).includes(
                    dataWorker.stringToHash(pageInfo.plugins[j])
                  )
                ) {
                  await $.getScript(pageInfo.plugins[j]);
                  console.log(
                    `${window.pluginIndex} => ${pageInfo.plugins[j]}`
                  );
                  window.pluginIndex++;
                  pluginLib[dataWorker.stringToHash(pageInfo.plugins[j])] =
                    pageInfo.plugins[j];
                }
              } catch (e) {}
            } else if (pageInfo.plugins[j].includes('css')) {
              try {
                if (
                  !Object.keys(pluginLib).includes(
                    dataWorker.stringToHash(pageInfo.plugins[j])
                  )
                ) {
                  document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${
                    pageInfo.plugins[j]
                  }?update=${Date.now()}>`;
                  console.log(
                    `${window.pluginIndex} => ${pageInfo.plugins[j]}`
                  );
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
            pageInfo.controller ? await controllerConfig[pageInfo.arrayExpression] : false
          );
        },
        middlewareLoader: async function (pageInfo) {
          middleware.push(
            pageInfo.middleware ? await middlewareConfig[pageInfo.arrayExpression] : false
          );
          console.log(middleware)
        },
        componentLoader: async function (pageInfo) {
          var systemComponents = arrayFunctions.arrayToObject(
            components.system
          );

          //Clear Page
          document.getElementById('wrapper').innerHTML = '';

          //Generate Page Navigation Bar
          document.getElementById('wrapper').innerHTML +=
            systemComponents.navbar.html;

          componentLib.navigationBar.status = true;
          componentLib.navigationBar.id = uuid();

          arrayFunctions.arrayToObject(modulePath)[
            arrayFunctions.arrayToObject(components.system).navbar
              .arrayExpression
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

          eventMiddleware.addEvent('loadComponent', {
            componentId: componentLib.navigationBar.id,
            userIdentifier: JSON.parse(localStorage.getItem('user')).email,
            location: window.endpoint
          });

          //Generate Page Body
          document.getElementById('content').innerHTML +=
            systemComponents.loader.html;

          componentLib.pageLoader = {};
          componentLib.pageLoader.status = true;
          componentLib.pageLoader.id = uuid();

          eventMiddleware.addEvent('loadComponent', {
            componentId: componentLib.pageLoader.id,
            userIdentifier: JSON.parse(localStorage.getItem('user')).email,
            location: window.endpoint
          });

          //Generate Page Footer
          document.getElementById('content').innerHTML +=
            systemComponents.footer.html;

          componentLib.footer = {};
          componentLib.footer.status = true;
          componentLib.footer.id = uuid();

          eventMiddleware.addEvent('loadComponent', {
            componentId: componentLib.footer.id,
            userIdentifier: JSON.parse(localStorage.getItem('user')).email,
            location: window.endpoint
          });
        },
        pageDestructor: async function (pageInfo) {
          document.getElementById(pageInfo.viewport).innerHTML = '';
        },
        drawPage: async function (pageName, pageInfo) {
          var body = documents[pageInfo.arrayExpression].html;
          if (
            pageName == 'login' ||
            pageName == 'account_verify' ||
            pageName == 'eula'
          ) {
            document.body.classList.add('bg-gradient-primary');
            componentLib.navigationBar.status = false;
          } else if (!pageInfo.document && !componentLib.navigationBar.status) {
            await pageMiddleware.componentLoader(pageInfo);
            let loaderStatus = !configuration.katharos.pageLoader.excludes.includes(
              pageName
            )
              ? await configuration.katharos.pageLoader.script(pageInfo.name)
              : 'Loader Not Initialized';
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
        selective: [''],
        excludes: ['r', 'login'],
        function: true
    },
    pageObjects: {
      objectGenerator: function (pageName, modalName) {
        var inputModal = arrayFunctions.arrayToObject(modals[pageName]);
        document.getElementById('modalCanvas').innerHTML =
          inputModal[modalName].html;
        eventMiddleware.addEvent('createModal', {
          modalId: inputModal[modalName].id,
          userIdentifier: JSON.parse(localStorage.getItem('user')).email,
          location: pageName
        });

        var inputForm = arrayFunctions.arrayToObject(forms[pageName]);
        document.getElementById('formCanvas').innerHTML =
          inputForm[modalName].html;
        eventMiddleware.addEvent('createForm', {
          formId: inputForm[modalName].id,
          userIdentifier: JSON.parse(localStorage.getItem('user')).email,
          location: pageName
        });
      },
      objectDestructor: function (form = false, modal = false) {
        if (form) {
          document.getElementById('formCanvas').innerHTML = '';
          eventMiddleware.addEvent('destroyForm', {
            userIdentifier: JSON.parse(localStorage.getItem('user')).email,
            location: window.endpoint
          });
        }
        if (modal) {
          document.getElementById('modalCanvas').innerHTML = '';
          eventMiddleware.addEvent('destroyModal', {
            userIdentifier: JSON.parse(localStorage.getItem('user')).email,
            location: window.endpoint
          });
        }
      },
      selective: [''],
      excludes: ['r', 'login'],
      function: true
    }

 }
export { katharos, initialization }