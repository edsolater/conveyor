import { isNumber } from '@edsolater/fnkit'
import { Accessor, createContext, createMemo, createSignal } from 'solid-js'
import { KitProps, useKitProps } from '../../createKit'
import { createSyncSignal } from '../../hooks/createSyncSignal'
import { Piv } from '../../piv/Piv'
import { ValidController } from '../../piv/typeTools'
import { TabList } from './TabList'
import { Tab } from './Tab'

export interface TabsController {
  groupName: Accessor<string | undefined>
  selectedTabIndex: Accessor<number>
  /** only works when target tab name can match */
  selectedTabValue: Accessor<string | undefined>
  tabValues: Accessor<string[]>

  /**
   * method
   */
  setSelectedTabIndex(index: number): void
  /**
   * method
   * only works when target tab name can match
   */
  setSelectedTabValue(value: string): void

  /**
   * inner method
   * invoked by `Tab` component
   */
  _addTabValue(value: string): void
}

export type TabsProps<Controller extends ValidController = TabsController> = KitProps<
  {
    /** recommand  */
    groupName?: string

    selectedIndex?: number
    defaultSelectedIndex?: number

    /** only works when target tab name can match */
    selectedValue?: string
    /** only works when target tab name can match */
    defaultSelectedValue?: string

    onChange?(utils: { tabIndex: number; tabValue?: Accessor<string | undefined> }): void
  },
  { controller: Controller }
>

const TabsControllerContextDefaultValue :TabsController= {
  groupName: () => undefined,
  selectedTabIndex: () => 0,
  tabValues: () => [],
  selectedTabValue: () => undefined,
  setSelectedTabIndex: () => {},
  setSelectedTabValue: () => {},
  _addTabValue: () => {},
}
export const TabsControllerContext = createContext<TabsController>(TabsControllerContextDefaultValue)

/**
 * @example
 * <Tabs>
 *   <Tab.List>
 *     <Tab>Tab 1</Tab>
 *     <Tab>Tab 2</Tab>
 *     <Tab>Tab 3</Tab>
 *   </Tab.List>
 *   <Tab.Panels>
 *     <Tab.Panel>Content 1</Tab.Panel>
 *     <Tab.Panel>Content 2</Tab.Panel>
 *     <Tab.Panel>Content 3</Tab.Panel>
 *   </Tab.Panels>
 * </Tabs>
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
      'defaultSelectedIndex' in props && props.defaultSelectedIndex != null
        ? props.defaultSelectedIndex
        : 0 /* defaultly focus on first one */,
    getValueFromOutside: () =>
      'selectedIndex' in props
        ? props.selectedIndex
        : 'selectedValue' in props && props.selectedValue
        ? getTabItemIndexByValues(props.selectedValue) ?? undefined
        : undefined /* defaultly focus on first one */,
    onInvokeSetter(value) {
      props.onChange?.({ tabIndex: value, tabValue: () => tabItemValues().at(value) })
    },
  })

  // an alertive of `activeTabIndex`
  const activeTabValue = createMemo(() => tabItemValues().at(activeTabIndex()))
  // an alertive of `setActiveTabIndex`
  function setActiveTabValue(value: string) {
    const idx = getTabItemIndexByValues(value)
    if (isNumber(idx)) setActiveTabIndex(idx)
  }

  // const check = () => setIsChecked(true)
  // const uncheck = () => setIsChecked(false)

  // const { containerBoxStyleProps, htmlCheckboxStyleProps, tabsCheckboxStyleProps, tabsLabelStyleProps } =
  //   createTabsStyle({ props })

  const tabsController: TabsController = {
    groupName: createMemo(() => props.groupName),
    tabValues: tabItemValues,
    selectedTabIndex: activeTabIndex,
    selectedTabValue: activeTabValue,
    setSelectedTabIndex: setActiveTabIndex,
    setSelectedTabValue: setActiveTabValue,
    _addTabValue: addTabValue,
  }

  lazyLoadController(tabsController)

  return (
    <TabsControllerContext.Provider value={tabsController}>
      <Piv class='Tabs' shadowProps={shadowProps}>
        {props.children}
      </Piv>
    </TabsControllerContext.Provider>
  )
}

Tabs.List = TabList
Tabs.Tab = Tab
