import React from 'react';
import { render } from 'enzyme';
import { act } from 'react-dom/test-utils';
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
    const wrapper = render(
      <Overflow<ItemType>
        data={getData(2)}
        renderItem={renderItem}
        maxCount="responsive"
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('with suffix', () => {
    const wrapper = render(
      <Overflow<ItemType>
        data={getData(2)}
        renderItem={renderItem}
        maxCount="responsive"
        suffix={<span>I am a suffix</span>}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
