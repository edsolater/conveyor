import { Plugin } from '../piv';
import { createRef } from '..';
import { UseGestureHoverOptions, useGestureHover } from '../hooks/useGestureHover';

/**
 *
 * @param options options for useGestureHover
 * @returns
 */
export function hoverPlugin(options?: Partial<UseGestureHoverOptions>) {
  // if this hook need domRef
  const [dom, setDom] = createRef<HTMLElement>();

  // usually, state is created by hook
  const state = useGestureHover({ el: dom, ...options });
  const plugin: Plugin = () => ({ domRef: setDom });
  return { plugin, state };
}
