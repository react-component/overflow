import * as React from 'react';
import classNames from 'classnames';
import Item from './Item';

export type ComponentType =
  | React.ComponentType<any>
  | React.ForwardRefExoticComponent<any>
  | React.FC<any>
  | keyof React.ReactHTML;

export const OverflowContext = React.createContext<{
  prefixCls: string;
  responsive: boolean;
  order: number;
  registerSize: (key: React.Key, width: number | null) => void;
  display: boolean;

  invalidate: boolean;

  // Item Usage
  item?: any;
  itemKey?: React.Key;

  // Rest Usage
  className?: string;
}>(null);

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
        className={classNames(contextClassName, className)}
        {...restContext}
        {...restProps}
      />
    </OverflowContext.Provider>
  );
};

const RawItem = React.forwardRef(InternalRawItem);
RawItem.displayName = 'RawItem';

export default RawItem;
