/* eslint-disable */
export default {
  displayName: 'adobe-aem-angular-editable-components',
  preset: '../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../coverage/adobe-aem-angular-editable-components',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  moduleNameMapper: {
    '^@kav-khalsa/adobe-aem-spa-model-manager/src/lib/common/constants$': '<rootDir>/src/mocks/constants.ts',
    '^@kav-khalsa/adobe-aem-spa-model-manager/src/lib/services/model-manager.service$': '<rootDir>/src/mocks/model-manager.mock.ts',
    '^@kav-khalsa/adobe-aem-spa-model-manager/src/lib/utils/path.service$': '<rootDir>/src/mocks/path-utils.mock.ts',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};