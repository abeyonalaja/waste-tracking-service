/* eslint-disable */
export default {
  displayName: 'mock-gateway',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/mock-gateway',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'waste-tracking-gateway',
        outputDirectory: 'reports/junit',
        outputName: 'waste-tracking-gateway.xml',
      },
    ],
  ],
};
