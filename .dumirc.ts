import { defineConfig } from 'dumi';
const isGitPagesSite = process.env.GITHUB_ACTIONS;

export default defineConfig({
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'rc-overflow',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
  exportStatic: {},
  outputPath: 'docs-dist',
  base: isGitPagesSite ? `/rc-overflow/` : `/`,
  publicPath: isGitPagesSite ? `/rc-overflow/` : `/`,
  styles: [
    `
      .markdown table {
        width: auto !important;
      }
    `,
  ],
});
