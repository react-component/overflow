import React from 'react';
import Overflow from '../src';
import { mount } from './wrapper';

interface ItemType {
  label: string;
  key: number;
}

function renderItem(item: ItemType) {
  return item.label;
}

describe('Overflow', () => {
  function getData(count: number) {
    return new Array(count).fill(undefined).map((_, index) => ({
      label: `Label ${index}`,
      key: index,
    }));
  }

  it('no maxCount', () => {
    const wrapper = mount(
      <Overflow<ItemType> data={getData(6)} renderItem={renderItem} />,
    );
    expect(wrapper.find('ResizeObserver')).toHaveLength(0);
    expect(wrapper.find('div.rc-overflow-item')).toHaveLength(6);
    expect(wrapper.findRest()).toHaveLength(0);
  });

  it('number maxCount', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(6)}
        renderItem={renderItem}
        maxCount={4}
      />,
    );
    expect(wrapper.find('ResizeObserver')).toHaveLength(0);
    expect(wrapper.find('div.rc-overflow-item')).toHaveLength(4 + 1);
    expect(wrapper.findRest()).toHaveLength(1);
  });

  it('renderRest', () => {
    const wrapper = mount(
      <Overflow
        data={getData(6)}
        renderItem={renderItem}
        renderRest={(omittedItems) => `Bamboo: ${omittedItems.length}`}
        maxCount={3}
      />,
    );

    expect(wrapper.findRest().text()).toEqual('Bamboo: 3');
  });
});
