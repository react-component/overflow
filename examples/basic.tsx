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
    label: `Label${index}`,
  }));

  return data;
}

const Demo = () => {
  const [data, setData] = React.useState(createData(5));

  return (
    <div style={{ padding: 32 }}>
      <select
        style={{ width: 200, height: 32 }}
        value={data.length}
        onChange={({ target: { value } }) => {
          setData(createData(Number(value)));
        }}
      >
        <option value={0}>0</option>
        <option value={1}>1</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>

      <div
        style={{
          border: '5px solid green',
          padding: 8,
          maxWidth: 300,
          marginTop: 32,
        }}
      >
        <Overflow<ItemType> data={data} renderItem={(item) => item.label} />
      </div>
    </div>
  );
};

export default Demo;
