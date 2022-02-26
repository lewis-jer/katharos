let plugins = [];
try {
  console.log(require.resolve("katharos-router"));
  plugins.push("katharos-router");
} catch (e) {
  console.error("katharos-router is not found");
}

try {
  console.log(require.resolve("katharos-dom"));
  plugins.push("katharos-dom");
} catch (e) {
  console.error("katharos-dom is not found");
}

try {
  console.log(require.resolve("katharos-event"));
  plugins.push("katharos-event");
} catch (e) {
  console.error("katharos-event is not found");
}

try {
  console.log(require.resolve("katharos-data"));
  plugins.push("katharos-data");
} catch (e) {
  console.error("katharos-data is not found");
}

export { plugins };
