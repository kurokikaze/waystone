export default {
    transform: {
        '\\.ts$': ['ts-jest', {
            useESM: true,
          }],
    },
    extensionsToTreatAsEsm: ['.ts'],
    transformIgnorePatterns: [],
    testEnvironment: 'node',
    testRegex: '.*/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};