import React from 'react';
import { render } from 'enzyme';
import Overflow from '../src';
import type { OverflowProps } from '../src';

interface ItemType {
  label: React.ReactNode;
  key: React.Key;
}

interface CaseConf {
  name: string;
  dataLength: number;
  maxCount: OverflowProps<ItemType>['maxCount'];
  suffix?: boolean;
}

function renderItem(item: ItemType) {
  return item.label;
}

describe('Overflow.SEO', () => {
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

  const testCases: CaseConf[] = [
    {
      name: 'responsive',
      dataLength: 2,
      maxCount: 'responsive',
    },
    {
      name: 'responsive with suffix',
      dataLength: 2,
      maxCount: 'responsive',
      suffix: true,
    },
    {
      name: 'maxCount number with suffix',
      dataLength: 6,
      maxCount: 4,
      suffix: true,
    },
    {
      name: 'invalidate number with suffix',
      dataLength: 4,
      maxCount: 'invalidate',
      suffix: true,
    },
  ];

  testCases.forEach(({ name, dataLength, maxCount: maxCountVal, suffix }) => {
    it(`${name}`, () => {
      const wrapper = render(
        <Overflow<ItemType>
          data={getData(dataLength)}
          renderItem={renderItem}
          maxCount={maxCountVal}
          suffix={suffix && <span> I am a suffix </span>}
        />,
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
