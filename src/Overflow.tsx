import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import Item from './Item';
import { useBatchFrameState } from './hooks/useBatchFrameState';

const RESPONSIVE = 'responsive' as const;

export interface OverflowProps<ItemType> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  data?: ItemType[];
  itemKey?: React.Key | ((item: ItemType) => React.Key);
  /** Used for `responsive`. It will limit render node to avoid perf issue */
  itemWidth?: number;
  renderItem?: (item: ItemType) => React.ReactNode;
  maxCount?: number | typeof RESPONSIVE;
  renderRest?:
    | React.ReactNode
    | ((omittedItems: ItemType[]) => React.ReactNode);
  suffix?: React.ReactNode;
}

function defaultRenderRest<ItemType>(omittedItems: ItemType[]) {
  return `+ ${omittedItems.length} ...`;
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
    itemWidth = 10,
    style,
    className,
    maxCount,
    renderRest = defaultRenderRest,
    suffix,
  } = props;

  const createUseState = useBatchFrameState();

  const [containerWidth, setContainerWidth] = createUseState(0);
  const [itemWidths, setItemWidths] = createUseState(
    new Map<React.Key, number>(),
  );

  const [prevRestWidth, setPrevRestWidth] = createUseState(0);
  const [restWidth, setRestWidth] = createUseState(0);

  const [suffixWidth, setSuffixWidth] = createUseState(0);
  const [suffixFixedStart, setSuffixFixedStart] = useState<number>(null);

  const [displayCount, setDisplayCount] = useState(0);
  const [restReady, setRestReady] = useState(false);

  const itemPrefixCls = `${prefixCls}-item`;

  // Always use the max width to avoid blink
  const mergedRestWidth = Math.max(prevRestWidth, restWidth);

  // ================================= Data =================================
  const isResponsive = maxCount === RESPONSIVE;

  /**
   * When is `responsive`, we will always render rest node to get the real width of it for calculation
   */
  const showRest =
    isResponsive || (typeof maxCount === 'number' && data.length > maxCount);

  const mergedData = useMemo(() => {
    let items = data;

    if (isResponsive) {
      items = data.slice(0, Math.min(data.length, containerWidth / itemWidth));
    } else if (typeof maxCount === 'number') {
      items = data.slice(0, maxCount);
    }

    return items;
  }, [data, itemWidth, containerWidth, maxCount, isResponsive]);

  const omittedItems = useMemo(() => {
    if (isResponsive) {
      return data.slice(displayCount + 1);
    }
    return data.slice(mergedData.length);
  }, [data, mergedData, isResponsive, displayCount]);

  // ================================= Item =================================
  const getKey = useCallback(
    (item: ItemType, index: number) => {
      if (typeof itemKey === 'function') {
        return itemKey(item);
      }
      return (itemKey && (item as any)?.[itemKey]) ?? index;
    },
    [itemKey],
  );

  const mergedRenderItem = useCallback(
    renderItem || ((item: ItemType) => item),
    [renderItem],
  );

  function updateDisplayCount(count: number, notReady?: boolean) {
    setDisplayCount(count);
    if (!notReady) {
      setRestReady(count < data.length - 1);
    }
  }

  // ================================= Size =================================
  function onOverflowResize(_: object, element: HTMLElement) {
    setContainerWidth(element.clientWidth);
  }

  function registerSize(key: React.Key, width: number | null) {
    setItemWidths((origin) => {
      const clone = new Map(origin);

      if (width === null) {
        clone.delete(key);
      } else {
        clone.set(key, width);
      }
      return clone;
    });
  }

  function registerOverflowSize(_: React.Key, width: number | null) {
    setRestWidth(width!);
    setPrevRestWidth(restWidth);
  }

  function registerSuffixSize(_: React.Key, width: number | null) {
    setSuffixWidth(width!);
  }

  // ================================ Effect ================================
  function getItemWidth(index: number) {
    return itemWidths.get(getKey(mergedData[index], index));
  }

  React.useLayoutEffect(() => {
    if (containerWidth && mergedRestWidth && mergedData) {
      let totalWidth = suffixWidth;

      const len = mergedData.length;
      const lastIndex = len - 1;

      // When data count change to 0, reset this since not loop will reach
      if (!len) {
        updateDisplayCount(0);
        setSuffixFixedStart(null);
        return;
      }

      for (let i = 0; i < len; i += 1) {
        const currentItemWidth = getItemWidth(i);

        // Break since data not ready
        if (currentItemWidth === undefined) {
          updateDisplayCount(i - 1, true);
          break;
        }

        // Find best match
        totalWidth += currentItemWidth;

        if (
          i === lastIndex - 1 &&
          totalWidth + getItemWidth(lastIndex)! <= containerWidth
        ) {
          // Additional check if match the end
          updateDisplayCount(lastIndex);
          setSuffixFixedStart(null);
          break;
        } else if (totalWidth + mergedRestWidth > containerWidth) {
          // Can not hold all the content to show rest
          updateDisplayCount(i - 1);
          setSuffixFixedStart(
            totalWidth - currentItemWidth - suffixWidth + restWidth,
          );
          break;
        } else if (i === lastIndex) {
          // Reach the end
          updateDisplayCount(lastIndex);
          setSuffixFixedStart(totalWidth - suffixWidth);
          break;
        }
      }

      if (suffix && getItemWidth(0) + suffixWidth > containerWidth) {
        setSuffixFixedStart(null);
      }
    }
  }, [containerWidth, itemWidths, restWidth, suffixWidth, getKey, mergedData]);

  // ================================ Render ================================
  const displayRest = restReady && !!omittedItems.length;

  let suffixStyle: React.CSSProperties = {};
  if (suffixFixedStart !== null && isResponsive) {
    suffixStyle = {
      position: 'absolute',
      left: suffixFixedStart,
      top: 0,
    };
  }

  let overflowNode = (
    <div className={classNames(prefixCls, className)} style={style} ref={ref}>
      {mergedData.map((item, index) => {
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
            responsive={isResponsive}
            display={index <= displayCount}
          />
        );
      })}

      {/* Rest Count Item */}
      {showRest ? (
        <Item
          // When not show, order should be the last
          order={displayRest ? displayCount : Number.MAX_SAFE_INTEGER}
          prefixCls={itemPrefixCls}
          className={`${itemPrefixCls}-rest`}
          responsive={isResponsive}
          registerSize={registerOverflowSize}
          display={displayRest}
        >
          {typeof renderRest === 'function'
            ? renderRest(omittedItems)
            : renderRest}
        </Item>
      ) : null}

      {/* Suffix Node */}
      {suffix && (
        <Item
          order={displayCount}
          prefixCls={itemPrefixCls}
          className={`${itemPrefixCls}-suffix`}
          responsive={isResponsive}
          registerSize={registerSuffixSize}
          display
          style={suffixStyle}
        >
          {suffix}
        </Item>
      )}
    </div>
  );

  if (isResponsive) {
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
