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

  it('HOC usage', () => {
    interface SharedProps {
      visible?: boolean;
      children?: React.ReactNode;
    }

    const ComponentWrapper = (props: SharedProps) => (
      <Overflow.Item {...props} />
    );

    const UserHOC = ({ visible, ...props }: SharedProps) =>
      visible ? <ComponentWrapper {...props} /> : null;

    const wrapper = mount(
      <Overflow
        data={[
          <UserHOC key="light">Light</UserHOC>,
          <UserHOC key="bamboo" visible>
            Bamboo
          </UserHOC>,
        ]}
        renderRawItem={node => node}
        itemKey={node => node.key}
      />,
    );

    expect(wrapper.render()).toMatchSnapshot();
  });
});
