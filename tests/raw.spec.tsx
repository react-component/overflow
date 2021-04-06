import React from 'react';
import Overflow from '../src';
import Item from '../src/Item';
import { mount } from './wrapper';

interface ItemType {
  label: React.ReactNode;
  key: React.Key;
}

describe('Overflow.Raw', () => {
  function getData(count: number) {
    return new Array(count).fill(undefined).map((_, index) => ({
      label: `Label ${index}`,
      key: `k-${index}`,
    }));
  }

  it('render node directly', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(1)}
        renderRawItem={item => {
          return <Overflow.Item component="li">{item.label}</Overflow.Item>;
        }}
        itemKey={item => `bamboo-${item.key}`}
        component="ul"
      />,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('safe with item directly', () => {
    const wrapper = mount(<Overflow.Item>Bamboo</Overflow.Item>);

    expect(wrapper.render()).toMatchSnapshot();

    expect(wrapper.exists(Item)).toBeFalsy();
  });
});
