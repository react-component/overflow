import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'rc-overflow',
  favicon:
    'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  logo:
    'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  exportStatic: {},
  outputPath: 'docs-dist',
  resolve: {
    examples: ['none'],
  },
  styles: [
    `
      .markdown table {
        width: auto !important;
      }
    `,
  ]
});
