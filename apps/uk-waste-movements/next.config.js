// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
// Import the next-intl plugin
const nextIntl = require('next-intl/plugin');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  basePath: '/ukwm',
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  nextIntl('./i18n.ts'),
];

module.exports = composePlugins(...plugins)(nextConfig);
