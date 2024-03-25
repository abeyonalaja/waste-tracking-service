/* eslint-disable */
export default {
  displayName: 'api-waste-tracking-gateway',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api-waste-tracking-gateway',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'api-waste-tracking-gateway',
        outputDirectory: 'reports/junit',
        outputName: 'api-waste-tracking-gateway.xml',
      },
    ],
  ],
};
