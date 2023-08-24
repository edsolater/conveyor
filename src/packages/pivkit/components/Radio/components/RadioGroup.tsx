import { createSignal } from 'solid-js'
import { KitProps, useKitProps } from '../../../createKit'
import { ValidController } from '../../../piv/typeTools'
import { icssCol } from '../../../styles/icssBlocks'
import { Box } from '../../Boxes/Box'

export interface RadioGroupController {
  name: string
  current: () => string | undefined

  check: (option: string) => void
  uncheck: () => void
}

export type RadioGroupProps<Controller extends ValidController = RadioGroupController> = KitProps<
  {
    name: string
    option?: string
    defaultOption?: string
    onChange?(utils: { option: string; isChecked: boolean }): void
    // 'anatomy:ContainerBox'?: LabelBoxProps
    // 'anatomy:HTMLRadioGroup'?: HTMLInputRadioGroupProps
    // 'anatomy:Checkbox'?: PivProps<'div', Controller>
    // 'anatomy:Option'?: LabelProps
  },
  { controller: Controller }
>

const selfProps = ['name', 'option', 'defaultOption', 'onChange'] satisfies (keyof RadioGroupProps)[]

const defaultProps = {
  name: 'unknown radio group',
} satisfies Partial<RadioGroupProps>

/**
 * RadioGroup can illustrate a boolean value
 */
export function RadioGroup(rawProps: RadioGroupProps) {
  const { props, shadowProps, lazyLoadController } = useKitProps(rawProps, {
    defaultProps,
    selfProps: selfProps,
  })

  const [selectedOption, setSeletedOption] = createSignal(props.option)

  const radioGroupController = {
    get option() {
      return props.option
    },
  }

  lazyLoadController(radioGroupController)

  return <Box class='RadioGroup' shadowProps={shadowProps} icss={icssCol()}/>
}
