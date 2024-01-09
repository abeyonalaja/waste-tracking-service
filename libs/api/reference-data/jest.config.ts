/* eslint-disable */
export default {
  displayName: 'api-reference-data',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api/reference-data',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'api-reference-data',
        outputDirectory: 'reports/junit',
        outputName: 'api-reference-data.xml',
      },
    ],
  ],
};
