const refreshTable = (_api) => (tableName) => handleTableAction(_api)(tableName, null, 'empty');
const emptyTableAction = (table) => table.rows().remove().draw(false);
const updateTableAction = (table, data) => data.forEach((x, i) => table.row.add(data[i]).draw(false).node());
const updateTable = (_api) => (tableName, data, formAction) => handleTableAction(_api)(tableName, data, formAction);
const removeTableRow = (_api) => async (tableName, selectedRow, selectedRowIndex) => handleTableAction(_api)(tableName, selectedRowIndex, 'delete');
const emptyTable = (tableName, func) => func && $(`#${tableName}`).DataTable().clear().destroy() && $(`#${tableName}`).empty();

const handleTableAction = (_api) => {
  return (tableName, data, formAction) => {
    var table = (Array.isArray(tableName) && tableName.map((tableElement) => $(`#${tableElement}`).DataTable())) || $(`#${tableName}`).DataTable();
    formAction == 'add' && table.row.add(data).draw(false).node();
    formAction == 'edit' && table.row(JSON.parse(data.tableIndex)._DT_CellIndex.row).data(data).draw(false);
    formAction == 'del-old' && table.row($(data.tableIndex).parents('tr')).remove().draw(false);
    formAction == 'delete' && table.row($(data).parents('tr')).remove().draw(false);
    formAction == 'empty' && emptyTableAction(table);
    formAction == 'update' && updateTableAction(table, data);
    formAction == 'pull' &&
      Array.isArray(table) &&
      table.forEach((el, i) => {
        emptyTableAction(el);
        updateTableAction(el, data.items);
      });
    formAction == 'del' &&
      Array.isArray(table) &&
      table.forEach((el, i) => {
        emptyTableAction(el);
        updateTableAction(el, data.items);
      });
  };
};

const tableSync = (element, dataset) => {
  function removeOptions(el) {
    for (var i = el.options.length - 1; i >= 0; i--) el.remove(i);
  }
  var select = document.getElementsByName(element);
  for (var i in select) {
    if (select[i].tagName === undefined) continue;
    var y = select[i];
    var selectedItem = y.value;
    removeOptions(y);
    for (var k in dataset) {
      var opt = dataset[k];
      var el = document.createElement('option');
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
