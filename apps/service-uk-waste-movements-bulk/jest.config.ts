/* eslint-disable */
export default {
  displayName: 'service-uk-waste-movements-bulk',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/service-uk-waste-movements-bulk',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'service-uk-waste-movements-bulk',
        outputDirectory: 'reports/junit',
        outputName: 'service-uk-waste-movements-bulk.xml',
      },
    ],
  ],
};
