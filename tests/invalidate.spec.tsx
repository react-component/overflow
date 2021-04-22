import React from 'react';
import Overflow from '../src';
import { mount } from './wrapper';

interface ItemType {
  label: React.ReactNode;
  key: React.Key;
}

describe('Overflow.Invalidate', () => {
  function getData(count: number) {
    return new Array(count).fill(undefined).map((_, index) => ({
      label: `Label ${index}`,
      key: `k-${index}`,
    }));
  }

  it('render item', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(2)}
        renderItem={item => {
          return item.label;
        }}
        itemKey={item => `bamboo-${item.key}`}
        itemComponent="li"
        component="ul"
        maxCount={Overflow.INVALIDATE}
      />,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('render raw', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(2)}
        renderRawItem={item => {
          return <Overflow.Item component="li">{item.label}</Overflow.Item>;
        }}
        itemKey={item => `bamboo-${item.key}`}
        component="ul"
        maxCount={Overflow.INVALIDATE}
      />,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });
});
