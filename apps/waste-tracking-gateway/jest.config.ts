/* eslint-disable */
export default {
  displayName: 'waste-tracking-gateway',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/waste-tracking-gateway',
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
