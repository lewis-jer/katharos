const pageObjects = (_api) => {
  return {
    objectGenerator: function (pageName, form) {
      document.getElementById('modalCanvas').innerHTML = form.modalHTML;
      let event = { modalId: form.id, userIdentifier: JSON.parse(localStorage.getItem('user'))?.email || null, location: pageName };
      _api.addEvent('createModal', event);

      document.getElementById('formCanvas').innerHTML = form.html;
      event = { formId: form.id, userIdentifier: JSON.parse(localStorage.getItem('user'))?.email || null, location: pageName };
      _api.addEvent('createForm', event);
    },
    objectDestructor: function (form = false, modal = false) {
      if (form) {
        document.getElementById('formCanvas').innerHTML = '';
        _api.addEvent('destroyForm', { userIdentifier: JSON.parse(localStorage.getItem('user'))?.email || null });
      }
      if (modal) {
        document.getElementById('modalCanvas').innerHTML = '';
        _api.addEvent('destroyModal', { userIdentifier: JSON.parse(localStorage.getItem('user'))?.email || null });
      }
    }
  };
};

export { pageObjects };
