import { createEffect, onCleanup } from 'solid-js'
import { createRef } from '..'
import { onEvent } from '../../domkit'
import { createTriggerController } from '../hooks/utils/createTriggerController'
import { PivProps, Plugin } from '../piv'
import { PopoverLocationHookOptions, usePopoverLocation } from '../pluginComponents/popover/usePopoverLocation'

/**
 *
 * @returns
 * - buttonPlugin(Piv): plugin for trigger
 * - popoverPlugin(Piv): plugin for popover
 * - info: accessors about trigger and popover
 */
export function usePopoverPluginFactory(
  options?: Omit<PopoverLocationHookOptions, 'isTriggerOn' | 'buttonDom' | 'panelDom'>
) {
  const { trigger, isTriggerOn } = createTriggerController()

  const [buttonDom, setButtonDom] = createRef<HTMLElement>()
  const [panelDom, setPanelDom] = createRef<HTMLElement>()

  /**
   * in {@link buttonPlugin}\
   * plugin registerer for trigger
   * @example
   * <Button plugin={buttonPlugin} />
   */
  function buttonPlugin() {
    // open popover by state
    createEffect(() => {
      try {
        if (isTriggerOn()) {
          // @ts-expect-error ts dom not ready yet
          panelDom()?.showPopover?.()
        } else {
          // @ts-expect-error ts dom not ready yet
          panelDom()?.hidePopover?.()
        }
      } catch (error) {
        console.error('trigger button error: ', error)
      }
    })
    return { domRef: setButtonDom, onClick: ({ el }) => trigger.toggle(el) } satisfies Partial<PivProps>
  }

  /**
   * in {@link buttonPlugin}\
   * plugin registerer for popover content
   * @example
   * <Box plugin={popoverTargetPlugin}>Popover Content</Box>
   */
  const popoverTargetPlugin: Plugin = () => {
    // listen to popover toggle event and reflect to trigger state
    createEffect(() => {
      const el = panelDom()
      if (!el) return
      const { abort } = onEvent(el, 'toggle', ({ ev }) => {
        // @ts-expect-error force
        const { newState } = ev as { newState: 'open' | 'closed' }
        if (newState === 'open') {
          trigger.turnOn(el)
        } else {
          trigger.turnOff(el)
        }
      })
      onCleanup(abort)
    })
    const { panelStyle } = usePopoverLocation({
      buttonDom: buttonDom,
      panelDom: panelDom,
      isTriggerOn,
      ...options,
    })
    return {
      domRef: setPanelDom,
      get style() {
        return panelStyle()
      },
      // @ts-expect-error lack of correct html type
      htmlProps: { popover: 'manual' },
    } satisfies Partial<PivProps>
  }

  /**
   * in {@link buttonPlugin}\
   *  public accessors
   */
  const state = {
    buttonDom,
    panelDom,
    isTriggerOn,
  }

  return { state, buttonPlugin, popoverTargetPlugin }
}
