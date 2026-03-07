export const parseUpdatePath = <T extends Record<string, any>[]>(
  path: string,
) => {
  const [index, key] = path.split('-').reverse();
  return [Number(index), key as keyof T[number]] as const;
};
