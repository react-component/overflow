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
let uuid = 0;

const ids = new Set();

/** Trigger before frame but after promise */
export function beforeFrame(callback: () => void) {
  uuid += 1;
  const myId = uuid;

  ids.add(myId);

  const channel = new MessageChannel();
  channel.port1.onmessage = () => {
    if (ids.has(myId)) {
      ids.delete(myId);
      callback();
    }
  };
  channel.port2.postMessage(null);

  return myId;
}

export function cancelBeforeFrame(id: number) {
  ids.delete(id);
}
