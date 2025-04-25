/* eslint-disable */
export default {
  displayName: 'lib-api-green-list-waste-export-bulk',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api/green-list-waste-export-bulk',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'lib-api-green-list-waste-export-bulk',
        outputDirectory: 'reports/junit',
        outputName: 'lib-api-green-list-waste-export-bulk.xml',
      },
    ],
  ],
};
