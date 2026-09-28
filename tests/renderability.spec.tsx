import React from 'react';
import { render } from '@testing-library/react';
import Overflow from '../src';

it.each([0, () => 0])('renders zero rest content %s', renderRest => {
  const { container } = render(
    <Overflow data={['A', 'B']} maxCount={1} renderRest={renderRest} />,
  );
  expect(container.querySelector('.rc-overflow-item-rest').textContent).toBe(
    '0',
  );
});

it.each([false, null, undefined, ''])(
  'keeps the default rest for %s',
  renderRest => {
    const { container } = render(
      <Overflow data={['A', 'B']} maxCount={1} renderRest={renderRest} />,
    );
    expect(container.querySelector('.rc-overflow-item-rest').textContent).toBe(
      '+ 1 ...',
    );
  },
);
