const { TextDecoder, TextEncoder } = require('util');
require('regenerator-runtime/runtime');

window.requestAnimationFrame = func => {
  window.setTimeout(func, 16);
};

const MockResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.ResizeObserver = MockResizeObserver;
window.ResizeObserver = MockResizeObserver;

Object.defineProperty(global, 'TextEncoder', {
  value: TextEncoder,
});

Object.defineProperty(global, 'TextDecoder', {
  value: TextDecoder,
});

global.MessageChannel = undefined;
window.MessageChannel = undefined;
