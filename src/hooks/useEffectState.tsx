import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import useEvent from 'rc-util/lib/hooks/useEvent';
import * as React from 'react';

type Updater<T> = T | ((origin: T) => T);

const EMPTY = {};

type UpdateCallbackFunc = (first: boolean) => void;

type NotifyEffectUpdate = (key: number, callback: UpdateCallbackFunc) => void;

/**
 * Batcher for record any `useEffectState` need update.
 */
export function useBatcher() {
  // Updater Trigger
  const [updateCount, setUpdateCount] = React.useState(0);
  const updateFuncRef =
    React.useRef<UpdateCallbackFunc[]>(null);

  // Effect updater
  useLayoutEffect(() => {
    if (updateCount !== 0) {
      const keys: Record<number, boolean> = {};
      updateFuncRef.current.forEach(([key, callback]) => {
        callback(!keys[key]);
        keys[key] = true;
      });
      updateFuncRef.current = null;
    }
  }, [updateCount]);

  // Notify update
  const notifyEffectUpdate: NotifyEffectUpdate = (key, callback) => {
    if (!updateFuncRef.current) {
      updateFuncRef.current = [];
      setUpdateCount(c => c + 1);
    }

    updateFuncRef.current.push([key, callback]);
  };

  return notifyEffectUpdate;
}

/**
 * Trigger state update by `useLayoutEffect` to save perf.
 */
export default function useEffectState<T extends string | number | object>(
  notifyEffectUpdate: NotifyEffectUpdate,
  defaultValue?: T,
): [T, (value: Updater<T>) => void] {
  // Value
  const [stateValue, setStateValue] = React.useState(defaultValue);
  const valRef = React.useRef<T | typeof EMPTY>(EMPTY);

  // Updater Trigger
  const [updateCount, setUpdateCount] = React.useState(0);

  // Effect Updater
  useLayoutEffect(() => {
    if (updateCount !== 0) {
      setStateValue(valRef.current as T);
      valRef.current = EMPTY;
    }
  }, [updateCount]);

  // Set State
  const setEffectVal = useEvent((nextValue: Updater<T>) => {
    let mergedNextValue: T;

    const init = valRef.current === EMPTY;

    if (typeof nextValue === 'function') {
      if (init) {
        valRef.current = stateValue;
      }
      mergedNextValue = nextValue(valRef.current as T);
    } else {
      mergedNextValue = nextValue;
    }
    valRef.current = mergedNextValue;

    if (init) {
      setUpdateCount(c => c + 1);
    }
  });

  return [stateValue, setEffectVal];
}
