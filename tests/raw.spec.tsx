import { render } from '@testing-library/react';
import React from 'react';
import Overflow from '../src';

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
    const elements = new Set<HTMLElement>();

    const { container } = render(
      <Overflow<ItemType>
        data={getData(1)}
        renderRawItem={item => {
          return (
            <Overflow.Item
              component="li"
              ref={ele => {
                elements.add(ele);
              }}
            >
              {item.label}
            </Overflow.Item>
          );
        }}
        itemKey={item => `bamboo-${item.key}`}
        component="ul"
      />,
    );

    const elementList = [...elements];
    expect(elementList).toHaveLength(1);
    expect(elementList[0] instanceof HTMLLIElement).toBeTruthy();

    expect(container).toMatchSnapshot();
  });

  it('safe with item directly', () => {
    const { container } = render(<Overflow.Item>Bamboo</Overflow.Item>);

    expect(container).toMatchSnapshot();

    expect(container.querySelector('.rc-overflow-item')).toBeFalsy();
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

    const { container } = render(
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

    expect(container).toMatchSnapshot();
  });
});
