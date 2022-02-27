let plugins = [];
try {
  console.log(require.resolve('katharos-router'));
  plugins.push('katharos-router');
} catch (e) {
  console.error('katharos-router is not found');
}

export { plugins };
