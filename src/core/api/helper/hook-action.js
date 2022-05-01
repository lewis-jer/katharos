const handleTableAction = (_api) => {
  return (tableName, data, formAction, endpoint) => {
    var table = $(`#${tableName}`).DataTable();
    formAction == 'add' && table.row.add(data).draw().node();
    formAction == 'edit' &&
      table
        .row(JSON.parse(data.tableIndex)._DT_CellIndex.row)
        .data(data)
        .draw();
    formAction == 'delete' && table.row($(data).parents('tr')).remove().draw();
    formAction == 'empty' && table.rows().remove().draw();
  };
};

export { handleTableAction };
