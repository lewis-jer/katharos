var meta = [
  { attributes: ['charset'], container: false, name: '', type: 'meta', values: ['utf-8'] },
  { attributes: ['http-equiv', 'content'], container: false, name: '', type: 'meta', values: ['X-UA-Compatible', 'IE=edge'] },
  {
    attributes: ['content'],
    container: false,
    name: 'viewport',
    type: 'meta',
    values: [{ width: 'device-width', 'initial-scale': 1, 'shrink-to-fit': 'no' }]
  },
  { attributes: ['content'], container: false, name: 'description', type: 'meta', values: [''] },
  { attributes: ['content'], container: false, name: 'author', type: 'meta', values: [''] },
  {
    attributes: ['rel', 'href', 'type'],
    container: false,
    name: 'author',
    type: 'link',
    values: ['shortcut icon', 'https://level.blob.core.windows.net/fp-blob/images/level-favicon.png', 'image/x-icon']
  },
  { attributes: [], container: true, innerHTML: 'Level | Official Site', name: '', type: 'title', values: [] }
];

var el = document.createElement('head');

const jsAssembler = async (_api, { modulePlugin, cacheBust }, callback = null) => {
  if (!Object.keys(_api.system.data.pluginLib).includes(_api.system.stringToHash(modulePlugin))) {
    await new Promise((resolve) => {
      (function (document, tag) {
        var scriptTag = document.createElement(tag);
        var firstScriptTag = document.getElementsByTagName(tag)[0];
        scriptTag.src = cacheBust ? modulePlugin + `?update=${Date.now()}` : modulePlugin;
        firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

        scriptTag.onload = scriptTag.onreadystatechange = function (_, isAbort) {
          if (isAbort || !scriptTag.readyState || /loaded|complete/.test(scriptTag.readyState)) {
            scriptTag.onload = scriptTag.onreadystatechange = null;
            scriptTag = undefined;
            if (!isAbort && callback) setTimeout(callback, 0);
            resolve();
          }
        };
      })(document, 'script');
    });
    _api.system.updatePlugin(modulePlugin);
  }
};

const cssAssembler = async (_api, { modulePlugin, cacheBust }) => {
  if (!Object.keys(_api.system.data.pluginLib).includes(_api.system.stringToHash(modulePlugin))) {
    let _src = cacheBust ? modulePlugin + `?update=${Date.now()}` : modulePlugin;
    document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=${_src}>`;
    _api.system.updatePlugin(modulePlugin);
  }
};

const assembler = (_api) => {
  return async (plugin) => {
    if (plugin.modulePlugin.includes('.css')) {
      try {
        await cssAssembler(_api, plugin);
      } catch (e) {
        _api.system.updatePlugin(plugin);
      }
    } else if (plugin.modulePlugin.includes('.js')) {
      try {
        await jsAssembler(_api, plugin);
      } catch (e) {
        _api.system.updatePlugin(plugin);
      }
    }
  };
};

for (var i in meta) {
  const child = document.createElement(meta[i].type);
  meta[i].name && child.setAttribute('name', meta[i].name);
  for (var j in meta[i].attributes) {
    typeof meta[i].values[j] == 'object'
      ? child.setAttribute(
          meta[i].attributes[j],
          JSON.stringify(meta[i].values[j]).replace(/[{}]/g, '').replace(/["]/g, '').replace(/[:]/g, '=').replace(/[,p]/g, ', ')
        )
      : meta[i].values[j] && child.setAttribute(meta[i].attributes[j], meta[i].values[j]);
  }
  meta[i].container && (child.innerHTML = meta[i].innerHTML);
  el.appendChild(child);
}

export { assembler, el as meta };
