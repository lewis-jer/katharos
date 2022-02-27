import { plugins } from './plugin';
import { loadPage } from '../kdom/action-canvas';
import { pageActions, _domInit } from '../../core/kdom';
import { pageObjects } from '../../core/components';
import { dataHandler, eventHandler } from './helper';
import { gatherPageInfo } from '../util';
console.log(loadPage);

let _api = { ...dataHandler, ...eventHandler };
_api = { ..._api, ...pageObjects(_api), gatherPageInfo: gatherPageInfo(_api) };
console.log(_api);

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
            pluginLib[_api.stringToHash(modulePath[i].plugins[j])] =
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
            pluginLib[_api.stringToHash(modulePath[i].plugins[j])] =
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

export { _api, initialization, plugins };
