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

function renderItem(item: ItemType) {
  return (
    <div
      style={{
        margin: '0 16px 0 8px',
        padding: '4px 8px',
        background: 'rgba(255, 0, 0, 0.2)',
      }}
    >
      {item.label}
    </div>
  );
}

function renderRest(items: ItemType[]) {
  return (
    <div
      style={{
        margin: '0 16px 0 8px',
        padding: '4px 8px',
        background: 'rgba(255, 0, 0, 0.2)',
      }}
    >
      +{items.length}...
    </div>
  );
}

const Demo = () => {
  const [responsive, setResponsive] = React.useState(true);
  const [data, setData] = React.useState(createData(1));

  return (
    <div style={{ padding: 32 }}>
      <button
        type="button"
        onClick={() => {
          setResponsive(!responsive);
        }}
      >
        {responsive ? 'Responsive' : 'MaxCount: 6'}
      </button>
      <select
        style={{ width: 200, height: 32 }}
        value={data.length}
        onChange={({ target: { value } }) => {
          setData(createData(Number(value)));
        }}
      >
        <option value={0}>0</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={200}>200</option>
      </select>

      <button
        onClick={() => {
          setData(createData(data.length ? 0 : 1));
        }}
      >
        Trigger
      </button>

      <div
        style={{
          border: '5px solid green',
          padding: 8,
          maxWidth: 300,
          // width: 120,
          marginTop: 32,
        }}
      >
        <Overflow<ItemType>
          data={data}
          renderItem={renderItem}
          renderRest={renderRest}
          maxCount={responsive ? 'responsive' : 6}
          // suffix={<span>1</span>}
        />
      </div>
    </div>
  );
};

export default Demo;
