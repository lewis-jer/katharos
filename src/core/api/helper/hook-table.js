import { handleTableAction } from './hook-action';

const updateTable = (_api) => {
  return (tableName, data, formAction, endpoint) => {
    const monthNames = _api.getMonthNames();
    if (endpoint == 'tx') {
      [data].forEach((x, i) => {
        data.searchAssist0 = `${
          monthNames[new Date(x.txdate).getMonth()]
        } ${new Date(x.txdate).getFullYear()}`;
        data.searchAssist1 = `${new Date(x.txdate).getFullYear()}`;
        data.searchAssist2 = `${monthNames[new Date(x.txdate).getMonth()]}`;
        data.txdate = `${new Date(x.txdate).toLocaleDateString()}`;
        data.txamt = data.txamount;
        data.txbcat = _api.txMatcher(data.txbcat);
        data.tx = _api.decrypter(data.tx);
      });
    } else if (endpoint == 'bcat') {
      [data].forEach((x, i) => {
        data.Modules = _api.bcatMatcher(data.module, 'module');
        data.Type = _api.bcatMatcher(data.type, 'type');
        data.Frequency = data.frequency;
      });
    }

    endpoint != 'bx' &&
      handleTableAction(_api)(tableName, data, formAction, endpoint);

    if (formAction == 'add') {
      if (endpoint == 'bx') {
        var table = $(`#${tableName}`).DataTable();
        data.bxamt = data.bcatamt;
        data.bxbcat = data.Category;
        table.row.add(data).draw().node();
      }
    } else if (formAction == 'edit') {
      if (endpoint == 'bx') {
        data.bxamt = data.bcatamt;
        data.bxbcat = data.Category;
        _api.updateUserProfileData(
          'bxExpData',
          data.id,
          formAction,
          endpoint,
          data
        );
        var table = $(`#${tableName}`).DataTable();
        var selectedRow = JSON.parse(document.getElementById('el2').innerHTML)
          ._DT_CellIndex.row;
        table.row(selectedRow).data(data).draw();
      }
    }
  };
};

const removeTableRow = (_api) => {
  return async (tableName, selectedRow, selectedRowIndex, endPoint) => {
    let res;
    if (endPoint == 'tx') {
      res = await dataService('DELETE', 'tx', selectedRow.id);
    }
    if (endPoint == 'bx') {
      res = await dataService('DELETE', 'bx', selectedRow.id);
      _api.updateUserProfileData('bxExpData', selectedRow.id, 'delete', 'bx');
      _api.updateUserProfileData('bxIncData', selectedRow.id, 'delete', 'bx');
    }
    var table = $(`#${tableName}`).DataTable();
    table.row($(selectedRowIndex).parents('tr')).remove().draw();
    if (endPoint == 'tx') {
      alertify.success(res);
    }
    if (endPoint == 'bx') {
      alertify.success(res);
    }
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
    emptyTable(tableName, endpoint);
    updateTableData(_api)(tableName, endpoint);
  };
};

const emptyTable = (tableName, func) => {
  var table = $(`#${tableName}`).DataTable();
  var rows = table.rows().remove().draw();
  if (func && func != 'tx_u') {
    table.clear().destroy();
    $(`#${tableName}`).empty();
  }
};

const updateTableData = (_api) => {
  return async (tableName, endpoint) => {
    var table = $(`#${tableName}`).DataTable();
    if (endpoint == 'tx') {
      var data = await dataService('GET', 'tx');
      data.forEach((x, i) => {
        data[i].txdate = `${new Date(x.txdate).toLocaleDateString('en-US')}`;
        data[i].tx = _api.decrypter(data[i].tx);
        table.row.add(data[i]).draw().node();
      });
    } else if (endpoint == 'bx') {
      var data;
      if (tableName == 'bxtablee') {
        data = userProfile.bxExpData;
      } else if (tableName == 'bxtablei') {
        data = userProfile.bxIncData;
      }
      data.forEach((x, i) => {
        table.row.add(data[i]).draw().node();
      });
    } else {
      userProfile.txUploadData = (await dataService('GET', 'tx/upload')).data;
      var data = userProfile.txUploadData;
      data.forEach((x, i) => {
        data[i].txdate = `${new Date(x.txdate).toLocaleDateString('en-US')}`;
        data[i].tx = _api.decrypter(data[i].tx);
        table.row.add(data[i]).draw().node();
      });
    }
  };
};

const tableMiddleware = (_api) => {
  return {
    updateTable: updateTable(_api),
    removeTableRow: removeTableRow(_api),
    tableSync: tableSync,
    refreshTable: refreshTable(_api),
    emptyTable: emptyTable,
    updateTableData: updateTableData(_api)
  };
};

export { tableMiddleware };
