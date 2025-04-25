const { composePlugins, withNx } = require('@nrwl/webpack');

module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config) => {
    config.experiments.futureDefaults = true;
    return config;
  },
);
