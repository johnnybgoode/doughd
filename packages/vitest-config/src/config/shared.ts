export const sharedConfig = {
  test: {
    coverage: {
      include: ['src/**/*.ts?(x)'],
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      thresholds: {
        lines: 90,
        functions: 90,
      },
    },
  },
};
