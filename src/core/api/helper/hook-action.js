const handleTableAction = (_api) => {
  return (tableName, data, formAction) => {
    var table =
      (Array.isArray(tableName) && tableName.map((tableElement) => $(`#${tableElement}`).DataTable())) ||
      $(`#${tableName}`).DataTable();
    formAction == 'add' && table.row.add(data).draw(false).node();
    formAction == 'edit' && table.row(JSON.parse(data.tableIndex)._DT_CellIndex.row).data(data).draw(false);
    formAction == 'del-old' && table.row($(data.tableIndex).parents('tr')).remove().draw(false);
    formAction == 'delete' && table.row($(data).parents('tr')).remove().draw(false);
    formAction == 'empty' && emptyTable(table);
    formAction == 'update' && updateTable(table, data);
    formAction == 'pull' &&
      Array.isArray(table) &&
      table.forEach((el, i) => {
        emptyTable(el);
        updateTable(el, data.items);
      });
    formAction == 'del' &&
      Array.isArray(table) &&
      table.forEach((el, i) => {
        emptyTable(el);
        updateTable(el, data.items);
      });
  };
};

const emptyTable = (table) => {
  table.rows().remove().draw(false);
};

const updateTable = (table, data) => {
  data.forEach((x, i) => {
    table.row.add(data[i]).draw(false).node();
  });
};

export { handleTableAction };
