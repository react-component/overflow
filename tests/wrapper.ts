import { mount as enzymeMount, ReactWrapper } from 'enzyme';

export type MountParam = Parameters<typeof enzymeMount>;

export interface WrapperType extends ReactWrapper {
  triggerResize: (offsetWidth: number) => WrapperType;
  triggerItemResize: (index: number, offsetWidth: number) => WrapperType;
  initSize: (width: number, itemWidth: number) => WrapperType;
  findRest: () => WrapperType;
}

export function mount(...args: MountParam) {
  return enzymeMount(...args) as WrapperType;
}
