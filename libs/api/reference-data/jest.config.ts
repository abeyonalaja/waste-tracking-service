/* eslint-disable */
export default {
  displayName: 'lib-api-reference-data',
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
        suiteName: 'lib-api-reference-data',
        outputDirectory: 'reports/junit',
        outputName: 'lib-api-reference-data.xml',
      },
    ],
  ],
};
