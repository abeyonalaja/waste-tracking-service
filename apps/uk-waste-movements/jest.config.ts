/* eslint-disable */

export default {
  displayName: 'uk-waste-movements',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/uk-waste-movements',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'uk-waste-movements',
        outputDirectory: 'reports/junit',
        outputName: 'uk-waste-movements.xml',
      },
    ],
  ],
};
