import * as React from 'react';
import { clsx } from 'clsx';
import Item from './Item';
import { OverflowContext } from './context';

export type ComponentType =
  | React.ComponentType<any>
  | React.ForwardRefExoticComponent<any>
  | React.FC<any>
  | keyof React.ReactHTML;

export interface RawItemProps extends React.HTMLAttributes<any> {
  component?: ComponentType;
  children?: React.ReactNode;
}

const InternalRawItem = (props: RawItemProps, ref: React.Ref<any>) => {
  const context = React.useContext(OverflowContext);

  // Render directly when context not provided
  if (!context) {
    const { component: Component = 'div', ...restProps } = props;
    return <Component {...restProps} ref={ref} />;
  }

  const { className: contextClassName, ...restContext } = context;
  const { className, ...restProps } = props;

  // Do not pass context to sub item to avoid multiple measure
  return (
    <OverflowContext.Provider value={null}>
      <Item
        ref={ref}
        className={clsx(contextClassName, className)}
        {...restContext}
        {...restProps}
      />
    </OverflowContext.Provider>
  );
};

const RawItem = React.forwardRef(InternalRawItem);

if (process.env.NODE_ENV !== 'production') {
  RawItem.displayName = 'RawItem';
}

export default RawItem;
