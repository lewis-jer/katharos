const handleTableAction = (_api) => {
  return (tableName, data, formAction) => {
    var table = (Array.isArray(tableName) && tableName.map(tableElement =>
      $(`#${tableElement}`).DataTable()
    )) || $(`#${tableName}`).DataTable();
    formAction == 'add' && table.row.add(data).draw().node();
    formAction == 'edit' &&
      table
        .row(JSON.parse(data.tableIndex)._DT_CellIndex.row)
        .data(data)
        .draw();
    formAction == 'delete' &&
      table.row($(data).parents('tr')).remove().draw(false);
    formAction == 'empty' && emptyTable(table);
    formAction == 'update' && updateTable(table, data)
    formAction == 'pull' && Object.keys(data).forEach((item) => {
      Array.isArray(table) && table.forEach((el, i) => {
        emptyTable(el);
        updateTable(el, data.items)
      })
      //console.log(tableName, data[item], formAction, Array.isArray(data[item]))

    })
  };
};

const emptyTable = (table) => {
  table.rows().remove().draw();
};

const updateTable = (table, data) => {
  data.forEach((x, i) => {
    table.row.add(data[i]).draw().node();
  });
};

export { handleTableAction };
