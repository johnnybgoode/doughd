const isError = (e: unknown): e is Error => {
  return e !== null && typeof e === 'object' && 'message' in e;
};

export const log = {
  error: (e: unknown) => {
    if (isError(e)) {
      console.error(e.message);
    }
  },
} as const;
