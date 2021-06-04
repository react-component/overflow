import React from 'react';
import { act } from 'react-dom/test-utils';
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
      expect(wrapper.findItems().at(i).props().display).toBe(display);
    });
    expect(wrapper.findRest()).toHaveLength(1);
    expect(wrapper.findRest().text()).toEqual('+ 2 ...');
    expect(
      wrapper.findItems().find('div').last().prop('aria-hidden'),
    ).toBeTruthy();
  });

  it('only one', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(1)}
        itemKey="key"
        renderItem={renderItem}
        maxCount="responsive"
      />,
    );
    wrapper.initSize(100, 20);

    expect(wrapper.findItems()).toHaveLength(1);
    expect(wrapper.findRest().props().display).toBeFalsy();
  });

  it('just fit', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(1)}
        itemKey="key"
        renderItem={renderItem}
        maxCount="responsive"
      />,
    );
    wrapper.initSize(20, 20);

    expect(wrapper.findItems()).toHaveLength(1);
    expect(wrapper.findRest().props().display).toBeFalsy();
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

    // Remove one (Just fit the container width)
    const newData = [...data];
    newData.splice(1, 1);
    wrapper.setProps({ data: newData });
    wrapper.update();

    expect(wrapper.findItems()).toHaveLength(5);
    expect(wrapper.findRest().props().display).toBeFalsy();

    // Remove one (More place for container)
    const restData = [...newData];
    restData.splice(1, 2);
    restData.push({
      label: 'Additional',
      key: 'additional',
    });
    wrapper.setProps({ data: restData });
    wrapper.update();

    expect(wrapper.findItems()).toHaveLength(4);
    expect(wrapper.findRest().props().display).toBeFalsy();
  });

  it('none to overflow', () => {
    const data = getData(5);

    const wrapper = mount(
      <Overflow<ItemType>
        data={data}
        itemKey="key"
        renderItem={renderItem}
        maxCount="responsive"
      />,
    );

    wrapper.initSize(100, 20);
    expect(wrapper.findItems()).toHaveLength(5);
    expect(wrapper.findRest().props().display).toBeFalsy();

    // Add one
    const newData: ItemType[] = [
      {
        label: 'Additional',
        key: 'additional',
      },
      ...data,
    ];
    wrapper.setProps({ data: newData });
    wrapper.update();

    // Currently resize observer not trigger, rest node is not ready
    expect(wrapper.findItems()).toHaveLength(6);
    expect(wrapper.findRest().props().display).toBeFalsy();

    // Trigger resize, node ready
    wrapper.triggerItemResize(0, 20);
    expect(wrapper.findItems()).toHaveLength(6);
    expect(wrapper.findRest().props().display).toBeTruthy();
  });

  it('unmount no error', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(1)}
        itemKey="key"
        renderItem={renderItem}
        maxCount="responsive"
      />,
    );

    wrapper.initSize(100, 20);

    wrapper.unmount();

    act(() => {
      jest.runAllTimers();
    });
  });

  describe('suffix', () => {
    it('ping the position', () => {
      const wrapper = mount(
        <Overflow<ItemType>
          data={getData(10)}
          itemKey="key"
          renderItem={renderItem}
          maxCount="responsive"
          suffix="Bamboo"
        />,
      );

      wrapper.initSize(100, 20);

      expect(wrapper.findSuffix().props().style).toEqual(
        expect.objectContaining({ position: 'absolute', top: 0, left: 80 }),
      );
    });

    it('too long to pin', () => {
      const wrapper = mount(
        <Overflow<ItemType>
          data={getData(1)}
          itemKey="key"
          renderItem={renderItem}
          maxCount="responsive"
          suffix="Bamboo"
        />,
      );

      wrapper.initSize(100, 20);
      wrapper.triggerItemResize(0, 90);

      expect(wrapper.findSuffix().props().style.position).toBeFalsy();
    });

    it('long to short should keep correct position', () => {
      const wrapper = mount(
        <Overflow<ItemType>
          data={getData(3)}
          itemKey="key"
          renderItem={renderItem}
          maxCount="responsive"
          suffix="Bamboo"
        />,
      );

      wrapper.initSize(20, 20);
      wrapper.setProps({ data: [] });

      expect(wrapper.findRest()).toHaveLength(0);
      expect(wrapper.findSuffix().props().style.position).toBeFalsy();
    });
  });

  it('render rest directly', () => {
    const wrapper = mount(
      <Overflow<ItemType>
        data={getData(10)}
        itemKey="key"
        renderItem={renderItem}
        maxCount="responsive"
        renderRawRest={omitItems => {
          return (
            <Overflow.Item component="span" className="custom-rest">
              {omitItems.length}
            </Overflow.Item>
          );
        }}
      />,
    );

    wrapper.initSize(100, 20);

    expect(wrapper.find('span.custom-rest').text()).toEqual('6');
  });
});
