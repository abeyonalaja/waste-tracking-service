// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();
const assetPath =
  process.env['NODE_ENV'] === 'production' ? '/move-waste/assets/' : '/assets/';
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  basePath: process.env['NODE_ENV'] === 'production' ? '/move-waste' : '',
  sassOptions: {
    prependData: `$assetPath: '${assetPath}';`,
  },
  experimental: {
    instrumentationHook: true,
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextIntl,
];

module.exports = composePlugins(...plugins)(nextConfig);
