/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: ['**/tests/unit/*.test.ts'],
    coverageThreshold: {
        global: {
          branches: 80,  // Porcentaje mínimo de cobertura de branches
          functions: 70, // Porcentaje mínimo de cobertura de funciones
          lines: 70,     // Porcentaje mínimo de cobertura de líneas
          statements: 70 // Porcentaje mínimo de cobertura de statements
        },
    },
};
