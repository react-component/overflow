import * as React from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import { getFullWidth } from './util';

export interface ItemProps<ItemType> {
  prefixCls: string;
  item?: ItemType;
  className?: string;
  renderItem?: (item: ItemType) => React.ReactNode;
  disabled?: boolean;
  itemKey?: React.Key;
  registerSize: (key: React.Key, width: number) => void;
  children?: React.ReactNode;
  display?: boolean;
}

export default function Item<ItemType>(props: ItemProps<ItemType>) {
  const {
    prefixCls,
    item,
    renderItem,
    disabled,
    registerSize,
    itemKey,
    className,
    children,
    display = true,
  } = props;

  // ================================ Effect ================================
  function internalRegisterSize(width: number) {
    registerSize(itemKey!, width);
  }

  React.useEffect(
    () => () => {
      internalRegisterSize(0);
    },
    [],
  );

  // ================================ Render ================================
  const childNode = item !== undefined ? renderItem!(item) : children;

  let itemNode = (
    <div
      className={classNames(prefixCls, className)}
      style={{ opacity: display ? 1 : 0.2 }}
    >
      {childNode}
    </div>
  );

  if (!disabled) {
    itemNode = (
      <ResizeObserver
        onResize={(_, element) => {
          const width = getFullWidth(element);
          internalRegisterSize(width);
        }}
      >
        {itemNode}
      </ResizeObserver>
    );
  }

  return itemNode;
}
