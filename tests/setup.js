const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { act } = require('react-dom/test-utils');
require('regenerator-runtime/runtime');

window.requestAnimationFrame = (func) => {
  window.setTimeout(func, 16);
};

Enzyme.configure({ adapter: new Adapter() });

Object.assign(Enzyme.ReactWrapper.prototype, {
  triggerResize(clientWidth) {
    act(() => {
      this.find('ResizeObserver').first().props().onResize({}, { clientWidth });
      jest.runAllTimers();
      this.update();
    });
  },
  triggerItemResize(index, offsetWidth) {
    act(() => {
      this.find('Item')
        .at(index)
        .find('ResizeObserver')
        .props()
        .onResize({ offsetWidth });
      jest.runAllTimers();
      this.update();
    });
  },
  initSize(width, itemWidth) {
    this.triggerResize(width);
    this.find('Item').forEach((_, index) => {
      this.triggerItemResize(index, itemWidth);
    });
  },
  findItems() {
    return this.find('Item').filterWhere(
      (item) =>
        item.props().className !== 'rc-overflow-item-rest' &&
        item.props().className !== 'rc-overflow-item-suffix',
    );
  },
  findRest() {
    return this.find('Item.rc-overflow-item-rest');
  },
  findSuffix() {
    return this.find('Item.rc-overflow-item-suffix');
  },
});
