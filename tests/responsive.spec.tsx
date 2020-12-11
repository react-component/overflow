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

    wrapper.initSize(100, 20); // [0][1][2][3][4][+2](5)(6)
    expect(wrapper.findItems()).toHaveLength(6);
    [true, true, true, true, false, false].forEach((display, i) => {
      expect(
        wrapper
          .findItems()
          .at(i)
          .props().display,
      ).toBe(display);
    });
    expect(wrapper.findRest()).toHaveLength(1);
    expect(wrapper.findRest().text()).toEqual('+ 2 ...');
  });

  it('remove to clean up', () => {
    const data = getData(6);

    const wrapper = mount(
      <Overflow<ItemType>
        data={data}
        itemKey="key"
        renderItem={renderItem}
        maxCount="responsive"
      />,
    );
    wrapper.initSize(100, 20);

    // Remove one
    const newData = [...data];
    newData.splice(1, 1);
    wrapper.setProps({ data: newData });

    expect(wrapper.findItems()).toHaveLength(5);
    expect(wrapper.findRest().text()).toEqual('+ 1 ...');
  });

  it('none to overflow', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(5)}
        itemKey="key"
        renderItem={renderItem}
        maxCount="responsive"
      />,
    );

    wrapper.initSize(100, 20);
    expect(wrapper.findItems()).toHaveLength(5);
    expect(wrapper.findRest().props().display).toBeFalsy();
  });
});
