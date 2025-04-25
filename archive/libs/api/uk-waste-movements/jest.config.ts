/* eslint-disable */
export default {
  displayName: 'lib-api-uk-waste-movements',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api/uk-waste-movements',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'lib-api-uk-waste-movements',
        outputDirectory: 'reports/junit',
        outputName: 'lib-api-uk-waste-movements.xml',
      },
    ],
  ],
};
