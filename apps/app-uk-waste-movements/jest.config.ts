/* eslint-disable */

export default {
  displayName: 'app-uk-waste-movements',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/app-uk-waste-movements',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'app-uk-waste-movements',
        outputDirectory: 'reports/junit',
        outputName: 'app-uk-waste-movements.xml',
      },
    ],
  ],
};
