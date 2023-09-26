import { createSignal } from 'solid-js'
import { KitProps, useKitProps } from '../../../createKit'
import { ValidController } from '../../../piv/typeTools'
import { icssCol } from '../../../styles/icssBlocks'
import { Box } from '../../Boxes/Box'

export interface TabsGroupController {
  name: string
  current: () => string | undefined

  check: (option: string) => void
  uncheck: () => void
}

export type TabsGroupProps<Controller extends ValidController = TabsGroupController> = KitProps<
  {
    name: string
    option?: string
    defaultOption?: string
    onChange?(utils: { option: string; isChecked: boolean }): void
    // 'anatomy:ContainerBox'?: LabelBoxProps
    // 'anatomy:HTMLTabsGroup'?: HTMLInputTabsGroupProps
    // 'anatomy:Checkbox'?: PivProps<'div', Controller>
    // 'anatomy:Option'?: LabelProps
  },
  { controller: Controller }
>

const selfProps = ['name', 'option', 'defaultOption', 'onChange'] satisfies (keyof TabsGroupProps)[]

const defaultProps = {
  name: 'unknown tabs group',
} satisfies Partial<TabsGroupProps>

/**
 * TabsGroup can illustrate a boolean value
 */
export function TabsGroup(rawProps: TabsGroupProps) {
  const { props, shadowProps, lazyLoadController } = useKitProps(rawProps, {
    defaultProps,
    selfProps: selfProps,
  })

  const [selectedOption, setSeletedOption] = createSignal(props.option)

  const tabsGroupController = {
    get option() {
      return props.option
    },
  }

  lazyLoadController(tabsGroupController)

  return <Box class='TabsGroup' shadowProps={shadowProps} icss={icssCol()}/>
}
