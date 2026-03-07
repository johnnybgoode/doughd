import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createStore, createStoreHooks } from '@/lib/createStore';
import { parseUpdatePath } from '@/utils/path';

describe('createStoreHooks', () => {
  describe('useField', () => {
    it('returns the initial scalar value', () => {
      const store = createStore({ title: 'My Recipe' });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('title'));
      expect(result.current.value).toBe('My Recipe');
    });

    it('updates a scalar field with a direct value', () => {
      const store = createStore({ title: 'My Recipe' });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('title'));
      act(() => {
        result.current.update('Updated Title');
      });
      expect(result.current.value).toBe('Updated Title');
    });

    it('updates a scalar field with a producer function', () => {
      const store = createStore({ count: 1 });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('count'));
      act(() => {
        result.current.update(prev => (prev as number) + 1);
      });
      expect(result.current.value).toBe(2);
    });

    it('returns the initial object value', () => {
      const store = createStore({
        meta: { author: 'Alice', tags: [] as string[] },
      });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('meta'));
      expect(result.current.value).toEqual({ author: 'Alice', tags: [] });
    });

    it('updates an object field with a direct value', () => {
      const store = createStore({ meta: { author: 'Alice' } });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('meta'));
      act(() => {
        result.current.update({ author: 'Bob' });
      });
      expect(result.current.value).toEqual({ author: 'Bob' });
    });

    it('updates an object field with a producer function', () => {
      const store = createStore({ meta: { author: 'Alice', count: 0 } });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('meta'));
      act(() => {
        result.current.update(draft => {
          (draft as { author: string; count: number }).count = 5;
        });
      });
      expect(result.current.value).toEqual({ author: 'Alice', count: 5 });
    });

    it('returns the initial array value', () => {
      const store = createStore({ tags: ['a', 'b'] });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('tags'));
      expect(result.current.value).toEqual(['a', 'b']);
    });

    it('updates an array field with a direct value', () => {
      const store = createStore({ tags: ['a', 'b'] });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('tags'));
      act(() => {
        result.current.update(['x', 'y', 'z']);
      });
      expect(result.current.value).toEqual(['x', 'y', 'z']);
    });

    it('updates an array field with a producer function', () => {
      const store = createStore({ tags: ['a', 'b'] });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('tags'));
      act(() => {
        result.current.update(prev => {
          (prev as string[]).push('c');
        });
      });
      expect(result.current.value).toEqual(['a', 'b', 'c']);
    });

    it('reflects updates from setData', () => {
      const store = createStore({ title: 'Old', credit: 'Author' });
      const { useField } = createStoreHooks(store);
      const { result } = renderHook(() => useField('title'));
      act(() => {
        store.getState().setData({ title: 'New', credit: 'Author' });
      });
      expect(result.current.value).toBe('New');
    });
  });

  describe('useMultiValueField', () => {
    it('returns the initial array value', () => {
      const store = createStore({
        ingredients: [{ name: 'flour', value: 100, unit: 'g' }],
      });
      const { useMultiValueField } = createStoreHooks(store);
      const { result } = renderHook(() =>
        useMultiValueField('ingredients', { name: '', value: 0, unit: '' }),
      );
      expect(result.current.value).toEqual([
        { name: 'flour', value: 100, unit: 'g' },
      ]);
    });

    it('addItem appends emptyItem to the array', () => {
      const store = createStore({
        ingredients: [{ name: 'flour', value: 100, unit: 'g' }],
      });
      const { useMultiValueField } = createStoreHooks(store);
      const emptyItem = { name: '', value: 0, unit: '' };
      const { result } = renderHook(() =>
        useMultiValueField('ingredients', emptyItem),
      );
      act(() => {
        result.current.addItem();
      });
      expect(result.current.value).toEqual([
        { name: 'flour', value: 100, unit: 'g' },
        { name: '', value: 0, unit: '' },
      ]);
    });

    it('addItem initializes to [emptyItem] when field is not an array', () => {
      const store = createStore({
        ingredients: null as unknown as {
          name: string;
          value: number;
          unit: string;
        }[],
      });
      const { useMultiValueField } = createStoreHooks(store);
      const emptyItem = { name: '', value: 0, unit: '' };
      const { result } = renderHook(() =>
        useMultiValueField('ingredients', emptyItem),
      );
      act(() => {
        result.current.addItem();
      });
      expect(result.current.value).toEqual([{ name: '', value: 0, unit: '' }]);
    });

    it('updateItem updates a text field of the item at the given index', () => {
      const store = createStore({
        ingredients: [
          { name: 'flour', value: 100, unit: 'g' },
          { name: 'water', value: 50, unit: 'ml' },
        ],
      });
      const { useMultiValueField } = createStoreHooks(store);
      const { result } = renderHook(() =>
        useMultiValueField('ingredients', { name: '', value: 0, unit: '' }),
      );
      act(() => {
        result.current.updateItem(
          'salt',
          parseUpdatePath<{ name: string }[]>('name-1'),
        );
      });
      expect(result.current.value[1]).toEqual({
        name: 'salt',
        value: 50,
        unit: 'ml',
      });
    });

    it('updateItem only mutates the targeted item', () => {
      const store = createStore({
        steps: [
          { title: 'Mix', description: 'Mix ingredients', time: 5 },
          { title: 'Knead', description: 'Knead dough', time: 10 },
        ],
      });
      const { useMultiValueField } = createStoreHooks(store);
      const emptyItem = { title: '', description: '', time: 0 };
      const { result } = renderHook(() =>
        useMultiValueField('steps', emptyItem),
      );
      act(() => {
        result.current.updateItem(
          'Stir',
          parseUpdatePath<{ title: string }[]>('title-0'),
        );
      });
      expect(result.current.value[0].title).toBe('Stir');
      expect(result.current.value[1]).toEqual({
        title: 'Knead',
        description: 'Knead dough',
        time: 10,
      });
    });

    it('updateItem handles multi-segment names (key-index format)', () => {
      const store = createStore({
        steps: [{ title: 'Mix', description: 'desc', time: 0 }],
      });
      const { useMultiValueField } = createStoreHooks(store);
      const { result } = renderHook(() =>
        useMultiValueField('steps', { title: '', description: '', time: 0 }),
      );
      act(() => {
        result.current.updateItem(
          'New description',
          parseUpdatePath<{ description: string }[]>('description-0'),
        );
      });
      expect(result.current.value[0].description).toBe('New description');
    });

    it('each store instance is isolated', () => {
      const storeA = createStore({ title: 'A' });
      const storeB = createStore({ title: 'B' });
      const hooksA = createStoreHooks(storeA);
      const hooksB = createStoreHooks(storeB);
      const { result: resultA } = renderHook(() => hooksA.useField('title'));
      const { result: resultB } = renderHook(() => hooksB.useField('title'));

      act(() => {
        resultA.current.update('Changed A');
      });

      expect(resultA.current.value).toBe('Changed A');
      expect(resultB.current.value).toBe('B');
    });
  });
});
