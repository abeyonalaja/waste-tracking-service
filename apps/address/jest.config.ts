/* eslint-disable */
export default {
  displayName: 'address',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/address',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'address',
        outputDirectory: 'reports/junit',
        outputName: 'address.xml',
      },
    ],
  ],
};
