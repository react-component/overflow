<div align="center">
  <h1>@rc-component/overflow</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Ant Design 生态的一部分。</sub></p>
  <p>📦 用于自动折叠可见项与溢出项的 React 布局基础组件。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/overflow"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/overflow.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/overflow"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/overflow.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/overflow/actions/workflows/test.yml"><img alt="build status" src="https://github.com/react-component/overflow/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/overflow"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/overflow/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/overflow"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/overflow?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>

## 亮点

| 方向 | 支持                                              |
| ---- | ------------------------------------------------- |
| 定位 | 用于自动折叠可见项与溢出项的 React 布局基础组件。 |
| 包名 | `@rc-component/overflow`                          |
| 发布 | `@rc-component/np` / `rc-np`                      |

## 安装

```bash
npm install @rc-component/overflow
```

## 用法

```tsx | pure
import Overflow from '@rc-component/overflow';

export default () => (
  <Overflow
    data={[1, 2, 3]}
    renderItem={item => <span>{item}</span>}
    renderRest={items => <span>+{items.length}</span>}
  />
);
```

## API

| 名称         | 说明                    |
| ------------ | ----------------------- |
| `data`       | Overflow 渲染的数据项。 |
| `renderItem` | 渲染可见项。            |
| `renderRest` | 渲染折叠后的溢出项。    |

## 本地开发

```bash
ut install
npm start
npm test
npm run lint
npm run tsc
npm run compile
```

本地 dumi 站点默认运行在 `http://localhost:8000`.

## 发布

```bash
npm run prepublishOnly
```

发布流程通过 `@rc-component/np` 提供的 `rc-np` 命令处理。

## 许可证

@rc-component/overflow 基于 [MIT](./LICENSE.md) 协议发布。
