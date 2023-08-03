//#region ------------------- hook: useHover() -------------------

import { createEffect } from 'solid-js'
import { createToggle } from './createToggle'

export interface UseGestureHoverOptions {
  el: HTMLElement | undefined | null,
  triggerDelay?: number
  disable?: boolean
  onHoverStart?: (info: { ev: PointerEvent }) => void
  onHoverEnd?: (info: { ev: PointerEvent }) => void
  onHover?: (info: { ev: PointerEvent; is: 'start' | 'end' }) => void
}

export function useGestureHover(options: UseGestureHoverOptions) {
  const [isHover, { on: turnonHover, off: turnoffHover }] = createToggle()

  createEffect(() => {
    if (options.disable) return
    let hoverDelayTimerId: number | undefined
    const hoverStartHandler = (ev: PointerEvent) => {
      if (options.disable) return
      if (options.triggerDelay) {
        hoverDelayTimerId = setTimeout(() => {
          hoverDelayTimerId = undefined
          turnonHover()
          options.onHover?.({ ev, is: 'start' })
          options.onHoverEnd?.({ ev })
        }, options.triggerDelay)
      } else {
        turnonHover()
        options.onHover?.({ is: 'start', ev })
        options.onHoverStart?.({ ev })
      }
    }
    const hoverEndHandler = (ev: PointerEvent) => {
      if (options.disable) return
      turnoffHover()
      options.onHover?.({ ev, is: 'end' })
      options.onHoverEnd?.({ ev })
      clearTimeout(hoverDelayTimerId)
      hoverDelayTimerId = undefined
    }
    options.el?.addEventListener('pointerenter', hoverStartHandler)
    options.el?.addEventListener('pointerleave', hoverEndHandler)
    options.el?.addEventListener('pointercancel', hoverEndHandler)
    return () => {
      options.el?.removeEventListener('pointerenter', hoverStartHandler)
      options.el?.removeEventListener('pointerleave', hoverEndHandler)
      options.el?.removeEventListener('pointercancel', hoverEndHandler)
    }
  })

  return { isHover }
}
