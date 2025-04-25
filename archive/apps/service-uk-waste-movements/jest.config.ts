/* eslint-disable */
export default {
  displayName: 'service-uk-waste-movements',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/service-uk-waste-movements',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'service-uk-waste-movements',
        outputDirectory: 'reports/junit',
        outputName: 'service-uk-waste-movements.xml',
      },
    ],
  ],
};
