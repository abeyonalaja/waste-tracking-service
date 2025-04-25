/* eslint-disable */
export default {
  displayName: 'service-payment',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/apps/service-payment',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'service-payment',
        outputDirectory: 'reports/junit',
        outputName: 'service-payment.xml',
      },
    ],
  ],
};
