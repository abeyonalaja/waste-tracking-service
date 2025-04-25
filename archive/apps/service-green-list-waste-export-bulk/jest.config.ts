/* eslint-disable */
export default {
  displayName: 'service-green-list-waste-export-bulk',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/service-green-list-waste-export-bulk',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'service-green-list-waste-export-bulk',
        outputDirectory: 'reports/junit',
        outputName: 'service-green-list-waste-export-bulk.xml',
      },
    ],
  ],
};
