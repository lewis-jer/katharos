const handleTableAction = (_api) => {
  return (tableName, data, formAction) => {
    var table = $(`#${tableName}`).DataTable();
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
      console.log(data[item])
      console.log(Array.isArray(data[item]))
    })
  };
};

export { handleTableAction };
