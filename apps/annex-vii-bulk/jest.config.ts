/* eslint-disable */
export default {
  displayName: 'annex-vii-bulk',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/annex-vii-bulk',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'annex-vii-bulk',
        outputDirectory: 'reports/junit',
        outputName: 'annex-vii-bulk.xml',
      },
    ],
  ],
};
