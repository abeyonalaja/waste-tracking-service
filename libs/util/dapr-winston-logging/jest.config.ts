/* eslint-disable */
export default {
  displayName: 'lib-util-dapr-winston-logging',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/util/dapr-winston-logging',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'lib-util-dapr-winston-logging',
        outputDirectory: 'reports/junit',
        outputName: 'lib-util-dapr-winston-logging.xml',
      },
    ],
  ],
};
