/* eslint-disable */
export default {
  displayName: 'api-address',
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
        suiteName: 'api-address',
        outputDirectory: 'reports/junit',
        outputName: 'api-address.xml',
      },
    ],
  ],
};
