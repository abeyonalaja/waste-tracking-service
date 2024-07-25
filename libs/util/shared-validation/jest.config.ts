/* eslint-disable */
export default {
  displayName: 'lib-util-shared-validation',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/util/shared-validation',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'lib-util-shared-validation',
        outputDirectory: 'reports/junit',
        outputName: 'lib-util-shared-validation.xml',
      },
    ],
  ],
};
