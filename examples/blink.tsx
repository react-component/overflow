import React from 'react';
import Overflow from '../src';
import '../assets/index.less';
import './common.less';

interface ItemType {
  value: string | number;
  label: string;
}

function createData(count: number): ItemType[] {
  const data: ItemType[] = new Array(count).fill(undefined).map((_, index) => ({
    value: index,
    label: `Label ${index}`,
  }));

  return data;
}

const sharedStyle: React.CSSProperties = {
  padding: '4px 8px',
  width: 90,
  overflow: 'hidden',
  background: 'rgba(255, 0, 0, 0.2)',
};

function renderItem(item: ItemType) {
  return <div style={sharedStyle}>{item.label}</div>;
}

function renderRest(items: ItemType[]) {
  if (items.length === 3) {
    return items.length;
  }

  return <div style={sharedStyle}>+{items.length}...</div>;
}

const data = createData(5);

const Demo = () => {
  return (
    <div style={{ padding: 32 }}>
      <div
        style={{
          boxShadow: '0 0 1px green',
          maxWidth: 300,
          marginTop: 32,
        }}
      >
        <Overflow<ItemType>
          data={data}
          renderItem={renderItem}
          renderRest={renderRest}
          maxCount="responsive"
        />
      </div>
    </div>
  );
};

export default Demo;
