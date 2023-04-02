const pageObjects = (_api) => {
  return {
    objectGenerator: function (pageName, form) {
      document.getElementById('modalCanvas').innerHTML = form.modalHTML;
      _api.addEvent('createModal', {
        modalId: form.id,
        userIdentifier: JSON.parse(localStorage.getItem('user'))?.email || null,
        location: pageName
      });

      document.getElementById('formCanvas').innerHTML = form.html;
      _api.addEvent('createForm', {
        formId: form.id,
        userIdentifier: JSON.parse(localStorage.getItem('user'))?.email || null,
        location: pageName
      });
    },
    objectDestructor: function (form = false, modal = false) {
      if (form) {
        document.getElementById('formCanvas').innerHTML = '';
        _api.addEvent('destroyForm', {
          userIdentifier: JSON.parse(localStorage.getItem('user'))?.email || null
        });
      }
      if (modal) {
        document.getElementById('modalCanvas').innerHTML = '';
        _api.addEvent('destroyModal', {
          userIdentifier: JSON.parse(localStorage.getItem('user'))?.email || null
        });
      }
    }
  };
};

export { pageObjects };
