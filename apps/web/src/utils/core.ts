export const isDefined = (v: unknown) => v !== undefined && v !== null;

export const isObject = (v: unknown): v is object => {
  return typeof v === 'object' && isDefined(v);
};
