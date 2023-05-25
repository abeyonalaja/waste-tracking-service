const { composePlugins, withNx } = require('@nrwl/webpack');
const { merge } = require('webpack-merge');

module.exports = composePlugins(withNx(), (config, { configuration }) =>
  merge(config, {
    mode: configuration,
    experiments: { futureDefaults: true },
  })
);
