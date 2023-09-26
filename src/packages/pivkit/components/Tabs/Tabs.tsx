import { Accessor } from 'solid-js'
import { createSyncSignal } from '../../hooks/createSyncSignal'
import { Label, LabelProps } from '../Label'
import { LabelBox, LabelBoxProps } from '../LabelBox'
import { HTMLInputTabs, HTMLInputTabsProps } from './HTMLInputTabs'
import { createTabsStyle } from './hooks/createTabsStyle'
import { ValidController } from '../../piv/typeTools'
import { Piv, PivProps } from '../../piv/Piv'
import { KitProps, useKitProps } from '../../createKit'

export interface TabsController {
  option: string
  isChecked: Accessor<boolean>
  check: () => void
  uncheck: () => void
}

export type TabsProps<Controller extends ValidController = TabsController> = KitProps<
  {
    option: string
    isChecked?: boolean
    onChange?(utils: { option: string; isChecked: boolean }): void
    'anatomy:ContainerBox'?: LabelBoxProps
    'anatomy:HTMLTabs'?: HTMLInputTabsProps
    'anatomy:Checkbox'?: PivProps<'div', Controller>
    'anatomy:Option'?: LabelProps
  },
  { controller: Controller }
>

const selfProps = ['isChecked', 'option', 'onChange'] satisfies (keyof TabsProps)[]

export type TabsDefaultTabsProps = typeof defaultProps

const defaultProps = {
  isChecked: false,
} satisfies Partial<TabsProps>

/**
 * Tabs can illustrate a boolean value
 */
export function Tabs(rawProps: TabsProps) {
  const { props, shadowProps, lazyLoadController } = useKitProps(rawProps, {
    defaultProps,
    selfProps: selfProps,
  })

  const [isChecked, setIsChecked] = createSyncSignal({
    get: () => props.isChecked,
    set(value) {
      props.onChange?.({ isChecked: value, option: props.option ?? '' })
    },
  })

  const check = () => setIsChecked(true)
  const uncheck = () => setIsChecked(false)

  const { containerBoxStyleProps, htmlCheckboxStyleProps, tabsCheckboxStyleProps, tabsLabelStyleProps } =
    createTabsStyle({ props })

  const tabsController = {
    isChecked,
    check,
    uncheck,
    get option() {
      return props.option
    },
  }

  lazyLoadController(tabsController)

  return (
    <LabelBox shadowProps={[containerBoxStyleProps, shadowProps, props['anatomy:ContainerBox']]}>
      <HTMLInputTabs
        shadowProps={[htmlCheckboxStyleProps, props['anatomy:HTMLTabs']]}
        innerController={tabsController}
        label={props.option}
        defaultChecked={props.isChecked}
        onClick={() => {
          setIsChecked((b) => !b)
        }}
      />

      {/* Tabs Checkbox */}
      <Piv
        shadowProps={[tabsCheckboxStyleProps, props['anatomy:Checkbox']]}
        innerController={tabsController}
        class='TabsCheckbox'
        icss={[{ display: 'grid', placeContent: 'center' }]}
      />

      {/* Tabs Label */}
      <Label shadowProps={[tabsLabelStyleProps, props['anatomy:Option']]}>{props.option}</Label>
    </LabelBox>
  )
}
