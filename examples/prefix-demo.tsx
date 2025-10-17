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
    label: `Item ${index + 1}`,
  }));

  return data;
}

function renderItem(item: ItemType) {
  return (
    <div
      style={{
        margin: '0 4px',
        padding: '6px 12px',
        background: '#f0f0f0',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
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
        margin: '0 4px',
        padding: '6px 12px',
        background: '#fff2e8',
        border: '1px solid #ffbb96',
        borderRadius: '4px',
        color: '#d46b08',
      }}
    >
      +{items.length} more
    </div>
  );
}

const PrefixDemo = () => {
  const [itemCount, setItemCount] = React.useState(8);
  const [prefixType, setPrefixType] = React.useState<'none' | 'text' | 'icon' | 'complex'>('text');
  const [suffixType, setSuffixType] = React.useState<'none' | 'text' | 'button'>('none');
  
  const data = React.useMemo(() => createData(itemCount), [itemCount]);

  const renderPrefix = () => {
    switch (prefixType) {
      case 'text':
        return (
          <div
            style={{
              padding: '6px 12px',
              background: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '4px',
              color: '#1890ff',
              fontWeight: 'bold',
            }}
          >
            标签:
          </div>
        );
      case 'icon':
        return (
          <div
            style={{
              padding: '6px 8px',
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: '4px',
              color: '#52c41a',
            }}
          >
            🏷️
          </div>
        );
      case 'complex':
        return (
          <div
            style={{
              padding: '4px 8px',
              background: 'linear-gradient(45deg, #f0f0f0, #e6f7ff)',
              border: '1px solid #91d5ff',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '12px' }}>📋</span>
            <span style={{ fontSize: '12px', color: '#1890ff' }}>分类:</span>
          </div>
        );
      default:
        return undefined;
    }
  };

  const renderSuffix = () => {
    switch (suffixType) {
      case 'text':
        return (
          <div
            style={{
              padding: '6px 12px',
              background: '#fff1f0',
              border: '1px solid #ffccc7',
              borderRadius: '4px',
              color: '#f5222d',
              fontSize: '12px',
            }}
          >
            (总计)
          </div>
        );
      case 'button':
        return (
          <button
            style={{
              padding: '4px 8px',
              background: '#f0f0f0',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onClick={() => alert('查看更多')}
          >
            更多 →
          </button>
        );
      default:
        return undefined;
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Prefix Demo</h2>
      
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Items Count:</label>
        <select
          value={itemCount}
          onChange={(e) => setItemCount(Number(e.target.value))}
          style={{ marginRight: 16, padding: '2px 4px' }}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={20}>20</option>
        </select>

        <label style={{ marginRight: 8 }}>Prefix:</label>
        <select
          value={prefixType}
          onChange={(e) => setPrefixType(e.target.value as any)}
          style={{ marginRight: 16, padding: '2px 4px' }}
        >
          <option value="none">None</option>
          <option value="text">Text</option>
          <option value="icon">Icon</option>
          <option value="complex">Complex</option>
        </select>

        <label style={{ marginRight: 8 }}>Suffix:</label>
        <select
          value={suffixType}
          onChange={(e) => setSuffixType(e.target.value as any)}
          style={{ padding: '2px 4px' }}
        >
          <option value="none">None</option>
          <option value="text">Text</option>
          <option value="button">Button</option>
        </select>
      </div>

      <div
        style={{
          border: '2px solid #1890ff',
          padding: 16,
          borderRadius: 8,
          background: '#fafafa',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', color: '#1890ff' }}>Responsive Mode:</h3>
        <div
          style={{
            border: '1px dashed #d9d9d9',
            padding: 12,
            maxWidth: 500,
            background: 'white',
            borderRadius: 4,
          }}
        >
          <Overflow<ItemType>
            data={data}
            renderItem={renderItem}
            renderRest={renderRest}
            maxCount="responsive"
            prefix={renderPrefix()}
            suffix={renderSuffix()}
          />
        </div>
      </div>

      <div
        style={{
          border: '2px solid #52c41a',
          padding: 16,
          borderRadius: 8,
          background: '#fafafa',
          marginTop: 24,
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', color: '#52c41a' }}>Fixed MaxCount (5):</h3>
        <div
          style={{
            border: '1px dashed #d9d9d9',
            padding: 12,
            background: 'white',
            borderRadius: 4,
          }}
        >
          <Overflow<ItemType>
            data={data}
            renderItem={renderItem}
            renderRest={renderRest}
            maxCount={5}
            prefix={renderPrefix()}
            suffix={renderSuffix()}
          />
        </div>
      </div>
    </div>
  );
};

export default PrefixDemo;