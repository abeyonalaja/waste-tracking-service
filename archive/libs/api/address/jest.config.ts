/* eslint-disable */
export default {
  displayName: 'lib-api-address',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api/address',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'lib-api-address',
        outputDirectory: 'reports/junit',
        outputName: 'lib-api-address.xml',
      },
    ],
  ],
};
