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

      var form = _api.system.getForm(modal.form);
      document.getElementById('formCanvas').innerHTML = form.html;
      _api.addEvent('createForm', {
        formId: form.id,
        userIdentifier: JSON.parse(localStorage.getItem('user')).email,
        location: pageName
      });
    },
    objectDestructor: function (form = false, modal = false) {
      if (form) {
        document.getElementById('formCanvas').innerHTML = '';
        _api.addEvent('destroyForm', {
          userIdentifier: JSON.parse(localStorage.getItem('user')).email
        });
      }
      if (modal) {
        document.getElementById('modalCanvas').innerHTML = '';
        _api.addEvent('destroyModal', {
          userIdentifier: JSON.parse(localStorage.getItem('user')).email
        });
      }
    }
  };
};

export { pageObjects };
