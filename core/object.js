const pageObjects = {
  objectGenerator: function (pageName, modalName) {
    var inputModal = arrayFunctions.arrayToObject(modals[pageName]);
    document.getElementById("modalCanvas").innerHTML =
      inputModal[modalName].html;
    eventMiddleware.addEvent("createModal", {
      modalId: inputModal[modalName].id,
      userIdentifier: JSON.parse(localStorage.getItem("user")).email,
      location: pageName,
    });

    var inputForm = arrayFunctions.arrayToObject(forms[pageName]);
    document.getElementById("formCanvas").innerHTML = inputForm[modalName].html;
    eventMiddleware.addEvent("createForm", {
      formId: inputForm[modalName].id,
      userIdentifier: JSON.parse(localStorage.getItem("user")).email,
      location: pageName,
    });
  },
  objectDestructor: function (form = false, modal = false) {
    if (form) {
      document.getElementById("formCanvas").innerHTML = "";
      eventMiddleware.addEvent("destroyForm", {
        userIdentifier: JSON.parse(localStorage.getItem("user")).email,
        location: window.endpoint,
      });
    }
    if (modal) {
      document.getElementById("modalCanvas").innerHTML = "";
      eventMiddleware.addEvent("destroyModal", {
        userIdentifier: JSON.parse(localStorage.getItem("user")).email,
        location: window.endpoint,
      });
    }
  },
  selective: [""],
  excludes: ["r", "login"],
  function: true,
};

export { pageObjects };
