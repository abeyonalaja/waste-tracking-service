/* eslint-disable */
export default {
  displayName: 'lib-api-payment',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../../coverage/libs/api/payment',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'lib-api-payment',
        outputDirectory: 'reports/junit',
        outputName: 'lib-api-payment.xml',
      },
    ],
  ],
};
