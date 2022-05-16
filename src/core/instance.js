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
  loginLoader: async function (x = false) {
    if (x) {
      document.getElementById('loginAuthBtn').hidden = false;
      document.getElementById('loginAuthSafeBtn').hidden = true;
      document.getElementsByClassName('loginloader')[0].style.display = 'none';
      return true;
    } else {
      document.getElementById('loginAuthBtn').hidden = true;
      document.getElementById('loginAuthSafeBtn').hidden = false;
      document.getElementById('loginAuthSafeBtn').innerHTML = 'Loading...';
      document.getElementById('loginAuthSafeBtn').style.backgroundColor =
        '#8CA4EA';
      document.getElementById('loginAuthSafeBtn').style.borderColor = '#8CA4EA';
      document.getElementsByClassName('loginloader')[0].style.display = 'block';
      return true;
    }
  },
  formSubmissionLoader: async function (status = '') {
    if (status == '') {
      document.getElementById('formSubmitBtn').style.display = 'none';
      document.getElementById('formLoadBtn').style.display = 'block';
      document.getElementById('formLoadBtn').innerHTML = 'Loading...';
      document.getElementById('formLoadBtn').style.backgroundColor = '#8CA4EA';
      document.getElementById('formLoadBtn').style.borderColor = '#8CA4EA';
      document.getElementsByClassName('formSubmissionloader')[0].style.display =
        'block';
      return true;
    } else {
      document.getElementsByClassName('formSubmissionloader')[0].style.display =
        'none';
      document.getElementById('formLoadBtn').style.display = 'none';
      document.getElementById('formSubmitBtn').style.display = 'block';
    }
  },
  selective: ['loginLoader', 'formSubmissionLoader'],
  excludes: ['r', 'login'],
  function: true
};

export { pageLoader };
