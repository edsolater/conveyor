import { SwitchController, SwitchProps } from '..'
import { Piv, PivChild, Plugin, createPlugin } from '../../../piv'

/**
 * **Plugin** for Switch
 * can render switch Thumb
 */
export const renderSwitchThumb = createPlugin<{ renderThumbContent?: PivChild<SwitchController> }, SwitchProps>(
  ({renderThumbContent}) => () => ({
    'anatomy:Thumb': {
      'render:lastChild': renderThumbContent,
    },
  })
)
