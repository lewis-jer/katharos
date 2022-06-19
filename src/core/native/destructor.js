const pageDestructor = async function (pageInfo) {
  console.log('pageDestructor: ', this);
  document.getElementById(pageInfo.viewport).innerHTML = '';
};
const dynamicTableDestructor = async function (_api, pageInfo) {
  console.log('dynamicTableDestructor: ', this);
  if (pageInfo.dynamicTables) {
    if (pageInfo.dynamicTables.status) {
      for (var i in pageInfo.dynamicTables.tables) {
        _api.emptyTable(pageInfo.dynamicTables.tables[i], true);
      }
    }
  }
};

export { pageDestructor, dynamicTableDestructor };
