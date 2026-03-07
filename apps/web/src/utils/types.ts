export type ElementOf<T> = T extends (infer U)[] ? U : never;

export type FilterKeys<T extends object, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type FilterValues<T extends object, U> = Pick<T, FilterKeys<T, U>>;

export type ValueOf<T> = T extends object ? T[keyof T] : never;

export type StringKeys<T> = {
  [K in keyof T]: K extends string ? K : never;
}[keyof T];

export type Split<
  Str extends string,
  Sep extends string,
> = Str extends `${infer First}${Sep}${infer Rest}`
  ? [First, ...Split<Rest, Sep>]
  : never[];
