import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Overflow from '../src';

interface ItemType {
  label: React.ReactNode;
  key: React.Key;
}

function renderItem(item: ItemType) {
  return item.label;
}

describe('Overflow.SSR', () => {
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

  it('basic', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
      <Overflow<ItemType>
        data={getData(2)}
        renderItem={renderItem}
        maxCount="responsive"
        ssr="full"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
