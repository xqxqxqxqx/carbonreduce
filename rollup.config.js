const { createSpaConfig } = require('ing-kit-rollup-config');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const supportedLocales = ['en-GB', 'nl-NL'];
const baseConfig = createSpaConfig({
  indexHtmlPath: 'index.html',
  // set to true to support polymer and HTML Imports
  polymerHybrid: false,
  supportedLocales,
});

module.exports = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    // resolve bare module imports from bower_components
    nodeResolve({
      customResolveOptions: {
        moduleDirectory: ['node_modules', 'bower_components'],
      },
    }),
  ],
};
