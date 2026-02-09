export const sharedConfig = {
  test: {
    global: true,
    coverage: {
      enabled: true,
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
