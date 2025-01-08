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

describe('Overflow.Basic', () => {
  function getData(count: number) {
    return new Array(count).fill(undefined).map((_, index) => ({
      label: `Label ${index}`,
      key: `k-${index}`,
    }));
  }

  it('no data', () => {
    const wrapper = mount(<Overflow<ItemType> />);
    expect(wrapper.findItems()).toHaveLength(0);
  });

  it('no maxCount', () => {
    const wrapper = mount(
      <Overflow<ItemType> data={getData(6)} renderItem={renderItem} />,
    );
    expect(wrapper.find('ResizeObserver')).toHaveLength(0);
    expect(wrapper.findItems()).toHaveLength(6);
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
    expect(wrapper.findItems()).toHaveLength(4);
    expect(wrapper.findRest()).toHaveLength(1);
  });

  it('without renderItem', () => {
    const wrapper = mount(<Overflow data={[<span>Bamboo Is Light</span>]} />);
    expect(wrapper.find('Item').text()).toEqual('Bamboo Is Light');
  });

  it('renderItem params have "order"', () => {
    const testData = getData(3);
    const wrapper = mount(
      <Overflow
        data={testData}
        renderItem={(item, info) => {
          return `${item.label}-${info.index}-test`;
        }}
      />,
    );
    const renderedItems = wrapper.find('.rc-overflow-item');
    expect(renderedItems).toHaveLength(testData.length);
    renderedItems.forEach((node, index) => {
      expect(node.text()).toBe(`${testData[index].label}-${index}-test`);
    });
  });
  describe('renderRest', () => {
    it('function', () => {
      const wrapper = mount(
        <Overflow
          data={getData(6)}
          renderItem={renderItem}
          renderRest={omittedItems => `Bamboo: ${omittedItems.length}`}
          maxCount={3}
        />,
      );

      expect(wrapper.findRest().text()).toEqual('Bamboo: 3');
    });

    it('node', () => {
      const wrapper = mount(
        <Overflow
          data={getData(6)}
          renderItem={renderItem}
          renderRest={<span>Light Is Bamboo</span>}
          maxCount={3}
        />,
      );

      expect(wrapper.findRest().text()).toEqual('Light Is Bamboo');
    });
  });

  describe('itemKey', () => {
    it('string', () => {
      const wrapper = mount(
        <Overflow data={getData(1)} renderItem={renderItem} itemKey="key" />,
      );

      expect(wrapper.find('Item').key()).toEqual('k-0');
    });
    it('function', () => {
      const wrapper = mount(
        <Overflow
          data={getData(1)}
          renderItem={renderItem}
          itemKey={item => `bamboo-${item.key}`}
        />,
      );

      expect(wrapper.find('Item').key()).toEqual('bamboo-k-0');
    });
  });

  it('customize component', () => {
    const wrapper = mount(
      <Overflow
        data={getData(1)}
        renderItem={renderItem}
        itemKey={item => `bamboo-${item.key}`}
        component="ul"
        itemComponent="li"
      />,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });
});
