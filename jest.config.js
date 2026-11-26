export default {
    transform: {
        '\\.[tj]s$': ['ts-jest', {
            useESM: true,
          }],
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
    transformIgnorePatterns: [],
    testEnvironment: 'node',
    testRegex: '.*/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
