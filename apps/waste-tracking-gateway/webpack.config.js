const { composePlugins, withNx } = require('@nrwl/webpack');
const { merge } = require('webpack-merge');

module.exports = composePlugins(withNx(), (config) =>
  merge(config, { experiments: { futureDefaults: true } })
);
