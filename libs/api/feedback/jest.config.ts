/* eslint-disable */
export default {
  displayName: 'lib-api-feedback',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api/feedback',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'lib-api-feedback',
        outputDirectory: 'reports/junit',
        outputName: 'lib-api-feedback.xml',
      },
    ],
  ],
};
