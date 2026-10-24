import { act, renderHook } from '@testing-library/react';
import { useBatcher } from '../src/hooks/useEffectState';

describe('useEffectState / useBatcher', () => {
  it('should clean up queued updates on unmount', async () => {
    let notify: any;
    let updateCalled = false;
    const { unmount } = renderHook(() => {
      notify = useBatcher();
    });

    notify(() => {
      updateCalled = true;
    });

    unmount();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    expect(updateCalled).toBe(false);
  });
});
