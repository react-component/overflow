import './setup';
import React from 'react';
import { act, render } from '@testing-library/react';
import { _rs as onResize } from '@rc-component/resize-observer';

function setElementSize(
  element: HTMLElement,
  size: Partial<Pick<HTMLElement, 'clientWidth' | 'offsetWidth'>>,
) {
  Object.entries(size).forEach(([key, value]) => {
    Object.defineProperty(element, key, {
      configurable: true,
      value,
    });
  });
}

async function flushResize() {
  await act(async () => {
    await Promise.resolve();
  });

  act(() => {
    jest.runAllTimers();
  });

  await act(async () => {
    await Promise.resolve();
  });
}

function normalizeStyle(style: CSSStyleDeclaration) {
  const styleObj: Record<string, string | number> = {};

  Array.from(style).forEach(key => {
    const value = style.getPropertyValue(key);
    const camelKey = key.replace(/-([a-z])/g, (_, char: string) =>
      char.toUpperCase(),
    );

    styleObj[camelKey] = value.endsWith('px')
      ? Number.parseFloat(value)
      : value;
  });

  return styleObj;
}

class NodeCollection {
  private nodes: HTMLElement[];

  constructor(nodes: HTMLElement[]) {
    this.nodes = nodes;
  }

  get length() {
    return this.nodes.length;
  }

  at(index: number) {
    return new NodeCollection([this.nodes[index]].filter(Boolean));
  }

  last() {
    return this.at(this.nodes.length - 1);
  }

  find(selector: string) {
    const matchNodes = this.nodes.flatMap(node => {
      const nodes: HTMLElement[] = [];

      if (node.matches(selector)) {
        nodes.push(node);
      }

      nodes.push(...Array.from(node.querySelectorAll<HTMLElement>(selector)));
      return nodes;
    });

    return new NodeCollection(matchNodes);
  }

  text() {
    return this.nodes.map(node => node.textContent).join('');
  }

  props() {
    const element = this.nodes[0];

    if (!element) {
      return {};
    }

    const hidden = element.getAttribute('aria-hidden') === 'true';

    return {
      display: !hidden && element.style.opacity !== '0',
      style: normalizeStyle(element.style),
    };
  }

  prop(name: string) {
    const element = this.nodes[0];

    if (!element) {
      return undefined;
    }

    if (name === 'aria-hidden') {
      return element.getAttribute(name) === 'true' || undefined;
    }

    return element.getAttribute(name);
  }

  [Symbol.iterator]() {
    return this.nodes[Symbol.iterator]();
  }

  forEach(callback: (node: NodeCollection, index: number) => void) {
    this.nodes.forEach((_, index) => {
      callback(this.at(index), index);
    });
  }
}

export function mount(element: React.ReactElement) {
  let mergedElement = element;
  const result = render(mergedElement);

  const getOverflow = () =>
    result.container.querySelector<HTMLElement>('.rc-overflow');

  const queryItems = () =>
    Array.from(
      result.container.querySelectorAll<HTMLElement>(
        '.rc-overflow-item:not(.rc-overflow-item-rest):not(.rc-overflow-item-prefix):not(.rc-overflow-item-suffix)',
      ),
    );

  const queryOverflowItems = () =>
    Array.from(
      result.container.querySelectorAll<HTMLElement>('.rc-overflow-item'),
    );

  const triggerElementResize = async (
    target: HTMLElement,
    offsetWidth: number,
  ) => {
    setElementSize(target, { offsetWidth });
    act(() => {
      onResize([{ target } as any]);
    });
    await flushResize();
  };

  const wrapper = {
    ...result,
    find(selector: string) {
      if (selector === 'ResizeObserver') {
        return new NodeCollection([]);
      }

      if (selector === 'Item') {
        return new NodeCollection(queryItems());
      }

      return new NodeCollection(
        Array.from(result.container.querySelectorAll<HTMLElement>(selector)),
      );
    },
    findItems() {
      return new NodeCollection(queryItems());
    },
    findRest() {
      return new NodeCollection(
        Array.from(
          result.container.querySelectorAll<HTMLElement>(
            '.rc-overflow-item-rest',
          ),
        ),
      );
    },
    findPrefix() {
      return new NodeCollection(
        Array.from(
          result.container.querySelectorAll<HTMLElement>(
            '.rc-overflow-item-prefix',
          ),
        ),
      );
    },
    findSuffix() {
      return new NodeCollection(
        Array.from(
          result.container.querySelectorAll<HTMLElement>(
            '.rc-overflow-item-suffix',
          ),
        ),
      );
    },
    async triggerResize(clientWidth: number) {
      const target = getOverflow();

      if (target) {
        setElementSize(target, { clientWidth });
        act(() => {
          onResize([{ target } as any]);
        });
        await flushResize();
      }

      return wrapper;
    },
    async triggerItemResize(index: number, offsetWidth: number) {
      const target = queryItems()[index];

      if (target) {
        await triggerElementResize(target, offsetWidth);
      }

      return wrapper;
    },
    async initSize(width: number, itemWidth: number) {
      await wrapper.triggerResize(width);

      const overflowItems = queryOverflowItems();
      for (let index = 0; index < overflowItems.length; index += 1) {
        await triggerElementResize(overflowItems[index], itemWidth);
      }

      return wrapper;
    },
    setProps(props: Record<string, any>) {
      mergedElement = React.cloneElement(mergedElement, props);
      result.rerender(mergedElement);
      return wrapper;
    },
    update() {
      return wrapper;
    },
    render() {
      return result.container.firstChild;
    },
  };

  return wrapper;
}
