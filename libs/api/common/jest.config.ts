/* eslint-disable */
export default {
  displayName: 'api-common',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api/common',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'api-common',
        outputDirectory: 'reports/junit',
        outputName: 'api-common.xml',
      },
    ],
  ],
};
