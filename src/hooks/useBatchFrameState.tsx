import { useRef } from 'react';
import raf from 'rc-util/lib/raf';
import useState from 'rc-util/lib/hooks/useState';

/**
 * State generate. Return a `setState` but it will flush all state with one render to save perf.
 * This is not a realization of `unstable_batchedUpdates`.
 */
export function useBatchFrameState() {
  const [, forceUpdate] = useState({});
  const statesRef = useRef<any[]>([]);
  let walkingIndex = 0;
  let beforeFrameId: number = 0;

  function createState<T>(
    defaultValue: T,
  ): [T, (value: T | ((origin: T) => T)) => void] {
    const myIndex = walkingIndex;
    walkingIndex += 1;

    // Fill value if not exist yet
    if (statesRef.current.length < myIndex + 1) {
      statesRef.current[myIndex] = defaultValue;
    }

    // Return filled as `setState`
    const value = statesRef.current[myIndex];

    function setValue(val: any) {
      statesRef.current[myIndex] =
        typeof val === 'function' ? val(statesRef.current[myIndex]) : val;

      raf.cancel(beforeFrameId);

      // Flush with batch
      beforeFrameId = raf(() => {
        forceUpdate({}, true);
      });
    }

    return [value, setValue];
  }

  return createState;
}
