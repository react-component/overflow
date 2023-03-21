import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import useEvent from 'rc-util/lib/hooks/useEvent';
import * as React from 'react';

type Updater<T> = T | ((origin: T) => T);

const EMPTY = {};

/**
 * Trigger state update by `useLayoutEffect` to save perf.
 */
export default function useEffectState<T extends string | number | object>(
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
