// Import a manuscript as text so Next.js tracks saves for Fast Refresh.
module.exports = function markdownLoader(source) {
  return `export default ${JSON.stringify(source)};`;
};
