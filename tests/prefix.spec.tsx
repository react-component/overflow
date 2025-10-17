import React from 'react';
import { mount } from './wrapper';
import Overflow from '../src';

interface ItemType {
  key: React.Key;
  value: any;
}

function getData(count: number): ItemType[] {
  return new Array(count).fill(null).map((_, index) => ({
    key: `key-${index}`,
    value: index,
  }));
}

function renderItem(item: ItemType) {
  return <span>{item.value}</span>;
}

describe('Overflow.Prefix', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('should render prefix when provided', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(3)}
        itemKey="key"
        renderItem={renderItem}
        prefix="Prefix:"
      />,
    );

    expect(wrapper.findPrefix()).toHaveLength(1);
    expect(wrapper.findPrefix().text()).toBe('Prefix:');
  });

  it('should not render prefix when not provided', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(3)}
        itemKey="key"
        renderItem={renderItem}
      />,
    );

    expect(wrapper.findPrefix()).toHaveLength(0);
  });

  it('should work with responsive mode and show overflow', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(10)}
        itemKey="key"
        renderItem={renderItem}
        maxCount="responsive"
        prefix="Label:"
      />,
    );

    // Small container to force overflow
    wrapper.initSize(60, 20);

    // Should render prefix
    expect(wrapper.findPrefix()).toHaveLength(1);
    expect(wrapper.findPrefix().text()).toBe('Label:');
    
    // Should show overflow indicator
    expect(wrapper.findRest()).toHaveLength(1);
    
    // Should render some but not all items
    expect(wrapper.findItems().length).toBeGreaterThan(0);
    expect(wrapper.findItems().length).toBeLessThan(10);
  });

  it('should work with fixed maxCount', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(10)}
        itemKey="key"
        renderItem={renderItem}
        maxCount={3}
        prefix="Categories:"
      />,
    );

    // Should render prefix
    expect(wrapper.findPrefix()).toHaveLength(1);
    expect(wrapper.findPrefix().text()).toBe('Categories:');
    
    // Should show exactly 3 items + rest
    expect(wrapper.findItems()).toHaveLength(3);
    expect(wrapper.findRest()).toHaveLength(1);
  });

  it('should work with both prefix and suffix', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(5)}
        itemKey="key"
        renderItem={renderItem}
        maxCount={3}
        prefix="Start"
        suffix="End"
      />,
    );

    // Should render both prefix and suffix
    expect(wrapper.findPrefix()).toHaveLength(1);
    expect(wrapper.findSuffix()).toHaveLength(1);
    expect(wrapper.findPrefix().text()).toBe('Start');
    expect(wrapper.findSuffix().text()).toBe('End');
    
    // Should show 3 items + rest
    expect(wrapper.findItems()).toHaveLength(3);
    expect(wrapper.findRest()).toHaveLength(1);
  });

  it('should render complex prefix content', () => {
    const ComplexPrefix = () => (
      <div className="complex-prefix">
        <span>🏷️</span>
        <span>Tags:</span>
      </div>
    );

    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(3)}
        itemKey="key"
        renderItem={renderItem}
        prefix={<ComplexPrefix />}
      />,
    );

    expect(wrapper.findPrefix()).toHaveLength(1);
    expect(wrapper.findPrefix().find('.complex-prefix')).toHaveLength(1);
    expect(wrapper.findPrefix().text()).toBe('🏷️Tags:');
  });
});