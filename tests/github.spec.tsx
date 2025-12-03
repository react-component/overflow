import React from 'react';
import { render, act } from '@testing-library/react';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
import Overflow from '../src';

import { _rs as onResize } from '@rc-component/resize-observer/lib/utils/observerUtil';

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

  const widths = {
    'rc-overflow': 100,
    'rc-overflow-item': 90,
  };

  const propDef = {
    get() {
      let targetWidth = 0;
      Object.keys(widths).forEach(key => {
        if (this.className.includes(key)) {
          targetWidth = widths[key];
        }
      });

      return targetWidth;
    },
  };

  beforeAll(() => {
    spyElementPrototypes(HTMLDivElement, {
      clientWidth: propDef,
      offsetWidth: propDef,
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

    // width & rest resize
    await triggerResize(container.querySelector('.rc-overflow'));
    await triggerResize(container.querySelector('.rc-overflow-item-rest'));

    act(() => {
      jest.runAllTimers();
    });

    const items = Array.from(
      container.querySelectorAll<HTMLDivElement>(
        '.rc-overflow-item:not(.rc-overflow-item-rest)',
      ),
    );

    for (let i = 0; i < items.length; i += 1) {
      await triggerResize(items[i]);
    }
    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelector('.rc-overflow-item-rest')).toHaveStyle({
      opacity: 1,
    });
  });
});
