import React from 'react';
import useLayoutEffect from "@rc-component/util/lib/hooks/useLayoutEffect";
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

const inputStyle: React.CSSProperties = {
  border: 'none',
  fontSize: 12,
  margin: 0,
  outline: 'none',
  lineHeight: '20px',
  fontFamily: '-apple-system',
  padding: '0 4px',
};

const Demo = () => {
  const [responsive, setResponsive] = React.useState(true);
  const [inputValue, setInputValue] = React.useState('');
  const [inputWidth, setInputWidth] = React.useState(0);
  const [data, setData] = React.useState(createData(3));
  const inputRef = React.useRef<HTMLInputElement>();
  const measureRef = React.useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    setInputWidth(measureRef.current.offsetWidth);
  }, [inputValue]);

  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

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

      <div
        style={{
          border: '5px solid green',
          padding: 8,
          maxWidth: 300,
          marginTop: 32,
        }}
      >
        <Overflow<ItemType>
          data={data}
          renderItem={renderItem}
          renderRest={renderRest}
          maxCount={responsive ? 'responsive' : 6}
          suffix={
            <div style={{ position: 'relative', maxWidth: '100%' }}>
              <input
                style={{
                  ...inputStyle,
                  background: 'rgba(0, 0, 0, 0.1)',
                  width: inputWidth,
                  minWidth: 10,
                  maxWidth: '100%',
                }}
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value);
                }}
                ref={inputRef}
              />
              <div
                style={{
                  ...inputStyle,
                  pointerEvents: 'none',
                  position: 'absolute',
                  left: 0,
                  top: `200%`,
                }}
                ref={measureRef}
              >
                {inputValue}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Demo;
