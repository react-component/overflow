import * as React from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import Item from './Item';
import { useBatchState } from './hooks/useBatchState';

export interface OverflowProps<ItemType> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  data?: ItemType[];
  itemKey?: React.Key | ((item: ItemType) => React.Key);
  renderItem?: (item: ItemType) => React.ReactNode;
  disabled?: boolean;
  maxCount?: number | 'responsive';
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
    disabled,
    maxCount = 'responsive',
  } = props;

  const createUseState = useBatchState();

  const [containerWidth, setContainerWidth] = createUseState(0);
  const [itemWidths, setItemWidths] = createUseState(
    new Map<React.Key, number>(),
  );
  const [overflowWidth, setOverflowWidth] = createUseState(0);

  const [displayCount, setDisplayCount] = React.useState(0);

  const itemPrefixCls = `${prefixCls}-item`;

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

  // ================================= Size =================================
  function onOverflowResize(_: object, element: HTMLElement) {
    setContainerWidth(element.clientWidth);
  }

  function registerSize(key: React.Key, width: number) {
    setItemWidths((origin) => {
      const clone = new Map(origin);

      if (!width) {
        clone.delete(key);
      } else {
        clone.set(key, width);
      }
      return clone;
    });
  }

  function registerOverflowSize(_: React.Key, width: number) {
    setOverflowWidth(width);
  }

  // ================================ Effect ================================
  React.useLayoutEffect(() => {
    if (containerWidth && overflowWidth && data) {
      let totalWidth = 0;

      const len = data.length;

      for (let i = 0; i < len; i += 1) {
        const itemWidth = itemWidths.get(getKey(data[i], i)) || 0;
        totalWidth += itemWidth;

        if (totalWidth + overflowWidth > containerWidth) {
          setDisplayCount(i - 1);
          break;
        } else if (i === len - 1) {
          setDisplayCount(len - 1);
          break;
        }
      }
    }
  }, [containerWidth, itemWidths, overflowWidth, getKey, data]);

  // ================================ Render ================================
  let overflowNode = (
    <div className={classNames(prefixCls, className)} style={style} ref={ref}>
      {data.map((item, index) => {
        const key = getKey(item, index);

        return (
          <Item<ItemType>
            order={index}
            key={key}
            item={item}
            prefixCls={itemPrefixCls}
            renderItem={mergedRenderItem}
            itemKey={key}
            registerSize={registerSize}
            disabled={disabled}
            display={index <= displayCount}
          />
        );
      })}

      {/* Rest Count Item */}
      <Item
        order={displayCount}
        prefixCls={itemPrefixCls}
        className={`${itemPrefixCls}-rest`}
        disabled={disabled}
        registerSize={registerOverflowSize}
      >
        Overflow
      </Item>
    </div>
  );

  if (!disabled) {
    overflowNode = (
      <ResizeObserver onResize={onOverflowResize}>
        {overflowNode}
      </ResizeObserver>
    );
  }

  return overflowNode;
}

const ForwardOverflow = React.forwardRef(Overflow);

ForwardOverflow.displayName = 'Overflow';

// Convert to generic type
export default ForwardOverflow as <ItemType = any>(
  props: React.PropsWithChildren<OverflowProps<ItemType>> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement;
