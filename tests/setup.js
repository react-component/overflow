const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { act } = require('react-dom/test-utils');
require('regenerator-runtime/runtime');

window.requestAnimationFrame = (func) => {
  window.setTimeout(func, 16);
};

Enzyme.configure({ adapter: new Adapter() });

Object.assign(Enzyme.ReactWrapper.prototype, {
  triggerResize(offsetWidth) {
    act(() => {
      this.find('ResizeObserver').first().props().onResize({ offsetWidth });
    });
  },
  triggerItemResize(index, offsetWidth) {
    act(() => {
      this.find('Item')
        .at(index)
        .find('ResizeObserver')
        .props()
        .onResize({ offsetWidth });
    });
  },
  initSize(width, itemWidth) {
    this.triggerResize(width);
    this.triggerItemResize(itemWidth);
  },
  findRest() {
    return this.find('div.rc-overflow-item-rest');
  },
});
