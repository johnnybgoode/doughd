import { castDraft, type Draft } from 'immer';
import { useCallback, useRef } from 'react';
import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { combine } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/vanilla/shallow';

type TState = object;

type Producer<T> = (draft: Draft<T>) => T;

type Updater<T> = Draft<T> | Producer<T>;

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

type TStore<T extends TState> = ReturnType<typeof createStore<T>>;
type TStoreState<T extends TState> =
  TStore<T> extends { getState: () => infer T } ? T : never;
type TStoreActions = keyof TStoreState<object>;

const isProducer = <T>(value: Updater<T>): value is Producer<T> =>
  typeof value === 'function';

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store(s => s[k as keyof typeof s]);
  }

  return store;
};

export const createStore = <T extends TState>(initialState: T) =>
  create(
    immer(
      combine(initialState, (set, get) => ({
        setState: (nextState: Partial<T>) => {
          set(() => nextState);
        },
        updateField: <K extends keyof T>(key: K, value: Updater<T[K]>) => {
          set((draft: Draft<T>) => {
            if (isProducer(value) && key in draft) {
              return {
                [key]: value(castDraft(get()[key])),
              };
            }
            return {
              [key]: value,
            };
          });
        },
      })),
    ),
  );

export const createStoreHooks = <T extends TState>(
  store: UseBoundStore<StoreApi<T>>,
) => {
  const useField = <K extends keyof Omit<T, TStoreActions>>(
    field: K,
    useShallow = true,
  ) => {
    const prev = useRef<T[K]>(void 0);
    const value = store((state: T) => {
      const next = state[field];
      if (!useShallow) {
        return next;
      }
      return shallow(prev.current, next) ? prev.current : (prev.current = next);
    });
    const updateField = store(state => (state as TStoreState<T>).updateField);

    return {
      value,
      update: useCallback(
        (value: Updater<T[K]>) => updateField(field, value),
        [updateField, field],
      ),
    } as const;
  };

  return { useField } as const;
};
