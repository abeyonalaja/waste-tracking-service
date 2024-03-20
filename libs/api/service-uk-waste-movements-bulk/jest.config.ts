/* eslint-disable */
export default {
  displayName: 'api-service-uk-waste-movements-bulk',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../coverage/libs/api/service-uk-waste-movements-bulk',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'api-service-uk-waste-movements-bulk',
        outputDirectory: 'reports/junit',
        outputName: 'api-service-uk-waste-movements-bulk.xml',
      },
    ],
  ],
};
