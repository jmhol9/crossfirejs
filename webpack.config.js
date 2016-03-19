module.exports = {
  context: __dirname,
  entry: "./crossfire/main.js",
  output: {
    path: "./crossfire/",
    publicPath: "/crossfire/",
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  devtool: 'source-maps',
};
