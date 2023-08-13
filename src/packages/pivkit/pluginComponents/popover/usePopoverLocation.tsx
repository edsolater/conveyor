import { getScrollParents } from './getScrollParents'
import { PopoverPlacement } from './type'
import { PopupLocationInfo, calcPopupPanelLocation } from './calcPopupPanelLocation'
import { Accessor, createEffect, createMemo, createSignal, onCleanup } from 'solid-js'
import { IStyle } from '../../piv/propHandlers'

// for fade in effect (fade-in is caused by )
const popupOrigins = {
  top: 'bottom',
  'top-left': 'bottom-left',
  'top-right': 'bottom-right',
  right: 'left',
  'right-top': 'top-left',
  'right-bottom': 'bottom-left',
  left: 'right',
  'left-top': 'top-right',
  'left-bottom': 'bottom-right',
  bottom: 'top',
  'bottom-left': 'top-left',
  'bottom-right': 'top-right',
}

export function usePopoverLocation({
  buttonDom,
  panelDom,
  isTriggerOn,
  placement = 'top',
  cornerOffset,
  popoverGap,
  viewportBoundaryInset,
}: {
  buttonDom: Accessor<HTMLElement | undefined>
  panelDom: Accessor<HTMLElement | undefined>
  isTriggerOn: Accessor<boolean>

  placement?: PopoverPlacement

  /** for corner placement like 'top-left' 'top-right etc. */
  cornerOffset?: number
  /** gap between `<PopoverButton>` and `<PopoverPanel>`*/
  popoverGap?: number
  /** to leave some space when touch the viewport boundary */
  viewportBoundaryInset?: number
}) {
  const [panelCoordinates, setPanelCoordinates] = createSignal<PopupLocationInfo>()

  const update = () => {
    // must in some computer
    if (!globalThis.document) return
    const buttonElement = buttonDom()
    const panelElement = panelDom()
    if (!buttonElement || !panelElement) return

    setPanelCoordinates(
      calcPopupPanelLocation({
        buttonElement: buttonElement,
        panelElement: panelElement,
        placement,
        cornerOffset,
        popoverGap,
        viewportBoundaryInset,
      })
    )
  }

  // if not trigger on, can't calculate location
  createEffect(() => {
    if (isTriggerOn()) {
      update()
    }
  })

  createEffect(() => {
    console.log('buttonDom(): ', buttonDom())
  })

  createEffect(() => {
    console.log('panelDom(): ', panelDom())
  })

  createEffect(() => {
    const buttonElement = buttonDom()
    if (!buttonElement) return
    const panelElement = panelDom()
    if (!panelElement) return
    const buttonScrollParents = buttonElement ? getScrollParents(buttonElement) : []
    const panelScrollParents = panelElement ? getScrollParents(panelElement) : []
    const parents = [...buttonScrollParents, ...panelScrollParents]
    parents.forEach((parent) => {
      parent.addEventListener('scroll', update, { passive: true })
      globalThis.addEventListener?.('resize', update, { passive: true })
    })
    onCleanup(() => {
      parents.forEach((parent) => {
        parent.removeEventListener('scroll', update)
        globalThis.removeEventListener?.('resize', update)
      })
    })
  })

  const panelStyle = createMemo(() => {
    const style = isTriggerOn()
      ? ({
          left: panelCoordinates()?.panelLeft + 'px',
          top: panelCoordinates()?.panelTop + 'px',
        } as IStyle)
      : ({ visibility: 'hidden' } as IStyle)
    return style
  })

  return { locationInfo: panelCoordinates, forceUpdateLocation: update, panelStyle }
}
