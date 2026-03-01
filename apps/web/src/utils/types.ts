export type ElementOf<T> = T extends (infer U)[] ? U : never;
export type FilterKeys<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
export type ValueOf<T> = T extends object ? T[keyof T] : never;
