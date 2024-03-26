/* eslint-disable */
export default {
  displayName: 'service-reference-data',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/service-reference-data',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'service-reference-data',
        outputDirectory: 'reports/junit',
        outputName: 'service-reference-data.xml',
      },
    ],
  ],
};
