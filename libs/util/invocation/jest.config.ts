/* eslint-disable */
export default {
  displayName: 'lib-util-invocation',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/util/invocation',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'lib-util-invocation',
        outputDirectory: 'reports/junit',
        outputName: 'lib-util-invocation.xml',
      },
    ],
  ],
};
