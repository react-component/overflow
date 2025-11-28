import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import Overflow from '../src';

interface ItemType {
  label: React.ReactNode;
  key: React.Key;
}

function renderItem(item: ItemType) {
  return item.label;
}

describe('Overflow.Basic', () => {
  let originalResizeObserver: typeof window.ResizeObserver;
  let observeSpy: jest.Mock;

  beforeEach(() => {
    // 1. 保存原始实现
    originalResizeObserver = window.ResizeObserver;

    // 2. 设置 mock
    observeSpy = jest.fn();
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: observeSpy,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    // 3. 恢复原始实现
    window.ResizeObserver = originalResizeObserver;
    cleanup();
  });

  function getData(count: number) {
    return new Array(count).fill(undefined).map((_, index) => ({
      label: `Label ${index}`,
      key: `k-${index}`,
    }));
  }

  it('no data', () => {
    const { container } = render(<Overflow<ItemType> />);
    expect(container.querySelectorAll('.rc-overflow-item')).toHaveLength(0);
  });

  it('no maxCount', () => {
    const { container } = render(
      <Overflow<ItemType> data={getData(6)} renderItem={renderItem} />,
    );
    expect(observeSpy).not.toHaveBeenCalled();
    expect(container.querySelectorAll('.rc-overflow-item')).toHaveLength(6);
    expect(screen.queryByText(/\+ \d+ \.\.\./)).not.toBeInTheDocument();
    expect(screen.queryByTestId('overflow-rest')).not.toBeInTheDocument();
  });

  it('number maxCount', () => {
    const { container } = render(
      <Overflow<ItemType>
        data={getData(6)}
        renderItem={renderItem}
        maxCount={4}
      />,
    );
    expect(observeSpy).not.toHaveBeenCalled();
    expect(container.querySelectorAll('.rc-overflow-item')).toHaveLength(5);

    const restIndicators = screen.getAllByText(/\+ \d+ \.\.\./);
    expect(restIndicators).toHaveLength(1);
  });

  it('without renderItem', () => {
    const { container } = render(
      <Overflow data={[<span>Bamboo Is Light</span>]} />,
    );
    expect(container.querySelector('.rc-overflow-item').textContent).toEqual(
      'Bamboo Is Light',
    );
  });

  it('renderItem params have "order"', () => {
    const testData = getData(3);
    const { container } = render(
      <Overflow
        data={testData}
        renderItem={(item, info) => {
          return `${item.label}-${info.index}-test`;
        }}
      />,
    );
    const renderedItems = container.querySelectorAll('.rc-overflow-item');
    expect(renderedItems).toHaveLength(testData.length);
    renderedItems.forEach((node, index) => {
      expect(node.textContent).toBe(`${testData[index].label}-${index}-test`);
    });
  });
  describe('renderRest', () => {
    it('function', () => {
      render(
        <Overflow
          data={getData(6)}
          renderItem={renderItem}
          renderRest={omittedItems => (
            <div data-testid="overflow-rest">Bamboo:{omittedItems.length}</div>
          )}
          maxCount={3}
        />,
      );
      expect(screen.getByTestId('overflow-rest')).toHaveTextContent('Bamboo:3');
    });

    it('node', () => {
      render(
        <Overflow
          data={getData(6)}
          renderItem={renderItem}
          renderRest={<span data-testid="overflow-rest">Light Is Bamboo</span>}
          maxCount={3}
        />,
      );
      expect(screen.getByTestId('overflow-rest')).toHaveTextContent(
        'Light Is Bamboo',
      );
    });
  });

  // describe('itemKey', () => {
  //   it('string', () => {
  //     const { container } = render(
  //       <Overflow data={getData(1)} renderItem={renderItem} itemKey="key" />,
  //     );
  //     expect(container.querySelector('.rc-overflow-item')).toHaveAttribute(
  //       'key',
  //       'k-0',
  //     );
  //   });
  //   it('function', () => {
  //     const { container } = render(
  //       <Overflow
  //         data={getData(1)}
  //         renderItem={renderItem}
  //         itemKey={item => `bamboo-${item.key}`}
  //       />,
  //     );

  //     expect(container.querySelector('.rc-overflow-item')).toHaveAttribute(
  //       'key',
  //       'bamboo-k-0',
  //     );
  //   });
  // });

  it('customize component', () => {
    const { container } = render(
      <Overflow
        data={getData(1)}
        renderItem={renderItem}
        itemKey={item => `bamboo-${item.key}`}
        component="ul"
        itemComponent="li"
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
