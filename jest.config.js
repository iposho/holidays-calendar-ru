/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'], // Путь к исходникам
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1', // Для работы с алиасами
  },
  setupFilesAfterEnv: [],
};
