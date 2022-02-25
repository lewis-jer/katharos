try {
  console.log(require.resolve("katharos-router"));
} catch (e) {
  console.error("katharos-router is not found");
}

export { plugins };
