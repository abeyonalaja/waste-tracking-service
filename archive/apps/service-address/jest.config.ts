/* eslint-disable */
export default {
  displayName: 'service-address',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/service-address',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'service-address',
        outputDirectory: 'reports/junit',
        outputName: 'service-address.xml',
      },
    ],
  ],
};
