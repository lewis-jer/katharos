const pageDestructor = async function (pageInfo) {
  document.getElementById(pageInfo.viewport).innerHTML = "";
};
const dynamicTableDestructor = async function (pageInfo) {
  if (pageInfo.dynamicTables) {
    if (pageInfo.dynamicTables.status) {
      for (var i in pageInfo.dynamicTables.tables) {
        _dom.emptyTable(pageInfo.dynamicTables.tables[i], true);
      }
    }
  }
};

export { pageDestructor, dynamicTableDestructor };
