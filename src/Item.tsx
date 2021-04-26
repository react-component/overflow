import * as React from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import { ComponentType } from './Overflow';

export interface ItemProps<ItemType> extends React.HTMLAttributes<any> {
  prefixCls: string;
  item?: ItemType;
  className?: string;
  style?: React.CSSProperties;
  renderItem?: (item: ItemType) => React.ReactNode;
  responsive?: boolean;
  itemKey?: React.Key;
  registerSize: (key: React.Key, width: number | null) => void;
  children?: React.ReactNode;
  display: boolean;
  order: number;
  component?: ComponentType;
  invalidate?: boolean;
}

function InternalItem<ItemType>(
  props: ItemProps<ItemType>,
  ref: React.Ref<any>,
) {
  const {
    prefixCls,
    invalidate,
    item,
    renderItem,
    responsive,
    registerSize,
    itemKey,
    className,
    style,
    children,
    display,
    order,
    component: Component = 'div',
    ...restProps
  } = props;

  const mergedHidden = responsive && !display;

  // ================================ Effect ================================
  function internalRegisterSize(width: number | null) {
    registerSize(itemKey!, width);
  }

  React.useEffect(
    () => () => {
      internalRegisterSize(null);
    },
    [],
  );

  // ================================ Render ================================
  const childNode =
    renderItem && item !== undefined ? renderItem(item) : children;

  let overflowStyle: React.CSSProperties | undefined;
  if (!invalidate) {
    overflowStyle = {
      opacity: mergedHidden ? 0 : 1,
      height: mergedHidden ? 0 : undefined,
      overflowY: mergedHidden ? 'hidden' : undefined,
      order: responsive ? order : undefined,
      pointerEvents: mergedHidden ? 'none' : undefined,
    };
  }

  let itemNode = (
    <Component
      className={classNames(!invalidate && prefixCls, className)}
      style={{
        ...overflowStyle,
        ...style,
      }}
      {...restProps}
      ref={ref}
    >
      {childNode}
    </Component>
  );

  if (responsive) {
    itemNode = (
      <ResizeObserver
        onResize={({ offsetWidth }) => {
          internalRegisterSize(offsetWidth);
        }}
      >
        {itemNode}
      </ResizeObserver>
    );
  }

  return itemNode;
}

const Item = React.forwardRef(InternalItem);
Item.displayName = 'Item';

export default Item;
