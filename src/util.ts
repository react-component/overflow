function px2num(value: string = '') {
  return Number(`0${value}`.replace('px', ''));
}

export function getFullWidth(element: HTMLElement) {
  const { offsetWidth } = element;
  const { marginLeft, marginRight } = getComputedStyle(element);
  const left = px2num(marginLeft);
  const right = px2num(marginRight);

  return left + offsetWidth + right;
}

// =================================== Frame ===================================
let batchQueue: (() => void)[] = [];
let batchUUID = 0;

/** Will execute all callback before next frame but after promise */
export function batchTask(callback: () => void) {
  batchUUID += 1;
  const id = batchUUID;

  batchQueue.push(callback);

  const channel = new MessageChannel();
  channel.port1.onmessage = () => {
    if (id === batchUUID) {
      batchQueue.forEach((fn) => {
        fn();
      });
      batchQueue = [];
    }
  };
  channel.port2.postMessage(null);
}
