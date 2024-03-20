/* eslint-disable */
export default {
  displayName: 'api-service-uk-waste-movements',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/api/service-uk-waste-movements',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'api-service-uk-waste-movements',
        outputDirectory: 'reports/junit',
        outputName: 'api-service-uk-waste-movements.xml',
      },
    ],
  ],
};
