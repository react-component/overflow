import useEvent from 'rc-util/lib/hooks/useEvent';
import * as React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

type Updater<T> = T | ((origin: T) => T);

type UpdateCallbackFunc = VoidFunction;

type NotifyEffectUpdate = (callback: UpdateCallbackFunc) => void;

/**
 * Batcher for record any `useEffectState` need update.
 */
export function useBatcher() {
  // Updater Trigger
  const updateFuncRef = React.useRef<UpdateCallbackFunc[]>(null);

  // Notify update
  const notifyEffectUpdate: NotifyEffectUpdate = callback => {
    // console.error('Update');
    if (!updateFuncRef.current) {
      updateFuncRef.current = [];

      const channel = new MessageChannel();
      channel.port1.onmessage = () => {
        // console.log('!!! channel update !!!');
        unstable_batchedUpdates(() => {
          updateFuncRef.current.forEach(fn => {
            fn();
          });
          updateFuncRef.current = null;
        });
      };
      channel.port2.postMessage(undefined);
    }

    // console.log('push');
    updateFuncRef.current.push(callback);
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

  // Set State
  const setEffectVal = useEvent((nextValue: Updater<T>) => {
    notifyEffectUpdate(() => {
      setStateValue(nextValue);
    });
  });

  return [stateValue, setEffectVal];
}
