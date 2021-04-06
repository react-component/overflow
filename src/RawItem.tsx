import * as React from 'react';
import Item from './Item';
import { OverflowContext } from './Overflow';

export default function RawItem() {
  const context = React.useContext(OverflowContext);

  return <Item {...context} />;
}
