import { Accessor, JSXElement, createContext, createMemo, createSignal } from 'solid-js'
import { createSyncSignal } from '../../hooks/createSyncSignal'
import { Label, LabelProps } from '../Label'
import { LabelBox, LabelBoxProps } from '../LabelBox'
import { HTMLInputTabs, HTMLInputTabsProps } from './HTMLInputTabs'
import { createTabsStyle } from './hooks/createTabsStyle'
import { ValidController } from '../../piv/typeTools'
import { Piv, PivProps } from '../../piv/Piv'
import { KitProps, useKitProps } from '../../createKit'

export interface TabsController {
  groupName: Accessor<string | undefined>
  tabValues: Accessor<string[]>
}

export type TabsProps<Controller extends ValidController = TabsController> = KitProps<
  {
    /** recommand  */
    groupName?: string

    activeIndex?: number
    defaultActiveIndex?: number

    /** only works when target tab name can match */
    activeValue?: string
    /** only works when target tab name can match */
    defaultActiveValue?: string

    onChange?(utils: { tabIndex: number; tabValue?: Accessor<string | undefined> }): void
  },
  { controller: Controller }
>

const TabsContext = createContext<{ activeTabIndex: Accessor<number> }>({ activeTabIndex: () => 0 })

function TabsContextProvider(props: { activeTabIndex: Accessor<number>; children?: JSXElement }) {
  return <TabsContext.Provider value={{ activeTabIndex: props.activeTabIndex }}>{props.children}</TabsContext.Provider>
}

/**
 * Tabs can illustrate a boolean value
 */
export function Tabs(rawProps: TabsProps) {
  const { props, shadowProps, lazyLoadController } = useKitProps(rawProps)

  const getTabItemIndexByValues = (value: string) => tabItemValues().findIndex((v) => v === value)

  const [tabItemValues, setTabItemValues] = createSignal<string[]>([])

  function addTabValue(tabValue: string) {
    setTabItemValues((prev) => [...prev, tabValue])
  }

  const [activeTabIndex, setActiveTabIndex] = createSyncSignal({
    defaultValue: () =>
      'defaultActiveIndex' in props && props.defaultActiveIndex != null
        ? props.defaultActiveIndex
        : 0 /* defaultly focus on first one */,
    getValueFromOutside: () =>
      'activeIndex' in props
        ? props.activeIndex
        : 'activeValue' in props && props.activeValue
        ? getTabItemIndexByValues(props.activeValue) ?? undefined
        : undefined /* defaultly focus on first one */,
    onInvokeSetter(value) {
      props.onChange?.({ tabIndex: value, tabValue: () => tabItemValues().at(value) })
    },
  })

  // const check = () => setIsChecked(true)
  // const uncheck = () => setIsChecked(false)

  // const { containerBoxStyleProps, htmlCheckboxStyleProps, tabsCheckboxStyleProps, tabsLabelStyleProps } =
  //   createTabsStyle({ props })

  const tabsController: TabsController = {
    groupName: createMemo(() => props.groupName),
    tabValues: tabItemValues,
  }

  lazyLoadController(tabsController)

  return (
    <TabsContext.Provider value={{ activeTabIndex: activeTabIndex }}>
      <Piv class='Tabs'>{props.children}</Piv>
    </TabsContext.Provider>
  )
}

export interface TabController {
  /** tab value */
  value: string

  active: Accessor<boolean>
  /** make this tab item to be active  */
  check: () => void
}
