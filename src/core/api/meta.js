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
    values: ['width=device-width, initial-scale=1, shrink-to-fit=no']
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
    values: [
      'shortcut icon',
      'https://level.blob.core.windows.net/fp-blob/images/level-favicon.png',
      'image/x-icon'
    ]
  },
  {
    attributes: [],
    container: true,
    innerHTML: 'Level | Official Site',
    name: 'author',
    type: 'title',
    values: []
  }
];

var el = document.createElement('head');

var header = `
<meta charset='utf-8'> 
<meta http-equiv='X-UA-Compatible' content='IE=edge'> 
<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'> 
<meta name='description' content=''> 
<meta name='author' content=''> 
<link rel='shortcut icon' href='https://level.blob.core.windows.net/fp-blob/images/level-favicon.png' type='image/x-icon'/> 
<title>Level | Official Site</title>`;
el.innerHTML = header;

var el1 = document.createElement('head');
for (var i in meta) {
  const child = document.createElement(meta[i].type);
  for (var j in meta[i].attributes) {
    child[meta[i].attributes[j]] = meta[i].values[j];
  }
  el1.appendChild(child);
}
console.log(el1);

console.log(el);
console.log(el.getElementsByTagName('meta'));
export { el as meta };
