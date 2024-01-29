/* eslint-disable */
export default {
  displayName: 'api-feedback',
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
        suiteName: 'api-feedback',
        outputDirectory: 'reports/junit',
        outputName: 'api-feedback.xml',
      },
    ],
  ],
};
