const { render, act } = require('@testing-library/react');
const { fireEvent } = require('@testing-library/dom');
require('regenerator-runtime/runtime');

// Mock requestAnimationFrame
window.requestAnimationFrame = (func) => {
  window.setTimeout(func, 16);
};

// Create a custom render with additional query methods
const customRender = (ui, options) => {
  const utils = render(ui, options);
  
  return {
    ...utils,
    triggerResize(clientWidth) {
      const resizeObserver = utils.container.querySelector('[data-resize-observer]');
      act(() => {
        fireEvent(resizeObserver, new Event('resize', {
          detail: { clientWidth }
        }));
        jest.runAllTimers();
      });
    },
    triggerItemResize(index, offsetWidth) {
      const items = utils.getAllByTestId('overflow-item');
      const target = items[index];
      act(() => {
        fireEvent(target, new Event('resize', {
          detail: { offsetWidth }
        }));
        jest.runAllTimers();
      });
    },
    initSize(width, itemWidth) {
      this.triggerResize(width);
      const items = utils.getAllByTestId('overflow-item');
      items.forEach((_, index) => {
        this.triggerItemResize(index, itemWidth);
      });
    },
    findItems() {
      return utils.getAllByTestId('overflow-item').filter(item => 
        !item.classList.contains('rc-overflow-item-rest') &&
        !item.classList.contains('rc-overflow-item-prefix') &&
        !item.classList.contains('rc-overflow-item-suffix')
      );
    },
    findRest() {
      return utils.getByTestId('overflow-item-rest');
    },
    findPrefix() {
      return utils.getByTestId('overflow-item-prefix');
    },
    findSuffix() {
      return utils.getByTestId('overflow-item-suffix');
    }
  };
};

// Re-export everything
module.exports = {
  ...require('@testing-library/react'),
  render: customRender,
  act,
  fireEvent
};
