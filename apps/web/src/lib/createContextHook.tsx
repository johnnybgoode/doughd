import {
  createContext,
  type PropsWithChildren,
  useContext as useContextReact,
  useMemo,
} from 'react';
import { capitalize } from '@/utils/string';

export const createContextHook = <T,>(contextName: string, defaultValue: T) => {
  const Context = createContext(defaultValue);
  Context.displayName = contextName;

  const Provider = ({ children, ...values }: PropsWithChildren<T>) => {
    // biome-ignore lint: lint/correctness/useExhaustiveDependencies
    const contextValue = useMemo(() => values, Object.values(values)) as T;
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
  };

  const useContext = () => {
    const value = useContextReact(Context);
    if (value) {
      return value;
    }
    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }
    throw new Error(
      `use${capitalize(contextName)} must be called within ${capitalize(contextName)}`,
    );
  };

  return [Provider, useContext] as const;
};
