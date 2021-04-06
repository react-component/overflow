import * as React from 'react';
import Item from './Item';
import { ComponentType, OverflowContext } from './Overflow';

export interface RawItemProps extends React.HTMLAttributes<any> {
  component?: ComponentType;
  children?: React.ReactNode;
}

export default function RawItem(props: RawItemProps) {
  const context = React.useContext(OverflowContext);

  // Render directly when context not provided
  if (!context) {
    const { component: Component = 'div', ...restProps } = props;
    return <Component {...restProps} />;
  }

  return <Item {...context} {...props} />;
}
