import { handleTableAction } from './hook-action';

const updateTable = (_api) => {
  return (tableName, data, formAction) => {
    console.log(`updateTable: `, JSON.parse(JSON.stringify(data)));
    console.log(tableName, formAction);
    handleTableAction(_api)(tableName, data, formAction);
  };
};

const removeTableRow = (_api) => {
  return async (tableName, selectedRow, selectedRowIndex) => {
    handleTableAction(_api)(tableName, selectedRowIndex, 'delete');
  };
};

const tableSync = (element, dataset) => {
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
  return (tableName) => {
    handleTableAction(_api)(tableName, null, 'empty');
  };
};

const emptyTable = (tableName, func) => {
  var table = $(`#${tableName}`).DataTable();
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
