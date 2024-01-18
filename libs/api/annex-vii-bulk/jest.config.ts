/* eslint-disable */
export default {
  displayName: 'api-annex-vii-bulk',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api/annex-vii-bulk',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'api-annex-vii-bulk',
        outputDirectory: 'reports/junit',
        outputName: 'api-annex-vii-bulk.xml',
      },
    ],
  ],
};
