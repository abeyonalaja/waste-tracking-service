/* eslint-disable */
export default {
  displayName: 'api-annex-vii',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api/annex-vii',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'api-annex-vii',
        outputDirectory: 'reports/junit',
        outputName: 'api-annex-vii.xml',
      },
    ],
  ],
};
