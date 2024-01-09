/* eslint-disable */
export default {
  displayName: 'reference-data',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/reference-data',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'reference-data',
        outputDirectory: 'reports/junit',
        outputName: 'reference-data.xml',
      },
    ],
  ],
};
