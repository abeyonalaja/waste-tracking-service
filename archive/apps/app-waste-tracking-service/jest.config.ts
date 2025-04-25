/* eslint-disable */

export default {
  displayName: 'app-waste-tracking-service',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/app-waste-tracking-service',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'app-waste-tracking-service',
        outputDirectory: 'reports/junit',
        outputName: 'app-waste-tracking-service.xml',
      },
    ],
  ],
};
