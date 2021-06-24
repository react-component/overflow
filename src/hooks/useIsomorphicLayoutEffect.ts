/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import * as React from 'react';

export default function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
) {
  // NOTE: check for client
  // ref: https://github.com/react-component/select/blob/423f860b8582e8d105ce67d189da096db36c0ba6/src/utils/commonUtil.ts#L111
  return typeof window === 'undefined' || process.env.NODE_ENV === 'test'
    ? React.useEffect(effect, deps)
    : React.useLayoutEffect(effect, deps);
}
