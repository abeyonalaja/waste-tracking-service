/* eslint-disable */
export default {
  displayName: 'api-mock-gateway',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api-mock-gateway',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'api-mock-gateway',
        outputDirectory: 'reports/junit',
        outputName: 'api-mock-gateway.xml',
      },
    ],
  ],
};
