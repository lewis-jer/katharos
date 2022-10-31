const pageLoader = {
  script: async function (x) {
    await $(document).ready(function (event) {
      document.querySelector('#loader').style.display = 'none';
      analytics.page(x);
      $('#loaderDiv').fadeIn(750);
      $('#footer').fadeIn(750);
    });
    return 'Module Initialization';
  },
  selective: ['loginLoader'],
  excludes: ['r', 'login'],
  function: true
};

export { pageLoader };
