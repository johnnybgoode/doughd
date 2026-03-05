import { castDraft, type Draft } from 'immer';
import { type ChangeEvent, useCallback, useRef } from 'react';
import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { combine } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/vanilla/shallow';
import type { ElementOf, FilterKeys } from '@/utils/types';

type Producer<T> = (draft: Draft<T>) => T;
type Updater<T> = Draft<T> | Producer<T>;

type TState = object;
type TStore<T extends TState> = ReturnType<typeof createStore<T>>;

type TStoreState<T extends TState> =
  TStore<T> extends { getState: () => infer T } ? T : never;
type TStoreActions = keyof TStoreState<object>;

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

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
  type TFieldName = keyof Omit<T, TStoreActions>;
  const useField = <K extends TFieldName>(field: K, useShallow = true) => {
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

  const getUpdatePath = (path: string) => {
    const [index, key] = path.split('-').reverse();
    return [Number(index), key] as const;
  };

  type TArrayFieldNames = TFieldName & FilterKeys<Required<T>, any[]>;
  // type ArrayField<K extends TFieldName> = T[K] extends Iterable<infer U> ? U : never
  const useMultiValueField = <K extends TArrayFieldNames, TValue extends T[K]>(
    field: K,
    emptyItem: ElementOf<TValue>,
    useShallow?: true,
  ) => {
    //type TFieldValue = T[K] extends any[] ? TFieldValue : never;
    const { value, update } = useField<K>(field, useShallow) as {
      value: (typeof emptyItem)[];
      update: (value: Updater<ElementOf<TValue>[]>) => void;
    };
    // if (value && typeof value === 'object' &&  !('map' in value)) {
    //   throw new Error('non-array field used with useMultiValueField')
    // }

    const onChangeItem = useCallback(
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const [index, key] = getUpdatePath(e.currentTarget.name);
        const nextValue =
          key === 'value'
            ? Number(e.currentTarget.value)
            : e.currentTarget.value;

        update(prev => {
          if (
            typeof prev === 'undefined' ||
            (typeof prev === 'object' && prev === null)
          ) {
            return [emptyItem];
          }
          return prev.map((item, i) =>
            i === Number(index)
              ? {
                  ...item,
                  [key]: nextValue,
                }
              : item,
          );
        });
      },
      [update, emptyItem],
    );

    const onAddItem = useCallback(() => {
      update(prev => [...(prev || []), emptyItem] as T[K]);
    }, [update, emptyItem]);

    return {
      onChangeItem,
      onAddItem,
      value,
    };
  };

  return { useField, useMultiValueField } as const;
};
