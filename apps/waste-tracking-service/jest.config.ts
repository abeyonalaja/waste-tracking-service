/* eslint-disable */
export default {
  displayName: 'waste-tracking-service',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/waste-tracking-service',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'waste-tracking-service',
        outputDirectory: 'reports/junit',
        outputName: 'waste-tracking-service.xml',
      },
    ],
  ],
};
