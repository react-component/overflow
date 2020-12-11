import React from 'react';
import Overflow from '../src';
import { mount } from './wrapper';

interface ItemType {
  label: React.ReactNode;
  key: React.Key;
}

function renderItem(item: ItemType) {
  return item.label;
}

describe('Overflow.Responsive', () => {
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
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(6)}
        renderItem={renderItem}
        maxCount="responsive"
      />,
    );

    wrapper.initSize(100, 20); // [0][1][2][3][4][+2]
    expect(wrapper.findItems()).toHaveLength(5);
    expect(wrapper.findRest()).toHaveLength(1);
    expect(wrapper.findRest().text()).toEqual('+2...');
  });
});
