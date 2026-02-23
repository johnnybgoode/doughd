import {
  type JSX,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useReducer,
  useRef,
} from 'react';
import { createContextHook } from './createContextHook';

const createSlots = <SlotNames extends string>(__slotNames: SlotNames[]) => {
  type SlotItems = {
    [key in SlotNames]?: ReactNode;
  };

  type ContextProps = {
    registerSlot: (name: SlotNames, contents: ReactNode) => void;
    unregisterSlot: (name: SlotNames) => void;
  };

  const [SlotsContextProvider, useSlotsContext] =
    createContextHook<ContextProps>('SlotsContext', {
      registerSlot: () => null,
      unregisterSlot: () => null,
    });

  type SlotsProps = {
    children: (slots: SlotItems) => JSX.Element | null;
  };
  const Slots = ({ children }: SlotsProps) => {
    const forceUpdate = useReducer(() => [], [])[1];
    const slotsRef = useRef<SlotItems>({});

    // Force rerender after children are mounted
    useLayoutEffect(() => {
      forceUpdate();
    }, []);

    const registerSlot = useCallback(
      (name: SlotNames, contents: React.ReactNode) => {
        slotsRef.current[name] = contents;
      },
      [],
    );

    const unregisterSlot = useCallback((name: SlotNames) => {
      slotsRef.current[name] = null;
      forceUpdate();
    }, []);

    return (
      <SlotsContextProvider
        registerSlot={registerSlot}
        unregisterSlot={unregisterSlot}
      >
        {children(slotsRef.current)}
      </SlotsContextProvider>
    );
  };

  const Slot = ({
    name,
    children,
  }: PropsWithChildren<{
    name: SlotNames;
  }>) => {
    const { registerSlot, unregisterSlot } = useSlotsContext();

    useLayoutEffect(() => {
      registerSlot(name, children);
      return () => unregisterSlot(name);
    }, [children, name, registerSlot, unregisterSlot]);

    return null;
  };

  return [Slots, Slot] as const;
};

export default createSlots;
