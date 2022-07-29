import React from 'react';
import { render, act } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import Overflow from '../src';

import { _rs as onResize } from 'rc-resize-observer/lib/utils/observerUtil';

interface ItemType {
  label: React.ReactNode;
  key: React.Key;
}

function renderItem(item: ItemType) {
  return item.label;
}

function renderRest(items: ItemType[]) {
  return `+${items.length}...`;
}

describe('Overflow.github', () => {
  function getData(count: number) {
    return new Array(count).fill(undefined).map((_, index) => ({
      label: `Label ${index}`,
      key: `k-${index}`,
    }));
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const clientWidths = {
    'rc-overflow': 100,
  };

  beforeAll(() => {
    spyElementPrototypes(HTMLDivElement, {
      clientWidth: {
        get() {
          let targetWidth = 0;
          Object.keys(clientWidths).forEach(key => {
            if (this.className.includes(key)) {
              targetWidth = clientWidths[key];
            }
          });

          return targetWidth;
        },
      },
    });
  });

  async function triggerResize(target: HTMLElement) {
    await act(async () => {
      onResize([{ target } as any]);
      for (let i = 0; i < 10; i += 1) {
        await Promise.resolve();
      }
    });
  }

  it('only one', async () => {
    const { container } = render(
      <Overflow<ItemType>
        data={getData(2)}
        itemKey="key"
        renderItem={renderItem}
        renderRest={renderRest}
        maxCount="responsive"
      />,
    );

    // width resize
    await triggerResize(container.querySelector('.rc-overflow'));

    setTimeout(() => {
      console.log(2333);
    }, 1000);

    act(() => {
      jest.runAllTimers();
    });
    act(() => {
      jest.runAllTimers();
    });
    console.log(jest.getTimerCount());
  });
});
