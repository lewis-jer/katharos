const pageObjects = (_api) => {
  return {
    objectGenerator: function (pageName, form) {
      document.getElementById('modalCanvas').innerHTML = form.modalHTML;
      document.getElementById('modal').setAttribute('name', form.modal);
      let modalTitle = document.createElement('h5');
      modalTitle.innerHTML = form.title;
      modalTitle.id = 'exampleModalLabel';
      modalTitle.classList.add('modal-title');
      document.querySelector('#modal .modal-header').prepend(modalTitle);
      let event = { modalId: form.id, userIdentifier: JSON.parse(localStorage.getItem('user'))?.email || null, location: pageName };
      _api.addEvent('createModal', event);

      // document.getElementById('formCanvas').innerHTML = form.html;
      let formLoaderHTML = _api.system.getComponent('form-loader').html;
      document.getElementById('form').name = form.formId;
      document.querySelector(`form[name="${form.formId}"] .modal-body`).innerHTML += form.html;
      document.querySelector(`form[name="${form.formId}"] .modal-body`).innerHTML += formLoaderHTML;
      document.querySelector(`form[name="${form.formId}"]`).innerHTML += _api.system.getModal().buttons;
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
