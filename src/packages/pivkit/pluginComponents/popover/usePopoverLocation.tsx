import { getScrollParents } from './getScrollParents'
import { PopoverPlacement } from './type'
import { PopupLocationInfo, calcPopupPanelLocation } from './calcPopupPanelLocation'
import { Accessor, createEffect, createSignal } from 'solid-js'

export function usePopoverLocation(
  buttonEl: HTMLElement,
  panelEl: HTMLElement,
  options: {
    placement: PopoverPlacement

    /** for corner placement like 'top-left' 'top-right etc. */
    cornerOffset?: number
    /** gap between `<PopoverButton>` and `<PopoverPanel>`*/
    popoverGap?: number
    /** to leave some space when touch the viewport boundary */
    viewportBoundaryInset?: number
  }
): { locationInfo: Accessor<PopupLocationInfo | undefined>; updateLocation: () => void } {
  const [panelCoordinates, setPanelCoordinates] = createSignal<PopupLocationInfo>()

  const update = () => {
    // must in some computer
    if (!globalThis.document) return
    if (!buttonEl || !panelEl) return

    setPanelCoordinates(
      calcPopupPanelLocation({
        buttonElement: buttonEl,
        panelElement: panelEl,
        ...options,
      })
    )
  }

  createEffect(() => {
    if (!buttonEl) return
    if (!panelEl) return
    const buttonScrollParents = buttonEl ? getScrollParents(buttonEl) : []
    const panelScrollParents = panelEl ? getScrollParents(panelEl) : []
    const parents = [...buttonScrollParents, ...panelScrollParents]
    parents.forEach((parent) => {
      parent.addEventListener('scroll', update, { passive: true })
      globalThis.addEventListener?.('resize', update, { passive: true })
    })
    return () => {
      parents.forEach((parent) => {
        parent.removeEventListener('scroll', update)
        globalThis.removeEventListener?.('resize', update)
      })
    }
  }, [buttonEl, panelEl])

  return { locationInfo: panelCoordinates, updateLocation: update }
}
