import * as React from 'react';
import classNames from 'classnames';
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

  const { className: contextClassName, ...restContext } = context;
  const { className, ...restProps } = props;

  // Do not pass context to sub item to avoid multiple measure
  return (
    <OverflowContext.Provider value={null}>
      <Item
        className={classNames(contextClassName, className)}
        {...restContext}
        {...restProps}
      />
    </OverflowContext.Provider>
  );
}
