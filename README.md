<div align="center">
  <h1>@rc-component/overflow</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Part of the Ant Design ecosystem.</sub></p>
  <p>📦 Auto-collapse React layout primitive for rendering visible items and overflow indicators.</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/overflow"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/overflow.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/overflow"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/overflow.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/overflow/actions/workflows/test.yml"><img alt="build status" src="https://github.com/react-component/overflow/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/overflow"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/overflow/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/overflow"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/overflow?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center">English | <a href="./README.zh-CN.md">简体中文</a></p>

## Highlights

| Area    | Support                                                                                   |
| ------- | ----------------------------------------------------------------------------------------- |
| Purpose | Auto-collapse React layout primitive for rendering visible items and overflow indicators. |
| Package | `@rc-component/overflow`                                                                  |
| Release | `@rc-component/np` / `rc-np`                                                              |

## Install

```bash
npm install @rc-component/overflow
```

## Usage

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

| Prop         | Description                      |
| ------------ | -------------------------------- |
| `data`       | Items rendered by Overflow.      |
| `renderItem` | Render a visible item.           |
| `renderRest` | Render collapsed overflow items. |

## Development

```bash
npm install
npm start
npm test
npm run lint
npm run tsc
npm run compile
```

The dumi site runs at `http://localhost:8000`.

## Release

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command when the package uses the shared release flow.

## License

@rc-component/overflow is released under the [MIT](./LICENSE.md) license.
