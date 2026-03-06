import { type Draft, type Producer, produce } from 'immer';
import { type ChangeEvent, useCallback, useRef } from 'react';
import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { combine } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/vanilla/shallow';
import { isObject } from '@/utils/core';
import type { ElementOf, FilterKeys } from '@/utils/types';

type Update<T> = T | Producer<T>;
type TState = object;
type TStore<T extends TState> = ReturnType<typeof createStore<T>>;

// type TStoreState<T extends TState> =
//   TStore<T> extends { getState: () => infer T } ? T : never;
// type TStoreData<T extends TState> =
//   TStoreState<T> extends { data: infer D } ? D : never;

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const isProducer = <T>(value: Update<T>): value is Producer<T> =>
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
      combine({ data: initialState }, set => ({
        setData: (nextState: T) => {
          set({ data: nextState });
        },
        updateField: <K extends keyof T>(key: K, update: Update<T[K]>) => {
          set(draft => {
            if (!isObject(draft.data)) {
              console.warn('Slice `data` is not an object');
              return;
            }
            const nextValue = isProducer(update)
              ? produce((draft.data as T)[key], update)
              : update;

            (draft.data as T)[key] = nextValue;
          });
        },
      })),
    ),
  );

// TODO -> utils
const getUpdatePath = (path: string) => {
  const [index, key] = path.split('-').reverse();
  return [Number(index), key] as const;
};

export const createStoreHooks = <T extends TState>(store: TStore<T>) => {
  type TFieldName = keyof T;
  type TArrayFieldNames = TFieldName & FilterKeys<Required<T>, any[]>;

  const useField = <K extends TFieldName>(field: K, useShallow = true) => {
    const prev = useRef<T[K]>(void 0);
    const value = store(state => {
      const next = state.data[field];
      if (!useShallow) {
        return next;
      }
      return shallow(prev.current, next) ? prev.current : (prev.current = next);
    });
    const updateField = store(state => state.updateField);

    return {
      value,
      update: useCallback(
        (value: Update<T[K]>) => updateField(field, value),
        [updateField, field],
      ),
    } as const;
  };

  const useMultiValueField = <K extends TArrayFieldNames>(
    field: K,
    emptyItem: ElementOf<T[K]>,
    useShallow?: true,
  ) => {
    const { value, update } = useField<K>(field, useShallow);

    const onChangeItem = useCallback(
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const [index, key] = getUpdatePath(e.currentTarget.name);
        const nextValue =
          key === 'value'
            ? Number(e.currentTarget.value)
            : e.currentTarget.value;

        update(prev => {
          if (!Array.isArray(prev)) {
            return [emptyItem] as Draft<T[K]>;
          }
          return prev.map((item, i) =>
            i === Number(index)
              ? {
                  ...item,
                  [key]: nextValue,
                }
              : item,
          ) as Draft<T[K]>;
        });
      },
      [update, emptyItem],
    );

    const onAddItem = useCallback(() => {
      update(prev => {
        if (!Array.isArray(prev)) {
          return [emptyItem] as Draft<T[K]>;
        }
        return [...prev, emptyItem] as Draft<T[K]>;
      });
    }, [update, emptyItem]);

    return {
      onChangeItem,
      onAddItem,
      value,
    };
  };

  return { useField, useMultiValueField } as const;
};
