import { handleTableAction } from './hook-action';

const updateTable = (_api) => {
  return (tableName, data, formAction, endpoint) => {
    console.log(JSON.parse(JSON.stringify(data)));
    handleTableAction(_api)(tableName, data, formAction, endpoint);
  };
};

const removeTableRow = (_api) => {
  return async (tableName, selectedRow, selectedRowIndex, endPoint) => {
    handleTableAction(_api)(tableName, selectedRowIndex, 'delete', null);
  };
};

const tableSync = (element, table) => {
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
          el = document.createElement('option');
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
};

const refreshTable = (_api) => {
  return (tableName, endpoint) => {
    handleTableAction(_api)(tableName, null, 'empty', null);
  };
};

const emptyTable = (tableName, func) => {
  var table = $(`#${tableName}`).DataTable();
  table.rows().remove().draw();
  func && table.clear().destroy() && $(`#${tableName}`).empty();
};

const tableMiddleware = (_api) => {
  return {
    updateTable: updateTable(_api),
    removeTableRow: removeTableRow(_api),
    tableSync: tableSync,
    refreshTable: refreshTable(_api),
    emptyTable: emptyTable
  };
};

export { tableMiddleware };
