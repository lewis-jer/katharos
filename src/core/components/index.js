const pageObjects = (_api) => {
  return {
    objectGenerator: function (pageName, modalName) {
      var modal = _api.system.getModal(modalName);
      document.getElementById('modalCanvas').innerHTML = modal.html;
      _api.addEvent('createModal', {
        modalId: modal.id,
        userIdentifier: JSON.parse(localStorage.getItem('user')).email,
        location: pageName
      });

      var inputForm = _api.arrayToObject(forms[pageName]);
      document.getElementById('formCanvas').innerHTML =
        inputForm[modalName].html;
      _api.addEvent('createForm', {
        formId: inputForm[modalName].id,
        userIdentifier: JSON.parse(localStorage.getItem('user')).email,
        location: pageName
      });
    },
    objectDestructor: function (form = false, modal = false) {
      if (form) {
        document.getElementById('formCanvas').innerHTML = '';
        _api.addEvent('destroyForm', {
          userIdentifier: JSON.parse(localStorage.getItem('user')).email,
          location: window.endpoint
        });
      }
      if (modal) {
        document.getElementById('modalCanvas').innerHTML = '';
        _api.addEvent('destroyModal', {
          userIdentifier: JSON.parse(localStorage.getItem('user')).email,
          location: window.endpoint
        });
      }
    }
  };
};

export { pageObjects };
