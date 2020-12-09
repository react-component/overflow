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
