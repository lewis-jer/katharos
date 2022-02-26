import {
  pageLoader,
  pageReloader,
  dynamicChartLoader,
  componentLoader,
} from "./environment/index";

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
const drawPage = async function (pageName, pageInfo) {
  var body = documents[pageInfo.arrayExpression].html;
  if (
    pageName == "login" ||
    pageName == "account_verify" ||
    pageName == "eula"
  ) {
    document.body.classList.add("bg-gradient-primary");
    componentLib.navigationBar.status = false;
  } else if (!pageInfo.document && !componentLib.navigationBar.status) {
    await componentLoader(pageInfo);
    let loaderStatus = !configuration.katharos.pageLoader.excludes.includes(
      pageName
    )
      ? await configuration.katharos.pageLoader.script(pageInfo.name)
      : "Loader Not Initialized";
  }

  document.getElementById(pageInfo.viewport).innerHTML = body;

  if (!pageInfo.document && pageInfo.dynamicCharts) {
    await dynamicChartLoader();
  }

  if (!pageInfo.loaded) {
    await pageLoader(pageInfo);
  } else {
    await pageReloader(pageInfo);
  }

  history.replaceState({}, null, window.domain + pageName);
};

export { dynamicTableDestructor, pageDestructor, drawPage };
