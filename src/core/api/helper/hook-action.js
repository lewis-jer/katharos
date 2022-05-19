const handleTableAction = (_api) => {
  return (tableName, data, formAction) => {
    var table = (Array.isArray(tableName) && tableName.map(tableElement =>
      $(`#${tableElement}`).DataTable()
    )) || $(`#${tableName}`).DataTable();
    console.log(tableName)
    console.log(table)
    formAction == 'add' && table.row.add(data).draw().node();
    formAction == 'edit' &&
      table
        .row(JSON.parse(data.tableIndex)._DT_CellIndex.row)
        .data(data)
        .draw();
    formAction == 'delete' &&
      table.row($(data).parents('tr')).remove().draw(false);
    formAction == 'empty' && table.rows().remove().draw();
    formAction == 'update' &&
      data.forEach((x, i) => {
        table.row.add(data[i]).draw().node();
      });
    formAction == 'pull' && Object.keys(data).forEach((item) => {
      Array.isArray(table) && table.forEach((el, i) => {
        _api.emptyTable(tableName[i]);
      })
      //console.log(tableName, data[item], formAction, Array.isArray(data[item]))

    })
  };
};

export { handleTableAction };
