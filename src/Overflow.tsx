import * as React from 'react';
import classNames from 'classnames';

export interface OverflowProps<ItemType> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  data?: ItemType[];
  itemKey?: React.Key | ((item: ItemType) => React.Key);
  renderItem?: (item: ItemType) => React.ReactNode;
}

function Overflow<ItemType = any>(
  props: OverflowProps<ItemType>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    prefixCls = 'rc-overflow',
    data = [],
    renderItem,
    itemKey,
    style,
    className,
  } = props;

  // ================================= Item =================================
  const getKey = React.useCallback(
    (item: ItemType, index: number) => {
      if (typeof itemKey === 'function') {
        return itemKey(item);
      }
      return (itemKey && (item as any)?.[itemKey]) ?? index;
    },
    [itemKey],
  );

  const mergedRenderItem = React.useCallback(
    renderItem || ((item: ItemType) => item),
    [renderItem],
  );

  // ================================ Render ================================
  return (
    <div className={classNames(prefixCls, className)} style={style} ref={ref}>
      {data.map((item, index) => {
        const key = getKey(item, index);

        return (
          <div className={`${prefixCls}-item`} key={key}>
            {mergedRenderItem(item)}
          </div>
        );
      })}
    </div>
  );
}

const ForwardOverflow = React.forwardRef(Overflow);

ForwardOverflow.displayName = 'Overflow';

// Convert to generic type
export default ForwardOverflow as <ItemType = any>(
  props: React.PropsWithChildren<OverflowProps<ItemType>> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement;
