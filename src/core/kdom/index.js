import { loadPage } from "./action-canvas";
import { gatherPageInfo } from "./util/index.js";

const pageActions = {
  loadPage: loadPage,
  gatherPageInfo: gatherPageInfo,
  selective: [""],
  loadIndex: 1,
  function: true,
};

const _dom = {
  updateTable: function (tableName, data, formAction, endpoint) {
    if (endpoint == "tx") {
      [data].forEach((x, i) => {
        data.searchAssist0 = `${
          monthNames[new Date(x.txdate).getMonth()]
        } ${new Date(x.txdate).getFullYear()}`;
        data.searchAssist1 = `${new Date(x.txdate).getFullYear()}`;
        data.searchAssist2 = `${monthNames[new Date(x.txdate).getMonth()]}`;
        data.txdate = `${new Date(x.txdate).toLocaleDateString()}`;
        data.txamt = data.txamount;
        data.txbcat = dataWorker.txMatcher(data.txbcat);
        data.tx = dataWorker.decrypter(data.tx);
      });
    } else if (endpoint == "bcat") {
      [data].forEach((x, i) => {
        data.Modules = dataWorker.bcatMatcher(data.module, "module");
        data.Type = dataWorker.bcatMatcher(data.type, "type");
        data.Frequency = data.frequency;
      });
    }

    if (formAction == "add") {
      if (endpoint == "tx") {
        var table = $(`#${tableName}`).DataTable();
        table.row.add(data).draw().node();
      } else if (endpoint == "bcat") {
        var table = $(`#${tableName}`).DataTable();
        table.row.add(data).draw().node();
      } else if (endpoint == "bx") {
        var table = $(`#${tableName}`).DataTable();
        data.bxamt = data.bcatamt;
        data.bxbcat = data.Category;
        table.row.add(data).draw().node();
      }
    } else if (formAction == "edit") {
      if (endpoint == "tx" || endpoint == "bcat") {
        var table = $(`#${tableName}`).DataTable();
        var selectedRow = JSON.parse(document.getElementById("el2").innerHTML)
          ._DT_CellIndex.row;
        table.row(selectedRow).data(data).draw();
      } else if (endpoint == "bx") {
        data.bxamt = data.bcatamt;
        data.bxbcat = data.Category;
        console.log(tableName);
        dataWorker.updateUserProfileData(
          "bxExpData",
          data.id,
          formAction,
          endpoint,
          data
        );
        var table = $(`#${tableName}`).DataTable();
        var selectedRow = JSON.parse(document.getElementById("el2").innerHTML)
          ._DT_CellIndex.row;
        table.row(selectedRow).data(data).draw();
      }
    }
  },
  removeTableRow: async function (
    tableName,
    selectedRow,
    selectedRowIndex,
    endPoint
  ) {
    let res;
    if (endPoint == "tx") {
      res = await dataService("DELETE", "tx", selectedRow.id);
    }
    if (endPoint == "bx") {
      res = await dataService("DELETE", "bx", selectedRow.id);
      dataWorker.updateUserProfileData(
        "bxExpData",
        selectedRow.id,
        "delete",
        "bx"
      );
      dataWorker.updateUserProfileData(
        "bxIncData",
        selectedRow.id,
        "delete",
        "bx"
      );
    }
    var table = $(`#${tableName}`).DataTable();
    table.row($(selectedRowIndex).parents("tr")).remove().draw();
    if (endPoint == "tx") {
      alertify.success(res);
    }
    if (endPoint == "bx") {
      alertify.success(res);
    }
  },
  tableSync: function (element, table) {
    function removeOptions(selectElement) {
      var i,
        L = selectElement.options.length - 1;
      for (i = L; i >= 0; i--) {
        selectElement.remove(i);
      }
    }
    var select = document.getElementsByName(element);
    for (var i in select) {
      if (select[i].tagName !== undefined) {
        var y = select[i],
          selectedItem = y.value;
        var dataset = userProfile.bcatData;
        removeOptions(y);
        for (var k in dataset) {
          var opt = dataset[k],
            el = document.createElement("option");
          el.textContent = opt.content;
          el.value = opt.value;
          y.appendChild(el);
        }
        for (var l in y.options) {
          if (y.options[l].value == selectedItem) {
            y.selectedIndex = l;
            break;
          }
        }
      }
    }
  },
  refreshTable: function (tableName, endpoint) {
    _dom.emptyTable(tableName, endpoint);
    _dom.updateTableData(tableName, endpoint);
  },
  emptyTable: function (tableName, func) {
    var table = $(`#${tableName}`).DataTable();
    var rows = table.rows().remove().draw();
    if (func && func != "tx_u") {
      table.clear().destroy();
      $(`#${tableName}`).empty();
    }
  },
  updateTableData: async function (tableName, endpoint) {
    var table = $(`#${tableName}`).DataTable();
    if (endpoint == "tx") {
      var data = await dataService("GET", "tx");
      data.forEach((x, i) => {
        data[i].txdate = `${new Date(x.txdate).toLocaleDateString("en-US")}`;
        data[i].tx = dataWorker.decrypter(data[i].tx);
        table.row.add(data[i]).draw().node();
      });
    } else if (endpoint == "bx") {
      var data;
      if (tableName == "bxtablee") {
        data = userProfile.bxExpData;
      } else if (tableName == "bxtablei") {
        data = userProfile.bxIncData;
      }
      data.forEach((x, i) => {
        table.row.add(data[i]).draw().node();
      });
    } else {
      userProfile.txUploadData = (await dataService("GET", "tx/upload")).data;
      var data = userProfile.txUploadData;
      data.forEach((x, i) => {
        data[i].txdate = `${new Date(x.txdate).toLocaleDateString("en-US")}`;
        data[i].tx = dataWorker.decrypter(data[i].tx);
        table.row.add(data[i]).draw().node();
      });
    }
  },
  formMiddleware: {
    completeAction: function (formName, formAction, modalName) {
      modalMiddleware.removeElementsById(null, null, formAction, modalName);
      formMiddleware.cleanForm(formName, formAction);
      formSpinner(1);
      $(`#${modalName}`).modal("hide");
      console.log("Form Submitted Successfully");
    },
    formValidation: function (formName, formAction, contents) {
      formMiddleware.validateForm(formName, formAction);
    },
    filterByValue: function (array, value) {
      return array.filter(
        (data) =>
          JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    },
    validateForm: function (formName, formAction, formClose = "") {
      var { formKeys, formContent } = formMiddleware.formData(formName);
      var contents = formMiddleware.formContents(
        formKeys,
        formAction,
        formContent
      );

      contents = contents.filter((el) => {
        return (
          el.object != null && el.object != "" && el.object.includes(formAction)
        );
      });

      contents.forEach((x, index) => {
        var field = document.forms[formName].elements[x.object];
        var formField = document
          .getElementById(formName)
          .getElementsByClassName("form-group")[x.index].children;
        if (formClose == "") {
          for (var i in formField) {
            if (formField[i].tagName == "SPAN" && x.value === false) {
              formField[i].id = `error${Date.now()}`;
              const Error = document.getElementById(formField[i].id);
              Error.classList.add("visible");
              Error.setAttribute("aria-hidden", false);
              Error.setAttribute("aria-invalid", true);
              Error.style.display = "block";
              field.style.borderColor = "red";
              formField[i].id = `error`;
            } else if (formField[i].tagName == "SPAN" && x.value) {
              formField[i].id = `error${Date.now()}`;
              const Error = document.getElementById(formField[i].id);
              Error.classList.add("hidden");
              Error.setAttribute("aria-hidden", true);
              Error.setAttribute("aria-invalid", false);
              Error.style.display = "none";
              field.style.borderColor = "#d1d3e2";
              formField[i].id = `error`;
            }
          }
        } else if (formClose == 1) {
          for (var i in formField) {
            if (formField[i].tagName == "SPAN") {
              formField[i].id = `error${Date.now()}`;
              const Error = document.getElementById(formField[i].id);
              Error.classList.add("hidden");
              Error.setAttribute("aria-hidden", true);
              Error.setAttribute("aria-invalid", false);
              Error.style.display = "none";
              field.style.borderColor = "#d1d3e2";
              formField[i].id = `error`;
            }
          }
        }
      });
    },
    cleanForm: function (formName, formAction) {
      function removeOptions(selectElement) {
        var i,
          L = selectElement.options.length - 1;
        for (i = L; i >= 0; i--) {
          selectElement.remove(i);
        }
      }

      var { formKeys, formContent } = formMiddleware.formData(formName);
      formMiddleware.validateForm(formName, formAction, 1);
      formMiddleware.filterByValue(formKeys, formAction).forEach((x) => {
        if (formContent[x].value != "")
          if (formContent[x].tagName != "SELECT") formContent[x].value = "";
        if (formContent[x].tagName == "SELECT") removeOptions(formContent[x]);
      });
    },
    formAction: async function (
      contents,
      formName,
      formAction,
      modalName,
      tableName
    ) {
      var modal = document.getElementById(modalName),
        data = {};
      var endpoint = modalName.replace(`${formAction}`, "");
      contents.map((x, i) => {
        contents[i].object = contents[i].object.replace(`${formAction}_`, "");
        if (contents[i].object == "txamt") contents[i].object = "txamount";
        data[contents[i].object] = contents[i].value;
      });
      if (endpoint == "tx") {
        data = [data];
        data.forEach((x) => {
          data.push({
            tx: dataWorker.encrypter(x.tx),
            //tx: x.tx,
            txdate: x.txdate,
            txamount: x.txamount,
            txbcat: x.txbcat,
            txdesc: "",
            username: userProfile.username,
          });
        });
        data.splice(0, 1);
        data = data[0];
        data.SN = typeof data.SN !== "undefined" ? data.SN : uuid();
      }
      let res;
      if (formAction == "add") {
        if (endpoint == "tx") {
          await dataService("POST", endpoint, false, data).then(
            async ({ data: res }) => {
              if (res.error) {
                formMiddleware.completeAction(formName, formAction, modalName);
                alertify.error(res.error);
              }
              data.id = res.insertId;
              await _dom.updateTable(tableName, data, formAction, endpoint);
              formMiddleware.completeAction(formName, formAction, modalName);
              alertify.success("Success message");
            }
          );
        } else if (endpoint == "bcat") {
          data.func = document.getElementById("el1").innerHTML;
          data.bcat = uuid();
          data.SN = uuid();
          data.username = userProfile.username;
          await dataService("POST", endpoint, false, data).then(
            async ({ data: res }) => {
              if (res.error) {
                formMiddleware.completeAction(formName, formAction, modalName);
                alertify.error(res.error);
              }
              data.id = res[0].insertId;
              await _dom.updateTable(tableName, data, formAction, endpoint);
              formMiddleware.completeAction(formName, formAction, modalName);
              alertify.success("Success message");
            }
          );
        } else if (endpoint == "bx") {
          data.date = data.mth + data.yr;
          data.func = document.getElementById("el1").innerHTML;
          data.dates = dataWorker.mySQLDateCreator(`${data.mth} 1 ${data.yr}`);
          data.username = userProfile.username;
          await dataService("POST", endpoint, false, data).then(
            async ({ data: res }) => {
              var error = false;
              for (var i in res) {
                if (Object.keys(res[i]).includes("errno")) {
                  error = true;
                }
              }
              if (error) {
                formMiddleware.completeAction(formName, formAction, modalName);
                alertify.error("Request Failed");
              } else {
                //data.id = res[0].insertId
                data = res[1];
                userProfile.bxExpData.push(data);
                userProfile.bxIncData.push(data);
                await _dom.updateTable(tableName, data, formAction, endpoint);
                formMiddleware.completeAction(formName, formAction, modalName);
                alertify.success("Success message");
              }
            }
          );
        }
      } else if (formAction == "edit") {
        if (endpoint == "tx") {
          var id = document.getElementById("el1").innerHTML;
          data.id = id;
          await dataService("PUT", endpoint, id, data).then(
            async ({ data: res }) => {
              if (res.error) {
                formMiddleware.completeAction(formName, formAction, modalName);
                alertify.error(res.error);
              }
              await _dom.updateTable(tableName, data, formAction, endpoint);
              formMiddleware.completeAction(formName, formAction, modalName);
              alertify.success("Success message");
            }
          );
        } else if (endpoint == "bcat") {
          data.module = data.Modules;
          data.type = data.Type;
          data.frequency = data.Frequency;
          data.SN = document.getElementById("el3").innerHTML;
          data.id = document.getElementById("el1").innerHTML;
          await dataService("PUT", endpoint, id, data).then(
            async ({ data: res }) => {
              if (res.error) {
                formMiddleware.completeAction(formName, formAction, modalName);
                alertify.error(res.error);
              } else {
                console.log(res);
                await _dom.updateTable(tableName, data, formAction, endpoint);
                formMiddleware.completeAction(formName, formAction, modalName);
                alertify.success("Success message");
              }
            }
          );
        } else if (endpoint == "bx") {
          data.ui = document.getElementById("el3").innerHTML;
          data.id = document.getElementById("el1").innerHTML;
          data.bxamt = parseFloat(data.bxamt);
          await dataService("PUT", endpoint, data.id, data).then(
            async ({ data: res }) => {
              var error = false;
              for (var i in res) {
                if (Object.keys(res[i]).includes("errno")) {
                  error = true;
                }
              }
              if (error) {
                formMiddleware.completeAction(formName, formAction, modalName);
                alertify.error("Request Failed");
              } else {
                data = res[1];
                await _dom.updateTable(tableName, data, formAction, endpoint);
                formMiddleware.completeAction(formName, formAction, modalName);
                alertify.success("Success message");
              }
            }
          );
        }
      }
    },
    formClose: function (formName, formAction, modalName) {
      modalMiddleware.removeElementsById(null, null, formAction, modalName);
      formMiddleware.cleanForm(formName, formAction);
      $(`#${modalName}`).modal("hide");
      console.log("Form Closed Successfully");
    },
    formData: function (formName) {
      var formKeys = [];
      var /* formKeys = Object.keys(document.forms[formName].elements), */ formContent =
          document.forms[formName].elements;
      for (var i in formContent) {
        formKeys.push(formContent[i].name);
      }

      formKeys = formKeys.filter((el) => {
        return el != null && el != "";
      });
      return {
        formKeys,
        formContent,
      };
    },
    formContents: function (formKeys, formAction, formContents) {
      var contents = [];
      formMiddleware.filterByValue(formKeys, formAction).forEach((x) => {
        if (
          formContents[x].value != "" &&
          formContents[x].value &&
          formContents[x].value != "null"
        ) {
          if (formContents[x].tagName != "BUTTON")
            contents.push({
              object: formContents[x].name,
              value: formContents[x].value,
              index: Object.values(formContents).indexOf(formContents[x]),
            });
        } else {
          if (formContents[x].tagName != "BUTTON")
            contents.push({
              object: formContents[x].name,
              value: false,
              index: Object.values(formContents).indexOf(formContents[x]),
            });
        }
      });
      return contents;
    },
    formSubmission: function (formName, formAction, modalName, tableName) {
      var { formKeys, formContent } = formMiddleware.formData(formName);
      var contents = formMiddleware.formContents(
        formKeys,
        formAction,
        formContent
      );

      contents = contents.filter((el) => {
        return (
          el.object != null && el.object != "" && el.object.includes(formAction)
        );
      });

      // formValidation
      if (contents.some((x) => x.value === false)) {
        console.log("Form Missing Required Information");
        formMiddleware.formValidation(formName, formAction, contents);
      } else {
        formSpinner();
        formMiddleware.formValidation(formName, formAction, contents);
        formMiddleware.formAction(
          contents,
          formName,
          formAction,
          modalName,
          tableName
        );
      }
    },
    preloadForm: function (formName, formAction, modalName, content) {
      var { formKeys, formContent } = formMiddleware.formData(formName);
      var contents = formMiddleware.formContents(
        formKeys,
        formAction,
        formContent
      );
      contents.forEach((x) => {
        if (
          Object.keys(content).includes(x.object.replace(`${formAction}_`, ""))
        ) {
          if (formContent[x.object].tagName == "INPUT") {
            var timestamp = Date.parse(
              content[x.object.replace(`${formAction}_`, "")]
            );
            if (!x.object.includes("amt") && isNaN(timestamp) == false) {
              var d = new Date(timestamp).toISOString().substring(0, 10);
              formContent[x.object].value = d;
            } else {
              formContent[x.object].value =
                content[x.object.replace(`${formAction}_`, "")];
            }
          } else if (formContent[x.object].tagName == "SELECT") {
            [formContent[x.object]].forEach((y, j) => {
              for (var i in y.options) {
                if (
                  y.options[i].innerHTML ==
                  content[x.object.replace(`${formAction}_`, "")]
                ) {
                  y.selectedIndex = i;
                  break;
                }
              }
            });
          }
        }
      });
    },
    modalSync: function (modalFunc, modalName) {
      for (var i in modals[modalFunc]) {
        if (modals[modalFunc][i].modal == modalName) {
          for (var j in modals[modalFunc][i].select) {
            var select = document.getElementById(
              modals[modalFunc][i].select[j]
            );
            var dataset = modals[modalFunc][i].datasets[j];
            for (var k in dataset) {
              var opt = dataset[k];
              var el = document.createElement("option");
              el.textContent = opt.content;
              el.value = opt.value;
              select.appendChild(el);
            }
          }
        }
      }
    },
    selective: ["formValidation"],
    excludes: ["r", "login"],
    function: true,
  },
  modalMiddleware: {
    addElementsById: function (
      objectId,
      systemReserved,
      formAction,
      modalName,
      newObjects = false
    ) {
      var modalInfo = arrayFunctions.arrayToObject(
        modals[modalName.replace(`${formAction}`, "")]
      )[modalName];
      var object = document.getElementById(objectId),
        modalObjects = [],
        systemReserved;
      for (var i in modalInfo.inputStore) {
        modalObjects[i] = [
          modalInfo.inputStore[i],
          modalInfo.inputDataStore[i],
        ];
      }
      if (newObjects != false) {
        for (var i in newObjects) {
          modalObjects.push(newObjects[i]);
          modalInfo.inputStoreSession.push(newObjects[i][0]);
          modalInfo.inputDataStoreSession.push(newObjects[i][1]);
        }
      }
      modalObjects = new Map(modalObjects);
      modalObjects = Object.fromEntries(modalObjects);
      Object.entries(modalObjects).forEach((entry) => {
        const [key, value] = entry;
        var label = document.createElement("label");
        label.setAttribute("id", key);
        label.setAttribute("hidden", "");
        label.innerHTML = value;
        object.appendChild(label);
      });
    },
    removeElementsById: function (
      objectId,
      systemReserved,
      formAction,
      modalName
    ) {
      var modalInfo = arrayFunctions.arrayToObject(
        modals[modalName.replace(`${formAction}`, "")]
      )[modalName];
      var object = document.getElementById(objectId);
      for (var i in modalInfo.inputStore) {
        document.getElementById(modalInfo.inputStore[i]).remove();
      }
      for (var i in modalInfo.inputStoreSession) {
        document.getElementById(modalInfo.inputStoreSession[i]).remove();
      }
      modalInfo.inputStoreSession = [];
      modalInfo.inputDataStoreSession = [];
    },
    selective: [],
    excludes: ["r", "login"],
    function: true,
  },
  selective: ["formValidation"],
  excludes: ["r", "login"],
  function: true,
};

export { pageActions, _dom };
