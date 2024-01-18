/* eslint-disable */
export default {
  displayName: 'util-invocation',
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
        suiteName: 'util-invocation',
        outputDirectory: 'reports/junit',
        outputName: 'util-invocation.xml',
      },
    ],
  ],
};
