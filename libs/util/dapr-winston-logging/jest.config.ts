/* eslint-disable */
export default {
  displayName: 'util-dapr-winston-logging',
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
        suiteName: 'util-dapr-winston-logging',
        outputDirectory: 'reports/junit',
        outputName: 'util-dapr-winston-logging.xml',
      },
    ],
  ],
};
