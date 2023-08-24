import { createRef } from '..'
import { UseGestureHoverOptions, useGestureHover } from '../hooks/useGestureHover'
import { createPlugin } from '../piv'

/**
 *
 * @param options options for useGestureHover
 * @returns
 */
export function hoverPlugin(options?: Partial<UseGestureHoverOptions>) {
  // if this hook need domRef
  const [dom, setDom] = createRef<HTMLElement>()

  // usually, state is created by hook
  const state = useGestureHover({ el: dom, ...options })

  //TODO: plugin should can be both a hook and plugin
  const plugin = createPlugin(() => () => ({ domRef: setDom }))
  // 💡 TODO: plugin should also can used like normal `const { state } = useHooks()` or `const { isHover } = usePlugin(hoverPlugin, options)`
  return { plugin, state }
}

