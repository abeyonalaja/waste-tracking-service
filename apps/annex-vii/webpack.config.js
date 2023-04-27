const { composePlugins, withNx } = require('@nrwl/webpack');
const { merge } = require('webpack-merge');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) =>
  merge(config, { experiments: { futureDefaults: true } })
);
