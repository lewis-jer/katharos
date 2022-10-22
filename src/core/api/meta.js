var meta = [
  {
    attributes: ['charset'],
    container: false,
    name: '',
    type: 'meta',
    values: ['utf-8']
  },
  {
    attributes: ['http-equiv', 'content'],
    container: false,
    name: '',
    type: 'meta',
    values: ['X-UA-Compatible', 'IE=edge']
  },
  {
    attributes: ['content'],
    container: false,
    name: 'viewport',
    type: 'meta',
    values: [{ width: 'device-width', 'initial-scale': 1, 'shrink-to-fit': 'no' }]
  },
  {
    attributes: ['content'],
    container: false,
    name: 'description',
    type: 'meta',
    values: ['']
  },
  {
    attributes: ['content'],
    container: false,
    name: 'author',
    type: 'meta',
    values: ['']
  },
  {
    attributes: ['rel', 'href', 'type'],
    container: false,
    name: 'author',
    type: 'link',
    values: ['shortcut icon', 'https://level.blob.core.windows.net/fp-blob/images/level-favicon.png', 'image/x-icon']
  },
  {
    attributes: [],
    container: true,
    innerHTML: 'Level | Official Site',
    name: '',
    type: 'title',
    values: []
  }
];

var el = document.createElement('head');

for (var i in meta) {
  const child = document.createElement(meta[i].type);
  meta[i].name && child.setAttribute('name', meta[i].name);
  for (var j in meta[i].attributes) {
    typeof meta[i].values[j] == 'object'
      ? child.setAttribute(
          meta[i].attributes[j],
          JSON.stringify(meta[i].values[j])
            .replace(/[{}]/g, '')
            .replace(/["]/g, '')
            .replace(/[:]/g, '=')
            .replace(/[,p]/g, ', ')
        )
      : meta[i].values[j] && child.setAttribute(meta[i].attributes[j], meta[i].values[j]);
  }
  meta[i].container && (child.innerHTML = meta[i].innerHTML);
  el.appendChild(child);
}
export { el as meta };
