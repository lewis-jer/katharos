async function pageDestructor(pageInfo) {
  console.log('pageDestructor: ', this);
  document.getElementById(pageInfo.viewport).innerHTML = '';
}

async function dynamicTableDestructor(pageInfo) {
  console.log('dynamicTableDestructor: ', this);
  if (pageInfo.dynamicTables) {
    if (pageInfo.dynamicTables.status) {
      for (var i in pageInfo.dynamicTables.tables) {
        this.emptyTable(pageInfo.dynamicTables.tables[i], true);
      }
    }
  }
}

export { pageDestructor, dynamicTableDestructor };
