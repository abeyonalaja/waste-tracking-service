/* eslint-disable */

export default {
  displayName: 'app-green-list-waste',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/app-green-list-waste',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'app-green-list-waste',
        outputDirectory: 'reports/junit',
        outputName: 'app-green-list-waste.xml',
      },
    ],
  ],
};
