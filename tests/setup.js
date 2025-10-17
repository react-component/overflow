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
    const target = this.find('ResizeObserver').first()
    target.invoke('onResize')({}, { clientWidth })
    act(() => {
      jest.runAllTimers();
    })  
    this.update()
  },
  triggerItemResize(index, offsetWidth) {
    const target = this.find('Item').at(index).find('ResizeObserver')
    target.invoke('onResize')({ offsetWidth });
    act(() => {
      jest.runAllTimers();
    })
    this.update()
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
        item.props().className !== 'rc-overflow-item-prefix' &&
        item.props().className !== 'rc-overflow-item-suffix',
    );
  },
  findRest() {
    return this.find('Item.rc-overflow-item-rest');
  },
  findPrefix() {
    return this.find('Item.rc-overflow-item-prefix');
  },
  findSuffix() {
    return this.find('Item.rc-overflow-item-suffix');
  },
});
