const { composePlugins, withNx } = require('@nx/webpack');
const { merge } = require('webpack-merge');

module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config, { configuration }) =>
    merge(config, {
      mode: configuration,
      experiments: { futureDefaults: true },
    })
);
