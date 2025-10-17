import type { ReactWrapper } from 'enzyme';
import { mount as enzymeMount } from 'enzyme';

export type MountParam = Parameters<typeof enzymeMount>;

export interface WrapperType extends ReactWrapper<any, any> {
  triggerResize: (offsetWidth: number) => WrapperType;
  triggerItemResize: (index: number, offsetWidth: number) => WrapperType;
  initSize: (width: number, itemWidth: number) => WrapperType;
  findItems: () => WrapperType;
  findRest: () => WrapperType;
  findPrefix: () => WrapperType;
  findSuffix: () => WrapperType;
}

export function mount(...args: MountParam) {
  return enzymeMount(...args) as WrapperType;
}
